'use client';

import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { useCart } from '@/context/CartContext';
import { ClipboardList, Ruler, Settings2, Ship, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const price = formatPrice(product.price);

  const WHATSAPP_PHONE = '8801819461614';

  const handleWhatsAppInquiry = () => {
    const message = `Hi, I'm interested in ${product.name} (ID: ${product.id}). Could you please provide a quote?`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden border border-[#dfddd5] bg-[#eeece5]">
            <CatalogImage
              productId={product.id}
              src={product.images[0]}
              alt={product.name}
              sizes="(max-width: 1023px) calc(100vw - 2rem), (max-width: 1312px) 50vw, 640px"
              loading="eager"
              className="object-contain p-5 transition-transform duration-700 ease-out hover:scale-105 sm:p-8"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-[.16em] text-[#8b806b]">
              {product.category.replaceAll('-', ' ')}
            </span>
            <h1 className="mt-3 max-w-full break-words text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-.045em] text-[#17221f]">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="border border-[#dfddd5] bg-[#eeece5] px-3 py-2 text-xs font-medium text-[#59615c]">
                {product.category === 'equipment' ? 'Model and serial required' : 'Part number required'}
              </span>
              {price && <span className="border border-[#c6b28b] bg-[#f5eddd] px-3 py-2 text-sm font-semibold text-[#6f5a32]">{price}</span>}
            </div>
          </div>

          <p className="mb-8 text-lg leading-8 text-[#59615c]">
            {product.description}
          </p>

          {product.category === 'equipment' && product.specifications && (
            <section className="mb-8 border border-[#dfddd5] bg-[#f1efe8] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#17221f]">Model details</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#48534c]">
                {product.specifications.map((specification) => (
                  <li key={specification} className="flex gap-2">
                    <span aria-hidden="true" className="text-[#a78b5f]">•</span>
                    <span>{specification}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="flex-1 gap-2" onClick={() => addToCart(product)}>
              <ClipboardList className="h-5 w-5" />
              Add to inquiry list
            </Button>
            <Button
              size="lg"
              className="flex-1 gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white border-none"
              onClick={handleWhatsAppInquiry}
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Inquiry
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-[#dfddd5] pt-10 sm:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Check part compatibility</h4>
                <p className="text-xs text-slate-500">Confirm engine name, model, and serial number.</p>
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
