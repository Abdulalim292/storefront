'use client';

import React, { useEffect } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { Breadcrumbs, type BreadcrumbEntry } from '@/components/ui/Breadcrumbs';
import { useCart } from '@/context/CartContext';
import { ClipboardList, Ruler, Settings2, Ship, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { whatsappHref } from '@/lib/site';
import { cleanDash, splitMeta } from '@/lib/copy';

const guidance = [
  {
    icon: Settings2,
    title: 'Check part compatibility',
    line: 'Confirm engine name, model, and serial number.',
  },
  {
    icon: Ruler,
    title: 'Share dimensions',
    line: 'Include measurements or a part number if available.',
  },
  {
    icon: Ship,
    title: 'Marine applications',
    line: 'Parts for marine and industrial engine service.',
  },
  {
    icon: ClipboardList,
    title: 'Request a quote',
    line: 'Price and availability are confirmed per inquiry.',
  },
];

export default function ProductDetailClient({
  product,
  breadcrumbItems,
}: {
  product: Product;
  breadcrumbItems: BreadcrumbEntry[];
}) {
  const { addToCart } = useCart();
  const price = formatPrice(product.price);

  useEffect(() => {
    trackEvent('view_item', {
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
    });
  }, [product.id, product.name, product.category]);

  const handleWhatsAppInquiry = () => {
    const message = `Hi, I'm interested in ${product.name} (ID: ${product.id}). Could you please provide a quote?`;
    trackEvent('generate_lead', { method: 'whatsapp', source: 'product-detail', item_id: product.id });
    window.open(whatsappHref(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="sheet-light">
      <div className="container py-12 sm:py-16">
        <Breadcrumbs items={breadcrumbItems} />

        <section aria-label="Product overview" className="mt-8 grid grid-cols-1 gap-10 lg:min-h-[34rem] lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col lg:col-span-6">
            <div className="plate aspect-square lg:aspect-auto lg:min-h-[420px] lg:flex-1">
              <CatalogImage
                productId={product.id}
                src={product.images[0]}
                alt={product.name}
                sizes="(max-width: 1023px) calc(100vw - 2rem), (max-width: 1312px) 50vw, 640px"
                loading="eager"
                preload
                className="h-full w-full object-contain p-6 sm:p-10"
              />
            </div>
            <div className="dim-row mt-8">
              <span className="font-outlier text-xs text-muted">Part record</span>
              <span className="dim" aria-hidden="true" />
              <span className="font-outlier text-xs text-muted">{product.id}</span>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-6 lg:justify-center">
            <p className="font-outlier text-xs text-muted">{product.category.replaceAll('-', ' ')}</p>
            <h1 className="mt-3 max-w-full break-words text-[clamp(2rem,3.6vw,3.4rem)] font-semibold text-ink">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="tag">
                {product.category === 'equipment' ? 'Model and serial required' : 'Part number required'}
              </span>
              {price && <span className="tag border-accent text-accent">{price}</span>}
            </div>

            <p className="mt-6 max-w-[58ch] text-base leading-7 text-ink-2">
              {cleanDash(product.description)}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" onClick={() => addToCart(product)}>
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
                Add to inquiry list
              </Button>
              <Button variant="secondary" className="flex-1" onClick={handleWhatsAppInquiry}>
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp inquiry
              </Button>
            </div>

            <p className="mt-5 font-outlier text-xs leading-5 text-muted">
              Price and availability are confirmed per inquiry. No payment is taken online.
            </p>
          </div>
        </section>

        {product.specifications && product.specifications.length > 0 && (
          <section className="mt-32 border-t border-rule pt-8" aria-labelledby="model-details">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule-2 pb-4">
              <div>
                <p className="font-outlier text-xs text-muted">Specification</p>
                <h2 id="model-details" className="mt-3 text-ink">
                  {product.category === 'equipment' ? 'Model details' : 'Part details'}
                </h2>
              </div>
              <p className="font-outlier text-xs text-muted">{product.specifications.length} entries</p>
            </div>
            <ul>
              {product.specifications.flatMap((specification) =>
                splitMeta(specification).map((part) => (
                  <li
                    key={`${specification}-${part}`}
                    className="flex items-baseline gap-3 border-b border-rule-2 py-4 text-sm leading-6 text-ink-2"
                  >
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] bg-accent" />
                    {part}
                  </li>
                ))
              )}
            </ul>
          </section>
        )}

        <section className="mt-32" aria-labelledby="inquiry-guidance">
          <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
            <h2 id="inquiry-guidance" className="text-xl text-ink">
              Before you inquire
            </h2>
            <p className="font-outlier text-xs text-muted">04 steps</p>
          </div>
          <div className="grid grid-cols-1 border-l border-t border-rule-2 sm:grid-cols-2 lg:grid-cols-4">
            {guidance.map(({ icon: Icon, title, line }, index) => (
              <div key={title} className="border-b border-r border-rule-2 p-5">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{line}</p>
                <span className="mt-4 block font-outlier text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
