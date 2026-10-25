'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { EquipmentModel } from '@/data/equipment';
import { useProductImage } from '@/context/ProductImageContext';

export function PinnedEquipmentStory({ models }: { models: EquipmentModel[] }) {
  return (
    <section className="bg-[#ebe9e2] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:grid lg:grid-cols-[.78fr_1.22fr] lg:gap-20 lg:px-12">
        <div className="mb-12 max-w-xl lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          <p className="section-kicker">Made to move demanding work</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.03] tracking-[-.045em] text-[#17221f] sm:text-6xl">Power, matched to its purpose.</h2>
          <p className="mt-6 text-base leading-7 text-[#59615c]">From propulsion to transmission, each specification matters. Browse a few equipment options and talk with us about the right configuration.</p>
          <Link href="/products" className="mt-8 inline-flex min-h-12 items-center gap-3 text-sm font-semibold text-[#26332d] underline decoration-[#a78b5f] underline-offset-8">Explore the catalog <ArrowUpRight className="h-4 w-4" /></Link>
        </div>

        <div className="space-y-7 lg:space-y-12">
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
  return (
    <Link
      id={index === 0 ? 'marine-engine-models' : index === 1 ? 'gearboxes' : 'heavy-machinery'}
      href={`/products/${model.id}`}
      prefetch={false}
      className="story-card group scroll-mt-24 block overflow-hidden bg-[#d8d9d2]"
    >
      <div className={`relative ${index === 0 ? 'aspect-[1.42]' : 'aspect-[1.7]'}`}>
        <Image
          src={image}
          alt={model.name}
          fill
          sizes="(max-width: 959px) 100vw, 60vw"
          quality={70}
          unoptimized={image.includes('/storage/v1/object/public/product-images/')}
          className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105 sm:p-12"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17221f]/75 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-8">
          <div>
            <p className="text-[11px] uppercase tracking-[.18em] text-white/70">{index === 0 ? 'Marine propulsion' : index === 1 ? 'Marine transmission' : 'Heavy machinery'}</p>
            <h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-4xl">{model.name}</h3>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/50 transition-colors group-hover:bg-white group-hover:text-[#17221f]"><ArrowUpRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}
