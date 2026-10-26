'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

function analyticsLocation(element: Element) {
  return element.closest<HTMLElement>('[data-analytics]')?.dataset.analytics
    || window.location.pathname;
}

export function Analytics() {
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    if (!GA_ID) return;

    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href') ?? '';
      const location = analyticsLocation(link);

      if (href.startsWith('tel:')) {
        trackEvent('contact_call', { link_location: location });
      } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        trackEvent('contact_whatsapp', { link_location: location });
      } else if (href.startsWith('mailto:')) {
        trackEvent('contact_email', { link_location: location });
      }
    }

    function handleSubmit(event: Event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.getAttribute('action') !== '/products') return;

      const query = String(new FormData(form).get('q') ?? '').trim();
      if (query) trackEvent('search', { search_term: query });
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit, true);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit, true);
    };
  }, []);

  useEffect(() => {
    if (!GA_ID) return;
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }

    trackEvent('page_view', {
      page_path: `${pathname}${window.location.search}`,
      page_location: window.location.href,
    });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_ID)});`}
      </Script>
    </>
  );
}
