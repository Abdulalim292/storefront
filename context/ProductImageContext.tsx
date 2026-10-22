'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type ImageMap = Record<string, string>;
type ProductImageContextValue = { images: ImageMap; refresh: () => Promise<void> };
const ProductImageContext = createContext<ProductImageContextValue>({ images: {}, refresh: async () => {} });

export function ProductImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<ImageMap>({});
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/product-images', { cache: 'no-store' });
      if (response.ok) setImages(await response.json() as ImageMap);
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
