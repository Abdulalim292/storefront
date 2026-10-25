import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';
import { marineEngineModels, marineGearboxModels, heavyMachineryModels } from '@/data/equipment';

const MAX_QUERY_LENGTH = 160;
const MAX_RESULTS = 3;

type SearchItem = {
  id: string;
  name: string;
  category: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SEARCH_ITEMS: SearchItem[] = [
  ...PRODUCTS.map((product) => ({ id: product.id, name: product.name, category: product.category })),
  ...marineEngineModels.map((product) => ({ id: product.id, name: product.name, category: 'marine-engines' })),
  ...marineGearboxModels.map((product) => ({ id: product.id, name: product.name, category: 'marine-gearboxes' })),
  ...heavyMachineryModels.map((product) => ({ id: product.id, name: product.name, category: 'heavy-machinery' })),
];

const SEARCH_TERMS = SEARCH_ITEMS.map((product) => ({
  product,
  terms: product.name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 3 && !['assembly', 'engine', 'turbocharger'].includes(term)),
}));

function searchProducts(question: string) {
  const query = question.toLowerCase();

  return SEARCH_TERMS
    .map(({ product, terms }) => {
      let score = 0;
      const name = product.name.toLowerCase();

      if (new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i').test(query)) score += 10;

      for (const term of terms) {
        if (new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i').test(query)) score += 5;
      }

      if (query.includes('turbocharger') && (product.category === 'turbocharging' || product.category === 'marine-engines')) score += 2;
      if (query.includes('piston') && (product.category === 'pistons-rings' || product.category === 'marine-engines')) score += 2;

      return { product, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({ product }) => product);
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim().slice(0, MAX_QUERY_LENGTH) ?? '';
  const matches = query ? searchProducts(query) : [];

  return NextResponse.json(
    { matches },
    {
      headers: {
        // The catalog only changes on deploy, so short-lived shared caching is safe.
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    },
  );
}
