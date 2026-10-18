'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const query = (searchParams.get('q') || '').trim().toLowerCase();


  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [sortOrder, setSortOrder] = useState<'a-z' | 'z-a'>('a-z');

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 sm:mb-12 sm:gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Marine Engine Parts</h1>
          <p className="mt-2 text-slate-600">Browse engine components and request pricing and fitment confirmation.</p>
          {query && <p className="mt-2 text-sm text-slate-500">Search results for “{query}”</p>}
        </div>


        <div className="flex w-full min-w-0 flex-col items-stretch gap-3 md:w-full md:max-w-[760px] md:items-end md:gap-4">
          <div aria-label="Filter products by category" className="relative flex w-full min-w-0 flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={cn(
                  "relative z-10 min-h-11 shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  activeCategory === value
                    ? "text-indigo-600"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {activeCategory === value && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
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
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
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
          className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-center"
        >
          <p className="text-lg font-medium text-slate-900">No parts found</p>
          <p className="text-slate-500">Try another search term or category.</p>
          <Button variant="outline" className="mt-4" onClick={() => setActiveCategory('all')}>
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// I need to import cn for the category button styling.
// I'll add it to the top of the file.
