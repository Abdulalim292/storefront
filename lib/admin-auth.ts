import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'storefront-admin';
const SESSION_SECONDS = 60 * 60 * 12;
const EXPIRY_PATTERN = /^\d{1,12}$/;
const SIGNATURE_PATTERN = /^[0-9a-f]{64}$/;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be set to at least 32 characters.');
  return secret;
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('hex');
}

function hash(value: string) {
  return createHash('sha256').update(value).digest();
}

// Hash both values before comparing so the comparison is constant time even
// when the candidate and the configured password have different lengths.
export function passwordsMatch(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error('ADMIN_PASSWORD is not configured.');
  return timingSafeEqual(hash(candidate), hash(expected));
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expires);
  return { value: `${payload}.${sign(payload)}`, expires };
}

export function verifyAdminSession(value?: string) {
  if (!value || value.length > 128) return false;

  const parts = value.split('.');
  if (parts.length !== 2) return false;

  const [expires, signature] = parts;
  if (!EXPIRY_PATTERN.test(expires) || !SIGNATURE_PATTERN.test(signature)) return false;

  const expiresAt = Number(expires);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;
  // A valid session can never extend beyond the configured lifetime; this
  // rejects signed but nonsensical values such as a far-future expiry.
  if (expiresAt > now + SESSION_SECONDS + 60) return false;

  const expected = Buffer.from(sign(expires), 'hex');
  const provided = Buffer.from(signature, 'hex');
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function isAdminRequest() {
  const store = await cookies();
  return verifyAdminSession(store.get(COOKIE_NAME)?.value);
}

export const adminCookie = COOKIE_NAME;
export const adminSessionSeconds = SESSION_SECONDS;

function normalizeHost(value?: string | null) {
  const candidate = value?.split(',')[0]?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(`http://${candidate}`);
    // Reject userinfo and anything beyond a bare host:port pair.
    if (url.username || url.password) return null;
    if (url.pathname !== '/' || url.search || url.hash) return null;
    return url.host;
  } catch {
    return null;
  }
}

export function hasValidOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    if (originUrl.protocol !== 'https:' && originUrl.protocol !== 'http:') return false;
    // The Origin header is a bare scheme + host. Reject crafted values that
    // smuggle credentials, paths, or query strings into the comparison.
    if (originUrl.username || originUrl.password) return false;
    if (originUrl.pathname !== '/' || originUrl.search || originUrl.hash) return false;

    const hosts = new Set<string>();
    try {
      hosts.add(new URL(request.url).host);
    } catch {
      // Fall through to the proxy headers below.
    }

    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (configuredSiteUrl) {
      try {
        hosts.add(new URL(configuredSiteUrl).host);
      } catch {
        // Ignore a malformed optional value.
      }
    }

    // Reverse proxies may rewrite request.url; the forwarded host is the
    // public host the browser used for Origin.
    for (const header of [request.headers.get('x-forwarded-host'), request.headers.get('host')]) {
      const host = normalizeHost(header);
      if (host) hosts.add(host);
    }

    return hosts.has(originUrl.host);
  } catch {
    return false;
  }
}
