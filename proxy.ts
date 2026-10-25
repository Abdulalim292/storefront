import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import catalog from './data/catalog.json';

// Cache Components streams product pages before `notFound()` runs, which would
// commit a 200 status for unknown ids. Reject those ids in the proxy instead so
// the 404 status is decided before any rendering starts.
const PRODUCT_IDS = new Set(catalog.products.map((product) => product.id));
const PRODUCT_PREFIX = '/products/';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(PRODUCT_PREFIX)) return NextResponse.next();

  const rawId = pathname.slice(PRODUCT_PREFIX.length).replace(/\/+$/, '');
  if (!rawId) return NextResponse.next();

  let id = rawId;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    // Keep the raw value; it cannot match a catalog id.
  }

  if (PRODUCT_IDS.has(id)) return NextResponse.next();

  return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
}

export const config = {
  matcher: '/products/:path+',
};
