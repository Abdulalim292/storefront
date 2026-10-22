'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({ src, alt, sizes, className = '', loading = 'lazy' }: ResilientImageProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const [useOriginalSource, setUseOriginalSource] = useState(false);

  if (hasFailed) {
    return (
      <div role="img" aria-label={`${alt} (image unavailable)`} className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-slate-400">
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        <span className="text-center text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={70}
      loading={loading}
      unoptimized={useOriginalSource || src.includes('wikimedia.org') || src.includes('/storage/v1/object/public/product-images/')}
      className={className}
      style={{ objectPosition: 'center' }}
      onError={() => {
        if (!useOriginalSource) {
          setUseOriginalSource(true);
          return;
        }
        setHasFailed(true);
      }}
    />
  );
}
