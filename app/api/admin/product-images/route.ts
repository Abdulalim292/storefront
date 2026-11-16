import { NextResponse } from 'next/server';
import sharp from 'sharp';
import catalog from '@/data/catalog.json';
import { hasValidOrigin, isAdminRequest } from '@/lib/admin-auth';
import { saveProductImage } from '@/lib/product-image-storage';

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 256 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const PRODUCT_IDS = new Set(catalog.products.map((product) => product.id));
const NO_STORE = { 'Cache-Control': 'no-store' };

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

type DetectedImage = { type: string; extension: string; width: number; height: number };

const MAX_DIMENSION = 12_000;
const MAX_PIXELS = 40_000_000;
const IMAGE_FORMATS: Record<string, { type: string; extension: string }> = {
  jpeg: { type: 'image/jpeg', extension: 'jpg' },
  png: { type: 'image/png', extension: 'png' },
  webp: { type: 'image/webp', extension: 'webp' },
};

async function detectImage(file: File): Promise<DetectedImage | null> {
  const image = sharp(Buffer.from(await file.arrayBuffer()), {
    failOn: 'warning',
    limitInputPixels: MAX_PIXELS,
    animated: true,
  });
  const { format, width, height } = await image.metadata();
  const detected = format ? IMAGE_FORMATS[format] : undefined;
  if (!detected || !width || !height || width > MAX_DIMENSION || height > MAX_DIMENSION) return null;

  // Metadata alone accepts truncated images; stats decodes every input pixel.
  await image.stats();
  return { ...detected, width, height };
}

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return json({ error: 'Request not allowed.' }, 403);

  let authenticated = false;
  try {
    authenticated = await isAdminRequest();
  } catch (error) {
    console.error('Could not verify the admin session:', error);
    return json({ error: 'Admin access is temporarily unavailable.' }, 503);
  }
  if (!authenticated) return json({ error: 'Please sign in again.' }, 401);

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_SIZE) {
    return json({ error: 'Photo must be 4 MB or smaller.' }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Choose a photo to upload.' }, 400);
  }

  const productId = form.get('productId');
  const photo = form.get('photo');
  if (typeof productId !== 'string' || !PRODUCT_IDS.has(productId)) {
    return json({ error: 'Choose a valid catalog item.' }, 400);
  }
  if (!(photo instanceof File)) return json({ error: 'Choose a photo to upload.' }, 400);
  if (!ALLOWED_TYPES.has(photo.type)) return json({ error: 'Use a JPG, PNG, or WebP image.' }, 400);
  if (photo.size === 0 || photo.size > MAX_FILE_SIZE) {
    return json({ error: 'Photo must be 4 MB or smaller.' }, 400);
  }

  let detected: DetectedImage | null;
  try {
    detected = await detectImage(photo);
  } catch {
    return json({ error: 'Choose a valid JPG, PNG, or WebP image.' }, 400);
  }
  if (!detected || detected.type !== photo.type) {
    return json({ error: 'Choose a valid JPG, PNG, or WebP image.' }, 400);
  }

  try {
    // Rebuild the File so the storage layer only ever sees the filename and
    // content type derived on the server.
    const safePhoto = new File([photo], `upload.${detected.extension}`, { type: detected.type });
    const imageUrl = await saveProductImage(productId, safePhoto);
    return json({ imageUrl });
  } catch (error) {
    console.error('Product photo upload failed:', error);
    return json({ error: 'Photo upload failed. Please try again.' }, 503);
  }
}
