-- ============================================================
-- Τραντισιοναλ e-shop — Initial schema
-- Τρέξε το ΟΛΟ σε: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "pgcrypto";

-- ---------- ADMIN HELPER ----------
-- Πίνακας με τους admins. Μετά τη δημιουργία του auth user
-- (traditional@gmail.com), θα προσθέσεις το user_id του εδώ (βλ. οδηγίες).
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Μόνο ένας admin μπορεί να δει ποιοι είναι admins.
create policy "admins can read admins"
  on public.admins for select
  using (auth.uid() = user_id);

-- Helper: είναι ο τρέχων χρήστης admin;
-- SECURITY DEFINER ώστε να διαβάζει τον πίνακα admins μέσα από RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- CATEGORIES ----------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position int not null default 0
);

alter table public.categories enable row level security;

create policy "public read categories"
  on public.categories for select
  using (true);

create policy "admin writes categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Οι 4 σταθερές κατηγορίες (ΔΕΝ είναι προϊόντα — προϊόντα θα προσθέσεις
-- εσύ από το /admin).
insert into public.categories (name, slug, position) values
  ('T-Shirts', 't-shirts', 1),
  ('Φούτερ', 'hoodies', 2),
  ('Καπέλα', 'hats', 3),
  ('Κάλτσες', 'socks', 4);

-- ---------- PRODUCTS ----------
create type public.product_status as enum ('draft', 'active');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category_id uuid not null references public.categories (id),
  -- Τελική τιμή σε λεπτά (cents), ΜΕ ΦΠΑ 24% (π.χ. 2490 = 24,90 €)
  price_cents int not null check (price_cents >= 0),
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_status_idx on public.products (status);

alter table public.products enable row level security;

create policy "public read active products"
  on public.products for select
  using (status = 'active' or public.is_admin());

create policy "admin writes products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- PRODUCT VARIANTS ----------
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  -- π.χ. size: 'S','M','L','XL' ή 'One Size' | color: 'Μαύρο','Μπεζ','Λευκό'
  size text not null,
  color text not null,
  stock int not null default 0 check (stock >= 0),
  sku text,
  unique (product_id, size, color)
);

create index variants_product_idx on public.product_variants (product_id);

alter table public.product_variants enable row level security;

create policy "public read variants of active products"
  on public.product_variants for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'active'
    )
  );

create policy "admin writes variants"
  on public.product_variants for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- PRODUCT IMAGES ----------
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  -- path μέσα στο bucket 'product-images', π.χ. '<product_id>/main.jpg'
  storage_path text not null,
  alt text not null default '',
  position int not null default 0
);

create index images_product_idx on public.product_images (product_id);

alter table public.product_images enable row level security;

create policy "public read images of active products"
  on public.product_images for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'active'
    )
  );

create policy "admin writes images"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- ORDERS ----------
create type public.order_status as enum ('pending', 'paid', 'shipped', 'delivered');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  -- Idempotency: το webhook του Stripe μπορεί να ξανασταλεί —
  -- το unique constraint εμποδίζει διπλές παραγγελίες.
  stripe_session_id text not null unique,
  email text not null,
  customer_name text not null default '',
  shipping_address jsonb not null default '{}'::jsonb,
  amount_cents int not null check (amount_cents >= 0),
  currency text not null default 'eur',
  status public.order_status not null default 'paid',
  created_at timestamptz not null default now()
);

create index orders_created_idx on public.orders (created_at desc);
create index orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

-- Παραγγελίες: ΜΟΝΟ ο admin τις βλέπει/ενημερώνει.
-- (Το webhook γράφει με service_role key, που παρακάμπτει το RLS.)
create policy "admin reads orders"
  on public.orders for select
  using (public.is_admin());

create policy "admin updates orders"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- ORDER ITEMS ----------
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  -- Snapshot τη στιγμή της αγοράς (μένει σωστό ακόμα κι αν αλλάξει το προϊόν)
  product_name text not null,
  size text not null,
  color text not null,
  unit_price_cents int not null check (unit_price_cents >= 0),
  quantity int not null check (quantity > 0)
);

create index order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "admin reads order items"
  on public.order_items for select
  using (public.is_admin());

-- ---------- ATOMIC STOCK DECREMENT ----------
-- Καλείται από το Stripe webhook (service role). Ατομική μείωση,
-- δεν αφήνει το stock να πέσει κάτω από 0 (GREATEST).
create or replace function public.decrement_stock(p_variant_id uuid, p_qty int)
returns void
language sql
security definer
set search_path = public
as $$
  update public.product_variants
  set stock = greatest(stock - p_qty, 0)
  where id = p_variant_id;
$$;

-- Μόνο ο service role να μπορεί να την καλέσει (όχι anon/authenticated).
revoke execute on function public.decrement_stock(uuid, int) from public, anon, authenticated;

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- STORAGE: bucket για εικόνες προϊόντων ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read (το bucket είναι public, αλλά βάζουμε και ρητό policy)
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Upload/αλλαγή/διαγραφή εικόνων: μόνο admin
create policy "admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
