'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_SEARCHABLE_PRODUCTS = [...PRODUCTS, ...EQUIPMENT_PRODUCTS];

type ProductsListProps = {
  initialCategory?: string;
  initialQuery?: string;
};

export function ProductsList({ initialCategory, initialQuery = '' }: ProductsListProps) {
  const router = useRouter();
  const rawQuery = initialQuery.trim();
  const query = rawQuery.toLowerCase();

  const requestedCategory = CATEGORIES.some(({ value }) => value === initialCategory)
    ? initialCategory!
    : 'all';
  const [activeCategory, setActiveCategory] = useState(requestedCategory);
  const [sortOrder, setSortOrder] = useState<'a-z' | 'z-a'>('a-z');

  useEffect(() => {
    setActiveCategory(requestedCategory);
  }, [requestedCategory]);

  function selectCategory(value: string) {
    setActiveCategory(value);
    const params = new URLSearchParams(window.location.search);
    if (value === 'all') params.delete('category');
    else params.set('category', value);
    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : '/products', { scroll: false });
  }

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (query) {
      // A text search should also surface matching equipment models, while a
      // category filter stays limited to that category's parts.
      const pool = activeCategory === 'all' ? ALL_SEARCHABLE_PRODUCTS : result;
      result = pool.filter(({ name, description, category }) =>
        `${name} ${description} ${category.replaceAll('-', ' ')}`.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => sortOrder === 'a-z'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name));

    return result;
  }, [activeCategory, sortOrder, query]);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mb-10 flex flex-col gap-8 border-b border-[#dfddd5] pb-9 sm:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Parts and components</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-[#17221f] sm:text-6xl">Find the part for the job.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#59615c]">Browse engine components and request pricing and fitment confirmation.</p>
          {rawQuery && <p className="mt-3 text-sm text-[#8b806b]">Search results for “{rawQuery}”</p>}
        </div>


        <div className="flex w-full min-w-0 flex-col items-stretch gap-3 md:w-full md:max-w-[760px] md:items-end md:gap-4">
          <div role="group" aria-label="Filter products by category" className="relative flex w-full min-w-0 flex-wrap gap-1 border border-[#dfddd5] bg-[#eeece5] p-1">
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                aria-pressed={activeCategory === value}
                onClick={() => selectCategory(value)}
                className={cn(
                  "relative z-10 min-h-11 shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  activeCategory === value
                    ? "text-[#17221f]"
                    : "text-[#667068] hover:text-[#17221f]"
                )}
              >
                {activeCategory === value && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-[#d7bd8d]/55 -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>

          <div className="flex min-h-11 items-center justify-end gap-2">
            <ArrowUpDown className="h-4 w-4 text-[#8b806b]" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'a-z' | 'z-a')}
              aria-label="Sort products by name"
              className="rounded-sm border border-[#c9c8be] bg-[#f8f7f3] px-3 py-1.5 text-sm font-medium text-[#17221f] outline-none focus:ring-2 focus:ring-[#a78b5f]"
            >
              <option value="a-z">Name: A to Z</option>
              <option value="z-a">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-64 flex-col items-center justify-center border border-dashed border-[#c9c8be] text-center"
        >
          <p className="text-lg font-medium text-[#17221f]">No parts found</p>
          <p className="text-[#667068]">Try another search term or category.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setActiveCategory('all');
            router.replace('/products', { scroll: false });
          }}>
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
