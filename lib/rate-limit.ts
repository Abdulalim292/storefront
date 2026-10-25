// Small in-memory throttle for the admin login. It protects a single server
// process; a multi-instance deployment should also rate limit at its proxy or
// use a shared store. The window resets on redeploy/restart.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const PRUNE_THRESHOLD = 500;
const MAX_BUCKETS = 5_000;

type Bucket = {
  failures: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function loginClientKey(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || request.headers.get('cf-connecting-ip')?.trim();
  return ip || null;
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function loginRetryAfter(key: string): number | null {
  const bucket = buckets.get(key);
  if (!bucket) return null;

  const now = Date.now();
  if (bucket.resetAt <= now) {
    buckets.delete(key);
    return null;
  }
  if (bucket.failures < MAX_FAILURES) return null;

  return Math.ceil((bucket.resetAt - now) / 1000);
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  if (buckets.size >= PRUNE_THRESHOLD) pruneExpired(now);

  // Keep the map bounded even if many distinct client addresses fail during
  // the same window. Dropping the oldest bucket is safer than growing forever.
  if (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (oldest !== undefined) buckets.delete(oldest);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { failures: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.failures += 1;
}

export function clearLoginFailures(key: string) {
  buckets.delete(key);
}
