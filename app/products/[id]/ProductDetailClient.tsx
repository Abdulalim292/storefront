'use client';

import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { useCart } from '@/context/CartContext';
import { ClipboardList, Ruler, Settings2, Ship } from 'lucide-react';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <ResilientImage
              src={product.images[0]}
              alt={product.name}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4 transition-all duration-300"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">Representative photo; the supplied part may differ.</p>
          <a
            href={product.imageSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block w-fit text-xs text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-cyan-800"
          >
            {product.imageLicense === 'Original illustration' ? 'Illustration' : 'Photo'}: {product.imageCredit} · {product.imageLicense}
          </a>
          <a href={product.imageLicenseUrl} target="_blank" rel="noreferrer" className="mt-1 block w-fit text-xs text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-cyan-800">
            View image license
          </a>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-medium uppercase tracking-wider text-slate-500">
              {product.category.replaceAll('-', ' ')}
            </span>
            <h1 className="mt-2 w-fit rounded-md bg-slate-950 px-3 py-2 text-4xl font-bold tracking-tight text-white">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Fitment confirmation required</span>
            </div>
          </div>

          <p className="mb-8 text-lg leading-relaxed text-slate-600">
            {product.description}
          </p>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="flex-1 gap-2" onClick={() => addToCart(product)}>
              <ClipboardList className="h-5 w-5" />
              Add to inquiry list
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-slate-200 pt-10 sm:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Check part compatibility</h4>
                <p className="text-xs text-slate-500">Confirm engine make, model, and serial number.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                <Ruler className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Share dimensions</h4>
                <p className="text-xs text-slate-500">Include measurements or a part number if available.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                <Ship className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Marine applications</h4>
                <p className="text-xs text-slate-500">Parts for marine and industrial engine service.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Request a quote</h4>
                <p className="text-xs text-slate-500">Price and availability are confirmed per inquiry.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
