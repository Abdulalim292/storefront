'use client';

import { ResilientImage } from '@/components/ui/ResilientImage';
import { useProductImage } from '@/context/ProductImageContext';

type CatalogImageProps = {
  productId: string;
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export function CatalogImage({ productId, src, ...props }: CatalogImageProps) {
  return <ResilientImage src={useProductImage(productId, src)} {...props} />;
}
