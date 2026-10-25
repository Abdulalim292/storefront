import type { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';

export const metadata: Metadata = {
  title: 'Image credits',
  description: 'Creators, sources, and licenses for the product photography used on the Noor Alam Machineries storefront.',
  alternates: { canonical: '/image-credits' },
};

const products = [...PRODUCTS, ...EQUIPMENT_PRODUCTS];

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

      <ul className="mt-12 divide-y divide-[#dfddd5] border-y border-[#dfddd5]">
        {products.map((product) => (
          <li key={product.id} className="grid gap-2 py-4 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:gap-6">
            <div>
              <p className="text-sm font-semibold text-[#17221f]">{product.name}</p>
              <p className="mt-1 text-xs leading-5 text-[#777b72]">{product.imageCredit || 'Credit not recorded'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#59615c]">
              {product.imageLicense && <span>{product.imageLicense}</span>}
              {product.imageSourceUrl && (
                <a href={product.imageSourceUrl} target="_blank" rel="noreferrer" className="font-medium text-[#6f5a32] underline decoration-[#c6b28b] underline-offset-4 hover:text-[#17221f]">
                  Source
                </a>
              )}
              {product.imageLicenseUrl && (
                <a href={product.imageLicenseUrl} target="_blank" rel="noreferrer" className="font-medium text-[#6f5a32] underline decoration-[#c6b28b] underline-offset-4 hover:text-[#17221f]">
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
