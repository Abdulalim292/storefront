import type { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { cleanDash } from '@/lib/copy';

export const metadata: Metadata = {
  title: 'Image credits',
  description: 'Creators, sources, and licenses for the product photography used on the Noor Alam Machineries storefront.',
  alternates: { canonical: '/image-credits' },
};

type CreditGroup = {
  source: string;
  credit: string;
  license: string;
  licenseUrl: string;
  productNames: string[];
};

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

// Many catalog entries share the same source photograph. Grouping keeps the
// attribution page small while still naming every product that uses it.
const creditGroups = (() => {
  const products = [...PRODUCTS, ...EQUIPMENT_PRODUCTS];
  const groups = new Map<string, CreditGroup>();

  for (const product of products) {
    const source = safeHttpUrl(product.imageSourceUrl);
    const licenseUrl = safeHttpUrl(product.imageLicenseUrl);
    const credit = product.imageCredit || 'Credit not recorded';
    const license = product.imageLicense || '';
    const key = source || `${credit}|${license}`;

    const existing = groups.get(key);
    if (existing) {
      existing.productNames.push(product.name);
      if (!existing.licenseUrl && licenseUrl) existing.licenseUrl = licenseUrl;
      continue;
    }

    groups.set(key, {
      source,
      credit,
      license,
      licenseUrl,
      productNames: [product.name],
    });
  }

  return [...groups.values()].sort((a, b) =>
    a.credit.localeCompare(b.credit) || a.productNames[0].localeCompare(b.productNames[0])
  );
})();

// Site photography that is not part of the product catalog.
const sitePhotos = [
  {
    name: 'Homepage hero: engine room on the RV Southern Surveyor',
    credit: 'Simon Torok / CSIRO',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_7992_The_engine_room_on_the_RV_Southern_Surveyor.jpg',
  },
];

export default function ImageCreditsPage() {
  return (
    <main className="sheet-light">
      <div className="container py-12 sm:py-16 lg:py-20">
        <header className="index-head border-b border-rule pb-10">
          <div>
            <p className="font-outlier text-xs text-muted">Attribution</p>
            <h1 className="mt-4 text-ink">Image credits</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-2">
              Product photography is shown for reference and remains the property of its respective owners. Where a photograph
              comes from Wikimedia Commons or another source, the creator, license, and original page are listed below.
              Manufacturer logos are credited in the brand assets README in the project repository.
            </p>
            <p className="mt-4 font-outlier text-xs text-muted">
              {PRODUCTS.length + EQUIPMENT_PRODUCTS.length} catalog items across {creditGroups.length} image sources
            </p>
          </div>

          <nav aria-label="Credit sections" className="mt-10 flex flex-col gap-3 border-t border-rule-2 pt-4 font-outlier text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Jump to a section</span>
            <span className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#site-photography" className="hover:text-accent">Site photography</a>
              <a href="#product-photography" className="hover:text-accent">Product photography</a>
            </span>
          </nav>
        </header>

        <section className="mt-14" aria-labelledby="site-photography">
          <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-rule pb-3">
            <h2 id="site-photography" className="text-xl text-ink">Site photography</h2>
            <p className="font-outlier text-xs text-muted">01</p>
          </div>
          <ul>
            {sitePhotos.map((photo) => (
              <li key={photo.name} className="grid gap-3 border-b border-rule-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                <div className="sm:col-span-7">
                  <p className="text-sm font-medium leading-6 text-ink">{photo.name}</p>
                  <p className="mt-1 font-outlier text-xs text-muted">{photo.credit}</p>
                </div>
                <div className="sm:col-span-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-outlier text-xs text-muted sm:justify-end">
                    {photo.license && <span>{photo.license}</span>}
                    {photo.source && (
                      <a href={photo.source} target="_blank" rel="noreferrer" className="link">
                        Source
                      </a>
                    )}
                    {photo.licenseUrl && (
                      <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="link">
                        License
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="product-photography">
          <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-rule pb-3">
            <h2 id="product-photography" className="text-xl text-ink">Product photography</h2>
            <p className="font-outlier text-xs text-muted">02</p>
          </div>
          <ul>
            {creditGroups.map((group) => (
              <li key={group.source || group.credit} className="grid gap-3 border-b border-rule-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                <div className="sm:col-span-7">
                  {group.productNames.length > 3 ? (
                    <details>
                      <summary className="cursor-pointer font-outlier text-xs text-ink marker:text-accent">
                        {group.productNames.length} products
                      </summary>
                      <ul className="mt-2 space-y-1">
                        {group.productNames.map((name) => (
                          <li key={name} className="text-sm leading-6 text-ink-2">{cleanDash(name)}</li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <p className="text-sm leading-6 text-ink">
                      {group.productNames.map((name) => cleanDash(name)).join(', ')}
                    </p>
                  )}
                  <p className="mt-1 font-outlier text-xs text-muted">{group.credit}</p>
                </div>
                <div className="sm:col-span-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-outlier text-xs text-muted sm:justify-end">
                    {group.license && <span>{group.license}</span>}
                    {group.source && (
                      <a href={group.source} target="_blank" rel="noreferrer" className="link">
                        Source
                      </a>
                    )}
                    {group.licenseUrl && (
                      <a href={group.licenseUrl} target="_blank" rel="noreferrer" className="link">
                        License
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
