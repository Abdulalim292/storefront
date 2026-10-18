import type { Metadata, Viewport } from 'next';
import '../src/app/globals.css';
import { StorefrontShell } from '@/components/layout/StorefrontShell';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  applicationName: 'Noor Alam Machineries',
  appleWebApp: { capable: true, title: 'Noor Alam Machineries', statusBarStyle: 'black-translucent' },
  title: 'Noor Alam Machineries',
  description: 'Marine engines, gearboxes, and heavy machinery for marine and industrial operations from Noor Alam Machineries.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
        <StorefrontShell>{children}</StorefrontShell>
        <Footer />
      </body>
    </html>
  );
}
