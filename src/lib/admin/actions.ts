'use server';

// Server Actions για το admin. Όλα περνούν από requireAdmin() και γράφουν
// με τον authenticated (admin) server client — το RLS επιβάλλει is_admin().
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from './auth';
import { slugify } from '@/lib/utils';

export interface VariantInput {
  id?: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductInput {
  id?: string;
  name: string;
  description: string;
  category_id: string;
  price_euros: number; // ο admin πληκτρολογεί ευρώ· μετατρέπουμε σε cents
  status: 'draft' | 'active';
  variants: VariantInput[];
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  productId?: string;
}

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  await requireAdmin();
  const supabase = createClient();

  // Validation
  if (!input.name.trim()) return { ok: false, error: 'Το όνομα είναι υποχρεωτικό.' };
  if (!input.category_id) return { ok: false, error: 'Διάλεξε κατηγορία.' };
  if (!(input.price_euros > 0)) return { ok: false, error: 'Η τιμή πρέπει να είναι θετική.' };
  const validVariants = input.variants.filter((v) => v.size.trim() && v.color.trim());
  if (validVariants.length === 0)
    return { ok: false, error: 'Πρόσθεσε τουλάχιστον μία παραλλαγή (μέγεθος/χρώμα).' };

  const price_cents = Math.round(input.price_euros * 100);
  const slug = slugify(input.name);

  let productId = input.id;

  if (productId) {
    const { error } = await supabase
      .from('products')
      .update({
        name: input.name.trim(),
        slug,
        description: input.description,
        category_id: input.category_id,
        price_cents,
        status: input.status,
      })
      .eq('id', productId);
    if (error) return { ok: false, error: mapError(error.message) };
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: input.name.trim(),
        slug,
        description: input.description,
        category_id: input.category_id,
        price_cents,
        status: input.status,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: mapError(error.message) };
    productId = data.id;
  }

  // Συγχρονισμός παραλλαγών: upsert τρέχουσες, διαγραφή όσων αφαιρέθηκαν.
  const { data: existing } = await supabase
    .from('product_variants')
    .select('id')
    .eq('product_id', productId);

  const keepIds = new Set(validVariants.filter((v) => v.id).map((v) => v.id));
  const toDelete = (existing ?? []).filter((v) => !keepIds.has(v.id));
  if (toDelete.length > 0) {
    await supabase
      .from('product_variants')
      .delete()
      .in('id', toDelete.map((v) => v.id));
  }

  for (const v of validVariants) {
    if (v.id) {
      await supabase
        .from('product_variants')
        .update({ size: v.size.trim(), color: v.color.trim(), stock: v.stock })
        .eq('id', v.id);
    } else {
      const { error } = await supabase.from('product_variants').insert({
        product_id: productId,
        size: v.size.trim(),
        color: v.color.trim(),
        stock: v.stock,
      });
      if (error) return { ok: false, error: mapError(error.message) };
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { ok: true, productId };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = createClient();

  // Σβήσε πρώτα τις εικόνες από το storage
  const { data: images } = await supabase
    .from('product_images')
    .select('storage_path')
    .eq('product_id', productId);
  if (images && images.length > 0) {
    await supabase.storage
      .from('product-images')
      .remove(images.map((i) => i.storage_path));
  }

  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) return { ok: false, error: mapError(error.message) };

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { ok: true };
}

export async function saveUploadedImage(
  productId: string,
  storagePath: string,
  alt: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = createClient();

  const { count } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId);

  const { error } = await supabase.from('product_images').insert({
    product_id: productId,
    storage_path: storagePath,
    alt,
    position: count ?? 0,
  });
  if (error) return { ok: false, error: mapError(error.message) };

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath('/shop');
  return { ok: true };
}

export async function deleteImage(
  imageId: string,
  storagePath: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = createClient();

  await supabase.storage.from('product-images').remove([storagePath]);
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);
  if (error) return { ok: false, error: mapError(error.message) };

  revalidatePath('/shop');
  return { ok: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'paid' | 'shipped' | 'delivered',
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) return { ok: false, error: mapError(error.message) };

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

function mapError(msg: string): string {
  if (msg.includes('duplicate key') && msg.includes('slug'))
    return 'Υπάρχει ήδη προϊόν με παρόμοιο όνομα. Άλλαξέ το λίγο.';
  if (msg.includes('row-level security'))
    return 'Δεν έχεις δικαίωμα — βεβαιώσου ότι είσαι συνδεδεμένος ως admin.';
  return `Σφάλμα: ${msg}`;
}
