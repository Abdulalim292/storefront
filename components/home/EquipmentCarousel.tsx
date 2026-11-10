'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { EquipmentModel } from '@/data/equipment';
import { useProductImage } from '@/context/ProductImageContext';
import { cleanDash, splitMeta } from '@/lib/copy';

export function EquipmentCarousel({ models }: { models: EquipmentModel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const model = models[activeIndex];
  const image = useProductImage(model.id, model.image);
  const move = (offset: number) => setActiveIndex((index) => (index + offset + models.length) % models.length);
  const specs = (model.specifications ?? []).flatMap((spec) => splitMeta(spec)).slice(0, 4);

  return (
    <section className="section band-deep">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2>Equipment in focus.</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} aria-label="Previous equipment" className="masthead__icon border border-rule-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next equipment" className="masthead__icon border border-rule-2">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid border border-rule-2 lg:grid-cols-[1.1fr_.9fr]">
          <Link href={`/products/${model.id}`} className="plate-link block border-b border-rule-2 lg:border-b-0 lg:border-r">
            <div className="plate aspect-[4/3] lg:aspect-auto lg:min-h-[460px]">
              <Image
                key={model.id}
                src={image}
                alt={model.name}
                fill
                sizes="(max-width: 1023px) 100vw, 55vw"
                unoptimized={image.includes('/storage/v1/object/public/product-images/')}
                className="object-contain p-8 sm:p-12"
              />
            </div>
          </Link>
          <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-10">
            <div>
              <p className="font-outlier text-xs text-muted">Model details</p>
              <h3 className="mt-4 text-3xl text-ink sm:text-4xl">{model.name}</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted">{cleanDash(model.description)}</p>
              {specs.length > 0 && (
                <ul className="mt-6 border-t border-rule-2">
                  {specs.map((spec) => (
                    <li key={spec} className="border-b border-rule-2 py-2 text-sm leading-6 text-ink-2">{spec}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-rule-2 pt-4">
              <p className="font-outlier text-xs text-muted">
                {String(activeIndex + 1).padStart(2, '0')} / {String(models.length).padStart(2, '0')}
              </p>
              <Link href={`/products/${model.id}`} className="link">
                View model <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose a model">
          {models.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`min-h-11 border px-3 text-xs font-medium transition-colors ${
                index === activeIndex
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-rule-2 text-muted hover:border-accent hover:text-accent'
              }`}
            >
              {entry.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
