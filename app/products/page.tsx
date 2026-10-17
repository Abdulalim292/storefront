'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Marine Engine Parts</h1>
          <p className="mt-2 text-slate-600">Browse engine components and request pricing and fitment confirmation.</p>
          {query && <p className="mt-2 text-sm text-slate-500">Search results for “{query}”</p>}
        </div>


        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={cn(
                  "min-h-10 px-3 py-2 text-sm font-medium rounded-md transition-all",
                  activeCategory === value
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <p className="text-lg font-medium text-slate-900">No parts found</p>
          <p className="text-slate-500">Try another search term or category.</p>
          <Button variant="outline" className="mt-4" onClick={() => setActiveCategory('all')}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

// I need to import cn for the category button styling.
// I'll add it to the top of the file.
