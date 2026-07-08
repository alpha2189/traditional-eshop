import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/utils';
import { ClearCartOnMount } from '@/components/cart/ClearCartOnMount';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Η παραγγελία ολοκληρώθηκε',
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) redirect('/');

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
  } catch {
    redirect('/');
  }

  if (session.payment_status !== 'paid') redirect('/cart');

  const items = session.line_items?.data ?? [];

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
      <ClearCartOnMount />

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
          Ευχαριστούμε
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Η παραγγελία σου ολοκληρώθηκε
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          Στείλαμε επιβεβαίωση στο{' '}
          <strong className="text-ink">
            {session.customer_details?.email}
          </strong>
          . Θα σε ενημερώσουμε ξανά όταν αποσταλεί.
        </p>
      </div>

      <div className="mt-12 border border-linen-deep">
        <h2 className="border-b border-linen-deep bg-linen px-5 py-3 text-xs font-semibold uppercase tracking-widest">
          Σύνοψη παραγγελίας
        </h2>
        <ul className="divide-y divide-linen px-5">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {item.description}
                <span className="ml-2 text-ink-soft">× {item.quantity}</span>
              </span>
              <span className="font-semibold tabular-nums">
                {formatPrice(item.amount_total ?? 0)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-linen-deep px-5 py-3">
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft">Μεταφορικά</span>
            <span className="tabular-nums">
              {formatPrice(session.total_details?.amount_shipping ?? 0)}
            </span>
          </div>
          <div className="mt-2 flex justify-between font-semibold">
            <span>Σύνολο (με ΦΠΑ 24%)</span>
            <span className="tabular-nums">
              {formatPrice(session.amount_total ?? 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/shop" className="btn-primary">
          Συνέχισε τις αγορές
        </Link>
      </div>
    </main>
  );
}
