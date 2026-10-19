'use client';

import { useState } from 'react';

type BrandLogoProps = { name: string; src: string };

export function BrandLogo({ name, src }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span aria-hidden="true" className="inline-flex h-9 w-24 shrink-0 items-center justify-center border border-[#d8d5cc] bg-white px-2 text-center text-xs font-bold tracking-wide text-[#38433d] sm:h-10 sm:w-28">{name}</span>;
  }

  return <img src={src} alt={`${name} logo`} width={128} height={48} loading="eager" onError={() => setFailed(true)} className="h-9 w-24 shrink-0 object-contain sm:h-10 sm:w-28" />;
}
