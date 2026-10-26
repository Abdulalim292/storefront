import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StorefrontShell } from '@/components/layout/StorefrontShell';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/analytics/Analytics';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';
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

// Some extensions (Urban VPN, SpeakIt!, Bitdefender) stamp
// `bis_skin_checked="1"` on every element as the page parses. React sees those
// attributes as a hydration mismatch and reports the whole page as changed.
// Remove that marker before hydration and keep watching for it while the page
// loads. Only this attribute is touched, so real mismatches are still reported.
const stripExtensionAttributes = `(function () {
  var attribute = 'bis_skin_checked';
  function strip(root) {
    if (root.nodeType === 1 && root.hasAttribute(attribute)) root.removeAttribute(attribute);
    if (!root.querySelectorAll) return;
    var nodes = root.querySelectorAll('[' + attribute + ']');
    for (var i = 0; i < nodes.length; i += 1) nodes[i].removeAttribute(attribute);
  }
  strip(document.documentElement);
  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i += 1) {
      if (records[i].attributeName === attribute) records[i].target.removeAttribute(attribute);
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [attribute],
    subtree: true,
  });
  window.addEventListener('load', function () {
    strip(document.documentElement);
    window.setTimeout(function () { observer.disconnect(); }, 1000);
  }, { once: true });
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Browser extensions such as Grammarly, ColorZilla, Dark Reader, and
    // translators inject attributes into the root elements before hydration.
    // Suppress only those root attribute warnings; real component mismatches
    // elsewhere in the tree are still reported.
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className="flex min-h-screen flex-col bg-[#f8f7f3] pb-[calc(3.5rem+env(safe-area-inset-bottom))] font-sans text-[#17221f] lg:pb-0">
        <script dangerouslySetInnerHTML={{ __html: stripExtensionAttributes }} />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <StorefrontShell>{children}</StorefrontShell>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
