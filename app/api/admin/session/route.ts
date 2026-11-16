import { NextResponse } from 'next/server';
import { adminCookie, adminSessionSeconds, createAdminSession, hasValidOrigin, isAdminRequest, passwordsMatch } from '@/lib/admin-auth';
import { clearLoginAttempts, consumeLoginAttempt, loginClientKey } from '@/lib/rate-limit';
import { readLimitedText } from '@/lib/request-body';

const NO_STORE = { 'Cache-Control': 'no-store' };
const MAX_BODY_BYTES = 4 * 1024;
const MAX_PASSWORD_LENGTH = 512;

function json(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return json({ error: 'Request not allowed.' }, 403);

  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') {
    return json({ error: 'Enter the admin password.' }, 415);
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ error: 'Request is too large.' }, 413);
  }

  let password: string;
  try {
    const raw = await readLimitedText(request, MAX_BODY_BYTES);
    if (raw === null) return json({ error: 'Request is too large.' }, 413);

    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ error: 'Enter the admin password.' }, 400);
    }

    const candidate = (body as Record<string, unknown>).password;
    if (typeof candidate !== 'string' || candidate.length === 0 || candidate.length > MAX_PASSWORD_LENGTH) {
      return json({ error: 'Enter the admin password.' }, 400);
    }
    password = candidate;
  } catch {
    return json({ error: 'Enter the admin password.' }, 400);
  }

  const clientKey = loginClientKey(request) ?? 'unknown';
  const limit = await consumeLoginAttempt(clientKey);
  if (!limit.allowed) {
    return json(
      { error: 'Too many sign-in attempts. Try again later.' },
      429,
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  try {
    if (!passwordsMatch(password)) {
      return json({ error: 'Incorrect password.' }, 401);
    }
  } catch (error) {
    // Configuration failures must not disclose which environment variable is
    // missing or how the comparison works.
    console.error('Admin login is not configured:', error);
    return json({ error: 'Admin sign-in is temporarily unavailable.' }, 503);
  }

  try {
    await clearLoginAttempts(clientKey);
    const session = createAdminSession();
    const response = json({ ok: true });
    response.cookies.set(adminCookie, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api',
      maxAge: adminSessionSeconds,
    });
    return response;
  } catch (error) {
    console.error('Could not create the admin session:', error);
    return json({ error: 'Admin sign-in is temporarily unavailable.' }, 503);
  }
}

export async function GET() {
  try {
    return json({ authenticated: await isAdminRequest() });
  } catch (error) {
    console.error('Could not read the admin session:', error);
    return json({ authenticated: false }, 503);
  }
}
