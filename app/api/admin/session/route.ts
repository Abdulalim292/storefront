import { NextResponse } from 'next/server';
import { adminCookie, adminSessionSeconds, createAdminSession, hasValidOrigin, isAdminRequest, passwordsMatch } from '@/lib/admin-auth';
import { clearLoginFailures, loginClientKey, loginRetryAfter, recordLoginFailure } from '@/lib/rate-limit';

const NO_STORE = { 'Cache-Control': 'no-store' };
const MAX_BODY_BYTES = 4 * 1024;
const MAX_PASSWORD_LENGTH = 512;

function json(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

// Route handlers do not cap request bodies for us. Read at most the configured
// number of bytes so a chunked request cannot force the process to buffer an
// arbitrarily large JSON document before parsing it.
async function readLimitedText(request: Request, maxBytes: number): Promise<string | null> {
  if (!request.body) return '';

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let result = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return null;
      }
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return json({ error: 'Request not allowed.' }, 403);

  const clientKey = loginClientKey(request);
  const retryAfter = await loginRetryAfter(clientKey);
  if (retryAfter) {
    return json(
      { error: 'Too many sign-in attempts. Try again later.' },
      429,
      { 'Retry-After': String(retryAfter) },
    );
  }

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

  try {
    if (!passwordsMatch(password)) {
      await recordLoginFailure(clientKey);
      return json({ error: 'Incorrect password.' }, 401);
    }
  } catch (error) {
    // Configuration failures must not disclose which environment variable is
    // missing or how the comparison works.
    console.error('Admin login is not configured:', error);
    await recordLoginFailure(clientKey);
    return json({ error: 'Admin sign-in is temporarily unavailable.' }, 503);
  }

  try {
    await clearLoginFailures(clientKey);
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
