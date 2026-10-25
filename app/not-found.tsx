import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Home, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you requested could not be found on the Noor Alam Machineries storefront.',
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 sm:px-8">
      <p className="section-kicker">404 · Page not found</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] text-[#17221f] sm:text-6xl">
        This page is off the chart
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-[#59615c]">
        The address may be mistyped, or the part you are looking for may have moved. Search the catalog or contact the
        team and we will help you find the right engine, gearbox, or component.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-sm bg-[#17221f] px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-[#34433c] focus:outline-none focus:ring-2 focus:ring-[#a78b5f] focus:ring-offset-2"
        >
          <Search className="mr-2 h-4 w-4" aria-hidden="true" />
          Browse products
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-sm border border-[#b9b8ae] px-6 py-3 text-lg font-medium text-[#26332d] transition-colors hover:bg-[#eeece4] focus:outline-none focus:ring-2 focus:ring-[#a78b5f] focus:ring-offset-2"
        >
          <Home className="mr-2 h-4 w-4" aria-hidden="true" />
          Back home
        </Link>
      </div>

      <Link href="/#contact" className="mt-8 inline-flex items-center text-sm font-medium text-[#6f5a32] hover:text-[#17221f]">
        Contact the sales team
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Link>
    </main>
  );
}
