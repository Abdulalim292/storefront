'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { useCart } from '@/context/CartContext';
import { ClipboardList } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden">
        <div className="relative h-full w-full">
          <ResilientImage
            src={product.images[0]}
            alt={product.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-col p-4">
        <a
          href={product.imageSourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-3 text-[11px] leading-4 text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-cyan-800"
          aria-label={`Image credit: ${product.imageCredit}, ${product.imageLicense}`}
        >
          Photo: {product.imageCredit} · {product.imageLicense}
        </a>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {product.category.replaceAll('-', ' ')}
          </span>
        </div>
        <Link href={`/products/${product.id}`} className="mb-4 text-base font-semibold text-black">
          {product.name}
        </Link>

        <Button
          onClick={() => addToCart(product)}
          className="mt-auto w-full gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          Add to inquiry list
        </Button>
      </div>
    </div>
  );
}
