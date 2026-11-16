import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import sharp from 'sharp';
import { readLimitedText } from '../lib/request-body.ts';
import { toBangladeshTel } from '../lib/phone.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const react = createRequire(import.meta.url)('react');
const envNames = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'INQUIRY_WEBHOOK_URL',
  'KV_REST_API_URL', 'KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'];

beforeEach((t) => {
  const previous = envNames.map((name) => [name, process.env[name]]);
  for (const name of envNames) delete process.env[name];
  t.after(() => {
    for (const [name, value] of previous) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected network request'); });
  t.mock.method(console, 'error', () => {});
});

// Load the actual route code with local service doubles; no Next server or live credentials.
function load(file, mocks = {}, globals = {}) {
  const filename = path.join(root, file);
  const require = createRequire(filename);
  const loadedModule = { exports: {} };
  const context = vm.createContext({
    module: loadedModule, exports: loadedModule.exports,
    require: (name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name),
    Buffer, Request, Response, Headers, File, Blob, FormData, URL, AbortSignal, TextDecoder,
    Date, crypto: globalThis.crypto, process, console,
    fetch: (...args) => globalThis.fetch(...args), ...globals,
  });
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInContext(source, context, { filename });
  return { exports: loadedModule.exports, context };
}

function request(endpoint, body, headers = {}) {
  return new Request(`https://storefront.test/api/${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.0.2.1', ...headers },
    body: JSON.stringify(body),
  });
}

function loginRoute(check, rate = load('lib/rate-limit.ts').exports) {
  return load('app/api/admin/session/route.ts', {
    '@/lib/admin-auth': { hasValidOrigin: () => true, passwordsMatch: check,
      adminCookie: 'admin-session', adminSessionSeconds: 43_200,
      createAdminSession: () => ({ value: 'signed-session' }), isAdminRequest: async () => true },
    '@/lib/rate-limit': rate, '@/lib/request-body': { readLimitedText },
  }).exports;
}

const inquiryBody = { name: 'Customer', phone: '+880 1819-461614', message: 'I need a flywheel.' };
const part = { id: 'engine-components-flywheel', name: 'Flywheel', category: 'engine-components' };
const gearboxPart = { id: 'gearbox-parts-flywheel', name: 'Flywheel', category: 'gearbox-parts' };

function inquiryRoute(services = { saveInquiry: async () => true, notifyInquiry: async () => false }) {
  return load('app/api/inquiries/route.ts', {
    '@/data/products': { PRODUCTS: [part, gearboxPart] }, '@/data/equipment': { EQUIPMENT_PRODUCTS: [] },
    '@/lib/inquiries': services, '@/lib/rate-limit': load('lib/rate-limit.ts').exports,
    '@/lib/request-body': { readLimitedText },
  }).exports;
}

test('concurrent local logins stop before the ninth password comparison', async (t) => {
  const check = t.mock.fn(() => false);
  const { POST } = loginRoute(check);
  const responses = await Promise.all(Array.from({ length: 12 }, () => POST(request('admin/session', { password: 'wrong' }))));
  assert.equal(check.mock.callCount(), 8);
  assert.equal(responses.filter((response) => response.status === 401).length, 8);
  assert.equal(responses.filter((response) => response.status === 429).length, 4);
  assert.ok(Number(responses.find((response) => response.status === 429).headers.get('Retry-After')) > 0);
});

test('two login instances share atomic Redis attempt reservations', async (t) => {
  process.env.KV_REST_API_URL = 'https://redis.test';
  process.env.KV_REST_API_TOKEN = 'test-token';
  const counters = new Map();
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(new URL(url).pathname, '/multi-exec');
    const replies = JSON.parse(init.body).map(([command, key]) => {
      if (command === 'SET') {
        if (counters.has(key)) return { result: null };
        counters.set(key, 0);
        return { result: 'OK' };
      }
      if (command === 'INCR') {
        const count = counters.get(key) + 1;
        counters.set(key, count);
        return { result: count };
      }
      assert.equal(command, 'PTTL');
      return { result: 900_000 };
    });
    return Response.json(replies);
  });
  const check = t.mock.fn(() => false);
  const routes = [loginRoute(check), loginRoute(check)];
  const responses = await Promise.all(Array.from({ length: 12 }, (_, i) =>
    routes[i % 2].POST(request('admin/session', { password: 'wrong' }))));
  assert.equal(check.mock.callCount(), 8);
  assert.equal(responses.filter((response) => response.status === 429).length, 4);
});

test('the global login limit survives a successful client reset', async () => {
  const rate = load('lib/rate-limit.ts').exports;
  const results = await Promise.all(Array.from({ length: 60 }, (_, i) => rate.consumeLoginAttempt(`192.0.2.${i}`)));
  assert.equal(results.filter((result) => result.allowed).length, 60);
  await rate.clearLoginAttempts('192.0.2.0');
  assert.equal((await rate.consumeLoginAttempt('192.0.2.0')).allowed, false);
});

test('valid login still creates a protected session and clears only its client count', async () => {
  const rate = load('lib/rate-limit.ts').exports;
  const { POST } = loginRoute((password) => password === 'correct', rate);
  const response = await POST(request('admin/session', { password: 'correct' }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(response.headers.get('set-cookie'), /SameSite=Strict/i);
  const attempts = await Promise.all(Array.from({ length: 9 }, () => rate.consumeLoginAttempt('192.0.2.1')));
  assert.equal(attempts.filter((result) => result.allowed).length, 8);
});

test('Redis command errors and malformed successes use the local limit', async (t) => {
  process.env.KV_REST_API_URL = 'https://redis.test';
  process.env.KV_REST_API_TOKEN = 'test-token';
  const invalidReplies = [
    [{ error: 'ERR command denied' }, { error: 'ERR command denied' }, { error: 'ERR command denied' }],
    [{ result: 'OK' }],
    [{ result: null }, {}, { result: 600_000 }],
    [{ result: null }, { result: null }, { result: 600_000 }],
    [{ result: null }, { result: 'bad count' }, { result: 600_000 }],
    [{ result: null }, { result: 1 }, { result: null }],
  ];
  for (const replies of invalidReplies) {
    t.mock.method(globalThis, 'fetch', async () => Response.json(replies));
    const rate = load('lib/rate-limit.ts').exports;
    const results = await Promise.all(Array.from({ length: 6 }, () => rate.consumeRateLimit('inquiry', 'client', 5, 600_000)));
    assert.equal(results.filter((result) => result.allowed).length, 5, JSON.stringify(replies));
  }
});

test('local limits expire at the fixed window boundary', async (t) => {
  let now = 1_000;
  t.mock.method(Date, 'now', () => now);
  const rate = load('lib/rate-limit.ts').exports;
  await rate.consumeRateLimit('inquiry', 'client', 1, 1_000);
  assert.equal((await rate.consumeRateLimit('inquiry', 'client', 1, 1_000)).retryAfter, 1);
  now = 2_000;
  assert.equal((await rate.consumeRateLimit('inquiry', 'client', 1, 1_000)).allowed, true);
});

test('spoofed alternate IP headers cannot bypass the inquiry limit', async () => {
  const { POST } = inquiryRoute();
  const responses = await Promise.all(Array.from({ length: 6 }, (_, i) => POST(request('inquiries', inquiryBody, {
    'cf-connecting-ip': `198.51.100.${i}`, 'x-real-ip': `203.0.113.${i}`,
  }))));
  assert.equal(responses.filter((response) => response.status === 201).length, 5);
  assert.equal(responses.filter((response) => response.status === 429).length, 1);
  const { loginClientKey } = load('lib/rate-limit.ts').exports;
  assert.equal(loginClientKey(new Request('https://storefront.test', { headers: { 'cf-connecting-ip': '192.0.2.1' } })), null);
  assert.equal(loginClientKey(new Request('https://storefront.test', { headers: { 'x-forwarded-for': '__all_clients__' } })), null);
  assert.equal(loginClientKey(new Request('https://storefront.test', { headers: { 'x-forwarded-for': '2001:db8::1' } })), '2001:db8::1');
  assert.equal(loginClientKey(new Request('https://storefront.test', { headers: { 'x-forwarded-for': `2001:db8::1%${'a'.repeat(100)}` } })), null);
});

test('inquiries reject punctuation and too few digits before saving', async (t) => {
  const saved = t.mock.fn(async () => true);
  const { POST } = inquiryRoute({ saveInquiry: saved, notifyInquiry: async () => false });
  for (const phone of ['++++++', '......', '+12345', '123+456']) {
    assert.equal((await POST(request('inquiries', { ...inquiryBody, phone }))).status, 400);
  }
  assert.equal(saved.mock.callCount(), 0);
  assert.equal((await POST(request('inquiries', inquiryBody))).status, 201);
  assert.equal(saved.mock.callCount(), 1);
});

const inquiry = { ...inquiryBody, email: null, equipmentModel: null,
  items: [], source: 'contact', createdAt: '2026-11-16T00:00:00.000Z' };

test('long Discord inquiries attach the full text and wait for confirmation', async (t) => {
  process.env.INQUIRY_WEBHOOK_URL = 'https://discord.com/api/webhooks/1/test?thread_id=2&wait=false';
  const { notifyInquiry, notificationText } = load('lib/inquiries.ts').exports;
  const longInquiry = { ...inquiry, message: 'M'.repeat(1_900),
    items: [part, gearboxPart].map((item) => ({ ...item, quantity: 1 })) };
  const fullText = notificationText(longInquiry);
  assert.ok(fullText.length > 2_000);
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(new URL(url).searchParams.get('wait'), 'true');
    assert.equal(new URL(url).searchParams.get('thread_id'), '2');
    assert.ok(init.body instanceof FormData);
    assert.equal(init.headers, undefined);
    assert.ok(JSON.parse(init.body.get('payload_json')).content.length <= 2_000);
    assert.equal(await init.body.get('files[0]').text(), fullText);
    assert.equal(init.body.get('files[0]').name, 'inquiry.txt');
    return Response.json({ id: '1234567890' });
  });
  assert.equal(await notifyInquiry(longInquiry), true);
});

test('Discord-only inquiries are accepted only after a created message is returned', async (t) => {
  process.env.INQUIRY_WEBHOOK_URL = 'https://discord.com/api/webhooks/1/test';
  const { POST } = inquiryRoute(load('lib/inquiries.ts').exports);
  for (const body of [null, {}, { id: '' }, { id: '1234567890' }]) {
    t.mock.method(globalThis, 'fetch', async (url, init) => {
      assert.equal(new URL(url).searchParams.get('wait'), 'true');
      const payload = JSON.parse(init.body);
      assert.match(payload.content, /Customer/);
      assert.deepEqual(payload.allowed_mentions.parse, []);
      return body === null ? new Response(null, { status: 204 }) : Response.json(body);
    });
    assert.equal((await POST(request('inquiries', inquiryBody))).status, body?.id ? 201 : 503);
  }
});

test('generic webhooks keep their structured JSON and acknowledgment behavior', async (t) => {
  process.env.INQUIRY_WEBHOOK_URL = 'https://hooks.test/inquiry';
  const { notifyInquiry } = load('lib/inquiries.ts').exports;
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(new URL(url).search, '');
    const payload = JSON.parse(init.body);
    assert.equal(payload.text, payload.content);
    assert.equal(payload.inquiry.message, inquiry.message);
    return new Response(null, { status: 204 });
  });
  assert.equal(await notifyInquiry(inquiry), true);
});

test('body reading keeps split UTF-8, cancels oversize streams and handles errors', async () => {
  const bytes = new TextEncoder().encode('a😀b');
  const stream = new ReadableStream({ start(controller) {
    controller.enqueue(bytes.slice(0, 3)); controller.enqueue(bytes.slice(3)); controller.close();
  } });
  const makeRequest = (body) => new Request('https://storefront.test', { method: 'POST', body, duplex: 'half' });
  assert.equal(await readLimitedText(makeRequest(stream), bytes.length), 'a😀b');
  let cancelled = false;
  const oversized = new ReadableStream({ start(controller) { controller.enqueue(bytes); }, cancel() { cancelled = true; } });
  assert.equal(await readLimitedText(makeRequest(oversized), 2), null);
  assert.equal(cancelled, true);
  const broken = new ReadableStream({ pull() { throw new Error('Disconnected'); } });
  assert.equal(await readLimitedText(makeRequest(broken), 20), null);
  assert.equal(await readLimitedText(new Request('https://storefront.test'), 20), '');
});

test('telephone links preserve Bangladesh international prefixes', () => {
  for (const phone of ['01819461614', '+880 1819-461614', '8801819461614']) {
    assert.equal(toBangladeshTel(phone), 'tel:+8801819461614');
  }
  assert.equal(toBangladeshTel('02 222224760'), 'tel:+8802222224760');
});

function uploadRoute(saveProductImage, authenticated = true) {
  return load('app/api/admin/product-images/route.ts', {
    '@/data/catalog.json': { products: [part] },
    '@/lib/admin-auth': { hasValidOrigin: () => true, isAdminRequest: async () => authenticated },
    '@/lib/product-image-storage': { saveProductImage },
  }).exports;
}

function photoRequest(bytes, type, productId = part.id) {
  const body = new FormData();
  body.set('productId', productId);
  body.set('photo', new File([bytes], 'client-filename.svg', { type }));
  return new Request('https://storefront.test/api/admin/product-images', { method: 'POST', body });
}

const imageInput = { create: { width: 8, height: 8, channels: 3, background: '#ffffff' } };

test('valid JPG, PNG and WebP uploads keep server-derived file names', async (t) => {
  const save = t.mock.fn(async () => 'https://images.test/new-photo');
  const { POST } = uploadRoute(save);
  for (const [format, type, extension] of [['jpeg', 'image/jpeg', 'jpg'], ['png', 'image/png', 'png'], ['webp', 'image/webp', 'webp']]) {
    const bytes = await sharp(imageInput)[format]().toBuffer();
    assert.equal((await POST(photoRequest(bytes, type))).status, 200);
    const [id, file] = save.mock.calls.at(-1).arguments;
    assert.equal(id, part.id);
    assert.equal(file.name, `upload.${extension}`);
    assert.equal(file.type, type);
    assert.deepEqual(Buffer.from(await file.arrayBuffer()), bytes);
  }
  assert.equal(save.mock.callCount(), 3);
});

test('headers without image data are rejected before replacing any photo', async (t) => {
  const save = t.mock.fn(async () => 'https://images.test/new-photo');
  const { POST } = uploadRoute(save);
  const png = Buffer.alloc(33);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(png);
  png.writeUInt32BE(13, 8); png.write('IHDR', 12);
  png.writeUInt32BE(8, 16); png.writeUInt32BE(8, 20); png[24] = 8; png[25] = 2;
  const jpeg = await sharp(imageInput).jpeg().toBuffer();
  const webp = await sharp(imageInput).webp({ lossless: true }).toBuffer();
  const broken = [
    [png, 'image/png'],
    [jpeg.subarray(0, jpeg.indexOf(Buffer.from([0xff, 0xda]))), 'image/jpeg'],
    [webp.subarray(0, 30), 'image/webp'],
  ];
  for (const [bytes, type] of broken) assert.equal((await POST(photoRequest(bytes, type))).status, 400);
  assert.equal(save.mock.callCount(), 0);
});

test('photo uploads retain authentication, size, type and product checks', async (t) => {
  const save = t.mock.fn(async () => 'https://images.test/new-photo');
  const png = await sharp(imageInput).png().toBuffer();
  const unauthorized = uploadRoute(save, false);
  assert.equal((await unauthorized.POST(photoRequest(png, 'image/png'))).status, 401);
  const { POST } = uploadRoute(save);
  assert.equal((await POST(photoRequest(png, 'image/jpeg'))).status, 400);
  assert.equal((await POST(photoRequest(png, 'image/png', 'unknown-product'))).status, 400);
  assert.equal((await POST(photoRequest(Buffer.alloc(4 * 1024 * 1024 + 1), 'image/png'))).status, 400);
  assert.equal(save.mock.callCount(), 0);
});

function storageEnv() {
  process.env.SUPABASE_URL = 'https://storage.test';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
}

test('a stale server read cannot refill the cache after invalidation', async (t) => {
  storageEnv();
  const old = Promise.withResolvers();
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => ++requests === 1 ? old.promise
    : Response.json([{ product_id: part.id, image_url: 'https://storage.test/new.png' }]));
  const storage = load('lib/product-image-storage.ts').exports;
  const stale = storage.getProductImageOverrides();
  storage.invalidateProductImageOverrides();
  assert.equal((await storage.getProductImageOverrides())[part.id], 'https://storage.test/new.png');
  old.resolve(Response.json([{ product_id: part.id, image_url: 'https://storage.test/old.png' }]));
  await stale;
  assert.equal((await storage.getProductImageOverrides())[part.id], 'https://storage.test/new.png');
  assert.equal(requests, 2);
});

test('replacing a photo retains objects still referenced by another instance or tab', async (t) => {
  storageEnv();
  const oldPath = `${part.id}/old.png`;
  const oldUrl = `https://storage.test/storage/v1/object/public/product-images/${oldPath}`;
  const objects = new Set([oldPath]);
  const deletes = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    const pathname = new URL(url).pathname;
    if (init.method === 'DELETE') {
      for (const object of JSON.parse(init.body).prefixes) { objects.delete(object); deletes.push(object); }
    } else if (pathname.startsWith('/storage/v1/object/product-images/')) {
      objects.add(pathname.slice('/storage/v1/object/product-images/'.length));
    } else if (init.method !== 'POST') {
      return Response.json([{ image_url: oldUrl }]);
    }
    return new Response(null, { status: 200 });
  });
  const storage = load('lib/product-image-storage.ts').exports;
  const newUrl = await storage.saveProductImage(part.id, new File(['pixels'], 'new.png', { type: 'image/png' }));
  assert.notEqual(newUrl, oldUrl);
  assert.ok(objects.has(oldPath));
  assert.equal(objects.size, 2);
  assert.equal(deletes.length, 0);
});

test('a failed photo mapping write cleans up only the unreferenced new object', async (t) => {
  storageEnv();
  const deleted = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    if (init.method === 'DELETE') deleted.push(...JSON.parse(init.body).prefixes);
    if (init.method === 'POST' && new URL(url).pathname === '/rest/v1/product_images') {
      return new Response(null, { status: 503 });
    }
    return Response.json([{ image_url: 'https://storage.test/old.png' }]);
  });
  const storage = load('lib/product-image-storage.ts').exports;
  await assert.rejects(storage.saveProductImage(part.id, new File(['pixels'], 'new.png', { type: 'image/png' })), /could not update the catalog/);
  assert.equal(deleted.length, 1);
  assert.match(deleted[0], new RegExp(`^${part.id}/[0-9]+-.+\\.png$`));
});

test('an older browser response cannot replace a completed forced refresh', async (t) => {
  const old = Promise.withResolvers();
  const fresh = Promise.withResolvers();
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => ++requests === 1 ? old.promise : fresh.promise);
  const client = load('context/ProductImageContext.tsx', {}, { window: { sessionStorage: { setItem() {} } } });
  const fetchImages = vm.runInContext('fetchImages', client.context);
  const stale = fetchImages();
  const refreshed = fetchImages(true);
  fresh.resolve(Response.json({ [part.id]: 'https://storage.test/new.png' }));
  await refreshed;
  old.resolve(Response.json({ [part.id]: 'https://storage.test/old.png' }));
  assert.equal((await stale)[part.id], 'https://storage.test/new.png');
});

for (const operation of ['writeFileSync', 'renameSync']) {
  test(`a failed catalog ${operation} leaves the previous catalog intact`, async (t) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'storefront-catalog-test-'));
    const previousCwd = process.cwd();
    t.after(() => { process.chdir(previousCwd); fs.rmSync(directory, { recursive: true, force: true }); });
    fs.mkdirSync(path.join(directory, 'data'));
    const catalogPath = path.join(directory, 'data', 'catalog.json');
    const original = '{"products":[{"id":"old"}]}\n';
    fs.writeFileSync(catalogPath, original);
    process.chdir(directory);
    const moduleUrl = pathToFileURL(path.join(root, 'scripts/image-utils.mjs'));
    moduleUrl.searchParams.set('case', operation);
    const { writeCatalog } = await import(moduleUrl.href);
    const replacement = { products: [{ id: 'verified' }] };
    writeCatalog(replacement);
    assert.deepEqual(JSON.parse(fs.readFileSync(catalogPath, 'utf8')), replacement);
    fs.writeFileSync(catalogPath, original);
    const write = fs.writeFileSync;
    t.mock.method(fs, operation, (...args) => {
      if (operation === 'writeFileSync') write(args[0], String(args[1]).slice(0, 10));
      throw new Error('Disk write failed');
    });
    assert.throws(() => writeCatalog({ products: [{ id: 'new' }] }), /Disk write failed/);
    assert.equal(fs.readFileSync(catalogPath, 'utf8'), original);
    assert.deepEqual(fs.readdirSync(path.dirname(catalogPath)), ['catalog.json']);
  });
}

test('compatibility suggestions return fitment instructions', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ matches: [] }));
  const chat = load('components/chat/StorefrontChatbot.tsx', {
    '@/data/branches': { BRANCHES: [] }, '@/lib/phone': { toBangladeshTel },
  }, { window: { location: { origin: 'https://storefront.test' } } });
  const replyTo = vm.runInContext('replyTo', chat.context);
  for (const question of ['Check compatibility', 'How do I check compatibility?', 'Is this compatible?']) {
    assert.match((await replyTo(question)).text, /engine name and model, serial number/);
  }
});

const hooks = { ...react, useState: (value) => [value, () => {}],
  useEffect: () => {}, useRef: () => ({ current: null }) };

function elements(element) {
  if (Array.isArray(element)) return element.flatMap(elements);
  if (!element || typeof element !== 'object') return [];
  return [element, ...elements(element.props?.children)];
}

test('same-named cart parts stay distinct in the inquiry and WhatsApp text', () => {
  let state = 0;
  const { CartDrawer } = load('components/cart/CartDrawer.tsx', {
    react: { ...hooks, useState: (value) => [state++ === 0 ? true : value, () => {}] },
    '@/context/CartContext': { useCart: () => ({ cart: [part, gearboxPart].map((item) => ({ ...item, images: ['/part.webp'], quantity: 1 })) }) },
    '@/components/ui/Button': { Button: 'button' }, '@/components/ui/CatalogImage': { CatalogImage: 'img' },
    '@/lib/utils': { cn: (...values) => values.join(' ') }, '@/lib/analytics': { trackEvent() {} },
    '@/lib/site': { whatsappHref: (text) => `https://wa.me/123?text=${encodeURIComponent(text)}` },
  }).exports;
  const tree = elements(CartDrawer({ isOpen: true, onClose() {} }));
  const text = tree.find((element) => element.type === 'textarea').props.value;
  for (const item of [part, gearboxPart]) assert.ok(text.includes(`1 × Flywheel (ID: ${item.id})`));
  const link = tree.find((element) => element.props?.['data-analytics'] === 'cart-whatsapp');
  assert.equal(new URL(link.props.href).searchParams.get('text'), text);
});

test('uploaded photos use optimization for only the configured storage bucket', () => {
  storageEnv();
  const config = load('next.config.ts').exports.default;
  const pattern = config.images.remotePatterns.find((entry) => entry instanceof URL && entry.hostname === 'storage.test');
  assert.equal(pattern.href, 'https://storage.test/storage/v1/object/public/product-images/**');
  const { ResilientImage } = load('components/ui/ResilientImage.tsx', { react: hooks, 'next/image': 'img' }).exports;
  const image = ResilientImage({ src: 'https://storage.test/storage/v1/object/public/product-images/photo.png', alt: 'Photo', sizes: '80px' });
  assert.equal(image.props.unoptimized, false);
  const preview = ResilientImage({ src: 'blob:local-preview', alt: 'Preview', sizes: '400px' });
  assert.equal(preview.props.unoptimized, true);
});

test('brand image errors reach the existing text fallback', () => {
  let failed = false;
  const { BrandLogo } = load('components/home/BrandLogo.tsx', {
    react: { ...hooks, useState: () => [failed, (value) => { failed = value; }] }, 'next/image': 'img',
  }).exports;
  BrandLogo({ name: 'Brand', src: '/missing.svg' }).props.onError();
  const fallback = BrandLogo({ name: 'Brand', src: '/missing.svg' });
  assert.equal(fallback.type, 'span');
  assert.equal(fallback.props.children, 'Brand');
});
