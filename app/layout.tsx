import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StorefrontShell } from '@/components/layout/StorefrontShell';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/analytics/Analytics';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Noor Alam Machineries',
  appleWebApp: { capable: true, title: 'Noor Alam Machineries', statusBarStyle: 'black-translucent' },
  title: {
    default: 'Noor Alam Machineries | Marine & Industrial Equipment',
    template: '%s | Noor Alam Machineries',
  },
  description: 'Marine engines, gearboxes, heavy machinery, and engine parts matched to your application by Noor Alam Machineries.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111b18',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-[#f8f7f3] pb-[calc(3.5rem+env(safe-area-inset-bottom))] font-sans text-[#17221f] lg:pb-0">
        <StorefrontShell>{children}</StorefrontShell>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
