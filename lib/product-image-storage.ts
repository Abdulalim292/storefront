function config() {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !key) throw new Error('Supabase image storage is not configured.');
  return { baseUrl, key };
}

async function supabaseRequest(path: string, init?: RequestInit) {
  const { baseUrl, key } = config();
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...init?.headers,
    },
    cache: 'no-store',
  });
}

export async function getProductImageOverrides(): Promise<Record<string, string>> {
  const response = await supabaseRequest('/rest/v1/product_images?select=product_id,image_url');
  if (!response.ok) throw new Error(`Could not load product photos (${response.status}).`);
  const rows = await response.json() as { product_id: string; image_url: string }[];
  return Object.fromEntries(rows.map((row) => [row.product_id, row.image_url]));
}

export async function saveProductImage(productId: string, image: File) {
  const { baseUrl } = config();
  const extension = image.type === 'image/png' ? 'png' : image.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${productId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const upload = await supabaseRequest(`/storage/v1/object/product-images/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': image.type, 'x-upsert': 'false' },
    body: image,
  });
  if (!upload.ok) throw new Error(`Photo upload failed (${upload.status}).`);

  const imageUrl = `${baseUrl}/storage/v1/object/public/product-images/${path}`;
  const save = await supabaseRequest('/rest/v1/product_images?on_conflict=product_id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ product_id: productId, image_url: imageUrl, updated_at: new Date().toISOString() }),
  });
  if (!save.ok) throw new Error(`Photo uploaded but could not update the catalog (${save.status}).`);
  return imageUrl;
}
