'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types';

type Category = {
  label: string;
  value: ProductCategory | 'all';
};

type ProductsControlsProps = {
  categories: Category[];
  category: string;
  query: string;
  sort: 'a-z' | 'z-a';
};

export function ProductsControls({ categories, category, query, sort }: ProductsControlsProps) {
  const router = useRouter();

  function productHref(next: { category?: string; sort?: string }) {
    const params = new URLSearchParams();
    const nextCategory = next.category ?? category;
    const nextSort = next.sort ?? sort;

    if (nextCategory !== 'all') params.set('category', nextCategory);
    if (query) params.set('q', query);
    if (nextSort === 'z-a') params.set('sort', 'z-a');

    const queryString = params.toString();
    return queryString ? `/products?${queryString}` : '/products';
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div role="group" aria-label="Filter products by category" className="flex min-w-0 flex-wrap border border-rule-2">
        {categories.map(({ label, value }) => {
          const active = category === value;
          return (
            <Link
              key={value}
              href={productHref({ category: value })}
              prefetch={false}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 shrink-0 items-center border-r border-rule-2 px-3 text-xs font-medium transition-colors duration-200 last:border-r-0',
                active
                  ? 'bg-accent text-accent-ink'
                  : 'text-muted hover:bg-paper-2 hover:text-ink'
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <label className="flex min-h-11 items-center gap-2">
        <ArrowUpDown className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <span className="text-xs text-muted">Sort</span>
        <select
          value={sort}
          onChange={(event) => router.push(productHref({ sort: event.target.value }), { scroll: false })}
          aria-label="Sort products by name"
          className="input min-h-11 w-auto py-0 text-sm"
        >
          <option value="a-z">Name: A to Z</option>
          <option value="z-a">Name: Z to A</option>
        </select>
      </label>
    </div>
  );
}
