import { isIP } from 'node:net';

// Shared counters protect multiple instances; bounded local counters cover Redis outages.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const MAX_GLOBAL_ATTEMPTS = 60;
const PRUNE_THRESHOLD = 500;
const MAX_BUCKETS = 5_000;
const GLOBAL_KEY = '__all_clients__';
const REDIS_TIMEOUT_MS = 1_500;

type Bucket = {
  attempts: number;
  resetAt: number;
};

type RedisConfig = {
  url: string;
  token: string;
};

const buckets = new Map<string, Bucket>();

export function loginClientKey(request: Request): string | null {
  // The ingress must overwrite this header; alternate IP headers may come from callers.
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  return ip && ip.length <= 64 && isIP(ip) ? ip : null;
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function retryAfterForLimit(key: string, now: number, limit: number): number | null {
  const bucket = buckets.get(key);
  if (!bucket) return null;

  if (bucket.resetAt <= now) {
    buckets.delete(key);
    return null;
  }
  if (bucket.attempts < limit) return null;

  return Math.ceil((bucket.resetAt - now) / 1000);
}

function recordAttempt(key: string, now: number, windowMs: number) {
  if (buckets.size >= PRUNE_THRESHOLD) pruneExpired(now);

  // Keep the map bounded even if many distinct client addresses fail during
  // the same window. Never evict the global bucket.
  if (buckets.size >= MAX_BUCKETS) {
    for (const oldest of buckets.keys()) {
      if (oldest !== `login:${GLOBAL_KEY}`) {
        buckets.delete(oldest);
        break;
      }
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { attempts: 1, resetAt: now + windowMs });
    return;
  }
  bucket.attempts += 1;
}

function redisConfig(): RedisConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

function redisKey(namespace: string, key: string) {
  return `storefront:${namespace}:${encodeURIComponent(key)}`;
}

type RedisCommand = (string | number)[];
type RedisReply = { result: unknown };

async function redisTransaction(commands: RedisCommand[]): Promise<RedisReply[] | null> {
  const config = redisConfig();
  if (!config) return null;

  try {
    const response = await fetch(`${config.url}/multi-exec`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
      cache: 'no-store',
      signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!Array.isArray(data) || data.length !== commands.length || data.some((entry) =>
      !entry || typeof entry !== 'object' || 'error' in entry || !('result' in entry)
    )) return null;
    return data as RedisReply[];
  } catch {
    // An unavailable shared store must not take admin sign-in down; the local
    // buckets still apply for this process.
    return null;
  }
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfter: number;
};

async function consumeRemoteRateLimit(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult | null> {
  const remoteKey = redisKey(namespace, key);
  // The transaction keeps counter creation, increment and expiry in one atomic operation.
  const results = await redisTransaction([
    ['SET', remoteKey, '0', 'PX', String(windowMs), 'NX'],
    ['INCR', remoteKey],
    ['PTTL', remoteKey],
  ]);

  if (!results) return null;

  const count = results[1].result;
  const ttl = results[2].result;
  if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 1
    || typeof ttl !== 'number' || !Number.isSafeInteger(ttl) || ttl <= 0) return null;

  return count > limit
    ? { allowed: false, retryAfter: Math.ceil(ttl / 1000) }
    : { allowed: true, retryAfter: 0 };
}

// Generic fixed-window limiter for public forms. It uses the shared store as
// the source of truth when configured and falls back to this process's bounded
// in-memory map when the store is absent or unavailable.
export async function consumeRateLimit(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (redisConfig()) {
    const remote = await consumeRemoteRateLimit(namespace, key, limit, windowMs);
    if (remote) return remote;
  }

  const now = Date.now();
  const localKey = `${namespace}:${key}`;
  const retryAfter = retryAfterForLimit(localKey, now, limit);
  if (retryAfter) return { allowed: false, retryAfter };

  recordAttempt(localKey, now, windowMs);
  return { allowed: true, retryAfter: 0 };
}

export async function consumeLoginAttempt(key: string): Promise<RateLimitResult> {
  const client = await consumeRateLimit('login', key, MAX_ATTEMPTS, WINDOW_MS);
  return client.allowed
    ? consumeRateLimit('login', GLOBAL_KEY, MAX_GLOBAL_ATTEMPTS, WINDOW_MS)
    : client;
}

export async function clearLoginAttempts(key: string) {
  // Only clear the caller's bucket. The global bucket expires with its own
  // window so one successful sign-in cannot reset protection for everyone.
  buckets.delete(`login:${key}`);
  if (redisConfig()) {
    await redisTransaction([['DEL', redisKey('login', key)]]);
  }
}
