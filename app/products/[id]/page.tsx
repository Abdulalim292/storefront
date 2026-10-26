import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { getCategoryForProduct } from '@/data/categories';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/structured-data';
import ProductDetailClient from './ProductDetailClient';

function findProduct(id: string) {
  return PRODUCTS.find((item) => item.id === id)
    ?? EQUIPMENT_PRODUCTS.find((item) => item.id === id);
}

// Product ids come from the bundled catalog, so every detail page can be
// prerendered at build time instead of being rendered on first request.
export function generateStaticParams() {
  return [...PRODUCTS, ...EQUIPMENT_PRODUCTS].map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<'/products/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: 'website',
      title: product.name,
      description: product.description,
      url: `/products/${product.id}`,
      images: product.images.length ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps<'/products/[id]'>) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) {
    notFound();
  }

  const category = getCategoryForProduct(product);
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    ...(category ? [{ name: category.label, path: `/categories/${category.slug}` }] : []),
    { name: product.name, path: `/products/${product.id}` },
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <ProductDetailClient product={product} breadcrumbItems={breadcrumbItems} />
    </>
  );
}
