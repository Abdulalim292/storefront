import fs from 'node:fs';
import path from 'node:path';

export const CATALOG_PATH = path.join(process.cwd(), 'data', 'catalog.json');
const IMAGE_ROOT = path.join(process.cwd(), 'public', 'images', 'products');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export function readCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

export function writeCatalog(catalog) {
  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
}

function extensionFor(url) {
  const extension = path.extname(new URL(url).pathname).toLowerCase();
  return EXTENSIONS.has(extension) ? extension : '.jpg';
}

export function localImagePath(productId, index, url) {
  return `/images/products/${productId}-${index}${extensionFor(url)}`;
}

function absoluteImagePath(localPath) {
  return path.join(IMAGE_ROOT, path.basename(localPath));
}

export async function downloadImage(url, localPath) {
  const target = absoluteImagePath(localPath);

  if (fs.existsSync(target)) {
    console.log(`Skipping ${localPath} (already exists).`);
    return true;
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) {
      throw new Error(`unexpected content type ${contentType || '(none)'}`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length === 0) throw new Error('empty response');

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
    console.log(`Downloaded ${localPath}`);
    return true;
  } catch (error) {
    console.error(`Failed ${url}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}
