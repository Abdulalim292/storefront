import React from 'react';
import Image from 'next/image';
import { PhoneCall, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';

export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-4 text-ink">
              <Image
                src="/brand/noor-alam-site-logo.webp"
                alt="Noor Alam Machineries gear logo"
                width={56}
                height={56}
                className="h-12 w-12 border border-rule-2 object-cover"
              />
              <span className="font-display text-2xl font-semibold uppercase leading-none sm:text-3xl">
                Noor Alam <span className="text-accent">Machineries</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-6 text-muted">
              Managed by Md. Noor Nabi. Importer, wholesaler, and retailer of marine diesel engines, gearboxes, generators, and heavy equipment spare parts.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-4 text-sm font-medium text-accent">Equipment</h4>
            <ul className="space-y-3">
              <li><Link href="/categories" prefetch={false} className="text-sm text-ink-2 hover:text-accent">All categories</Link></li>
              <li><Link href="/categories/marine-engines" prefetch={false} className="text-sm text-ink-2 hover:text-accent">Marine engines</Link></li>
              <li><Link href="/categories/marine-gearboxes" prefetch={false} className="text-sm text-ink-2 hover:text-accent">Gearboxes</Link></li>
              <li><Link href="/categories/heavy-machinery" prefetch={false} className="text-sm text-ink-2 hover:text-accent">Heavy machinery</Link></li>
              <li><Link href="/products" prefetch={false} className="text-sm text-ink-2 hover:text-accent">All engine parts</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="mb-4 text-sm font-medium text-accent">Company</h4>
            <ul className="space-y-3">
              <li className="text-sm leading-5 text-muted">
                <span className="block text-ink-2">Md. Noor Nabi</span>
                Managing Director
              </li>
              <li><Link href="/#contact" className="text-sm text-ink-2 hover:text-accent">Showroom and branch addresses</Link></li>
              <li><a href={toBangladeshTel('01728-079359')} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-accent"><PhoneCall className="h-4 w-4" aria-hidden="true" /> {formatBangladeshPhone('01728-079359')}</a></li>
              <li><a href="mailto:noornoobi80@gmail.com" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-accent"><Mail className="h-4 w-4" aria-hidden="true" /> noornoobi80@gmail.com</a></li>
              <li><a href="https://www.nooralammachinery.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-accent"><Globe className="h-4 w-4" aria-hidden="true" /> nooralammachinery.com</a></li>
              <li><Link href="/image-credits" className="text-sm text-ink-2 hover:text-accent">Image credits</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-rule-2 pt-6">
          <p className="mb-3 text-sm font-medium text-ink">Engines and equipment supported</p>
          <p className="max-w-4xl text-sm leading-6 text-muted">Zichai marine diesel engines, Fadda marine gearboxes, Hino, Isuzu, Cummins, Perkins, Doosan, John Deere, MAN, generators, and heavy equipment spare parts.</p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-rule-2 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 max-w-none">© 2026 Noor Alam Machineries</p>
          <p className="m-0 max-w-none">Dhaka and Chittagong, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
