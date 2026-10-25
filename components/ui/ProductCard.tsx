'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { useCart } from '@/context/CartContext';
import { ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const price = formatPrice(product.price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden border border-[#dfddd5] bg-[#f8f7f3] transition-all hover:border-[#a78b5f] hover:shadow-[0_16px_40px_rgba(30,37,32,.09)]"
    >
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-[#eeece5]">
        <div className="relative h-full w-full">
          <CatalogImage
            productId={product.id}
            src={product.images[0]}
            alt={product.name}
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), (max-width: 1279px) calc((100vw - 5rem) / 4), 300px"
            className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#8b806b]">
            {product.category.replaceAll('-', ' ')}
          </span>
        </div>
        <Link href={`/products/${product.id}`} className={`text-base font-semibold text-[#17221f] ${price ? 'mb-2' : 'mb-4'}`}>
          {product.name}
        </Link>
        {price && <p className="mb-3 text-sm font-semibold text-[#8d754d]">{price}</p>}

        <Button
          onClick={() => addToCart(product)}
          className="mt-auto w-full gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          Add to inquiry list
        </Button>
      </div>
    </motion.div>
  );
}
