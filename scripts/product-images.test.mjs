import test from 'node:test';
import assert from 'node:assert/strict';
import { isGeneratedImage, showIllustrativeNote, ILLUSTRATIVE_NOTE } from '../lib/product-image-note.ts';
import { validateCurated, generatedIds, verifyCatalog, plateSvg } from './product-images.mjs';

const generated = { imageSourceUrl: '', images: ['/images/products/clutch-pack-0.webp'] };
const curated = { imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:X.jpg', images: ['/images/products/sun-gear-0.webp'] };

test('a generated entry is recognised by its empty source', () => {
  assert.equal(isGeneratedImage(generated), true);
  assert.equal(isGeneratedImage(curated), false);
});

test('the note shows for a generated image that is the one on screen', () => {
  assert.equal(showIllustrativeNote(generated, '/images/products/clutch-pack-0.webp'), true);
});

test('the note hides when an admin override replaced the image', () => {
  assert.equal(showIllustrativeNote(generated, 'https://example.supabase.co/storage/v1/object/public/product-images/clutch-pack/1.jpg'), false);
});

test('the note never shows for a real photograph', () => {
  assert.equal(showIllustrativeNote(curated, curated.images[0]), false);
});

test('the note copy names the fitment check', () => {
  assert.match(ILLUSTRATIVE_NOTE, /engine or gearbox model/);
});

test('a curated entry without a licence is rejected', () => {
  assert.throws(() => validateCurated([{ productId: 'a', file: 'A.jpg', credit: 'X', license: '', licenseUrl: '' }], ['a']), /licence/i);
});

test('a curated entry for an unknown product is rejected', () => {
  assert.throws(() => validateCurated([{ productId: 'nope', file: 'A.jpg', credit: 'X', license: 'CC0', licenseUrl: 'https://x' }], ['a']), /unknown product/i);
});

test('generated ids exclude curated ids and keep catalog order', () => {
  const products = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.deepEqual(generatedIds(products, new Set(['b'])), ['a', 'c']);
});

test('a curated entry without a licence link is rejected', () => {
  const entries = [{ productId: 'a', file: 'A.jpg', credit: 'X', license: 'Public domain', licenseUrl: '' }];
  assert.throws(() => validateCurated(entries, ['a']), /licence/i);
});

test('a product pointing at a missing file fails verification', () => {
  const products = [{ id: 'a', name: 'Sun Gear', category: 'gearbox-parts', images: ['/images/products/a-0.webp'] }];
  assert.throws(() => verifyCatalog(products, () => false), /missing/i);
});

test('a remote part image fails verification', () => {
  const products = [{ id: 'a', name: 'Sun Gear', category: 'gearbox-parts', images: ['https://example.com/x.jpg'] }];
  assert.throws(() => verifyCatalog(products, () => true), /remote/i);
});

test('two products may not share a file unless they share a duplicate name', () => {
  const shared = '/images/products/shared-0.webp';
  assert.throws(() => verifyCatalog([
    { id: 'a', name: 'Sun Gear', category: 'gearbox-parts', images: [shared] },
    { id: 'b', name: 'Ring Gear', category: 'gearbox-parts', images: [shared] },
  ], () => true), /shared/i);

  assert.doesNotThrow(() => verifyCatalog([
    { id: 'a', name: 'Flywheel', category: 'engine-components', images: [shared] },
    { id: 'b', name: 'Flywheel', category: 'gearbox-parts', images: [shared] },
  ], () => true));
});

test('a shared file is only allowed for the five duplicate part names', () => {
  const shared = '/images/products/shared-0.webp';
  assert.throws(() => verifyCatalog([
    { id: 'a', name: 'Sun Gear', category: 'gearbox-parts', images: [shared] },
    { id: 'b', name: 'Sun Gear', category: 'gear-parts', images: [shared] },
  ], () => true), /shared/i);
});

test('equipment entries are out of scope for verification', () => {
  const products = [{ id: 'eq', name: 'Cummins KTA19', category: 'equipment', images: ['https://example.com/x.jpg'] }];
  assert.doesNotThrow(() => verifyCatalog(products, () => false));
});

test('a plate names the part and its category', () => {
  const svg = plateSvg({ id: 'a', name: 'Sun Gear', category: 'gearbox-parts' });
  assert.match(svg, /Sun Gear/);
  assert.match(svg, /gearbox parts/i);
});

test('a plate escapes markup in the part name', () => {
  const svg = plateSvg({ id: 'a', name: 'Bolt & Nut', category: 'engine-components' });
  assert.match(svg, /Bolt &amp; Nut/);
});
