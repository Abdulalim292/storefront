// Small in-memory throttle for the admin login. It protects a single server
// process; a multi-instance deployment should also rate limit at its proxy or
// use a shared store. The window resets on redeploy/restart.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const MAX_GLOBAL_FAILURES = 60;
const PRUNE_THRESHOLD = 500;
const MAX_BUCKETS = 5_000;
const GLOBAL_KEY = '__all_clients__';

type Bucket = {
  failures: number;
  resetAt: number;
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

function retryAfterFor(key: string, now: number): number | null {
  const bucket = buckets.get(key);
  if (!bucket) return null;

  if (bucket.resetAt <= now) {
    buckets.delete(key);
    return null;
  }
  if (bucket.failures < limitFor(key)) return null;

  return Math.ceil((bucket.resetAt - now) / 1000);
}

export function loginRetryAfter(key: string | null): number | null {
  const now = Date.now();
  const retryAfter = key ? retryAfterFor(key, now) : null;
  const globalRetryAfter = retryAfterFor(GLOBAL_KEY, now);

  if (!retryAfter && !globalRetryAfter) return null;
  return Math.max(retryAfter ?? 0, globalRetryAfter ?? 0);
}

function recordFailure(key: string, now: number) {
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
    buckets.set(key, { failures: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.failures += 1;
}

export function recordLoginFailure(key: string | null) {
  const now = Date.now();
  if (key) recordFailure(key, now);
  recordFailure(GLOBAL_KEY, now);
}

export function clearLoginFailures(key: string | null) {
  // Only clear the caller's bucket. The global bucket expires with its own
  // window so one successful sign-in cannot reset protection for everyone.
  if (key) buckets.delete(key);
}
