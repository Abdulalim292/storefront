import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  CATEGORY_LANDINGS,
  getCategoryImageSource,
  getCategoryProducts,
} from '@/data/categories';
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/structured-data';
import { cleanDash } from '@/lib/copy';

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse marine engines, gearboxes, heavy machinery, and engine parts by category at Noor Alam Machineries.',
  alternates: { canonical: '/categories' },
};

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
];

const groups = [
  {
    title: 'Equipment',
    description: 'Complete engines, transmissions, and machines matched to the work.',
    categories: CATEGORY_LANDINGS.filter((category) => category.kind === 'equipment'),
  },
  {
    title: 'Parts and components',
    description: 'Service parts and overhaul components for marine and industrial equipment.',
    categories: CATEGORY_LANDINGS.filter((category) => category.kind === 'parts'),
  },
];

export default function CategoriesPage() {
  return (
    <main className="sheet-light">
      <div className="container py-12 sm:py-16 lg:py-20">
        <JsonLd
          data={collectionPageJsonLd({
            name: 'Equipment and parts categories',
            description: 'Marine engines, gearboxes, heavy machinery, and engine parts categories.',
            path: '/categories',
            items: CATEGORY_LANDINGS.map((category) => ({
              name: category.label,
              path: `/categories/${category.slug}`,
            })),
          })}
        />
        <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

        <Breadcrumbs items={breadcrumbItems} />

        <header className="index-head mt-8 border-b border-rule pb-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="text-ink">Equipment and parts, grouped by the work.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-2">
                Start with the machine or the component you need. Each category explains what to confirm before ordering,
                so the model, fitment, and part number can be checked against your application.
              </p>
            </div>
            <div className="grid grid-cols-2 border border-rule-2 lg:col-span-4">
              <div className="border-r border-rule-2 p-4">
                <p className="font-outlier text-xs text-muted">Categories</p>
                <p className="mt-1 font-outlier text-2xl font-medium text-ink">{CATEGORY_LANDINGS.length}</p>
              </div>
              <div className="p-4">
                <p className="font-outlier text-xs text-muted">Groups</p>
                <p className="mt-1 font-outlier text-2xl font-medium text-ink">{groups.length}</p>
              </div>
            </div>
          </div>

          <nav aria-label="Category groups" className="mt-10 flex flex-col gap-3 border-t border-rule-2 pt-4 font-outlier text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Jump to a group</span>
            <span className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#group-equipment" className="hover:text-accent">{groups[0].title}</a>
              <a href="#group-parts" className="hover:text-accent">{groups[1].title}</a>
            </span>
          </nav>
        </header>

        <section className="mt-14" aria-labelledby="group-equipment">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="group-equipment" className="text-ink">{groups[0].title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{groups[0].description}</p>
            </div>
            <p className="font-outlier text-xs text-muted">{groups[0].categories.length} categories</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups[0].categories.map((category) => {
              const image = getCategoryImageSource(category);
              const count = getCategoryProducts(category).length;

              return (
                <Link key={category.slug} href={`/categories/${category.slug}`} prefetch={false} className="plate-link group flex min-w-0 flex-col border border-rule-2">
                  <div className="plate aspect-[4/3]">
                    <CatalogImage
                      productId={image.productId}
                      src={image.src}
                      alt=""
                      sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), 440px"
                      className="h-full w-full object-contain p-6"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-rule-2 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-outlier text-xs text-muted">{category.kicker}</span>
                      <span className="font-outlier text-xs text-muted">
                        {count} {count === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-ink">{category.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-2">{cleanDash(category.description)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                      Browse category <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="group-parts">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="group-parts" className="text-ink">{groups[1].title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{groups[1].description}</p>
            </div>
            <p className="font-outlier text-xs text-muted">{groups[1].categories.length} categories</p>
          </div>

          <ul className="border-t border-rule">
            {groups[1].categories.map((category, index) => {
              const count = getCategoryProducts(category).length;
              return (
                <li key={category.slug} className="border-b border-rule-2">
                  <Link
                    href={`/categories/${category.slug}`}
                    prefetch={false}
                    className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-5 transition-colors hover:bg-paper-2 sm:grid-cols-[3rem_1fr_2fr_auto]"
                  >
                    <span className="font-outlier text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg font-medium text-ink">{category.label}</h3>
                    <span className="col-start-2 text-sm leading-6 text-muted sm:col-start-3">{cleanDash(category.description)}</span>
                    <span className="col-start-3 row-start-1 flex items-center gap-3 font-outlier text-xs text-muted sm:col-start-4">
                      {count} {count === 1 ? 'part' : 'parts'}
                      <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
