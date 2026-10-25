import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { ProductsControls } from './ProductsControls';

const PAGE_SIZE = 24;
const ALL_SEARCHABLE_PRODUCTS = [...PRODUCTS, ...EQUIPMENT_PRODUCTS];

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse marine engine parts, turbochargers, cylinder components, gearbox parts, and heavy equipment components from Noor Alam Machineries.',
  alternates: { canonical: '/products' },
};

function buildProductsHref({
  category,
  query,
  sort,
  page,
}: {
  category: string;
  query: string;
  sort: 'a-z' | 'z-a';
  page: number;
}) {
  const params = new URLSearchParams();
  if (category !== 'all') params.set('category', category);
  if (query) params.set('q', query);
  if (sort === 'z-a') params.set('sort', 'z-a');
  if (page > 1) params.set('page', String(page));

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : '/products';
}

export default function ProductsPage({ searchParams }: PageProps<'/products'>) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1440px] px-5 py-24 text-center text-[#59615c] sm:px-8 lg:px-12">Loading products…</div>}>
      <ProductsResults searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsResults({ searchParams }: Pick<PageProps<'/products'>, 'searchParams'>) {
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category : '';
  const category = CATEGORIES.some(({ value }) => value === categoryParam) ? categoryParam : 'all';
  const rawQuery = typeof params.q === 'string' ? params.q.trim().slice(0, 120) : '';
  const query = rawQuery.toLowerCase();
  const sort: 'a-z' | 'z-a' = params.sort === 'z-a' ? 'z-a' : 'a-z';

  let filteredProducts = category === 'all'
    ? [...ALL_SEARCHABLE_PRODUCTS]
    : PRODUCTS.filter((product) => product.category === category);

  if (query) {
    filteredProducts = filteredProducts.filter(({ name, description, category: productCategory }) =>
      `${name} ${description} ${productCategory.replaceAll('-', ' ')}`.toLowerCase().includes(query)
    );
  }

  filteredProducts.sort((a, b) => sort === 'a-z'
    ? a.name.localeCompare(b.name)
    : b.name.localeCompare(a.name));

  const total = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedPage = Number.parseInt(typeof params.page === 'string' ? params.page : '1', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, pageCount)
    : 1;
  const start = (page - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(start, start + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mb-10 flex flex-col gap-8 border-b border-[#dfddd5] pb-9 sm:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Parts and components</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-[#17221f] sm:text-6xl">Find the part for the job.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#59615c]">Browse engine components and request pricing and fitment confirmation.</p>
          {rawQuery && <p className="mt-3 text-sm text-[#8b806b]">Search results for “{rawQuery}”</p>}
        </div>

        <ProductsControls
          categories={CATEGORIES}
          category={category}
          query={rawQuery}
          sort={sort}
        />
      </div>

      {total > 0 ? (
        <>
          <p role="status" className="mb-6 text-sm text-[#777b72]">
            Showing {start + 1}–{start + visibleProducts.length} of {total} results
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                eager={index < 4}
                preload={index === 0}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <nav aria-label="Product pages" className="mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-[#dfddd5] pt-8">
              <PageLink
                href={page > 1 ? buildProductsHref({ category, query: rawQuery, sort, page: page - 1 }) : undefined}
                label="Previous page"
              >
                Previous
              </PageLink>
              <span className="px-2 text-sm text-[#59615c]" aria-current="page">Page {page} of {pageCount}</span>
              <PageLink
                href={page < pageCount ? buildProductsHref({ category, query: rawQuery, sort, page: page + 1 }) : undefined}
                label="Next page"
              >
                Next
              </PageLink>
            </nav>
          )}
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center border border-dashed border-[#c9c8be] px-5 text-center">
          <p className="text-lg font-medium text-[#17221f]">No parts found</p>
          <p className="text-[#667068]">Try another search term or category.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm border border-[#b9b8ae] px-4 py-2 text-base font-medium text-[#26332d] transition-colors hover:bg-[#eeece4] focus:outline-none focus:ring-2 focus:ring-[#a78b5f] focus:ring-offset-2"
          >
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  );
}

function PageLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  const className = 'inline-flex min-h-11 items-center justify-center rounded-sm border border-[#b9b8ae] px-4 py-2 text-sm font-medium transition-colors';

  if (!href) {
    return (
      <span aria-disabled="true" aria-label={label} className={`${className} cursor-not-allowed border-[#dfddd5] text-[#9a9d96]`}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} prefetch={false} aria-label={label} className={`${className} text-[#26332d] hover:bg-[#eeece4]`}>
      {children}
    </Link>
  );
}
