import Link from 'next/link';
import { getCategories } from '@/lib/queries';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Νέο προϊόν' };

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <nav className="text-sm text-ink-soft">
        <Link href="/admin/products" className="hover:text-ink">← Προϊόντα</Link>
      </nav>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
        Νέο προϊόν
      </h1>
      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
