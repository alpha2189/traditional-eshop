import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, productImageUrl } from '@/lib/utils';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select(
      'id, name, slug, price_cents, status, category:categories(name), product_variants(stock), product_images(storage_path, position)',
    )
    .order('created_at', { ascending: false });

  const list = products ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Προϊόντα
        </h1>
        <Link href="/admin/products/new" className="btn-primary">
          + Νέο προϊόν
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-16 flex flex-col items-center py-16 text-center">
          <div className="rule-linen w-16" />
          <p className="mt-8 font-display text-xl font-bold">
            Δεν υπάρχουν προϊόντα ακόμα
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Πρόσθεσε το πρώτο σου προϊόν για να ξεκινήσεις.
          </p>
          <Link href="/admin/products/new" className="btn-primary mt-6">
            + Νέο προϊόν
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-linen-deep">
          <table className="w-full text-sm">
            <thead className="border-b border-linen-deep bg-linen text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Προϊόν</th>
                <th className="px-4 py-3 font-semibold">Κατηγορία</th>
                <th className="px-4 py-3 font-semibold">Τιμή</th>
                <th className="px-4 py-3 font-semibold">Απόθεμα</th>
                <th className="px-4 py-3 font-semibold">Κατάσταση</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {list.map((p) => {
                const category = Array.isArray(p.category) ? p.category[0] : p.category;
                const totalStock = (p.product_variants ?? []).reduce(
                  (sum: number, v: { stock: number }) => sum + v.stock,
                  0,
                );
                const image = [...(p.product_images ?? [])].sort(
                  (a, b) => a.position - b.position,
                )[0];
                return (
                  <tr key={p.id} className="hover:bg-linen/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-linen">
                          {image ? (
                            <Image
                              src={productImageUrl(image.storage_path)}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{category?.name}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatPrice(p.price_cents)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      <span className={totalStock === 0 ? 'text-danger' : ''}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium ${
                          p.status === 'active'
                            ? 'bg-ink text-paper'
                            : 'bg-linen text-ink-soft'
                        }`}
                      >
                        {p.status === 'active' ? 'Ενεργό' : 'Πρόχειρο'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-ink-soft underline underline-offset-4 hover:text-ink"
                        >
                          Επεξεργασία
                        </Link>
                        <DeleteProductButton productId={p.id} productName={p.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
