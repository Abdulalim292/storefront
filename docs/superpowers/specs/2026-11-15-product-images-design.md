# Product imagery: real where verifiable, generated where not

## Intent

Today 313 part-type entries share 46 photographs and one of them — a ZF transmission
housing — is the picture for 168 different products. A shop that sells gearbox internals
shows the same gearbox for a clutch pack, a shift rail and a sun gear. The goal is that
every product shows a recognisably correct part of that kind, and that no two neighbouring
products on a category page look identical.

Accuracy is the first priority: a real photograph of the right kind of part beats a
generated one. Where no verifiable real photograph exists, a generated image is acceptable.

## What is true today

- `data/catalog.json` holds 333 entries. 20 are `equipment` (Cummins KTA19, Weichai WP10,
  Fada FD170 …) with a distinct real manufacturer photo each. **These 20 are out of scope
  and are not touched.**
- The remaining 313 are generic part *types* — "Input Shaft", "Clutch Pack", "Sun Gear" —
  with one boilerplate description, no part numbers and no brand. "Correct" therefore means
  *recognisably the right kind of part*, not *this exact SKU*.
- Images are remote hotlinks from 15 hosts, overwhelmingly Wikimedia Commons, each with
  `imageSourceUrl` / `imageCredit` / `imageLicense` / `imageLicenseUrl` recorded and shown
  on `/image-credits`.
- Rendering goes through `components/ui/ResilientImage.tsx` → `next/image`. Wikimedia URLs
  are rendered `unoptimized`; local paths would be optimised normally.
- `lib/product-image-storage.ts` already supports per-product photo overrides from Supabase
  `product_images`, surfaced at `/admin/products`. Nothing in this design depends on it.
- `public/images/products/` exists and holds 38 files (`image-1.jpg` … `image-38.webp`,
  6.3 MB) that **nothing references**.
- The UI desaturates plate images on hover (`filter: grayscale(1) contrast(1.14)`,
  `app/globals.css`), so every new image must stay readable in greyscale.

## Approaches considered

**A — Hybrid, verified where possible (chosen).** Human-verify real open-licensed photos for
the part types where a good one genuinely exists (estimated 50–70 of 313); generate the rest.
Most authentic outcome and the user's stated first priority. Cost: manual verification of
every sourced photograph.

**B — Generate all 313.** Uniform house style, zero licensing work, every product distinct.
Rejected only because it abandons real photography where it is available.

**C — Generate ~60 family images and reuse them.** Cheapest, but siblings within a family
still look alike, which is the complaint being fixed.

## Design

### 1. Sourcing passes

**Pass 1 — curated real photographs.** For each candidate part type, search Wikimedia Commons
and accept a file only if all of these hold:

- it is a photograph (bitmap, not SVG/PNG diagram, not a GIF or 3D render),
- it shows the named part type unambiguously and as the subject,
- it is one object or a clean arrangement, not a machine containing the part,
- its licence is CC0, public domain, CC BY, or CC BY-SA,
- the credit line and licence URL can be recorded.

A part type with no qualifying photograph falls through to pass 2. Roughly 50–70 are expected
to qualify (bearings, gears, liners, injectors, gaskets, track shoes, turbochargers). The
accepted list is a checked-in file of product id → Commons file title, so the choice is
reviewable rather than buried in code.

The curator's judgement *is* the verification. There is no approval gate between passes: the
run goes through in one go, and the accepted list is shown at the end alongside the result.
Commons is the only source; manufacturer and dealer catalogues are out.

Curated photographs keep their **native aspect**. Only the format is converted to WebP — no
cropping and no squaring, because squaring a CC BY-SA photo is a derivative that would have
to be declared. Product cards render with `fill`, so native aspect needs no layout change.
The credits page states once, in its intro, that photographs are shown converted to WebP and
otherwise unmodified.

**Pass 2 — a part plate per remaining product (amended 2026-11-16).** The harness image
generator turned out to be paid pay-as-you-go and the account balance was empty, so generation
was abandoned rather than left as a blocked step. Every remaining product gets a rendered
**part plate** instead: a square 1000x1000 SVG drawn by `scripts/product-images.mjs` and
converted to WebP, containing

- the part name, set large in DejaVu Sans — the site's display face is not installed where the
  plates are rendered, so DejaVu Sans is used,
- the category, small and letter-spaced, in the register's label voice,
- a simple line glyph for the category (gear for gearbox parts, piston for engine parts, track
  segment for heavy equipment, and so on),
- a hairline frame on a white ground (`#ffffff`), because `.plate img { mix-blend-mode: multiply }`
  in `app/base.css` would darken a plate-tone ground under the image.

No photograph, no AI, no outside service, nothing to license. The plate is obviously a
typographic record rather than a part, which is exactly what the "Illustrative image" label
says, so the label stays. Distinctness comes from the name and category line, so no two
products share a file.

### 2. Files and data

- Images live at `public/images/products/<product-id>-0.webp`, the path and naming already
  produced by `scripts/download-images.mjs` / `scripts/connect-images.mjs`, one per product,
  1000×1000 for plates and native aspect for curated photographs.
- `catalog.json` `images[0]` becomes that local path for every part product. The 20 equipment
  entries keep their remote URLs.
- Plate entries: `imageSourceUrl: ""`, `imageCredit: "Generated illustration"`,
  `imageLicense: ""`, `imageLicenseUrl: ""`.
- Curated entries keep source, credit, licence and licence URL exactly as they are today.
- The five part names that appear in two categories each (`Flywheel`, `Vibration Damper`,
  `Oil Filter`, `Oil Cooler`, `Hydraulic Pump`) may share one curated photograph; they are the
  same part type. Every other product gets its own file.
- Budget: plates are flat SVG-derived art, a few KB each, so the committed set is a couple of
  megabytes rather than the 45 MB a photographic set would have cost.

### 3. Honesty on the page

A generated picture must not read as the actual part. The product detail page shows a short
label — "Illustrative image; confirm the part against your engine or gearbox model" — when
the entry is generated. `imageSourceUrl === ''` is the test; no new field, no schema change,
and the same rule is reused by the credits page.

The label hides itself when the picture on screen is not the catalog picture. `CatalogImage`
resolves a per-product override from Supabase, so the test is "generated entry **and** the
rendered src is still `product.images[0]`". A product whose photo an admin replaced must not
carry a label describing a generated image it is no longer showing.

### 4. Credits page

`/image-credits` gains one short paragraph stating that generated illustrations are not
photographs of the actual part, and that real photographs are credited below. Generated
entries are excluded from the credit groups by the same `imageSourceUrl === ''` rule, so the
page lists only real photographers — currently it would list a photographer for 313 entries,
most of which will become generated.

### 5. Cleanup

- Delete the 38 unreferenced files in `public/images/products/` — the unused output of the
  earlier `download-images.mjs` run.
- `next.config.ts` `remotePatterns` is **left unchanged for this release**. Carts persist
  product snapshots in `localStorage`, so pruning the Wikimedia hosts would turn saved items
  from earlier visits into "Image unavailable". Pruning becomes a follow-up once those carts
  have aged out.
- The Wikimedia `unoptimized` special case in `ResilientImage` stays; equipment images and
  those older cart snapshots still use it.

## Non-goals

- No claim that a generated image matches a specific part number, brand or fitment.
- No sourcing from manufacturer or dealer catalogues; reuse rights cannot be established.
- No change to the 20 equipment images or their hosts.
- No Supabase migration; the override mechanism is left alone and keeps working, layered
  on top of these files as before.
- No art direction change to the site itself.

## Anti-goals

A generated image that looks like a different part (a gear where the name says bearing) is
worse than the shared stock photo it replaces. Where the part type is too obscure to depict
plausibly, the generator gets the generic-but-honest treatment: the right kind of metal part
with the correct silhouette, and the page's illustrative label does the rest. Two products
sharing a file is a failure, except the five same-name pairs listed above; the check below
enforces exactly that.

## Verification

- A script asserts: every part product's `images[0]` is a local path that exists on disk;
  no image file is used by two products except the five same-name pairs; the 20 equipment
  entries still point at their original remote URLs.
- Every generated entry has `imageSourceUrl: ""` and the "Generated illustration" credit;
  every curated entry still has a Commons source and a licence.
- `/image-credits` lists only entries with a real source. Every curated entry links to its
  licence; equipment entries carry their supplier listing as the source instead, since no
  licence applies to them.
- `npm run build` and `npm run lint` pass.
- Spot check: 10 random category pages render distinct, plausible images; the four
  highest-traffic part types (cylinder head gasket, track roller, input shaft, turbocharger
  cartridge) are read by eye.

## Left to the builder

- The exact prompt wording, and the per-part disambiguation lines for names that collide
  with other domains ("Shift Rail", "Separator Plate", "Clutch Pack").
- Which part types actually have a qualifying photograph, decided by looking at candidates,
  not by guessing from names.
- Where the curated list and the verification script live, and how generated images are
  encoded to WebP (sharp is available via `node_modules`).

## Left to the builder

- The exact prompt wording, and the per-part disambiguation lines for names that collide
  with other domains ("Shift Rail", "Separator Plate", "Clutch Pack").
- The curated pass-1 list: which part types actually have a qualifying photograph, decided
  by looking at candidates, not by guessing from names.
- Generation batching and retry policy when an image comes back wrong.
