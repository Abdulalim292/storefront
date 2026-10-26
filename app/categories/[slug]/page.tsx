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

const PAGE_SIZE = 24;

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
    <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
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

      <header className="mt-8 grid gap-10 border-b border-[#dfddd5] pb-12 sm:mt-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:pb-16">
        <div>
          <p className="section-kicker">{category.kicker}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-.045em] text-[#17221f] sm:text-6xl">
            {category.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#59615c]">{category.intro}</p>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[.16em] text-[#8b806b]">
            {products.length} {products.length === 1 ? 'product' : 'products'} in this category
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden border border-[#dfddd5] bg-[#eeece5]">
          <CatalogImage
            productId={image.productId}
            src={image.src}
            alt={category.label}
            sizes="(max-width: 1023px) calc(100vw - 2.5rem), 620px"
            loading="eager"
            preload
            className={category.kind === 'equipment' ? 'object-contain p-6 sm:p-10' : 'object-cover'}
          />
        </div>
      </header>

      <section className="grid gap-8 border-b border-[#dfddd5] py-9 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.18em] text-[#8b806b]">
            Before you request a quote
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {category.buyingNotes.map((note, index) => (
              <li key={note} className="flex gap-3 text-sm leading-6 text-[#48534c]">
                <span className="font-mono text-xs text-[#a78b5f]">0{index + 1}</span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.18em] text-[#8b806b]">Related categories</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {category.related.map((relatedSlug) => {
              const related = getCategoryLanding(relatedSlug);
              if (!related) return null;
              return (
                <li key={related.slug}>
                  <Link
                    href={`/categories/${related.slug}`}
                    prefetch={false}
                    className="inline-flex min-h-10 items-center border border-[#cfcdc4] px-3 text-xs font-medium text-[#48534c] transition-colors hover:border-[#a78b5f] hover:bg-[#eeece4] hover:text-[#17221f]"
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
    </main>
  );
}

function CategoryResultsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="border border-[#dfddd5] bg-[#f1efe8]">
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
      <div className="flex h-56 flex-col items-center justify-center border border-dashed border-[#c9c8be] px-5 text-center">
        <p className="text-lg font-medium text-[#17221f]">No products listed yet</p>
        <p className="mt-1 text-sm text-[#667068]">Send us the model and part details and we will check availability.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-[-.03em] text-[#17221f] sm:text-3xl">
          {kind === 'equipment' ? 'Models in this category' : 'Parts in this category'}
        </h2>
        <p role="status" className="text-sm text-[#777b72]">
          Showing {start + 1}–{start + visibleProducts.length} of {total}
        </p>
      </div>

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
        <nav aria-label={`${label} pages`} className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[#dfddd5] pt-8">
          <PageLink href={page > 1 ? categoryHref(slug, page - 1) : undefined} label="Previous page">
            Previous
          </PageLink>
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
  const className = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors';

  if (!href) {
    return (
      <span aria-disabled="true" aria-label={label} className={`${className} cursor-not-allowed border-[#dfddd5] text-[#9a9d96]`}>
        {children}
      </span>
    );
  }

  if (current) {
    return (
      <Link href={href} aria-current="page" aria-label={label} className={`${className} border-[#17221f] bg-[#17221f] text-white`}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} prefetch={false} aria-label={label} className={`${className} border-[#b9b8ae] text-[#26332d] hover:bg-[#eeece4]`}>
      {children}
    </Link>
  );
}
