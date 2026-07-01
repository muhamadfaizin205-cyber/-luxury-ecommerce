-- ══════════════════════════════════════════════════════════════
-- LUX E — Supabase Database Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ══════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── users ──────────────────────────────────────────────────────
-- Extends Supabase auth.users with profile data
create table if not exists public.users (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text unique not null,
  full_name        text,
  shipping_address text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-create profile row when user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── products ───────────────────────────────────────────────────
create table if not exists public.products (
  id          bigserial primary key,
  title       text        not null,
  description text,
  price       numeric(12,2) not null,
  category    text,
  images      text[]      not null default '{}',
  tags        text[]      not null default '{}',
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_products_category  on public.products(category);
create index if not exists idx_products_is_active on public.products(is_active);

-- ── product_variants ───────────────────────────────────────────
create table if not exists public.product_variants (
  id         bigserial primary key,
  product_id bigint      not null references public.products(id) on delete cascade,
  size       text,
  color      text,
  stock      integer     not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_variants_product on public.product_variants(product_id);

-- ── cart_items ─────────────────────────────────────────────────
create table if not exists public.cart_items (
  id         bigserial primary key,
  user_id    uuid        not null references public.users(id) on delete cascade,
  product_id bigint      not null references public.products(id) on delete cascade,
  variant_id bigint      references public.product_variants(id) on delete set null,
  quantity   integer     not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, variant_id)
);

create index if not exists idx_cart_user    on public.cart_items(user_id);
create index if not exists idx_cart_product on public.cart_items(product_id);

-- ── Row Level Security ─────────────────────────────────────────
alter table public.users          enable row level security;
alter table public.products       enable row level security;
alter table public.product_variants enable row level security;
alter table public.cart_items     enable row level security;

-- Users: only own profile
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Products: public read
create policy "Products are publicly readable"
  on public.products for select
  using (is_active = true);

-- Variants: public read
create policy "Variants are publicly readable"
  on public.product_variants for select
  using (true);

-- Cart: only own items
create policy "Users can view own cart"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own cart"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cart"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own cart"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- ── Seed data ──────────────────────────────────────────────────
insert into public.products (title, description, price, category, images, tags) values
(
  'Atasan Rajut Lengan Panjang',
  'Rajutan waffle premium dengan siluet santai. Terbuat dari campuran katun pilihan.',
  1250000,
  'Rajutan',
  array[
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
  ],
  array['Eksklusif Pra-Peluncuran', 'Baru']
),
(
  'Tas Tote Kulit Terstruktur',
  'Tas tote dari kulit sapi asli dengan jahitan tangan pengrajin lokal terpilih.',
  4800000,
  'Tas Tangan',
  array[
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
  ],
  array['Edisi Terbatas']
),
(
  'Celana Kargo Teknikal',
  'Celana kargo dengan bahan teknikal ringan. Cocok untuk gaya urban aktif.',
  2100000,
  'Pakaian',
  array[
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'
  ],
  array[]::text[]
),
(
  'Turtleneck Kasmir Berribut',
  '100% kasmir merino dari pegunungan Italia. Sentuhan lembut yang tak tertandingi.',
  3400000,
  'Rajutan',
  array[
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop'
  ],
  array['Buatan Italia']
)
on conflict do nothing;

-- Insert variants for each product
insert into public.product_variants (product_id, size, color, stock)
select p.id, v.size, v.color, floor(random() * 50 + 5)::int
from public.products p
cross join (
  values
    ('XS', 'Hitam'), ('S', 'Hitam'), ('M', 'Hitam'), ('L', 'Hitam'), ('XL', 'Hitam'),
    ('S', 'Karamel'), ('M', 'Karamel'), ('L', 'Karamel'),
    ('S', 'Gading'),  ('M', 'Gading'),  ('L', 'Gading')
) as v(size, color)
on conflict do nothing;
