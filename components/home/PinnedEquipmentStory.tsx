'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { EquipmentModel } from '@/data/equipment';
import { useProductImage } from '@/context/ProductImageContext';
import { cleanDash, splitMeta } from '@/lib/copy';

const roles = ['Marine propulsion', 'Marine transmission', 'Heavy machinery'];
const anchors = ['marine-engine-models', 'gearboxes', 'heavy-machinery'];

export function PinnedEquipmentStory({ models }: { models: EquipmentModel[] }) {
  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2>Power, matched to its purpose.</h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-muted">
            From propulsion to transmission, each specification matters. Browse a few equipment options and talk with us about the right configuration.
          </p>
          <Link href="/products" className="link mt-6">
            Explore the catalog <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <ol className="mt-9 border-t border-rule-2">
            {models.map((model, index) => (
              <li key={model.id} className="border-b border-rule-2">
                <a href={`#${anchors[index]}`} className="flex items-baseline gap-3 py-3 text-sm text-ink-2 hover:text-accent">
                  <span className="font-outlier text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
                  {model.name}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6 lg:col-span-8">
          {models.map((model, index) => (
            <EquipmentStoryCard key={model.id} model={model} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EquipmentStoryCard({ model, index }: { model: EquipmentModel; index: number }) {
  const image = useProductImage(model.id, model.image);
  const specs = (model.specifications ?? []).flatMap((spec) => splitMeta(spec)).slice(0, 4);

  return (
    <Link
      id={anchors[index]}
      href={`/products/${model.id}`}
      prefetch={false}
      className="plate-link group grid scroll-mt-28 border border-rule-2 md:grid-cols-2"
    >
      <div className={`plate ${index === 0 ? 'aspect-[4/3] md:aspect-auto md:min-h-[340px]' : 'aspect-[16/9] md:aspect-auto md:min-h-[280px]'}`}>
        <Image
          src={image}
          alt={model.name}
          fill
          sizes="(max-width: 767px) 100vw, 44vw"
          quality={70}
          unoptimized={image.includes('/storage/v1/object/public/product-images/')}
          className="object-contain p-6 sm:p-8"
        />
      </div>
      <div className="flex flex-col justify-between border-t border-rule-2 p-5 md:border-l md:border-t-0 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-outlier text-xs text-muted">{roles[index]}</span>
            <span className="font-outlier text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <h3 className="mt-3 text-2xl text-ink">{model.name}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{cleanDash(model.description)}</p>
          {specs.length > 0 && (
            <ul className="mt-5 border-t border-rule-2">
              {specs.map((spec) => (
                <li key={spec} className="border-b border-rule-2 py-2 text-sm leading-6 text-ink-2">{spec}</li>
              ))}
            </ul>
          )}
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
          View model <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
