import { NextResponse } from 'next/server';
import { getProductImageOverrides } from '@/lib/product-image-storage';

export async function GET() {
  try {
    return NextResponse.json(await getProductImageOverrides(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({}, { headers: { 'Cache-Control': 'no-store' } });
  }
}
