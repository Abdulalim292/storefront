// Sourcing and layout for product imagery.
//   node scripts/product-images.mjs plan      → data/image-manifest.json (products without a photograph)
//   node scripts/product-images.mjs curated   → download + apply data/curated-sources.json
//   node scripts/product-images.mjs plates    → render a typographic plate for every manifest product
//   node scripts/product-images.mjs verify    → fail if any part image is missing, remote or miscredited
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

export function validateCurated(entries, productIds) {
  const known = new Set(productIds);
  for (const entry of entries) {
    if (!known.has(entry.productId)) throw new Error(`curated entry for unknown product ${entry.productId}`);
    if (!entry.file) throw new Error(`curated entry ${entry.productId} is missing a file`);
    if (!entry.credit || !entry.license || !entry.licenseUrl) {
      throw new Error(`curated entry ${entry.productId} is missing a licence, credit or licence link`);
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
    if (other && !DUPES.has(product.name)) {
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
    return { id, name: product.name, category: product.category };
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

    // A plate already exists for this id: replace it rather than stamp "curated" metadata
    // onto generated art.
    const stalePlate = !product.images[0]?.startsWith('/images/products/') || product.imageSourceUrl === '';
    if (!fs.existsSync(target) || stalePlate) {
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

function glyph(category) {
  const ink = 'fill="none" stroke="#4a5551" stroke-width="6" stroke-linecap="round"';
  if (category === 'gearbox-parts') {
    return `<g ${ink}><circle cx="500" cy="770" r="58"/><circle cx="500" cy="770" r="22"/>${Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return `<line x1="${500 + Math.cos(a) * 62}" y1="${770 + Math.sin(a) * 62}" x2="${500 + Math.cos(a) * 86}" y2="${770 + Math.sin(a) * 86}"/>`;
    }).join('')}</g>`;
  }
  if (category === 'turbocharging') {
    return `<g ${ink}><circle cx="500" cy="770" r="62"/><path d="M500 708 C536 740 536 800 500 832"/><path d="M470 740 C510 750 530 780 500 806"/></g>`;
  }
  if (category === 'fuel-system' || category === 'cooling-system') {
    return `<g ${ink}><path d="M470 712 L530 712 L500 760 Z"/><path d="M500 760 L500 786"/><path d="M470 800 C470 826 500 846 500 846 C500 846 530 826 530 800 C530 786 470 786 470 800 Z"/></g>`;
  }
  if (category === 'heavy-equipment-parts') {
    return `<g ${ink}><rect x="404" y="742" width="192" height="56" rx="28"/><circle cx="452" cy="770" r="16"/><circle cx="500" cy="770" r="16"/><circle cx="548" cy="770" r="16"/></g>`;
  }
  // engine, cylinder, pistons and valve train share the piston glyph
  return `<g ${ink}><rect x="452" y="706" width="96" height="86" rx="8"/><line x1="462" y1="742" x2="538" y2="742"/><line x1="462" y1="760" x2="538" y2="760"/><path d="M500 792 L500 846"/><circle cx="500" cy="852" r="12"/></g>`;
}

function wrap(name, max = 16) {
  const lines = [];
  let line = '';
  for (const word of name.split(' ')) {
    if (line && `${line} ${word}`.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function plateSvg({ name, category }) {
  const label = escapeXml(category.replaceAll('-', ' ').toUpperCase());
  const lines = wrap(escapeXml(name));
  const fontSize = lines.length > 2 ? 72 : 86;
  const top = 470 - ((lines.length - 1) * fontSize * 0.58) / 1;
  const text = lines
    .map((line, i) => `<text x="500" y="${top + i * fontSize * 1.18}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${fontSize}" font-weight="600" fill="#1f2a26">${line}</text>`)
    .join('');
  // White ground, not the plate tone: `.plate img` multiplies, so white lets the sheet's own
  // tone through and the plate has no visible inner rectangle on any surface.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
<rect width="1000" height="1000" fill="#ffffff"/>
<rect x="40" y="40" width="920" height="920" fill="none" stroke="#1f2a26" stroke-opacity="0.22" stroke-width="1.5"/>
<text x="500" y="210" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="26" letter-spacing="7" fill="#4a5551">${label}</text>
<line x1="330" y1="246" x2="670" y2="246" stroke="#1f2a26" stroke-opacity="0.18" stroke-width="1.5"/>
${text}
${glyph(category)}
<text x="500" y="920" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="20" letter-spacing="4" fill="#6a7570">ILLUSTRATION</text>
</svg>`;
}

async function plates() {
  const catalog = readCatalog();
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const byId = new Map(catalog.products.map((product) => [product.id, product]));

  let rendered = 0;
  for (const entry of manifest) {
    const product = byId.get(entry.id);
    if (!product || product.imageSourceUrl !== '') continue;
    const localPath = `/images/products/${entry.id}-0.webp`;
    const svg = Buffer.from(plateSvg(entry));
    await sharp(svg).webp({ quality: 88 }).toFile(path.join(IMAGE_ROOT, `${entry.id}-0.webp`));
    applyGenerated(product, localPath);
    rendered += 1;
  }

  writeCatalog(catalog);
  console.log(`Rendered ${rendered} part plates.`);
}

async function verify() {
  const catalog = readCatalog();
  verifyCatalog(catalog.products, (absolutePath) => fs.existsSync(absolutePath));

  for (const product of partProducts(catalog)) {
    if (product.imageSourceUrl === '') {
      if (product.imageCredit !== GENERATED_CREDIT || product.imageLicense || product.imageLicenseUrl) {
        throw new Error(`plate ${product.id} has photograph credits: ${product.imageCredit}`);
      }
    } else if (!product.imageLicense || !product.imageCredit) {
      throw new Error(`photograph ${product.id} has no licence or credit`);
    }
  }

  console.log('Catalog images verified.');
}

if (import.meta.main) {
  const command = process.argv[2];
  if (command === 'plan') await plan();
  else if (command === 'curated') await curated();
  else if (command === 'plates') await plates();
  else if (command === 'verify') await verify();
  else {
    console.error('Usage: node scripts/product-images.mjs <plan|curated|plates|verify>');
    process.exitCode = 1;
  }
}
