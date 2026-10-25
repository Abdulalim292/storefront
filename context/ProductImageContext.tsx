'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ImageMap = Record<string, string>;
type ProductImageContextValue = { images: ImageMap; refresh: (force?: boolean) => Promise<void> };
const ProductImageContext = createContext<ProductImageContextValue>({ images: {}, refresh: async () => {} });

const CACHE_MS = 60_000;
const STORAGE_KEY = 'product-image-overrides-v1';
let cachedImages: ImageMap | null = null;
let cachedAt = 0;
let inFlight: Promise<ImageMap> | null = null;

function normalizeImages(value: unknown): ImageMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const images: ImageMap = {};
  for (const [productId, imageUrl] of Object.entries(value)) {
    if (typeof imageUrl === 'string' && imageUrl.length > 0 && imageUrl.length <= 2_000) {
      images[productId] = imageUrl;
    }
  }
  return images;
}

function readStoredImages(): { at: number; images: ImageMap } | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const record = parsed as Record<string, unknown>;
    if (typeof record.at !== 'number' || !Number.isFinite(record.at)) return null;
    return { at: record.at, images: normalizeImages(record.images) };
  } catch {
    return null;
  }
}

function rememberImages(images: ImageMap) {
  cachedImages = images;
  cachedAt = Date.now();
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ at: cachedAt, images }));
  } catch {
    // Storage can be unavailable in private or quota-limited contexts.
  }
}

async function fetchImages(force = false): Promise<ImageMap> {
  if (!force && inFlight) return inFlight;

  let request: Promise<ImageMap>;
  request = fetch('/api/product-images', { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Image overrides request failed (${response.status}).`);
      const images = normalizeImages(await response.json());
      rememberImages(images);
      return images;
    })
    .finally(() => {
      if (inFlight === request) inFlight = null;
    });

  inFlight = request;
  return request;
}

export function ProductImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<ImageMap>({});

  const refresh = useCallback(async (force = false) => {
    try {
      if (!force) {
        if (cachedImages && Date.now() - cachedAt < CACHE_MS) {
          setImages(cachedImages);
          return;
        }
        const stored = readStoredImages();
        if (stored && Date.now() - stored.at < CACHE_MS) {
          cachedImages = stored.images;
          cachedAt = stored.at;
          setImages(stored.images);
          return;
        }
      }
      setImages(await fetchImages(force));
    } catch {
      // The catalog keeps its bundled image when remote storage is unavailable.
    }
  }, []);

  useEffect(() => {
    let active = true;

    const stored = readStoredImages();
    if (stored && Date.now() - stored.at < CACHE_MS) {
      cachedImages = stored.images;
      cachedAt = stored.at;
      setImages(stored.images);
      return;
    }

    // Let the first view render with the bundled catalog image before asking
    // for overrides, keeping the image request off the LCP critical path.
    const timer = window.setTimeout(() => {
      fetchImages()
        .then((nextImages) => {
          if (active) setImages(nextImages);
        })
        .catch(() => {
          // Keep the bundled images.
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

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
