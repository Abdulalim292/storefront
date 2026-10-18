import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({ params }: PageProps<'/products/[id]'>) {
  const { id } = await params;
  const product = PRODUCTS.find((item) => item.id === id)
    ?? EQUIPMENT_PRODUCTS.find((item) => item.id === id);
  if (!product) {
    notFound();
  }
  return <ProductDetailClient product={product} />;
}
