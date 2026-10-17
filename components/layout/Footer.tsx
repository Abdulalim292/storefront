import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 mb-4">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
              <span>LUXE<span className="text-indigo-600">STORE</span></span>
            </Link>
            <p className="max-w-xs text-sm text-slate-600 leading-relaxed">
              Curating the finest physical products for the modern home and lifestyle. Quality, design, and functionality in every piece.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-slate-600 hover:text-indigo-600">All Products</Link></li>
              <li><Link href="/products?category=electronics" className="text-sm text-slate-600 hover:text-indigo-600">Electronics</Link></li>
              <li><Link href="/products?category=home-decor" className="text-sm text-slate-600 hover:text-indigo-600">Home Decor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-slate-600 hover:text-indigo-600">About Us</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-indigo-600">Contact</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LUXESTORE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
