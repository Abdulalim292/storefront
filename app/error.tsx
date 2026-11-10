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
    <main className="sheet-light">
      <div className="container flex min-h-[70vh] flex-col justify-center py-16 sm:py-20">
        <div className="grid gap-8 border-t border-rule pt-6 lg:grid-cols-12">
          <p className="font-outlier text-xs text-muted lg:col-span-3">Interrupted</p>
          <div className="lg:col-span-9">
            <h1 className="text-ink">We couldn&apos;t load this page</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-2">
              An unexpected error interrupted the page. Try loading it again, or return to the catalog to keep browsing
              marine engines, gearboxes, and machinery parts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button type="button" size="lg" onClick={() => retry()}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </Button>
              <Link href="/products" className="btn btn--quiet min-h-14 px-8">
                <Home className="h-4 w-4" aria-hidden="true" />
                Browse products
              </Link>
            </div>

            {digest && <p className="mt-8 font-outlier text-xs text-muted">Reference: {digest}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
