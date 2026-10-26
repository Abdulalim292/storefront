import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { notifyInquiry, saveInquiry, type Inquiry, type InquiryItem } from '@/lib/inquiries';
import { consumeRateLimit, loginClientKey } from '@/lib/rate-limit';

const NO_STORE = { 'Cache-Control': 'no-store' };
const MAX_BODY_BYTES = 24 * 1024;
const MAX_ITEMS = 40;
const MAX_ITEM_QUANTITY = 99;
const INQUIRY_LIMIT = 5;
const INQUIRY_WINDOW_MS = 10 * 60 * 1000;

const productNames = new Map(
  [...PRODUCTS, ...EQUIPMENT_PRODUCTS].map((product) => [product.id, product.name]),
);

function json(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

async function readLimitedText(request: Request, maxBytes: number): Promise<string | null> {
  if (!request.body) return '';

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let result = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return null;
      }
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } catch {
    return null;
  }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function parseItems(value: unknown): InquiryItem[] {
  if (!Array.isArray(value)) return [];

  const quantities = new Map<string, number>();

  for (const entry of value.slice(0, MAX_ITEMS)) {
    if (!entry || typeof entry !== 'object') continue;

    const id = text((entry as Record<string, unknown>).id, 200);
    if (!productNames.has(id)) continue;

    const rawQuantity = (entry as Record<string, unknown>).quantity;
    const quantity = typeof rawQuantity === 'number' && Number.isInteger(rawQuantity)
      ? Math.min(MAX_ITEM_QUANTITY, Math.max(1, rawQuantity))
      : 1;

    quantities.set(id, Math.min(MAX_ITEM_QUANTITY, (quantities.get(id) ?? 0) + quantity));
  }

  return [...quantities].map(([id, quantity]) => ({
    id,
    name: productNames.get(id) as string,
    quantity,
  }));
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Request not allowed.' }, 403);

  const clientKey = loginClientKey(request) ?? 'unknown';
  const limit = await consumeRateLimit('inquiry', clientKey, INQUIRY_LIMIT, INQUIRY_WINDOW_MS);
  if (!limit.allowed) {
    return json(
      { error: 'Too many inquiries were sent recently. Please wait a few minutes or contact us on WhatsApp.' },
      429,
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  const raw = await readLimitedText(request, MAX_BODY_BYTES);
  if (raw === null) return json({ error: 'The inquiry is too large.' }, 413);

  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body');
    data = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid inquiry.' }, 400);
  }

  // Bots that fill every field get a normal-looking response but are not saved.
  if (text(data.website, 200)) return json({ ok: true }, 201);

  const name = text(data.name, 80);
  const phone = text(data.phone, 30);
  const email = text(data.email, 200);
  const equipmentModel = text(data.model, 120);
  const message = text(data.message, 2_000);

  if (name.length < 2) return json({ error: 'Please enter your name.' }, 400);
  if (!/^[0-9+().\-\s]{6,30}$/.test(phone)) return json({ error: 'Please enter a valid phone number.' }, 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (message.length < 5) return json({ error: 'Please describe what you need.' }, 400);

  const inquiry: Inquiry = {
    name,
    phone,
    email: email || null,
    equipmentModel: equipmentModel || null,
    message,
    items: parseItems(data.items),
    source: data.source === 'cart' ? 'cart' : 'contact',
    createdAt: new Date().toISOString(),
  };

  const [saved, notified] = await Promise.all([
    saveInquiry(inquiry),
    notifyInquiry(inquiry),
  ]);

  if (!saved && !notified) {
    console.error('Inquiry dropped: no storage or notification destination is configured or available.');
    return json(
      { error: 'Online inquiries are temporarily unavailable. Please call or message us on WhatsApp.' },
      503,
    );
  }

  return json({ ok: true }, 201);
}
