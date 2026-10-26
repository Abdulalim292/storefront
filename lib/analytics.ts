type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

// Google Analytics is optional. When NEXT_PUBLIC_GA_ID is absent these calls
// are no-ops, so the storefront keeps working without third-party scripts.
export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined' || !GA_ID) return;

  // Mirror the standard gtag bootstrap so events fired before the analytics
  // script arrives are queued instead of dropped.
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
  }

  window.gtag('event', name, params);
}
