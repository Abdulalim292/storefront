import { NextResponse } from 'next/server';
import catalog from '@/data/catalog.json';
import { hasValidOrigin, isAdminRequest } from '@/lib/admin-auth';
import { saveProductImage } from '@/lib/product-image-storage';

export const runtime = 'nodejs';
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const PRODUCT_IDS = new Set(catalog.products.map((product) => product.id));

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 });
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  try {
    const form = await request.formData();
    const productId = String(form.get('productId') ?? '');
    const photo = form.get('photo');
    if (!PRODUCT_IDS.has(productId)) return NextResponse.json({ error: 'Choose a valid catalog item.' }, { status: 400 });
    if (!(photo instanceof File)) return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 });
    if (!ALLOWED_TYPES.has(photo.type)) return NextResponse.json({ error: 'Use a JPG, PNG, or WebP image.' }, { status: 400 });
    if (photo.size === 0 || photo.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Photo must be 4 MB or smaller.' }, { status: 400 });

    const imageUrl = await saveProductImage(productId, photo);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Photo upload failed.' }, { status: 503 });
  }
}
