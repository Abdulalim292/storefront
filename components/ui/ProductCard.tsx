'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { useCart } from '@/context/CartContext';
import { ClipboardList } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  eager?: boolean;
  preload?: boolean;
  aspect?: 'square' | 'wide';
}

export function ProductCard({ product, eager = false, preload = false, aspect = 'square' }: ProductCardProps) {
  const { addToCart } = useCart();
  const price = formatPrice(product.price);

  return (
    <article className="flex min-w-0 flex-col border border-rule-2 bg-paper">
      <Link
        href={`/products/${product.id}`}
        prefetch={false}
        className="plate-link"
      >
        <div className={`plate ${aspect === 'wide' ? 'aspect-[2/1]' : 'aspect-square'}`}>
          <CatalogImage
            productId={product.id}
            src={product.images[0]}
            alt={product.name}
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), (max-width: 1279px) calc((100vw - 5rem) / 4), 300px"
            className="h-full w-full object-contain p-4"
            loading={eager ? 'eager' : 'lazy'}
            preload={preload}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col border-t border-rule-2 p-4">
        <p className="mb-2 font-outlier text-xs text-muted">{product.category.replaceAll('-', ' ')}</p>
        <h3 className="text-base font-medium leading-snug text-ink">
          <Link href={`/products/${product.id}`} prefetch={false} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        {price && <p className="mt-2 font-outlier text-sm font-medium text-accent">{price}</p>}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => addToCart(product)}
          className="mt-auto w-full"
        >
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          Add to inquiry list
        </Button>
      </div>
    </article>
  );
}
