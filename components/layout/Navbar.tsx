'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ClipboardList, PhoneCall } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SALES_PHONE } from '@/lib/site';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';

const NAV_LINKS = [
  { href: '/categories/marine-engines', label: 'Marine engines' },
  { href: '/categories/marine-gearboxes', label: 'Gearboxes' },
  { href: '/categories/heavy-machinery', label: 'Heavy machinery' },
  { href: '/categories', label: 'All categories' },
  { href: '/products', label: 'Products' },
];

export function Navbar({ onCartClick }: { onCartClick: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSearchOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <header className="masthead">
      <div className="masthead__tier1 hidden lg:block">
        <div className="container flex h-full items-center justify-between">
          <p className="m-0 max-w-none text-xs text-muted">Showrooms in Dhaka and Chittagong</p>
          <div className="flex items-center gap-6">
            <a href={toBangladeshTel(SALES_PHONE)} className="inline-flex items-center gap-2 text-xs text-ink-2 hover:text-accent">
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              {formatBangladeshPhone(SALES_PHONE)}
            </a>
            <a href="mailto:noornoobi80@gmail.com" className="text-xs text-ink-2 hover:text-accent">noornoobi80@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="masthead__tier2">
        <div className="container flex min-h-[var(--nav-tier-2)] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Noor Alam Machineries home">
            <Image
              src="/brand/noor-alam-site-logo.webp"
              alt="Noor Alam Machineries logo"
              width={44}
              height={44}
              className="h-9 w-9 shrink-0 border border-rule-2 object-cover sm:h-10 sm:w-10"
              preload
            />
            <span className="min-w-0 font-display text-base font-semibold leading-[1.05] text-ink sm:text-lg lg:text-xl">
              Noor Alam <span className="text-accent">Machineries</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-5 xl:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} prefetch={false} className="masthead__link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <PartSearchForm className="hidden 2xl:flex" />

            <button
              type="button"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={isSearchOpen}
              aria-controls="navbar-search"
              onClick={() => {
                setIsSearchOpen((open) => !open);
                setIsMenuOpen(false);
              }}
              className="masthead__icon 2xl:hidden"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={onCartClick}
              aria-label={`Open inquiry list${cartCount ? `, ${cartCount} items` : ''}`}
              className="masthead__icon relative"
            >
              <ClipboardList className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 grid min-h-5 min-w-5 place-items-center bg-accent px-1 font-outlier text-[10px] font-medium leading-none text-accent-ink">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className="masthead__icon xl:hidden"
              onClick={() => {
                setIsMenuOpen((open) => !open);
                setIsSearchOpen(false);
              }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div id="navbar-search" className="border-t border-rule-2 bg-paper-2 p-4 2xl:hidden">
          <PartSearchForm className="flex w-full" autoFocus expanded onSubmitted={() => setIsSearchOpen(false)} />
        </div>
      )}

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-rule-2 bg-paper-2 xl:hidden">
          <nav aria-label="Mobile" className="container flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="flex min-h-12 items-center border-b border-rule-2 text-sm font-medium text-ink"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={toBangladeshTel(SALES_PHONE)}
              className="flex min-h-12 items-center gap-2 text-sm text-ink-2"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              {formatBangladeshPhone(SALES_PHONE)}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function PartSearchForm({
  className = '',
  autoFocus = false,
  expanded = false,
  onSubmitted,
}: {
  className?: string;
  autoFocus?: boolean;
  expanded?: boolean;
  onSubmitted?: () => void;
}) {
  return (
    <form
      action="/products"
      method="get"
      role="search"
      onSubmit={onSubmitted}
      className={`min-h-12 items-center border border-rule-2 bg-paper-2 ${className}`}
    >
      <input
        type="search"
        name="q"
        aria-label="Search engine parts"
        placeholder="Search engine parts"
        autoFocus={autoFocus}
        className={`min-w-0 flex-1 bg-transparent px-3 text-sm text-ink caret-accent outline-none placeholder:text-muted ${expanded ? 'w-full' : 'xl:w-40'}`}
      />
      <button type="submit" aria-label="Search" className="grid h-11 w-11 shrink-0 place-items-center text-muted hover:text-accent">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
