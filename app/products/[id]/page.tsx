'use client';

import { Suspense } from 'react';
import { notFound, useParams } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-600">Loading product...</div>}>
      <ProductDetailRoute />
    </Suspense>
  );
}

function ProductDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
