import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.stockStatus === 'low-stock' && (
          <div className="absolute top-2 left-2 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">
            Low Stock
          </div>
        )}
        {product.stockStatus === 'out-of-stock' && (
          <div className="absolute top-2 left-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
            Out of Stock
          </div>
        )}
      </Link>

      <div className="flex flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {product.category.replace('-', ' ')}
          </span>
          <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
        </div>
        <Link href={`/products/${product.id}`} className="mb-4 text-base font-semibold text-slate-800 hover:text-indigo-600">
          {product.name}
        </Link>

        <Button
          onClick={() => addToCart(product)}
          disabled={product.stockStatus === 'out-of-stock'}
          className="mt-auto w-full gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
