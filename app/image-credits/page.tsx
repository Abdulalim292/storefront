import type { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';

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

export default function ImageCreditsPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <p className="section-kicker">Attribution</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-[#17221f] sm:text-6xl">Image credits</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[#59615c]">
        Product photography is shown for reference and remains the property of its respective owners. Where a photograph
        comes from Wikimedia Commons or another source, the creator, license, and original page are listed below.
        Manufacturer logos are credited in the brand assets README in the project repository.
      </p>
      <p className="mt-4 text-sm text-[#777b72]">
        {PRODUCTS.length + EQUIPMENT_PRODUCTS.length} catalog items across {creditGroups.length} image sources.
      </p>

      <ul className="mt-12 divide-y divide-[#dfddd5] border-y border-[#dfddd5]">
        {creditGroups.map((group) => (
          <li key={group.source || group.credit} className="grid gap-3 py-5 sm:grid-cols-[1.15fr_.85fr] sm:gap-8">
            <div>
              <p className="text-sm font-semibold leading-6 text-[#17221f]">{group.productNames.join(' · ')}</p>
              <p className="mt-1 text-xs leading-5 text-[#777b72]">{group.credit}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#59615c]">
              {group.license && <span>{group.license}</span>}
              {group.source && (
                <a href={group.source} target="_blank" rel="noreferrer" className="font-medium text-[#6f5a32] underline decoration-[#c6b28b] underline-offset-4 hover:text-[#17221f]">
                  Source
                </a>
              )}
              {group.licenseUrl && (
                <a href={group.licenseUrl} target="_blank" rel="noreferrer" className="font-medium text-[#6f5a32] underline decoration-[#c6b28b] underline-offset-4 hover:text-[#17221f]">
                  License
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
