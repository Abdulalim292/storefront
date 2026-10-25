import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'storefront-admin';
const SESSION_SECONDS = 60 * 60 * 12;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be set to at least 32 characters.');
  return secret;
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('hex');
}

export function passwordsMatch(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error('ADMIN_PASSWORD is not configured.');
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expires);
  return { value: `${payload}.${sign(payload)}`, expires };
}

export function verifyAdminSession(value?: string) {
  if (!value) return false;
  const [expires, signature, extra] = value.split('.');
  if (!expires || !signature || extra || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(sign(expires));
  const provided = Buffer.from(signature);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function isAdminRequest() {
  const store = await cookies();
  return verifyAdminSession(store.get(COOKIE_NAME)?.value);
}

export const adminCookie = COOKIE_NAME;
export const adminSessionSeconds = SESSION_SECONDS;

export function hasValidOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    if (originUrl.protocol !== 'https:' && originUrl.protocol !== 'http:') return false;

    const hosts = new Set<string>();
    const addHost = (value?: string | null) => {
      const candidate = value?.split(',')[0]?.trim();
      if (!candidate) return;
      try {
        hosts.add(new URL(`${originUrl.protocol}//${candidate}`).host);
      } catch {
        // Ignore malformed header values.
      }
    };

    try {
      hosts.add(new URL(request.url).host);
    } catch {
      // Fall through to the proxy headers below.
    }

    // Reverse proxies may rewrite request.url; the forwarded host is the
    // public host the browser used for Origin.
    addHost(request.headers.get('x-forwarded-host'));
    addHost(request.headers.get('host'));

    return hosts.has(originUrl.host);
  } catch {
    return false;
  }
}
