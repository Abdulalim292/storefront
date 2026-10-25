import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/image-credits`,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    ...[...PRODUCTS, ...EQUIPMENT_PRODUCTS].map((product) => ({
      url: `${SITE_URL}/products/${product.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
