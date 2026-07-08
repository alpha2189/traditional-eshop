import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [ordersRes, productsRes, lowStockRes, recentRes] = await Promise.all([
    supabase.from('orders').select('amount_cents, status'),
    supabase.from('products').select('id, status'),
    supabase
      .from('product_variants')
      .select('id, size, color, stock, product:products(name, slug)')
      .lte('stock', 3)
      .order('stock'),
    supabase
      .from('orders')
      .select('id, email, amount_cents, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const orders = ordersRes.data ?? [];
  const paidOrders = orders.filter((o) => o.status !== 'pending');
  const revenue = paidOrders.reduce((sum, o) => sum + o.amount_cents, 0);
  const products = productsRes.data ?? [];
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const lowStock = lowStockRes.data ?? [];
  const recent = recentRes.data ?? [];

  const stats = [
    { label: 'Παραγγελίες', value: orders.length.toString() },
    { label: 'Έσοδα', value: formatPrice(revenue) },
    { label: 'Ενεργά προϊόντα', value: activeProducts.toString() },
    { label: 'Χαμηλό απόθεμα', value: lowStock.length.toString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Επισκόπηση
        </h1>
        <Link href="/admin/products/new" className="btn-primary">
          + Νέο προϊόν
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-linen-deep p-5">
            <dt className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              {s.label}
            </dt>
            <dd className="mt-2 font-display text-2xl font-bold tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-lg font-bold">Πρόσφατες παραγγελίες</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">Καμία παραγγελία ακόμα.</p>
          ) : (
            <ul className="mt-4 divide-y divide-linen border-y border-linen">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center justify-between gap-3 py-3 text-sm hover:bg-linen"
                  >
                    <span className="min-w-0 truncate">{o.email}</span>
                    <span className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={o.status} />
                      <span className="font-semibold tabular-nums">
                        {formatPrice(o.amount_cents)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Ειδοποιήσεις αποθέματος</h2>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">
              Όλα καλά — κανένα προϊόν σε χαμηλό απόθεμα.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-linen border-y border-linen">
              {lowStock.map((v) => {
                const product = Array.isArray(v.product) ? v.product[0] : v.product;
                return (
                  <li key={v.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span className="min-w-0 truncate">
                      {product?.name}{' '}
                      <span className="text-ink-soft">
                        ({v.size}/{v.color})
                      </span>
                    </span>
                    <span
                      className={`shrink-0 font-semibold tabular-nums ${
                        v.stock === 0 ? 'text-danger' : ''
                      }`}
                    >
                      {v.stock === 0 ? 'Εξαντλήθηκε' : `${v.stock} τεμ.`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-linen text-ink-soft',
    paid: 'bg-ink text-paper',
    shipped: 'bg-linen-deep text-ink',
    delivered: 'bg-linen text-ink',
  };
  const label: Record<string, string> = {
    pending: 'Εκκρεμεί',
    paid: 'Πληρώθηκε',
    shipped: 'Απεστάλη',
    delivered: 'Παραδόθηκε',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium ${map[status] ?? 'bg-linen'}`}>
      {label[status] ?? status}
    </span>
  );
}
