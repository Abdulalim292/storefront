'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ImageMap = Record<string, string>;
type ProductImageContextValue = { images: ImageMap; refresh: (force?: boolean) => Promise<void> };
const ProductImageContext = createContext<ProductImageContextValue>({ images: {}, refresh: async () => {} });

const CACHE_MS = 60_000;
let cachedImages: ImageMap | null = null;
let cachedAt = 0;
let inFlight: Promise<ImageMap> | null = null;

async function fetchImages() {
  if (inFlight) return inFlight;

  inFlight = fetch('/api/product-images', { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Image overrides request failed (${response.status}).`);
      const images = await response.json() as ImageMap;
      cachedImages = images;
      cachedAt = Date.now();
      return images;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function ProductImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<ImageMap>({});

  const refresh = useCallback(async (force = false) => {
    try {
      if (!force && cachedImages && Date.now() - cachedAt < CACHE_MS) {
        setImages(cachedImages);
        return;
      }
      setImages(await fetchImages());
    } catch {
      // The catalog keeps its bundled image when remote storage is unavailable.
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  const value = useMemo(() => ({ images, refresh }), [images, refresh]);
  return <ProductImageContext.Provider value={value}>{children}</ProductImageContext.Provider>;
}

export function useProductImage(productId: string, fallback: string) {
  const { images } = useContext(ProductImageContext);
  return images[productId] ?? fallback;
}

export function useRefreshProductImages() {
  return useContext(ProductImageContext).refresh;
}
