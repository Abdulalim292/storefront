const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredSiteUrl || 'https://www.nooralammachinery.com').replace(/\/+$/, '');

// Keep the public sales number in one place so product, cart, and mobile
// contact links cannot drift apart.
export const SALES_PHONE = '01819-461614';
export const WHATSAPP_PHONE = `880${SALES_PHONE.replace(/\D/g, '').replace(/^0/, '')}`;

export function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
