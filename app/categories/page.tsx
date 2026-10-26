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
    <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
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

      <header className="mt-8 max-w-4xl border-b border-[#dfddd5] pb-10 sm:mt-10 sm:pb-12">
        <p className="section-kicker">Browse the catalogue</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-[#17221f] sm:text-6xl">
          Equipment and parts, grouped by the work.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#59615c]">
          Start with the machine or the component you need. Each category explains what to confirm before ordering,
          so the model, fitment, and part number can be checked against your application.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.title} className="mt-14 sm:mt-20" aria-labelledby={`group-${group.title}`}>
          <div className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id={`group-${group.title}`} className="text-2xl font-semibold tracking-[-.03em] text-[#17221f] sm:text-3xl">
                {group.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6b746e]">{group.description}</p>
            </div>
            <p className="text-xs uppercase tracking-[.16em] text-[#8b806b]">
              {group.categories.length} categories
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {group.categories.map((category) => {
              const image = getCategoryImageSource(category);
              const count = getCategoryProducts(category).length;

              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  prefetch={false}
                  className="group flex flex-col overflow-hidden border border-[#dfddd5] bg-[#f8f7f3] transition-all hover:border-[#a78b5f] hover:shadow-[0_16px_40px_rgba(30,37,32,.09)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#eeece5]">
                    <CatalogImage
                      productId={image.productId}
                      src={image.src}
                      alt=""
                      sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), 440px"
                      className={`transition-transform duration-700 ease-out group-hover:scale-105 ${
                        category.kind === 'equipment' ? 'object-contain p-6' : 'object-cover'
                      }`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#8b806b]">
                        {category.kicker}
                      </span>
                      <span className="text-[11px] text-[#777b72]">
                        {count} {count === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-.025em] text-[#17221f]">{category.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#666f69]">{category.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#6f5a32]">
                      Browse category <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
