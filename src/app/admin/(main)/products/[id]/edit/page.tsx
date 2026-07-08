import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/queries';
import { ProductForm } from '@/components/admin/ProductForm';
import type { ProductWithRelations } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Επεξεργασία προϊόντος' };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const [{ data: product }, categories] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*), product_variants(*), product_images(*)')
      .eq('id', params.id)
      .maybeSingle(),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <nav className="text-sm text-ink-soft">
        <Link href="/admin/products" className="hover:text-ink">← Προϊόντα</Link>
      </nav>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
        Επεξεργασία: {product.name}
      </h1>
      <div className="mt-8">
        <ProductForm
          categories={categories}
          product={product as unknown as ProductWithRelations}
        />
      </div>
    </div>
  );
}
