'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <ShoppingBag className="h-6 w-6 text-indigo-600" />
            <span>LUXE<span>STORE</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Shop All
            </Link>
            <Link href="/products?category=electronics" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=home-decor" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Home Decor
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent text-sm outline-none w-32 lg:w-48 placeholder:text-slate-400"
            />
          </div>

          <button
            className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors"
            onClick={() => {/* We will implement CartDrawer toggle here */}}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4">
          <Link href="/products" className="block py-2 text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Shop All
          </Link>
          <Link href="/products?category=electronics" className="block py-2 text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Electronics
          </Link>
          <Link href="/products?category=home-decor" className="block py-2 text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Home Decor
          </Link>
        </div>
      )}
    </nav>
  );
}
