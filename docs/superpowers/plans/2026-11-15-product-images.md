# Product Imagery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 46 shared stock photographs behind 313 part products with a real
photograph of the right kind of part where one is verifiable on Wikimedia Commons, and a
generated illustration otherwise, so that no two neighbouring products look identical.

**Architecture:** Sourcing decisions live in one script, `scripts/product-images.mjs`, which
plans what needs generating, validates and applies the curated Commons list, converts
generator output to WebP, and verifies the end state. The app reads local files under
`public/images/products/` through the existing `CatalogImage` → `ResilientImage` path; a
generated entry is marked by `imageSourceUrl === ""`, which drives an "Illustrative image"
note on the product page and keeps `/image-credits` listing only real photographers.

**Tech Stack:** Next.js 16.4.5 (App Router, Turbopack), React 19.3.1, Node 24.21.0,
`node:test` for tests, `sharp` 0.35.5 for WebP encoding, existing `scripts/image-utils.mjs`
for download and path conventions.

**Spec:** `docs/superpowers/specs/2026-11-15-product-images-design.md`

## Global Constraints

- 333 catalog entries: 20 `equipment` (real manufacturer photos) are **untouched** — same
  URLs, same credits. 313 part products are in scope.
- Local image path is exactly `/images/products/<product-id>-0.webp`, produced by the existing
  `localImagePath(productId, 0, "image.webp")` helper in `scripts/image-utils.mjs`.
- Generated entries: `imageSourceUrl: ""`, `imageCredit: "Generated illustration"`,
  `imageLicense: ""`, `imageLicenseUrl: ""`.
- Curated entries keep their Commons `imageSourceUrl`, `imageCredit`, `imageLicense`,
  `imageLicenseUrl` verbatim; the file keeps its native aspect (WebP conversion only).
- Generated images: 1000×1000, WebP quality 78, target ≤ 150 KB.
- These five part names appear in two categories each and **may** share one photograph:
  `Flywheel`, `Vibration Damper`, `Oil Filter`, `Oil Cooler`, `Hydraulic Pump`. Every other
  product gets its own file.
- `next.config.ts` `remotePatterns` and `components/ui/ResilientImage.tsx` are **not
  modified** in this change.
- Before editing anything under `app/`, read the matching guide in
  `node_modules/next/dist/docs/` (this Next version differs from training data — see
  `AGENTS.md`).
- Commit after every category batch so an interrupted generation run keeps its progress.

## Review Focus

- A product whose photo an admin replaced through `/admin/products` must **not** show the
  "Illustrative image" note — the note describes an image that is no longer on screen.
- An interrupted generation run must never leave a catalog entry pointing at a file that does
  not exist; every entry is checked before it is written.
- The five duplicate-name pairs must pass the uniqueness check as an explicit exception, not
  by the check silently ignoring duplicates.
- A curated entry missing a licence or a credit line must be rejected before the catalog is
  written — publishing unattributed CC material is the one unrecoverable mistake here.
- Every generation prompt must contain the product's name verbatim; a prompt built from the
  category alone would silently produce a whole category of wrong images.

---

### Task 1: The generated-image rule, with tests

**Files:**
- Create: `lib/product-image-note.ts`
- Create: `scripts/product-images.test.mjs`
- Modify: `package.json` (add `test` script, add `sharp` dev dependency)

**Interfaces:**
- Consumes: nothing.
- Produces: `isGeneratedImage(product: { imageSourceUrl: string }): boolean`,
  `showIllustrativeNote(product: { imageSourceUrl: string; images: string[] }, renderedSrc: string): boolean`,
  `ILLUSTRATIVE_NOTE: string` — all from `@/lib/product-image-note`. Tasks 2 and 3 use them.

- [ ] **Step 1: Add the test runner and the encoder dependency**

In `package.json` add `"test": "node --test scripts/*.test.mjs"` to `scripts`, and
`"sharp": "0.35.5"` to `devDependencies` (it is currently only present transitively through
`next`).

- [ ] **Step 2: Write the failing test**

Create `scripts/product-images.test.mjs`:

```js
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '../lib/product-image-note.ts'`.

- [ ] **Step 4: Implement `lib/product-image-note.ts`**

No imports from `@/types` — the parameter shapes are inline so `node --test` can load the file
directly.

```ts
export const ILLUSTRATIVE_NOTE =
  'Illustrative image; confirm the part against your engine or gearbox model.';

export function isGeneratedImage(product: { imageSourceUrl: string }): boolean {
  return product.imageSourceUrl === '';
}

export function showIllustrativeNote(
  product: { imageSourceUrl: string; images: string[] },
  renderedSrc: string,
): boolean {
  return isGeneratedImage(product) && renderedSrc === product.images[0];
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json lib/product-image-note.ts scripts/product-images.test.mjs
git commit -m "feat: identify generated product images"
```

---

### Task 2: Illustrative note on the product page

**Files:**
- Modify: `app/products/[id]/ProductDetailClient.tsx` (the `plate` block holding `CatalogImage`, around line 70)

**Interfaces:**
- Consumes: `showIllustrativeNote`, `ILLUSTRATIVE_NOTE` from `@/lib/product-image-note`;
  `useProductImage(productId, fallback)` from `@/context/ProductImageContext`.
- Produces: nothing importable.

- [ ] **Step 1: Render the note**

Import `useProductImage` and the two helpers. In the component body resolve
`const renderedSrc = useProductImage(product.id, product.images[0]);` and pass
`src={renderedSrc}` to `CatalogImage` (it re-resolves internally; passing the resolved value is
what makes the note and the picture agree). Below the `dim-row` that prints `product.id`, render
one line when `showIllustrativeNote(product, renderedSrc)` is true:

```tsx
<p className="mt-3 text-xs text-muted">{ILLUSTRATIVE_NOTE}</p>
```

- [ ] **Step 2: Check it renders both ways**

Run: `npm run dev`, open a product (any part product — every one is generated until the
catalogue work lands), confirm the line appears under the part record. Then open an equipment
product (`/products/cummins-kta19`), confirm it does not.

- [ ] **Step 3: Commit**

```bash
git add "app/products/[id]/ProductDetailClient.tsx"
git commit -m "feat: label generated product images as illustrative"
```

---

### Task 3: Credits page lists only real photographs

**Files:**
- Modify: `app/image-credits/page.tsx` (the `creditGroups` builder around lines 33–53, plus the intro copy)

**Interfaces:**
- Consumes: `isGeneratedImage` from `@/lib/product-image-note`.
- Produces: nothing importable.

- [ ] **Step 1: Filter and explain**

Skip products where `isGeneratedImage(product)` is true before grouping — the file already
falls back to `'Credit not recorded'` for empty credits, but a generated entry has no
photograph to credit. Add one sentence to the page intro stating that some product images are
generated illustrations, not photographs of the actual part, and that photographs are shown
converted to WebP and otherwise unmodified.

- [ ] **Step 2: Verify**

Run: `npm run build`, then `npm run dev` and open `/image-credits`.
Expected: only real photographers listed, each with a licence link.

- [ ] **Step 3: Commit**

```bash
git add app/image-credits/page.tsx
git commit -m "feat: credit only real photographs on the image credits page"
```

---

### Task 4: Sourcing script — plan and curated passes

**Files:**
- Create: `scripts/product-images.mjs`
- Create: `data/curated-sources.json`
- Modify: `scripts/product-images.test.mjs`

**Interfaces:**
- Consumes: `readCatalog`, `writeCatalog`, `downloadImage`, `localImagePath` from
  `./image-utils.mjs`; `isGeneratedImage` not needed here.
- Produces: subcommands `node scripts/product-images.mjs plan`, `... curated`, `... normalize`,
  `... verify`. Exported pure helpers `renderPrompt(product)`, `validateCurated(entries, productIds)`,
  `generatedIds(products, curatedIds)`, `GENERATED_CREDIT` — Task 5 extends the same file.

- [ ] **Step 1: Write the failing tests**

Append to `scripts/product-images.test.mjs`, importing from `./product-images.mjs`:

```js
test('a prompt always contains the part name verbatim', () => {
  const p = { id: 'gearbox-parts-shift-rail', name: 'Shift Rail', category: 'gearbox-parts' };
  assert.match(renderPrompt(p), /Shift Rail/);
  assert.match(renderPrompt(p), /gearbox/);
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './product-images.mjs'`.

- [ ] **Step 3: Implement the script skeleton, `plan` and `curated`**

`scripts/product-images.mjs` exports the four helpers above and dispatches on
`process.argv[2]`. `GENERATED_CREDIT = 'Generated illustration'`.

- `plan`: reads the catalog, takes part products (`category !== 'equipment'`), subtracts the
  product ids in `data/curated-sources.json`, writes `data/image-manifest.json` as
  `[{ id, name, category, prompt }]` in catalog order, and prints the count.
- `renderPrompt(product)`: returns a one-line prompt containing the name verbatim and the
  category as context, e.g.
  `studio product photograph of a single marine gearbox "Shift Rail", isolated on a warm off-white seamless background, soft even light, engineering catalogue style, no text, square 1:1`. Keep the style wording in a module-level constant so Task 5 does not duplicate it.
- `validateCurated(entries, productIds)`: throws `unknown product <id>` for a product id not in
  `productIds`, and throws `curated entry <id> is missing a licence` when `license` or
  `licenseUrl` is empty; otherwise returns the entries.
- `curated`: validates, then for each entry downloads `https://commons.wikimedia.org/wiki/Special:FilePath/<file>?width=1400`
  through `downloadImage` to `localImagePath(productId, 0, file)`, and on success sets
  `images[0]`, `imageSourceUrl`, `imageCredit`, `imageLicense`, `imageLicenseUrl` on the catalog
  entry. Writes the catalog once at the end. A failed download leaves that entry untouched
  (it will be picked up by `plan` as needing generation) and is reported.

`data/curated-sources.json` is the curation output: an array of
`{ productId, file, credit, license, licenseUrl }`, where `file` is the Commons file title
without the `File:` prefix. Fill it by querying
`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20<term>&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|extmetadata&format=json`
and accepting only candidates that satisfy the spec's rules: a photograph (not SVG/PNG
diagram, GIF or render), the named part as the subject, licence CC0/PD/CC BY/CC BY-SA. Expect
50–70 entries; anything not accepted falls through to generation. Batch the API calls — the
endpoint rate-limits after ~10 requests — and record the term searched in a comment-free
one-line entry per product.

- [ ] **Step 4: Run the tests to verify they pass, then run both subcommands**

Run: `npm test` — PASS.
Run: `node scripts/product-images.mjs curated` — expected: downloaded or already present for
every curated entry, failures listed.
Run: `node scripts/product-images.mjs plan` — expected: the number of part products with no
local image, and `data/image-manifest.json` written.

- [ ] **Step 5: Commit**

```bash
git add scripts/product-images.mjs scripts/product-images.test.mjs data/curated-sources.json data/image-manifest.json data/catalog.json public/images/products
git commit -m "feat: source real photographs for part types that have one"
```

---

### Task 5: Sourcing script — normalize and verify

**Files:**
- Modify: `scripts/product-images.mjs`
- Modify: `scripts/product-images.test.mjs`

**Interfaces:**
- Consumes: helpers from Task 4, `sharp` (dev dependency added in Task 1).
- Produces: subcommands `normalize`, `verify`; exported pure helper
  `verifyCatalog(products, exists)` where `exists: (localPath: string) => boolean`.

- [ ] **Step 1: Write the failing tests**

```js
const DUPES = new Set(['Flywheel', 'Vibration Damper', 'Oil Filter', 'Oil Cooler', 'Hydraulic Pump']);

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

test('equipment entries are out of scope for verification', () => {
  const products = [{ id: 'eq', name: 'Cummins KTA19', category: 'equipment', images: ['https://example.com/x.jpg'] }];
  assert.doesNotThrow(() => verifyCatalog(products, () => false));
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `verifyCatalog is not a function`.

- [ ] **Step 3: Implement `normalize` and `verify`**

- `normalize`: for every `.png`/`.jpg`/`.jpeg` file in `public/images/products/` whose name
  starts with a product id of a part product, encode with sharp to
  `public/images/products/<id>-0.webp` at `{ width: 1000, height: 1000, fit: 'cover' }`,
  `webp({ quality: 78 })`, delete the source file, then set that product's `images[0]` to the
  local path and the generated fields from Global Constraints. Skips a product that already has
  a curated entry (non-empty `imageSourceUrl`). Writes the catalog once.
- `verify`: reads the catalog and calls `verifyCatalog(catalog.products, fs.existsSync)`.
- `verifyCatalog(products, exists)`: ignores `category === 'equipment'`; for every part product
  throws `remote part image <id>` if `images[0]` is not a local `/images/products/` path, throws
  `missing image file <path>` if `exists` is false, and throws `image shared by <a> and <b>` when
  two part products share a path and their names differ and neither name is in `DUPES`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/product-images.mjs scripts/product-images.test.mjs
git commit -m "feat: normalize generated images and verify the catalog"
```

---

### Task 6: Render the part plates

**Files:**
- Create: 272 files under `public/images/products/`
- Modify: `data/catalog.json`

**Interfaces:**
- Consumes: `data/image-manifest.json` from Task 4; `plateSvg(product)` and the `plates`
  subcommand added here; `verify` from Task 5.
- Produces: the finished catalogue imagery.

**Amended 2026-11-16:** the harness image generator is billed pay-as-you-go and the balance is
empty, so no AI images exist. Pass 2 is a rendered typographic plate instead (see the spec's
"Pass 2" section). `normalize` is dropped with it — plates are written straight to WebP.

- [ ] **Step 1: Write the failing test**

```js
test('a plate names the part and its category', () => {
  const svg = plateSvg({ id: 'a', name: 'Sun Gear', category: 'gearbox-parts' });
  assert.match(svg, /Sun Gear/);
  assert.match(svg, /gearbox parts/i);
});

test('a plate escapes markup in the part name', () => {
  const svg = plateSvg({ id: 'a', name: 'Bolt & Nut', category: 'engine-components' });
  assert.match(svg, /Bolt &amp; Nut/);
});
```

- [ ] **Step 2: Run it, watch it fail**

Run: `npm test` — FAIL, no export named `plateSvg`.

- [ ] **Step 3: Implement `plateSvg` and the `plates` subcommand**

`plateSvg({ id, name, category })` returns a 1000x1000 SVG string: plate-tone background,
hairline inner frame, category label in upper case, part name wrapped at most two lines, and
the category glyph. Escape `&`, `<`, `>` in the name. The `plates` command renders each
manifest entry through `sharp(Buffer.from(svg)).webp({ quality: 88 })` to
`public/images/products/<id>-0.webp`, applies the generated fields, and writes the catalog once.

- [ ] **Step 4: Run it, watch it pass, then render**

Run: `npm test` — PASS. Then `node scripts/product-images.mjs plates` and
`node scripts/product-images.mjs verify` — both clean.

- [ ] **Step 5: Commit**

```bash
git add scripts data public/images/products
git commit -m "feat: render part plates for products without a photograph"
```

---

### Task 7: Cleanup and final verification

**Files:**
- Delete: the 38 unreferenced files in `public/images/products/` (everything not referenced by
  `catalog.json` and not named `<product-id>-0.webp`)

**Interfaces:**
- Consumes: `verify` from Task 5.
- Produces: nothing.

- [ ] **Step 1: Remove the dead files**

List what `catalog.json` references, delete every other file in `public/images/products/`
(38 files, 6.3 MB today, e.g. `image-1.jpg`). Deleting a referenced file is caught by `verify`.

- [ ] **Step 2: Run everything**

Run: `npm test` — PASS.
Run: `node scripts/product-images.mjs verify` — PASS.
Run: `npm run lint` — no new errors.
Run: `npm run build` — succeeds.
Expected: 313 part products with local images, 20 equipment entries with their original remote
URLs.

- [ ] **Step 3: Spot check by eye**

Open 10 random category pages and confirm the images are distinct and plausible, and read the
four most-visited part types: cylinder head gasket, track roller, input shaft, turbocharger
cartridge. Then open one product whose photo was changed in `/admin/products` and confirm the
illustrative note is absent.

- [ ] **Step 4: Report which photographs are real**

Give the human partner the list from `data/curated-sources.json` — product name, Commons file
and licence — as the record of which products carry a real photograph and which carry an
illustration, per the spec's decision to show that list at the end rather than gate on it.

- [ ] **Step 5: Commit**

```bash
git add -A public/images/products
git commit -m "chore: drop unused product images"
```
