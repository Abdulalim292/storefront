import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { CATEGORY_LANDINGS } from '@/data/categories';
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
      url: `${SITE_URL}/categories`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...CATEGORY_LANDINGS.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
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
