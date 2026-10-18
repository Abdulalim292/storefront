'use client';

import { Suspense } from 'react';
import { notFound, useParams } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { marineEngineModels, marineGearboxModels, heavyMachineryModels } from '@/data/equipment';
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

  // Search in parts catalog first
  let product = PRODUCTS.find((item) => item.id === id);

  // If not found, search in equipment models
  if (!product) {
    const allEquipment = [...marineEngineModels, ...marineGearboxModels, ...heavyMachineryModels];
    const equipment = allEquipment.find((item) => item.id === id);
    if (equipment) {
      // Map EquipmentModel to the structure ProductDetailClient expects
      product = {
        ...equipment,
        category: 'equipment', // Fallback category
        images: [equipment.image],
        imageSourceUrl: equipment.imageSource || '',
        imageCredit: equipment.imageCredit || '',
        imageLicense: 'Proprietary',
        imageLicenseUrl: '',
      } as any;
    }
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
