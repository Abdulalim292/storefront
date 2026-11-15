// Sourcing and layout for product imagery.
//   node scripts/product-images.mjs plan      → data/image-manifest.json (what still needs generating)
//   node scripts/product-images.mjs curated   → download + apply data/curated-sources.json
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { readCatalog, writeCatalog, downloadImage } from './image-utils.mjs';

const IMAGE_ROOT = path.join(process.cwd(), 'public', 'images', 'products');
const CURATED_PATH = path.join(process.cwd(), 'data', 'curated-sources.json');
const MANIFEST_PATH = path.join(process.cwd(), 'data', 'image-manifest.json');

export const GENERATED_CREDIT = 'Generated illustration';

// Same part type listed under two categories may share one photograph.
const DUPES = new Set(['Flywheel', 'Vibration Damper', 'Oil Filter', 'Oil Cooler', 'Hydraulic Pump']);

const STYLE =
  'Isolated on a warm off-white seamless sweep, soft even studio light, engineering catalogue style, ' +
  'clean machined metal with visible detail, no text, no watermark, no branding, no hands, square 1:1.';

export function renderPrompt(product) {
  const category = product.category.replaceAll('-', ' ');
  return `Studio product photograph of a single ${category} part: ${product.name}. ${STYLE}`;
}

export function validateCurated(entries, productIds) {
  const known = new Set(productIds);
  for (const entry of entries) {
    if (!known.has(entry.productId)) throw new Error(`curated entry for unknown product ${entry.productId}`);
    if (!entry.file) throw new Error(`curated entry ${entry.productId} is missing a file`);
    if (!entry.credit || !entry.license) {
      throw new Error(`curated entry ${entry.productId} is missing a licence or credit`);
    }
  }
  return entries;
}

export function generatedIds(products, curatedIds) {
  return products.filter((product) => !curatedIds.has(product.id)).map((product) => product.id);
}

function readCurated() {
  if (!fs.existsSync(CURATED_PATH)) return [];
  return JSON.parse(fs.readFileSync(CURATED_PATH, 'utf8'));
}

function partProducts(catalog) {
  return catalog.products.filter((product) => product.category !== 'equipment');
}

function applyGenerated(product, localPath) {
  product.images = [localPath];
  product.imageSourceUrl = '';
  product.imageCredit = GENERATED_CREDIT;
  product.imageLicense = '';
  product.imageLicenseUrl = '';
}

export function verifyCatalog(products, exists) {
  const seen = new Map();
  for (const product of products) {
    if (product.category === 'equipment') continue;
    const src = product.images?.[0] ?? '';
    if (!src.startsWith('/images/products/')) {
      throw new Error(`remote part image ${product.id}: ${src || '(none)'}`);
    }
    if (!exists(path.join(process.cwd(), 'public', src))) {
      throw new Error(`missing image file for ${product.id}: ${src}`);
    }
    const other = seen.get(src);
    if (other && other.name !== product.name) {
      throw new Error(`image shared by ${other.id} and ${product.id}: ${src}`);
    }
    seen.set(src, product);
  }
}

async function convertToWebp(sourcePath, targetPath, { width, height, quality }) {
  const pipeline = sharp(sourcePath);
  if (width) pipeline.resize(width, height, { fit: 'cover' });
  await pipeline.webp({ quality }).toFile(targetPath);
}

async function plan() {
  const catalog = readCatalog();
  const curatedIds = new Set(readCurated().map((entry) => entry.productId));
  const needed = generatedIds(partProducts(catalog), curatedIds);
  const manifest = needed.map((id) => {
    const product = catalog.products.find((item) => item.id === id);
    return { id, name: product.name, category: product.category, prompt: renderPrompt(product) };
  });
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`${manifest.length} part products need a generated image.`);
  console.log(`Manifest: ${path.relative(process.cwd(), MANIFEST_PATH)}`);
}

async function curated() {
  const catalog = readCatalog();
  const entries = validateCurated(readCurated(), catalog.products.map((product) => product.id));
  const failed = [];
  let applied = 0;

  for (const entry of entries) {
    const product = catalog.products.find((item) => item.id === entry.productId);
    // Same shape localImagePath() produces, built directly because that helper needs a URL.
    const localPath = `/images/products/${entry.productId}-0.webp`;
    const target = path.join(IMAGE_ROOT, path.basename(localPath));

    if (!fs.existsSync(target)) {
      const downloadPath = `${localPath.slice(0, -'.webp'.length)}${path.extname(entry.file) || '.jpg'}`;
      const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(entry.file)}?width=1400`;
      if (!(await downloadImage(url, downloadPath))) {
        failed.push(entry.productId);
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Native aspect: only the format changes.
      await convertToWebp(path.join(IMAGE_ROOT, path.basename(downloadPath)), target, { quality: 82 });
      fs.rmSync(path.join(IMAGE_ROOT, path.basename(downloadPath)), { force: true });
    }

    product.images = [localPath];
    product.imageSourceUrl = `https://commons.wikimedia.org/wiki/File:${entry.file}`;
    product.imageCredit = entry.credit;
    product.imageLicense = entry.license;
    product.imageLicenseUrl = entry.licenseUrl;
    applied += 1;
  }

  writeCatalog(catalog);
  console.log(`Applied ${applied} curated photographs.`);
  if (failed.length) {
    console.error(`Failed: ${failed.join(', ')} — these fall through to generation.`);
    process.exitCode = 1;
  }
}

async function normalize() {
  const catalog = readCatalog();
  const parts = partProducts(catalog);
  const byId = new Map(parts.map((product) => [product.id, product]));
  const raw = fs
    .readdirSync(IMAGE_ROOT)
    .filter((name) => /\.(png|jpe?g)$/i.test(name))
    .map((name) => ({ name, id: name.replace(/-0\.(png|jpe?g)$/i, '') }))
    .filter(({ id, name }) => /-0\./i.test(name) && byId.has(id));

  let converted = 0;
  for (const { name, id } of raw) {
    const product = byId.get(id);
    if (product.imageSourceUrl !== '') continue; // a curated photograph owns this product

    const source = path.join(IMAGE_ROOT, name);
    const target = path.join(IMAGE_ROOT, `${id}-0.webp`);
    await convertToWebp(source, target, { width: 1000, height: 1000, quality: 78 });
    fs.rmSync(source, { force: true });
    applyGenerated(product, `/images/products/${id}-0.webp`);
    converted += 1;
  }

  writeCatalog(catalog);
  console.log(`Converted ${converted} generated images to WebP.`);
}

async function verify() {
  const catalog = readCatalog();
  verifyCatalog(catalog.products, (absolutePath) => fs.existsSync(absolutePath));
  const remaining = partProducts(catalog).filter((product) => !product.imageSourceUrl && !product.images[0]);
  if (remaining.length) throw new Error(`${remaining.length} part products have no image`);
  console.log('Catalog images verified.');
}

if (import.meta.main) {
  const command = process.argv[2];
  if (command === 'plan') await plan();
  else if (command === 'curated') await curated();
  else if (command === 'normalize') await normalize();
  else if (command === 'verify') await verify();
  else {
    console.error('Usage: node scripts/product-images.mjs <plan|curated|normalize|verify>');
    process.exitCode = 1;
  }
}
