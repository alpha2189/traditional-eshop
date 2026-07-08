'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { productImageUrl } from '@/lib/utils';
import {
  saveProduct,
  deleteImage,
  saveUploadedImage,
  type VariantInput,
} from '@/lib/admin/actions';
import type { Category, ProductWithRelations } from '@/lib/types';

interface Props {
  categories: Category[];
  product?: ProductWithRelations;
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? categories[0]?.id ?? '',
  );
  const [price, setPrice] = useState(
    product ? (product.price_cents / 100).toString() : '',
  );
  const [status, setStatus] = useState<'draft' | 'active'>(
    product?.status ?? 'draft',
  );
  const [variants, setVariants] = useState<VariantInput[]>(
    product?.product_variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
    })) ?? [{ size: '', color: '', stock: 0 }],
  );
  const [images, setImages] = useState(
    [...(product?.product_images ?? [])].sort((a, b) => a.position - b.position),
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateVariant(i: number, patch: Partial<VariantInput>) {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)),
    );
  }
  function addVariant() {
    setVariants((prev) => [...prev, { size: '', color: '', stock: 0 }]);
  }
  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await saveProduct({
      id: product?.id,
      name,
      description,
      category_id: categoryId,
      price_euros: Number(price),
      status,
      variants,
    });
    setSaving(false);

    if (!result.ok) {
      setError(result.error ?? 'Κάτι πήγε στραβά.');
      return;
    }
    // Νέο προϊόν → πήγαινε στην επεξεργασία για να ανέβουν εικόνες.
    if (!isEdit && result.productId) {
      router.push(`/admin/products/${result.productId}/edit`);
    } else {
      router.push('/admin/products');
    }
    router.refresh();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !product) return;
    setUploading(true);
    setError(null);

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${product.id}/${crypto.randomUUID()}.${ext}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError(`Αποτυχία μεταφόρτωσης: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const result = await saveUploadedImage(product.id, path, name);
    setUploading(false);
    if (!result.ok) {
      setError(result.error ?? 'Αποτυχία αποθήκευσης εικόνας.');
      return;
    }
    // Ανανέωση τοπικής λίστας
    setImages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        product_id: product.id,
        storage_path: path,
        alt: name,
        position: prev.length,
      },
    ]);
    e.target.value = '';
  }

  async function handleDeleteImage(imageId: string, path: string) {
    const result = await deleteImage(imageId, path);
    if (result.ok) {
      setImages((prev) => prev.filter((img) => img.storage_path !== path));
    } else {
      setError(result.error ?? 'Αποτυχία διαγραφής.');
    }
  }

  const field = 'w-full border border-linen-deep bg-paper px-3 py-2.5 text-sm focus:border-ink';
  const labelCls = 'text-xs font-semibold uppercase tracking-widest';

  return (
    <div className="max-w-3xl space-y-8">
      {error && (
        <p className="border border-danger bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="p-name" className={labelCls}>Όνομα προϊόντος</label>
          <input id="p-name" className={`mt-2 ${field}`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label htmlFor="p-cat" className={labelCls}>Κατηγορία</label>
          <select id="p-cat" className={`mt-2 ${field}`} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="p-price" className={labelCls}>Τιμή (€, με ΦΠΑ)</label>
          <input id="p-price" type="number" min={0} step="0.01" className={`mt-2 ${field}`} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="24.90" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="p-desc" className={labelCls}>Περιγραφή</label>
          <textarea id="p-desc" rows={4} className={`mt-2 ${field}`} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label htmlFor="p-status" className={labelCls}>Κατάσταση</label>
          <select id="p-status" className={`mt-2 ${field}`} value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'active')}>
            <option value="draft">Πρόχειρο (κρυφό)</option>
            <option value="active">Ενεργό (ορατό στο κατάστημα)</option>
          </select>
        </div>
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className={labelCls}>Παραλλαγές (μέγεθος / χρώμα / απόθεμα)</h2>
          <button type="button" onClick={addVariant} className="text-sm underline underline-offset-4 hover:text-ink-soft">
            + Προσθήκη
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input aria-label="Μέγεθος" placeholder="Μέγεθος (π.χ. M)" className={field} value={v.size} onChange={(e) => updateVariant(i, { size: e.target.value })} />
              <input aria-label="Χρώμα" placeholder="Χρώμα (π.χ. Μαύρο)" className={field} value={v.color} onChange={(e) => updateVariant(i, { color: e.target.value })} />
              <input aria-label="Απόθεμα" type="number" min={0} placeholder="Απόθεμα" className={`${field} w-28`} value={v.stock} onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })} />
              <button type="button" onClick={() => removeVariant(i)} aria-label="Αφαίρεση παραλλαγής" className="shrink-0 px-2 text-ink-soft hover:text-danger" disabled={variants.length === 1}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <h2 className={labelCls}>Εικόνες</h2>
        {!isEdit ? (
          <p className="mt-3 text-sm text-ink-soft">
            Αποθήκευσε πρώτα το προϊόν — μετά θα μπορείς να ανεβάσεις εικόνες.
          </p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((img) => (
                <div key={img.storage_path} className="relative h-28 w-24 overflow-hidden border border-linen-deep">
                  <Image src={productImageUrl(img.storage_path)} alt={img.alt} fill sizes="96px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id, img.storage_path)}
                    aria-label="Διαγραφή εικόνας"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ink/80 text-xs text-paper hover:bg-ink"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <label className="flex h-28 w-24 cursor-pointer flex-col items-center justify-center border border-dashed border-linen-deep text-center text-xs text-ink-soft hover:border-ink hover:text-ink">
                {uploading ? 'Ανέβασμα…' : '+ Εικόνα'}
                <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              Η πρώτη εικόνα χρησιμοποιείται ως κύρια. JPG/PNG/WebP.
            </p>
          </>
        )}
      </div>

      <div className="flex gap-3 border-t border-linen-deep pt-6">
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Αποθήκευση…' : isEdit ? 'Αποθήκευση αλλαγών' : 'Δημιουργία προϊόντος'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="btn-secondary">
          Ακύρωση
        </button>
      </div>
    </div>
  );
}
