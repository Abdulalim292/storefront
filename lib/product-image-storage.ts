const BUCKET = 'product-images';
const OVERRIDES_TTL_MS = 60_000;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const SAFE_OBJECT_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/;

type OverrideCache = {
  value: Record<string, string>;
  expiresAt: number;
};

let overridesCache: OverrideCache | null = null;
let overridesInFlight: Promise<Record<string, string>> | null = null;

function config() {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !key) throw new Error('Supabase image storage is not configured.');
  return { baseUrl, key };
}

function publicUrlPrefix(baseUrl: string) {
  return `${baseUrl}/storage/v1/object/public/${BUCKET}/`;
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isSafeObjectPath(path: string) {
  return SAFE_OBJECT_PATH.test(path);
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
    redirect: 'error',
    cache: 'no-store',
    signal: init?.signal ?? AbortSignal.timeout(15_000),
  });
}

async function deleteImageObjects(paths: string[]) {
  const safePaths = paths.filter(isSafeObjectPath);
  if (!safePaths.length) return;
  try {
    await supabaseRequest(`/storage/v1/object/${BUCKET}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefixes: safePaths }),
    });
  } catch {
    // Best effort: leaving an unused object behind is better than failing the upload.
  }
}

export function invalidateProductImageOverrides() {
  overridesCache = null;
}

export async function getProductImageOverrides(): Promise<Record<string, string>> {
  const now = Date.now();
  if (overridesCache && overridesCache.expiresAt > now) return overridesCache.value;
  if (overridesInFlight) return overridesInFlight;

  let request: Promise<Record<string, string>>;
  request = (async () => {
    const response = await supabaseRequest('/rest/v1/product_images?select=product_id,image_url');
    if (!response.ok) throw new Error(`Could not load product photos (${response.status}).`);

    const rows: unknown = await response.json();
    const value: Record<string, string> = {};
    if (Array.isArray(rows)) {
      for (const row of rows) {
        if (!row || typeof row !== 'object') continue;
        const record = row as Record<string, unknown>;
        if (typeof record.product_id === 'string' && isHttpUrl(record.image_url)) {
          value[record.product_id] = record.image_url;
        }
      }
    }

    overridesCache = { value, expiresAt: Date.now() + OVERRIDES_TTL_MS };
    return value;
  })().finally(() => {
    if (overridesInFlight === request) overridesInFlight = null;
  });

  overridesInFlight = request;
  return request;
}

export async function saveProductImage(productId: string, image: File) {
  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    throw new Error('Unsupported photo type.');
  }

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
        try {
          const candidate = decodeURIComponent(previousUrl.slice(prefix.length));
          if (candidate.startsWith(`${productId}/`)) previousPath = candidate;
        } catch {
          // Ignore a malformed stored URL; the old object will simply remain.
        }
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

  invalidateProductImageOverrides();

  if (previousPath && previousPath !== path) {
    await deleteImageObjects([previousPath]);
  }

  return imageUrl;
}
