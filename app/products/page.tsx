import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsList } from './ProductsList';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse marine engine parts, turbochargers, cylinder components, gearbox parts, and heavy equipment components from Noor Alam Machineries.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage({ searchParams }: PageProps<'/products'>) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1440px] px-5 py-24 text-center text-[#59615c] sm:px-8 lg:px-12">Loading products…</div>}>
      <ProductsResults searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsResults({ searchParams }: Pick<PageProps<'/products'>, 'searchParams'>) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const query = typeof params.q === 'string' ? params.q : '';
  return <ProductsList initialCategory={category} initialQuery={query} />;
}
