'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Navbar({ onCartClick }: { onCartClick?: () => void }) {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-10 items-center gap-8">
          <div className="hidden 2xl:flex items-center gap-5">
            <Link href="/#marine-engine-models" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Marine Engines
            </Link>
            <Link href="/#gearboxes" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Gearboxes
            </Link>
            <Link href="/#heavy-machinery" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Heavy Machinery
            </Link>
            <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Products
            </Link>
          </div>
        </div>

        <Link href="/" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 sm:text-base lg:text-xl" aria-label="Noor Alam Machineries home">
          <Image
            src="/brand/noor-alam-machineries-logo.jpg"
            alt=""
            width={42}
            height={42}
            className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
            priority
          />
          <span className="hidden sm:inline">Noor Alam <span className="text-indigo-600">Machineries</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <PartSearchForm className="hidden 2xl:flex" />

          <button
            type="button"
            aria-label={`Open parts inquiry list${cartCount > 0 ? `, ${cartCount} items` : ''}`}
            className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors"
            onClick={onCartClick}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="2xl:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-navigation" className="2xl:hidden border-t border-slate-200 bg-white p-4 space-y-4">
          <PartSearchForm className="flex 2xl:hidden" />
          <Link href="/#marine-engine-models" className="block py-2 text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Marine Engines
          </Link>
          <Link href="/#gearboxes" className="block py-2 text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Gearboxes
          </Link>
          <Link href="/#heavy-machinery" className="block py-2 text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Heavy Machinery
          </Link>
          <Link href="/products" className="block py-2 text-base font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
        </div>
      )}
    </nav>
  );
}

function PartSearchForm({ className = '' }: { className?: string }) {
  return (
    <form
      action="/products"
      method="get"
      role="search"
      className={`items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 ${className}`}
    >
      <input
        type="search"
        name="q"
        aria-label="Search engine parts"
        placeholder="Search engine parts..."
        className="min-w-0 flex-1 bg-transparent text-sm text-black caret-black outline-none placeholder:text-slate-400 xl:w-40"
      />
      <button type="submit" aria-label="Search" className="text-slate-500 transition-colors hover:text-indigo-600">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
