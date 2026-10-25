'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string'
    ? error.digest
    : null;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 sm:px-8">
      <p className="section-kicker">Something went wrong</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-[#17221f] sm:text-6xl">
        We couldn&apos;t load this page
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-[#59615c]">
        An unexpected error interrupted the page. Try loading it again, or return to the catalog to keep browsing
        marine engines, gearboxes, and machinery parts.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button type="button" size="lg" onClick={() => retry()}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-sm border border-[#b9b8ae] px-6 py-3 text-lg font-medium text-[#26332d] transition-colors hover:bg-[#eeece4] focus:outline-none focus:ring-2 focus:ring-[#a78b5f] focus:ring-offset-2"
        >
          <Home className="mr-2 h-4 w-4" aria-hidden="true" />
          Browse products
        </Link>
      </div>

      {digest && <p className="mt-8 text-xs text-[#777b72]">Reference: {digest}</p>}
    </main>
  );
}
