import catalog from './catalog.json';
import type { Product, ProductCategory } from '@/types';

export const PRODUCTS: Product[] = catalog.products.filter((item) => item.category !== 'equipment') as Product[];
export const CATEGORIES: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'All parts', value: 'all' },
  ...catalog.categories.map(({ label, value }) => ({ label, value: value as ProductCategory })),
];
