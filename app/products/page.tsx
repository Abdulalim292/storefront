'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12 text-center text-slate-600">Loading products...</div>}>
      <ProductsList />
    </Suspense>
  );
}

function ProductsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const query = (searchParams.get('q') || '').trim().toLowerCase();


  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [sortOrder, setSortOrder] = useState<'a-z' | 'z-a'>('a-z');

  useEffect(() => {
    const requestedCategory = CATEGORIES.some(({ value }) => value === categoryParam)
      ? categoryParam!
      : 'all';
    setActiveCategory(requestedCategory);
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (query) {
      result = result.filter(({ name, description, category }) =>
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
          {query && <p className="mt-3 text-sm text-[#8b806b]">Search results for “{query}”</p>}
        </div>


        <div className="flex w-full min-w-0 flex-col items-stretch gap-3 md:w-full md:max-w-[760px] md:items-end md:gap-4">
          <div aria-label="Filter products by category" className="relative flex w-full min-w-0 flex-wrap gap-1 border border-[#dfddd5] bg-[#eeece5] p-1">
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
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
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'a-z' | 'z-a')}
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

// I need to import cn for the category button styling.
// I'll add it to the top of the file.
