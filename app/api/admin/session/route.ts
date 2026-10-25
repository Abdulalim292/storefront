import { NextResponse } from 'next/server';
import { adminCookie, adminSessionSeconds, createAdminSession, hasValidOrigin, passwordsMatch } from '@/lib/admin-auth';
import { clearLoginFailures, loginClientKey, loginRetryAfter, recordLoginFailure } from '@/lib/rate-limit';

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 });

  const clientKey = loginClientKey(request);
  if (clientKey) {
    const retryAfter = loginRetryAfter(clientKey);
    if (retryAfter) {
      return NextResponse.json(
        { error: 'Too many sign-in attempts. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }
  }

  let password = '';
  try {
    ({ password = '' } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Enter the admin password.' }, { status: 400 });
  }
  try {
    if (!passwordsMatch(password)) {
      if (clientKey) recordLoginFailure(clientKey);
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }
    if (clientKey) clearLoginFailures(clientKey);
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookie, session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api',
      maxAge: adminSessionSeconds,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Admin login is not configured.' }, { status: 503 });
  }
}

export async function GET() {
  const { isAdminRequest } = await import('@/lib/admin-auth');
  return NextResponse.json({ authenticated: await isAdminRequest() });
}
