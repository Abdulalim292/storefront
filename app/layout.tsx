import type { Metadata, Viewport } from 'next';
import '../src/app/globals.css';
import { StorefrontShell } from '@/components/layout/StorefrontShell';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  applicationName: 'Noor Alam Machineries',
  appleWebApp: { capable: true, title: 'Noor Alam Machineries', statusBarStyle: 'black-translucent' },
  title: 'Noor Alam Machineries | Marine & Industrial Equipment',
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
      <body className="min-h-screen flex flex-col bg-[#f8f7f3] font-sans text-[#17221f]">
        <StorefrontShell>{children}</StorefrontShell>
        <Footer />
      </body>
    </html>
  );
}
