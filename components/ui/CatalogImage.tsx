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
  const resolvedSrc = useProductImage(productId, src);
  // Remount when the photo changes so any previous error state is discarded.
  return <ResilientImage key={resolvedSrc} src={resolvedSrc} {...props} />;
}
