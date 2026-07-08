import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { OrderStatusControl } from '@/components/admin/OrderStatusControl';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Παραγγελία' };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from('orders').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('order_items').select('*').eq('order_id', params.id),
  ]);

  if (!order) notFound();

  const addr = (order.shipping_address ?? {}) as Record<string, string>;
  const orderItems = items ?? [];
  const itemsTotal = orderItems.reduce(
    (sum, it) => sum + it.unit_price_cents * it.quantity,
    0,
  );
  const shipping = order.amount_cents - itemsTotal;

  return (
    <div className="max-w-3xl">
      <nav className="text-sm text-ink-soft">
        <Link href="/admin/orders" className="hover:text-ink">← Παραγγελίες</Link>
      </nav>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Παραγγελία
        </h1>
        <OrderStatusControl orderId={order.id} current={order.status} />
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        {new Date(order.created_at).toLocaleString('el-GR')}
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest">Πελάτης</h2>
          <div className="mt-3 space-y-1 text-sm">
            <p className="font-medium">{order.customer_name || '—'}</p>
            <p className="text-ink-soft">{order.email}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest">Διεύθυνση αποστολής</h2>
          <address className="mt-3 space-y-0.5 text-sm not-italic text-ink-soft">
            {addr.line1 && <p>{addr.line1}</p>}
            {addr.line2 && <p>{addr.line2}</p>}
            {(addr.postal_code || addr.city) && (
              <p>{[addr.postal_code, addr.city].filter(Boolean).join(' ')}</p>
            )}
            {addr.state && <p>{addr.state}</p>}
            {addr.country && <p>{addr.country}</p>}
            {!addr.line1 && <p>—</p>}
          </address>
        </section>
      </div>

      <div className="mt-8 border border-linen-deep">
        <h2 className="border-b border-linen-deep bg-linen px-4 py-3 text-xs font-semibold uppercase tracking-widest">
          Προϊόντα
        </h2>
        <ul className="divide-y divide-linen px-4">
          {orderItems.map((it) => (
            <li key={it.id} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {it.product_name}{' '}
                <span className="text-ink-soft">
                  ({it.size}/{it.color}) × {it.quantity}
                </span>
              </span>
              <span className="font-semibold tabular-nums">
                {formatPrice(it.unit_price_cents * it.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-linen-deep px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Προϊόντα</span>
            <span className="tabular-nums">{formatPrice(itemsTotal)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-ink-soft">Μεταφορικά</span>
            <span className="tabular-nums">{formatPrice(Math.max(shipping, 0))}</span>
          </div>
          <div className="mt-2 flex justify-between font-semibold">
            <span>Σύνολο (με ΦΠΑ 24%)</span>
            <span className="tabular-nums">{formatPrice(order.amount_cents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
