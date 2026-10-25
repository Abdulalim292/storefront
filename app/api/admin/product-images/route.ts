import { NextResponse } from 'next/server';
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

function validDimensions(width: number, height: number) {
  return Number.isInteger(width) && Number.isInteger(height)
    && width > 0 && height > 0
    && width <= MAX_DIMENSION && height <= MAX_DIMENSION;
}

// The declared MIME type is client-controlled, so confirm the leading bytes
// really describe one of the three formats we accept and that the header
// carries plausible image dimensions.
async function detectImage(file: File): Promise<DetectedImage | null> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xff) return null;
      const marker = bytes[offset + 1];
      if (marker === 0xff) {
        offset += 1;
        continue;
      }
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
        offset += 2;
        continue;
      }
      if (marker === 0xd9 || marker === 0xda) return null;

      const length = view.getUint16(offset + 2);
      if (length < 2 || offset + 2 + length > bytes.length) return null;

      const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf
        && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isStartOfFrame) {
        if (offset + 9 > bytes.length) return null;
        const height = view.getUint16(offset + 5);
        const width = view.getUint16(offset + 7);
        return validDimensions(width, height)
          ? { type: 'image/jpeg', extension: 'jpg', width, height }
          : null;
      }

      offset += 2 + length;
    }
    return null;
  }

  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 33 && png.every((byte, index) => bytes[index] === byte)) {
    if (bytes[12] !== 0x49 || bytes[13] !== 0x48 || bytes[14] !== 0x44 || bytes[15] !== 0x52) return null;
    const width = view.getUint32(16);
    const height = view.getUint32(20);
    return validDimensions(width, height)
      ? { type: 'image/png', extension: 'png', width, height }
      : null;
  }

  const riff = [0x52, 0x49, 0x46, 0x46];
  const webp = [0x57, 0x45, 0x42, 0x50];
  if (
    bytes.length >= 30
    && riff.every((byte, index) => bytes[index] === byte)
    && webp.every((byte, index) => bytes[index + 8] === byte)
  ) {
    const chunk = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);

    if (chunk === 'VP8 ' && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
      const width = view.getUint16(26, true) & 0x3fff;
      const height = view.getUint16(28, true) & 0x3fff;
      return validDimensions(width, height)
        ? { type: 'image/webp', extension: 'webp', width, height }
        : null;
    }

    if (chunk === 'VP8L' && bytes[20] === 0x2f) {
      const bits = view.getUint32(21, true);
      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      return validDimensions(width, height)
        ? { type: 'image/webp', extension: 'webp', width, height }
        : null;
    }

    if (chunk === 'VP8X') {
      const width = (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1;
      const height = (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1;
      return validDimensions(width, height)
        ? { type: 'image/webp', extension: 'webp', width, height }
        : null;
    }
  }

  return null;
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
