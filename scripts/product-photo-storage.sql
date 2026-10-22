-- Run this once in the Supabase SQL Editor for the photo manager.
create table if not exists public.product_images (
  product_id text primary key,
  image_url text not null,
  updated_at timestamptz not null default now()
);

alter table public.product_images enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 4194304, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
