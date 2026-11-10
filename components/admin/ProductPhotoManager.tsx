'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { PRODUCTS } from '@/data/products';
import { EQUIPMENT_PRODUCTS } from '@/data/equipment';
import { useRefreshProductImages } from '@/context/ProductImageContext';

const catalog = [...PRODUCTS, ...EQUIPMENT_PRODUCTS].sort((a, b) => a.name.localeCompare(b.name));

export function ProductPhotoManager() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [query, setQuery] = useState('');
  const [productId, setProductId] = useState(catalog[0]?.id ?? '');
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const refreshImages = useRefreshProductImages();

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/admin/session', { cache: 'no-store' }).then((response) => response.json()),
      fetch('/api/product-images', { cache: 'no-store' }).then((response) => response.json()),
    ]).then(([session, images]) => {
      if (!active) return;
      setAuthenticated(Boolean(session.authenticated));
      setImageOverrides(images as Record<string, string>);
    }).catch(() => { if (active) setAuthenticated(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? catalog.filter((item) => item.name.toLowerCase().includes(normalized)) : catalog;
  }, [query]);

  // Keep the stored selection aligned with the visible list so a later filter
  // change cannot silently target a product the user is not looking at.
  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((item) => item.id === productId)) {
      setProductId(filtered[0].id);
      setFile(null);
    }
  }, [filtered, productId]);

  // Keep the upload target in sync with the visible, filtered options.
  const product = filtered.find((item) => item.id === productId) ?? filtered[0];
  const selectedProductId = product?.id ?? '';
  const currentImage = product ? imageOverrides[product.id] ?? product.images[0] : '';

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not sign in.');
      setAuthenticated(true); setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not sign in.');
    } finally { setBusy(false); }
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !product) { setMessage('Choose a photo first.'); return; }
    setBusy(true); setMessage('Uploading photo…');
    try {
      const form = new FormData(); form.set('productId', product.id); form.set('photo', file);
      const response = await fetch('/api/admin/product-images', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Upload failed.');
      setImageOverrides((current) => ({ ...current, [product.id]: result.imageUrl }));
      await refreshImages(true);
      setFile(null);
      setMessage(`Photo updated for ${product.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally { setBusy(false); }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  }

  if (authenticated === null) {
    return (
      <main className="sheet-light">
        <p className="container py-24 text-muted">Loading photo manager…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="sheet-light">
        <div className="container flex min-h-[70vh] max-w-3xl items-center py-16">
          <form onSubmit={login} className="w-full border border-rule-2 p-7 sm:p-10">
            <p className="font-outlier text-xs text-muted">Store management</p>
            <h1 className="mt-3 text-3xl text-ink">Product photos</h1>
            <p className="mt-3 text-sm leading-6 text-ink-2">Sign in to replace a product or equipment photo.</p>
            <label htmlFor="admin-password" className="label mt-7 block">Admin password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input mt-2"
            />
            {message && <p role="alert" className="mt-3 text-sm text-error">{message}</p>}
            <button disabled={busy} className="btn mt-5 w-full">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="sheet-light">
      <div className="container py-12 sm:py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-rule pb-7">
          <div>
            <p className="font-outlier text-xs text-muted">Store management</p>
            <h1 className="mt-3 text-3xl text-ink sm:text-4xl">Product photos</h1>
            <p className="mt-3 text-sm text-ink-2">Replace the image shown on product cards and detail pages.</p>
          </div>
          <button type="button" onClick={logout} className="btn btn--quiet btn--sm">Sign out</button>
        </div>

        <form onSubmit={upload} className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <label htmlFor="product-search" className="label block">Find a product</label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product name"
              className="input mt-2"
            />

            <label htmlFor="product-choice" className="label mt-5 block">Catalog item</label>
            <select
              id="product-choice"
              value={selectedProductId}
              onChange={(event) => { setProductId(event.target.value); setFile(null); setMessage(''); }}
              size={Math.min(9, Math.max(filtered.length, 3))}
              className="input mt-2 h-auto max-h-80 p-1"
            >
              {filtered.map((item) => <option key={item.id} value={item.id} className="px-2 py-2">{item.name}</option>)}
            </select>

            <label htmlFor="photo-file" className="label mt-6 block">New photo</label>
            <input
              id="photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => { setFile(event.target.files?.[0] ?? null); setMessage(''); }}
              className="mt-2 block w-full text-sm text-ink-2 file:mr-4 file:min-h-11 file:border-0 file:bg-paper-3 file:px-4 file:font-medium file:text-ink"
            />
            <p className="mt-2 text-xs leading-5 text-muted">JPG, PNG, or WebP. Maximum 4 MB.</p>
            {message && <p role="status" className="mt-4 text-sm text-ink-2">{message}</p>}
            <button disabled={busy || !file || !product} className="btn mt-5 w-full">
              {busy ? 'Uploading…' : 'Save new photo'}
            </button>
          </div>

          <div>
            <p className="label">{file ? 'New photo preview' : 'Current photo'}</p>
            <div className="plate mt-2 aspect-square">
              {preview ? (
                <img src={preview} alt={product?.name ?? 'Product photo'} className="h-full w-full object-contain p-5" />
              ) : currentImage ? (
                <Image src={currentImage} alt={product?.name ?? 'Product photo'} fill sizes="(min-width: 768px) 400px, 100vw" className="object-contain p-5" unoptimized={currentImage.startsWith('http')} />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-sm text-muted">No photo selected</span>
              )}
            </div>
            {product && <p className="mt-3 text-sm text-ink-2">Selected: <span className="font-medium text-ink">{product.name}</span></p>}
          </div>
        </form>
      </div>
    </main>
  );
}
