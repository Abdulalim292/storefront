-- Storefront inquiries submitted from the contact form and inquiry list.
-- Run this once in the Supabase SQL editor for the project used by the site.
-- The site writes with the service role key, which bypasses RLS. No public
-- policies are created, so browsers cannot read or write this table directly.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  equipment_model text,
  message text not null,
  items jsonb not null default '[]'::jsonb,
  source text not null default 'contact',
  status text not null default 'new'
);

alter table public.inquiries enable row level security;

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_status_idx
  on public.inquiries (status);
