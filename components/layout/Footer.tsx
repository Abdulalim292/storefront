import React from 'react';
import Image from 'next/image';
import { PhoneCall, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111b18] py-16 text-white">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-3 text-xl font-bold tracking-tight text-white">
              <Image
                src="/brand/noor-alam-site-logo.webp"
                alt="Noor Alam Machineries gear logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <span>Noor Alam <span className="text-[#d7bd8d]">Machineries</span></span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Managed by Md. Noor Nabi. Importer, wholesaler, and retailer of marine diesel engines, gearboxes, generators, and heavy equipment spare parts.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#d7bd8d]">Equipment</h4>
            <ul className="space-y-3">
              <li><Link href="/categories" prefetch={false} className="text-sm text-white/65 hover:text-white">All categories</Link></li>
              <li><Link href="/categories/marine-engines" prefetch={false} className="text-sm text-white/65 hover:text-white">Marine Engines</Link></li>
              <li><Link href="/categories/marine-gearboxes" prefetch={false} className="text-sm text-white/65 hover:text-white">Gearboxes</Link></li>
              <li><Link href="/categories/heavy-machinery" prefetch={false} className="text-sm text-white/65 hover:text-white">Heavy Machinery</Link></li>
              <li><Link href="/products" prefetch={false} className="text-sm text-white/65 hover:text-white">All Engine Parts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#d7bd8d]">Company</h4>
            <ul className="space-y-3">
              <li className="text-sm text-white/65">Md. Noor Nabi · Managing Director</li>
              <li><Link href="/#contact" className="text-sm text-white/65 hover:text-white">Showroom and branch addresses</Link></li>
              <li><a href={toBangladeshTel('01728-079359')} className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"><PhoneCall className="h-4 w-4" /> {formatBangladeshPhone('01728-079359')}</a></li>
              <li><a href="mailto:noornoobi80@gmail.com" className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"><Mail className="h-4 w-4" /> noornoobi80@gmail.com</a></li>
              <li><a href="https://www.nooralammachinery.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"><Globe className="h-4 w-4" /> nooralammachinery.com</a></li>
              <li><Link href="/image-credits" className="text-sm text-white/65 hover:text-white">Image credits</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-7 text-sm text-white/55">
          <p className="mb-3 font-semibold text-white/80">Engines and equipment supported</p>
          <p className="max-w-4xl leading-6">Zichai marine diesel engines, Fadda marine gearboxes, Hino, Isuzu, Cummins, Perkins, Doosan, John Deere, MAN, generators, and heavy equipment spare parts.</p>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          © 2026 Noor Alam Machineries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
