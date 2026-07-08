'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart, selectSubtotalCents } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { CheckoutButton } from '@/components/cart/CheckoutButton';

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const subtotal = useCart(selectSubtotalCents);
  const clear = useCart((s) => s.clear);

  // Το localStorage διαβάζεται μόνο client-side — αποφυγή hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Καλάθι
      </h1>

      {!mounted ? (
        <div className="mt-10 h-40 animate-pulse bg-linen" aria-busy="true" />
      ) : lines.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <div className="rule-linen w-16" />
          <p className="mt-8 font-display text-2xl font-bold">
            Το καλάθι είναι άδειο
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Ρίξε μια ματιά στη συλλογή — κάτι θα σου κάνει.
          </p>
          <Link href="/shop" className="btn-primary mt-8">
            Δες τη συλλογή
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="divide-y divide-linen border-y border-linen">
              {lines.map((line) => (
                <CartLineItem key={line.variantId} line={line} />
              ))}
            </div>
            <button
              type="button"
              onClick={clear}
              className="mt-4 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Άδειασμα καλαθιού
            </button>
          </div>

          <aside className="h-fit border border-linen-deep p-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold">Σύνοψη</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Μερικό σύνολο</dt>
                <dd className="font-semibold tabular-nums">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Μεταφορικά</dt>
                <dd className="text-ink-soft">στο επόμενο βήμα</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink-soft">
              Οι τιμές περιλαμβάνουν ΦΠΑ 24%.
            </p>
            <div className="mt-5">
              <CheckoutButton />
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
