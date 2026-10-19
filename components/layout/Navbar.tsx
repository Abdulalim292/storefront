'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ClipboardList, Cog } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Navbar({ onCartClick }: { onCartClick: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-[60] w-full border-b border-[#deddd5] bg-[#f8f7f3]/95 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex min-w-10 items-center gap-8">
          <div className="hidden xl:flex items-center gap-6">
            <Link href="/#marine-engine-models" className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#59615c] hover:text-[#8d754d] transition-colors">
              Marine Engines
            </Link>
            <Link href="/#gearboxes" className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#59615c] hover:text-[#8d754d] transition-colors">
              Gearboxes
            </Link>
            <Link href="/#heavy-machinery" className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#59615c] hover:text-[#8d754d] transition-colors">
              Heavy Machinery
            </Link>
            <Link href="/products" className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#59615c] hover:text-[#8d754d] transition-colors">
              Products
            </Link>
          </div>
        </div>

        <Link href="/" className="relative mr-auto flex min-w-0 items-center gap-2 text-base font-bold tracking-tight text-[#17221f] sm:absolute sm:left-1/2 sm:top-1/2 sm:mr-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:whitespace-nowrap sm:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl" aria-label="Noor Alam Machineries home">
          <Image
            src="/brand/noor-alam-machineries-logo.webp"
            alt=""
            width={42}
            height={42}
            className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
            preload
          />
          <Cog aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-[#8d754d] sm:block" strokeWidth={1.8} />
          <span className="max-w-[88px] text-[13px] leading-tight sm:hidden">Noor Alam Machineries</span>
          <span className="hidden sm:inline">Noor Alam <span className="text-[#8d754d]">Machineries</span></span>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <PartSearchForm className="hidden 2xl:flex" />

          <button
            type="button"
            onClick={onCartClick}
            aria-label={`Open inquiry list${cartCount ? `, ${cartCount} items` : ''}`}
            className="relative grid h-11 w-11 place-items-center rounded-full text-[#34403a] transition hover:bg-[#e7e3d8] hover:text-[#8d754d]"
          >
            <ClipboardList className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute right-0 top-0 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#17221f] px-1 text-[10px] font-bold text-white">{cartCount > 99 ? '99+' : cartCount}</span>}
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="grid h-11 w-11 place-items-center text-[#34403a] xl:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-navigation" className="space-y-2 border-t border-[#deddd5] bg-[#f8f7f3] p-4 shadow-lg xl:hidden">
          <PartSearchForm className="mb-2 flex xl:hidden" />
          <Link href="/#marine-engine-models" className="flex min-h-11 items-center text-sm font-semibold text-[#34403a]" onClick={() => setIsMenuOpen(false)}>
            Marine Engines
          </Link>
          <Link href="/#gearboxes" className="flex min-h-11 items-center text-sm font-semibold text-[#34403a]" onClick={() => setIsMenuOpen(false)}>
            Gearboxes
          </Link>
          <Link href="/#heavy-machinery" className="flex min-h-11 items-center text-sm font-semibold text-[#34403a]" onClick={() => setIsMenuOpen(false)}>
            Heavy Machinery
          </Link>
          <Link href="/products" className="flex min-h-11 items-center text-sm font-semibold text-[#34403a]" onClick={() => setIsMenuOpen(false)}>
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
      className={`min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 ${className}`}
    >
      <input
        type="search"
        name="q"
        aria-label="Search engine parts"
        placeholder="Search engine parts..."
        className="min-w-0 flex-1 bg-transparent text-sm text-black caret-black outline-none placeholder:text-slate-400 xl:w-40"
      />
      <button type="submit" aria-label="Search" className="grid h-10 w-10 shrink-0 place-items-center text-slate-500 transition-colors hover:text-indigo-600">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
