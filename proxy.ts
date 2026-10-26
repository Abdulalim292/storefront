import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import catalog from './data/catalog.json';
import { CATEGORY_LANDINGS } from './data/categories';

// Cache Components streams product and category pages before `notFound()` runs,
// which would commit a 200 status for unknown ids. Reject those in the proxy
// instead so the 404 status is decided before any rendering starts.
const PRODUCT_IDS = new Set(catalog.products.map((product) => product.id));
const CATEGORY_SLUGS = new Set(CATEGORY_LANDINGS.map((category) => category.slug));
const PRODUCT_PREFIX = '/products/';
const CATEGORY_PREFIX = '/categories/';

function decodePathSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    // Keep the raw value; it cannot match a known route.
    return value;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(PRODUCT_PREFIX)) {
    const rawId = pathname.slice(PRODUCT_PREFIX.length).replace(/\/+$/, '');
    if (!rawId) return NextResponse.next();

    if (PRODUCT_IDS.has(decodePathSegment(rawId))) return NextResponse.next();

    return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
  }

  if (pathname.startsWith(CATEGORY_PREFIX)) {
    const rawSlug = pathname.slice(CATEGORY_PREFIX.length).replace(/\/+$/, '');
    if (!rawSlug) return NextResponse.next();

    if (CATEGORY_SLUGS.has(decodePathSegment(rawSlug))) return NextResponse.next();

    return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path+', '/categories/:path+'],
};
