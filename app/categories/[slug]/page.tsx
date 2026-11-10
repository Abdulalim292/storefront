import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CATEGORY_LANDINGS,
  getCategoryImageSource,
  getCategoryLanding,
  getCategoryProducts,
} from '@/data/categories';
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/structured-data';
import { cleanDash } from '@/lib/copy';

const PAGE_SIZE = 24;

// Category pages validate the slug so unknown routes return a real 404.
// Pagination reads search params, so the route can block on first navigation.
export const instant = false;

export function generateStaticParams() {
  return CATEGORY_LANDINGS.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<'/categories/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryLanding(slug);
  if (!category) notFound();

  const image = getCategoryImageSource(category);

  return {
    title: category.label,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      type: 'website',
      title: category.label,
      description: category.description,
      url: `/categories/${category.slug}`,
      images: [{ url: image.src, alt: category.label }],
    },
  };
}

function categoryHref(slug: string, page: number) {
  return page > 1 ? `/categories/${slug}?page=${page}` : `/categories/${slug}`;
}

export default async function CategoryLandingPage({
  params,
  searchParams,
}: PageProps<'/categories/[slug]'>) {
  const { slug } = await params;
  const category = getCategoryLanding(slug);
  if (!category) notFound();

  const products = getCategoryProducts(category);
  const image = getCategoryImageSource(category);
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: category.label, path: `/categories/${category.slug}` },
  ];

  return (
    <main className="sheet-light">
      <div className="container py-12 sm:py-16 lg:py-20">
        <JsonLd
          data={collectionPageJsonLd({
            name: category.label,
            description: category.description,
            path: `/categories/${category.slug}`,
            items: products.map((product) => ({
              name: product.name,
              path: `/products/${product.id}`,
            })),
          })}
        />
        <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

        <Breadcrumbs items={breadcrumbItems} />

        <header className="mt-8 grid gap-10 border-b border-rule pb-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-16">
          <div className="lg:col-span-7">
            <h1 className="max-w-[24ch] text-ink">{category.heading}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-2">{cleanDash(category.intro)}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule-2 pt-4 font-outlier text-xs text-muted">
              <span>{category.kicker}</span>
              <span>{products.length} {products.length === 1 ? 'product' : 'products'} in this category</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="plate aspect-[4/3]">
              <CatalogImage
                productId={image.productId}
                src={image.src}
                alt={category.label}
                sizes="(max-width: 1023px) calc(100vw - 2.5rem), 520px"
                loading="eager"
                preload
                className={category.kind === 'equipment' ? 'h-full w-full object-contain p-6 sm:p-10' : 'h-full w-full object-cover'}
              />
            </div>
          </div>
        </header>

        <section className="grid gap-10 border-b border-rule py-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <h2 className="text-base font-semibold text-ink">Before you request a quote</h2>
            <ol className="mt-5 grid gap-4 sm:grid-cols-3">
              {category.buyingNotes.map((note, index) => (
                <li key={note} className="flex gap-3 border-t border-rule-2 pt-3 text-sm leading-6 text-ink-2">
                  <span className="font-outlier text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
                  <span>{cleanDash(note)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-4">
            <h2 className="text-base font-semibold text-ink">Related categories</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {category.related.map((relatedSlug) => {
                const related = getCategoryLanding(relatedSlug);
                if (!related) return null;
                return (
                  <li key={related.slug}>
                    <Link
                      href={`/categories/${related.slug}`}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center border border-rule-2 px-3 text-xs font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent"
                    >
                      {related.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-label={`${category.label} products`}>
          <Suspense fallback={<CategoryResultsFallback />}>
            <CategoryResults slug={category.slug} label={category.label} kind={category.kind} searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function CategoryResultsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="border border-rule-2 bg-paper-2">
          <div className="aspect-square" />
          <div className="h-28" />
        </div>
      ))}
    </div>
  );
}

async function CategoryResults({
  slug,
  label,
  kind,
  searchParams,
}: {
  slug: string;
  label: string;
  kind: 'equipment' | 'parts';
  searchParams: PageProps<'/categories/[slug]'>['searchParams'];
}) {
  const params = await searchParams;
  const category = getCategoryLanding(slug);
  if (!category) notFound();

  const products = [...getCategoryProducts(category)].sort((a, b) => a.name.localeCompare(b.name));
  const total = products.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedPage = Number.parseInt(typeof params.page === 'string' ? params.page : '1', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, pageCount)
    : 1;
  const start = (page - 1) * PAGE_SIZE;
  const visibleProducts = products.slice(start, start + PAGE_SIZE);

  if (total === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center border border-rule-2 px-5 py-14 text-center">
        <p className="font-display text-lg font-semibold uppercase text-ink">No products listed yet</p>
        <p className="mt-2 text-sm text-muted">Send us the model and part details and we will check availability.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 border-b border-rule-2 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl text-ink">
          {kind === 'equipment' ? 'Models in this category' : 'Parts in this category'}
        </h2>
        <p role="status" className="font-outlier text-xs text-muted">
          Showing {start + 1} to {start + visibleProducts.length} of {total}
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 ${total % 4 === 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
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
        <nav aria-label={`${label} pages`} className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6">
          <PageLink href={page > 1 ? categoryHref(slug, page - 1) : undefined} label="Previous page">
            Previous
          </PageLink>
          <div className="flex flex-wrap items-center gap-1">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <PageLink
                key={pageNumber}
                href={categoryHref(slug, pageNumber)}
                label={`Page ${pageNumber}`}
                current={pageNumber === page}
              >
                {pageNumber}
              </PageLink>
            ))}
          </div>
          <PageLink href={page < pageCount ? categoryHref(slug, page + 1) : undefined} label="Next page">
            Next
          </PageLink>
        </nav>
      )}
    </>
  );
}

function PageLink({
  href,
  label,
  current = false,
  children,
}: {
  href?: string;
  label: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  const className = 'inline-flex min-h-11 min-w-11 items-center justify-center border px-3 font-outlier text-sm font-medium transition-colors';

  if (!href) {
    return (
      <span aria-disabled="true" aria-label={label} className={`${className} cursor-not-allowed border-rule-2 text-muted opacity-50`}>
        {children}
      </span>
    );
  }

  if (current) {
    return (
      <Link href={href} aria-current="page" aria-label={label} className={`${className} border-ink bg-ink text-accent-ink`}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} prefetch={false} aria-label={label} className={`${className} border-rule-2 text-ink-2 hover:border-accent hover:text-accent`}>
      {children}
    </Link>
  );
}
