-- ============================================================
-- 003 — Κατηγορία «Παιδικά» με υποκατηγορία «Δίδυμα»
-- Τρέξε το στο Supabase → SQL Editor.
-- ============================================================

-- Υποστήριξη υποκατηγοριών: parent_id που δείχνει σε άλλη κατηγορία.
alter table public.categories
  add column if not exists parent_id uuid references public.categories (id);

-- Γονική κατηγορία: Παιδικά
insert into public.categories (name, slug, position, parent_id)
values ('Παιδικά', 'kids', 5, null)
on conflict (slug) do nothing;

-- Υποκατηγορία: Δίδυμα (parent = Παιδικά)
insert into public.categories (name, slug, position, parent_id)
select 'Δίδυμα', 'twins', 1, c.id
from public.categories c
where c.slug = 'kids'
on conflict (slug) do nothing;
