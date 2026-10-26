// Login throttling. A single process is protected by the in-memory map below.
// Multi-instance deployments can set a Vercel KV or Upstash Redis REST URL and
// token to share the same counters across processes. Without one of those
// environment pairs, the in-memory fallback keeps the storefront working.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const MAX_GLOBAL_FAILURES = 60;
const PRUNE_THRESHOLD = 500;
const MAX_BUCKETS = 5_000;
const GLOBAL_KEY = '__all_clients__';
const REDIS_TIMEOUT_MS = 1_500;

type Bucket = {
  failures: number;
  resetAt: number;
};

type RedisConfig = {
  url: string;
  token: string;
};

const buckets = new Map<string, Bucket>();

export function loginClientKey(request: Request): string | null {
  // Prefer headers set by a reverse proxy or CDN. The global bucket below still
  // limits abuse if a client can spoof these values on a direct connection.
  const forwarded = request.headers.get('cf-connecting-ip')
    || request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  return ip ? ip.slice(0, 64) : null;
}

function limitFor(key: string) {
  return key === GLOBAL_KEY ? MAX_GLOBAL_FAILURES : MAX_FAILURES;
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
  if (bucket.failures < limit) return null;

  return Math.ceil((bucket.resetAt - now) / 1000);
}

function retryAfterFor(key: string, now: number): number | null {
  return retryAfterForLimit(key, now, limitFor(key));
}

function recordFailureWithin(key: string, now: number, windowMs: number) {
  if (buckets.size >= PRUNE_THRESHOLD) pruneExpired(now);

  // Keep the map bounded even if many distinct client addresses fail during
  // the same window. Never evict the global bucket.
  if (buckets.size >= MAX_BUCKETS) {
    for (const oldest of buckets.keys()) {
      if (oldest !== GLOBAL_KEY) {
        buckets.delete(oldest);
        break;
      }
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { failures: 1, resetAt: now + windowMs });
    return;
  }
  bucket.failures += 1;
}

function recordFailure(key: string, now: number) {
  recordFailureWithin(key, now, WINDOW_MS);
}

function redisConfig(): RedisConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

function redisKey(key: string) {
  return `storefront:login:${encodeURIComponent(key)}`;
}

type RedisCommand = (string | number)[];

async function redisPipeline(commands: RedisCommand[]): Promise<unknown[] | null> {
  const config = redisConfig();
  if (!config) return null;

  try {
    const response = await fetch(`${config.url}/pipeline`, {
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
    return Array.isArray(data) ? data : null;
  } catch {
    // An unavailable shared store must not take admin sign-in down; the local
    // buckets still apply for this process.
    return null;
  }
}

function pipelineResult(results: unknown[], index: number): unknown {
  const entry = results[index];
  if (!entry || typeof entry !== 'object') return null;
  return (entry as { result?: unknown }).result ?? null;
}

async function remoteRetryAfter(keys: string[]): Promise<{ ok: boolean; retryAfter: number | null }> {
  const results = await redisPipeline(keys.flatMap((key) => [
    ['GET', redisKey(key)],
    ['PTTL', redisKey(key)],
  ]));
  if (!results) return { ok: false, retryAfter: null };

  let retryAfter = 0;
  keys.forEach((key, index) => {
    const failures = Number(pipelineResult(results, index * 2));
    const ttl = Number(pipelineResult(results, index * 2 + 1));
    if (Number.isFinite(failures) && failures >= limitFor(key) && Number.isFinite(ttl) && ttl > 0) {
      retryAfter = Math.max(retryAfter, Math.ceil(ttl / 1000));
    }
  });

  return { ok: true, retryAfter: retryAfter || null };
}

async function recordRemoteFailures(keys: string[]): Promise<boolean> {
  // SET ... NX gives a new key its fixed window without extending it on every
  // later failure; INCR then records the attempt. This avoids a key without a
  // TTL if the process stops between two separate commands.
  const commands = keys.flatMap((key) => [
    ['SET', redisKey(key), '0', 'PX', String(WINDOW_MS), 'NX'],
    ['INCR', redisKey(key)],
  ]);
  return (await redisPipeline(commands)) !== null;
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
): Promise<{ ok: boolean; result: RateLimitResult }> {
  const remoteKey = `storefront:${namespace}:${encodeURIComponent(key)}`;
  const results = await redisPipeline([
    ['SET', remoteKey, '0', 'PX', String(windowMs), 'NX'],
    ['INCR', remoteKey],
    ['PTTL', remoteKey],
  ]);

  if (!results) return { ok: false, result: { allowed: true, retryAfter: 0 } };

  const count = Number(pipelineResult(results, 1));
  const ttl = Number(pipelineResult(results, 2));
  if (!Number.isFinite(count)) return { ok: false, result: { allowed: true, retryAfter: 0 } };

  if (count > limit) {
    const retryAfter = Number.isFinite(ttl) && ttl > 0
      ? Math.ceil(ttl / 1000)
      : Math.ceil(windowMs / 1000);
    return { ok: true, result: { allowed: false, retryAfter } };
  }

  return { ok: true, result: { allowed: true, retryAfter: 0 } };
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
    if (remote.ok) return remote.result;
  }

  const now = Date.now();
  const localKey = `${namespace}:${key}`;
  const retryAfter = retryAfterForLimit(localKey, now, limit);
  if (retryAfter) return { allowed: false, retryAfter };

  recordFailureWithin(localKey, now, windowMs);
  return { allowed: true, retryAfter: 0 };
}

export async function loginRetryAfter(key: string | null): Promise<number | null> {
  const keys = key ? [key, GLOBAL_KEY] : [GLOBAL_KEY];

  // When a shared store is configured it is authoritative, so one instance
  // cannot keep a stale local count after another instance clears it.
  if (redisConfig()) {
    const remote = await remoteRetryAfter(keys);
    if (remote.ok) return remote.retryAfter;
  }

  const now = Date.now();
  const localRetryAfter = Math.max(
    (key ? retryAfterFor(key, now) : 0) ?? 0,
    retryAfterFor(GLOBAL_KEY, now) ?? 0,
  );
  return localRetryAfter || null;
}

export async function recordLoginFailure(key: string | null) {
  const keys = key ? [key, GLOBAL_KEY] : [GLOBAL_KEY];

  if (redisConfig() && await recordRemoteFailures(keys)) return;

  const now = Date.now();
  for (const bucketKey of keys) recordFailure(bucketKey, now);
}

export async function clearLoginFailures(key: string | null) {
  // Only clear the caller's bucket. The global bucket expires with its own
  // window so one successful sign-in cannot reset protection for everyone.
  if (!key) return;

  buckets.delete(key);
  if (redisConfig()) {
    await redisPipeline([['DEL', redisKey(key)]]);
  }
}
