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
    <main className="sheet-light">
      <Suspense fallback={<div className="container py-24 text-center text-muted">Loading products</div>}>
        <ProductsResults searchParams={searchParams} />
      </Suspense>
    </main>
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
    <div className="container py-12 sm:py-16 lg:py-20">
      <header className="index-head border-b border-rule pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="text-ink">Find the part for the job.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-2">
              Browse engine components and request pricing and fitment confirmation.
            </p>
            {rawQuery && <p className="mt-3 font-outlier text-sm text-muted">Search results for “{rawQuery}”</p>}
          </div>
          <div className="grid grid-cols-2 border border-rule-2 lg:col-span-4">
            <div className="border-r border-rule-2 p-4">
              <p className="font-outlier text-xs text-muted">Records</p>
              <p className="mt-1 font-outlier text-2xl font-medium text-ink">{total}</p>
            </div>
            <div className="p-4">
              <p className="font-outlier text-xs text-muted">Page</p>
              <p className="mt-1 font-outlier text-2xl font-medium text-ink">{page} / {pageCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ProductsControls
            categories={CATEGORIES}
            category={category}
            query={rawQuery}
            sort={sort}
          />
        </div>
      </header>

      {total > 0 ? (
        <>
          <p role="status" className="mt-8 border-b border-rule-2 pb-3 font-outlier text-xs text-muted">
            Showing {start + 1} to {start + visibleProducts.length} of {total} results
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                eager={index < 4}
                preload={index === 0}
                aspect="wide"
              />
            ))}
          </div>

          {pageCount > 1 && (
            <nav aria-label="Product pages" className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
              <PageLink
                href={page > 1 ? buildProductsHref({ category, query: rawQuery, sort, page: page - 1 }) : undefined}
                label="Previous page"
              >
                Previous
              </PageLink>
              <span className="font-outlier text-sm text-muted" aria-current="page">Page {page} of {pageCount}</span>
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
        <div className="mt-8 flex min-h-64 flex-col items-center justify-center border border-rule-2 px-5 py-16 text-center">
          <p className="font-display text-xl font-semibold uppercase text-ink">No parts found</p>
          <p className="mt-2 text-muted">Try another search term or category.</p>
          <Link href="/products" className="btn btn--quiet mt-6">
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  );
}

function PageLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) {
    return (
      <span aria-disabled="true" aria-label={label} className="btn btn--quiet cursor-not-allowed opacity-50">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} prefetch={false} aria-label={label} className="btn btn--quiet">
      {children}
    </Link>
  );
}
