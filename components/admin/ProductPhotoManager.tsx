'use client';

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

  if (authenticated === null) return <main className="mx-auto max-w-5xl px-5 py-24 text-[#59615c]">Loading photo manager…</main>;

  if (!authenticated) return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-5 py-16">
      <form onSubmit={login} className="w-full border border-[#dfddd5] bg-white p-7 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#8b806b]">Store management</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#17221f]">Product photos</h1>
        <p className="mt-3 text-sm leading-6 text-[#59615c]">Sign in to replace a product or equipment photo.</p>
        <label htmlFor="admin-password" className="mt-7 block text-sm font-medium text-[#17221f]">Admin password</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full border border-[#c9c8be] bg-[#f8f7f3] px-3 outline-none focus:border-[#8b806b]" />
        {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
        <button disabled={busy} className="mt-5 min-h-12 w-full bg-[#17221f] px-5 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#dfddd5] pb-7">
        <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#8b806b]">Store management</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#17221f] sm:text-4xl">Product photos</h1><p className="mt-3 text-sm text-[#59615c]">Replace the image shown on product cards and detail pages.</p></div>
        <button type="button" onClick={logout} className="min-h-10 border border-[#c9c8be] px-4 text-sm font-medium text-[#17221f] hover:bg-[#eeece5]">Sign out</button>
      </div>

      <form onSubmit={upload} className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <label htmlFor="product-search" className="block text-sm font-medium text-[#17221f]">Find a product</label>
          <input id="product-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product name" className="mt-2 min-h-12 w-full border border-[#c9c8be] bg-white px-3 outline-none focus:border-[#8b806b]" />
          <label htmlFor="product-choice" className="mt-5 block text-sm font-medium text-[#17221f]">Catalog item</label>
          <select id="product-choice" value={selectedProductId} onChange={(event) => { setProductId(event.target.value); setFile(null); setMessage(''); }} size={Math.min(9, Math.max(filtered.length, 3))} className="mt-2 max-h-80 w-full border border-[#c9c8be] bg-white p-1 text-sm text-[#17221f]">
            {filtered.map((item) => <option key={item.id} value={item.id} className="px-2 py-2">{item.name}</option>)}
          </select>
          <label htmlFor="photo-file" className="mt-6 block text-sm font-medium text-[#17221f]">New photo</label>
          <input id="photo-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setMessage(''); }} className="mt-2 block w-full text-sm text-[#59615c] file:mr-4 file:min-h-11 file:border-0 file:bg-[#eeece5] file:px-4 file:font-medium" />
          <p className="mt-2 text-xs leading-5 text-[#777b72]">JPG, PNG, or WebP. Maximum 4 MB.</p>
          {message && <p role="status" className="mt-4 text-sm text-[#59615c]">{message}</p>}
          <button disabled={busy || !file || !product} className="mt-5 min-h-12 w-full bg-[#17221f] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Uploading…' : 'Save new photo'}</button>
        </div>
        <div>
          <p className="text-sm font-medium text-[#17221f]">{file ? 'New photo preview' : 'Current photo'}</p>
          <div className="mt-2 grid aspect-square place-items-center overflow-hidden border border-[#dfddd5] bg-[#eeece5]">
            {(preview || currentImage) ? <img src={preview || currentImage} alt={product?.name ?? 'Product photo'} className="h-full w-full object-contain p-5" /> : <span className="text-sm text-[#777b72]">No photo selected</span>}
          </div>
          {product && <p className="mt-3 text-sm text-[#59615c]">Selected: <span className="font-medium text-[#17221f]">{product.name}</span></p>}
        </div>
      </form>
    </main>
  );
}
