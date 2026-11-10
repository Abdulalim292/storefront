import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Home, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you requested could not be found on the Noor Alam Machineries storefront.',
};

export default function NotFound() {
  return (
    <main className="sheet-light">
      <div className="container flex min-h-[70vh] flex-col justify-center py-16 sm:py-20">
        <div className="grid gap-8 border-t border-rule pt-6 lg:grid-cols-12">
          <p className="font-outlier text-xs text-muted lg:col-span-3">Error 404</p>
          <div className="lg:col-span-9">
            <h1 className="text-ink">This page is off the chart</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-2">
              The address may be mistyped, or the part you are looking for may have moved. Search the catalog or contact the
              team and we will help you find the right engine, gearbox, or component.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn">
                <Search className="h-4 w-4" aria-hidden="true" />
                Browse products
              </Link>
              <Link href="/" className="btn btn--quiet">
                <Home className="h-4 w-4" aria-hidden="true" />
                Back home
              </Link>
            </div>

            <Link href="/#contact" className="link mt-8">
              Contact the sales team
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
