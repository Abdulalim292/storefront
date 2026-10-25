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
    <div className="flex w-full min-w-0 flex-col items-stretch gap-3 md:w-full md:max-w-[760px] md:items-end md:gap-4">
      <div role="group" aria-label="Filter products by category" className="relative flex w-full min-w-0 flex-wrap gap-1 border border-[#dfddd5] bg-[#eeece5] p-1">
        {categories.map(({ label, value }) => {
          const active = category === value;
          return (
            <Link
              key={value}
              href={productHref({ category: value })}
              prefetch={false}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative z-10 min-h-11 shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                active
                  ? 'bg-[#d7bd8d]/55 text-[#17221f]'
                  : 'text-[#667068] hover:bg-[#f3f0e7] hover:text-[#17221f]'
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex min-h-11 items-center justify-end gap-2">
        <ArrowUpDown className="h-4 w-4 text-[#8b806b]" />
        <select
          value={sort}
          onChange={(event) => router.push(productHref({ sort: event.target.value }), { scroll: false })}
          aria-label="Sort products by name"
          className="rounded-sm border border-[#c9c8be] bg-[#f8f7f3] px-3 py-1.5 text-sm font-medium text-[#17221f] outline-none focus:ring-2 focus:ring-[#a78b5f]"
        >
          <option value="a-z">Name: A to Z</option>
          <option value="z-a">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
