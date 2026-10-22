import { NextResponse } from 'next/server';
import { adminCookie, hasValidOrigin } from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api', maxAge: 0 });
  return response;
}
