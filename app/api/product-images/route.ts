import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { getProductImageOverrides } from '@/lib/product-image-storage';

export async function GET() {
  // The overrides live in Supabase and change from the admin page, so this
  // route must never be prerendered into a static, stale response.
  await connection();
  try {
    return NextResponse.json(await getProductImageOverrides(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({}, { headers: { 'Cache-Control': 'no-store' } });
  }
}
