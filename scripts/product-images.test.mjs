import test from 'node:test';
import assert from 'node:assert/strict';
import { isGeneratedImage, showIllustrativeNote, ILLUSTRATIVE_NOTE } from '../lib/product-image-note.ts';

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
