const BUCKET = 'product-images';

function config() {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !key) throw new Error('Supabase image storage is not configured.');
  return { baseUrl, key };
}

function publicUrlPrefix(baseUrl: string) {
  return `${baseUrl}/storage/v1/object/public/${BUCKET}/`;
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

async function deleteImageObjects(paths: string[]) {
  if (!paths.length) return;
  try {
    await supabaseRequest(`/storage/v1/object/${BUCKET}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefixes: paths }),
    });
  } catch {
    // Best effort: leaving an unused object behind is better than failing the upload.
  }
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

  // Remember the current photo so it can be removed after a successful replace.
  let previousPath: string | null = null;
  try {
    const existing = await supabaseRequest(
      `/rest/v1/product_images?select=image_url&product_id=eq.${encodeURIComponent(productId)}`,
    );
    if (existing.ok) {
      const rows = await existing.json() as { image_url: string }[];
      const previousUrl = rows[0]?.image_url;
      const prefix = publicUrlPrefix(baseUrl);
      if (previousUrl?.startsWith(prefix)) {
        const candidate = decodeURIComponent(previousUrl.slice(prefix.length));
        if (candidate.startsWith(`${productId}/`)) previousPath = candidate;
      }
    }
  } catch {
    // A failed lookup must not block the upload; the old file will simply remain.
  }

  const upload = await supabaseRequest(`/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': image.type, 'x-upsert': 'false' },
    body: image,
  });
  if (!upload.ok) throw new Error(`Photo upload failed (${upload.status}).`);

  const imageUrl = `${publicUrlPrefix(baseUrl)}${path}`;
  const save = await supabaseRequest('/rest/v1/product_images?on_conflict=product_id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ product_id: productId, image_url: imageUrl, updated_at: new Date().toISOString() }),
  });
  if (!save.ok) {
    await deleteImageObjects([path]);
    throw new Error(`Photo uploaded but could not update the catalog (${save.status}).`);
  }

  if (previousPath && previousPath !== path) {
    await deleteImageObjects([previousPath]);
  }

  return imageUrl;
}
