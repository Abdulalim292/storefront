import type { Product } from '@/types';
import { SITE_URL } from './site';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type ListItem = {
  name: string;
  path: string;
};

function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(absoluteUrl),
    sku: product.id,
    category: product.category.replaceAll('-', ' '),
    url: absoluteUrl(`/products/${product.id}`),
    additionalProperty: product.specifications?.map((specification) => ({
      '@type': 'PropertyValue',
      name: 'Specification',
      value: specification,
    })),
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function itemListJsonLd(name: string, items: ListItem[]) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: ListItem[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: itemListJsonLd(name, items),
  };
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Noor Alam Machineries',
  url: SITE_URL,
  logo: `${SITE_URL}/brand/noor-alam-site-logo.webp`,
  description:
    'Importer, wholesaler, and retailer of marine diesel engines, gearboxes, heavy machinery, and engine spare parts in Bangladesh.',
  email: 'noornoobi80@gmail.com',
  telephone: '+880 1819-461614',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Modina Arzoo Complex, 107 Nawabpur Road',
    addressLocality: 'Dhaka',
    postalCode: '1100',
    addressCountry: 'BD',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+880 1819-461614',
    contactType: 'sales',
    areaServed: 'BD',
    availableLanguage: ['en', 'bn'],
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Noor Alam Machineries',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
