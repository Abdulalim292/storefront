'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { EquipmentModel } from '@/data/equipment';

export function EquipmentCarousel({ models }: { models: EquipmentModel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const model = models[activeIndex];
  const move = (offset: number) => setActiveIndex((index) => (index + offset + models.length) % models.length);

  return (
    <section className="bg-[#f8f7f3] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div><p className="section-kicker">A closer look</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] text-[#17221f] sm:text-6xl">Equipment in focus.</h2></div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => move(-1)} aria-label="Previous equipment" className="grid h-12 w-12 place-items-center border border-[#c9c8be] text-[#17221f] transition-colors hover:bg-[#17221f] hover:text-white"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next equipment" className="grid h-12 w-12 place-items-center border border-[#c9c8be] text-[#17221f] transition-colors hover:bg-[#17221f] hover:text-white"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid overflow-hidden bg-[#e6e5de] lg:grid-cols-[1.1fr_.9fr]">
          <Link href={`/products/${model.id}`} className="group relative block min-h-[300px] overflow-hidden sm:min-h-[450px]">
            <Image key={model.id} src={model.image} alt={model.name} fill sizes="(max-width: 1023px) 100vw, 55vw" className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105 sm:p-14" />
            <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#17221f]"><ArrowUpRight className="h-4 w-4" /></span>
          </Link>
          <div className="flex flex-col justify-between p-7 sm:p-12 lg:p-14">
            <div><p className="text-xs uppercase tracking-[.18em] text-[#86734f]">Model details</p><h3 className="mt-5 text-3xl font-semibold tracking-[-.035em] text-[#17221f] sm:text-5xl">{model.name}</h3><p className="mt-5 max-w-xl text-base leading-7 text-[#59615c]">{model.description}</p>
              {model.specifications?.length ? <ul className="mt-7 space-y-3 border-t border-[#cecec5] pt-6">{model.specifications.slice(0, 3).map((spec) => <li key={spec} className="flex gap-3 text-sm leading-6 text-[#48534c]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a78b5f]" />{spec}</li>)}</ul> : null}
            </div>
            <div className="mt-10 flex items-center justify-between border-t border-[#cecec5] pt-5">
              <p className="text-sm text-[#777b72]">{String(activeIndex + 1).padStart(2, '0')} <span className="mx-1">/</span> {String(models.length).padStart(2, '0')}</p>
              <div className="flex gap-2 sm:hidden"><button type="button" onClick={() => move(-1)} aria-label="Previous equipment" className="grid h-11 w-11 place-items-center border border-[#c9c8be]"><ArrowLeft className="h-4 w-4" /></button><button type="button" onClick={() => move(1)} aria-label="Next equipment" className="grid h-11 w-11 place-items-center border border-[#c9c8be]"><ArrowRight className="h-4 w-4" /></button></div>
              <Link href={`/products/${model.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#17221f]">View model <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
