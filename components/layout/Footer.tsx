import React from 'react';
import Image from 'next/image';
import { PhoneCall, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 mb-4">
              <Image
                src="/brand/noor-alam-machineries-logo.webp"
                alt="Noor Alam Machineries gear logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <span>Noor Alam <span className="text-indigo-600">Machineries</span></span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              Managed by Md. Noor Nabi. Importer, wholesaler, and retailer of marine diesel engines, gearboxes, generators, and heavy equipment spare parts.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Equipment</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-slate-600 hover:text-indigo-600">All Engine Parts</Link></li>
              <li><Link href="/image-credits" className="text-sm text-slate-600 hover:text-indigo-600">Image credits</Link></li>
              <li><Link href="/#marine-engine-models" className="text-sm text-slate-600 hover:text-indigo-600">Marine Engines</Link></li>
              <li><Link href="/#gearboxes" className="text-sm text-slate-600 hover:text-indigo-600">Gearboxes</Link></li>
              <li><Link href="/#heavy-machinery" className="text-sm text-slate-600 hover:text-indigo-600">Heavy Machinery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li className="text-sm text-slate-600">Md. Noor Nabi · Managing Director</li>
              <li><Link href="/#contact" className="text-sm text-slate-600 hover:text-indigo-600">Showroom and branch addresses</Link></li>
              <li><a href={toBangladeshTel('01728-079359')} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"><PhoneCall className="h-4 w-4" /> {formatBangladeshPhone('01728-079359')}</a></li>
              <li><a href="mailto:noornoobi80@gmail.com" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"><Mail className="h-4 w-4" /> noornoobi80@gmail.com</a></li>
              <li><a href="https://www.nooralammachinery.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"><Globe className="h-4 w-4" /> nooralammachinery.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p className="mb-3 font-semibold text-slate-700">Engines and equipment supported</p>
          <p className="max-w-4xl leading-6">Zichai marine diesel engines, Fadda marine gearboxes, Hino, Isuzu, Cummins, Perkins, Doosan, John Deere, MAN, generators, and heavy equipment spare parts.</p>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
          © 2026 Noor Alam Machineries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
