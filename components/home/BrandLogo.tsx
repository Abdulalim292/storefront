'use client';

import { useState } from 'react';

type BrandLogoProps = { name: string; src: string };

export function BrandLogo({ name, src }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span aria-hidden="true" className="inline-flex h-7 w-16 shrink-0 items-center justify-center border border-[#d8d5cc] bg-white px-1.5 text-center text-[10px] font-bold tracking-wide text-[#38433d] sm:h-8 sm:w-20 sm:px-2 sm:text-xs">{name}</span>;
  }

  return <img src={src} alt={`${name} logo`} width={128} height={48} loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-7 w-16 shrink-0 object-contain sm:h-8 sm:w-20" />;
}
