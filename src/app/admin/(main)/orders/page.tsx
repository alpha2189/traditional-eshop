import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Παραγγελίες' };

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id, email, customer_name, amount_cents, status, created_at')
    .order('created_at', { ascending: false });

  const list = orders ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">
        Παραγγελίες
      </h1>

      {list.length === 0 ? (
        <div className="mt-16 flex flex-col items-center py-16 text-center">
          <div className="rule-linen w-16" />
          <p className="mt-8 font-display text-xl font-bold">
            Καμία παραγγελία ακόμα
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Οι παραγγελίες θα εμφανίζονται εδώ μόλις οι πελάτες ολοκληρώνουν αγορές.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-linen-deep">
          <table className="w-full text-sm">
            <thead className="border-b border-linen-deep bg-linen text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Ημερομηνία</th>
                <th className="px-4 py-3 font-semibold">Πελάτης</th>
                <th className="px-4 py-3 font-semibold">Ποσό</th>
                <th className="px-4 py-3 font-semibold">Κατάσταση</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-linen/50">
                  <td className="px-4 py-3 tabular-nums text-ink-soft">
                    {new Date(o.created_at).toLocaleDateString('el-GR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customer_name || '—'}</div>
                    <div className="text-xs text-ink-soft">{o.email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums">
                    {formatPrice(o.amount_cents)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-ink-soft underline underline-offset-4 hover:text-ink"
                    >
                      Άνοιγμα
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
