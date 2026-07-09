// Server-side queries για το storefront. Όλα με anon key + RLS,
// άρα επιστρέφουν ΜΟΝΟ active προϊόντα στο κοινό.
import { createClient } from '@/lib/supabase/server';
import type { Category, ProductWithRelations } from '@/lib/types';

const PRODUCT_SELECT =
  '*, category:categories(*), product_variants(*), product_images(*)';

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('position');
  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data;
}

/** Υποκατηγορίες μιας γονικής κατηγορίας (π.χ. Δίδυμα κάτω από Παιδικά). */
export async function getChildCategories(
  parentId: string,
): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('position');
  return data ?? [];
}

/** Ενεργά προϊόντα σε πολλές κατηγορίες (γονική + υποκατηγορίες μαζί). */
export async function getActiveProductsInCategories(
  categoryIds: string[],
): Promise<ProductWithRelations[]> {
  if (categoryIds.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .in('category_id', categoryIds)
    .order('created_at', { ascending: false });
  return (data as unknown as ProductWithRelations[]) ?? [];
}

export async function getActiveProducts(
  categoryId?: string,
): Promise<ProductWithRelations[]> {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (categoryId) query = query.eq('category_id', categoryId);

  const { data } = await query;
  return (data as unknown as ProductWithRelations[]) ?? [];
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();
  return data as unknown as ProductWithRelations | null;
}

export async function searchProducts(
  term: string,
): Promise<ProductWithRelations[]> {
  const supabase = createClient();
  const safe = term.replace(/[%_,]/g, ' ').trim();
  if (!safe) return [];
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .or(`name.ilike.%${safe}%,description.ilike.%${safe}%`)
    .order('created_at', { ascending: false });
  return (data as unknown as ProductWithRelations[]) ?? [];
}
