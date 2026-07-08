'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import {
  useCart,
  selectSubtotalCents,
  selectTotalQuantity,
} from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { CartLineItem } from './CartLineItem';
import { CheckoutButton } from './CheckoutButton';

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const lines = useCart((s) => s.lines);
  const subtotal = useCart(selectSubtotalCents);
  const count = useCart(selectTotalQuantity);

  // ESC κλείνει το drawer· κλείδωμα scroll όσο είναι ανοιχτό.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Καλάθι">
      <button
        type="button"
        onClick={closeCart}
        aria-label="Κλείσιμο καλαθιού"
        className="absolute inset-0 bg-ink/40"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-xl">
        <header className="flex items-center justify-between border-b border-linen-deep px-5 py-4">
          <h2 className="font-display text-lg font-bold">
            Καλάθι {count > 0 && <span className="text-ink-soft">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Κλείσιμο"
            className="flex h-9 w-9 items-center justify-center hover:bg-linen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="rule-linen w-12" />
            <p className="mt-6 font-display text-xl font-bold">
              Το καλάθι είναι άδειο
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              Ώρα να το γεμίσουμε.
            </p>
            <button type="button" onClick={closeCart} className="btn-secondary mt-6">
              Συνέχισε τις αγορές
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-linen overflow-y-auto px-5">
              {lines.map((line) => (
                <CartLineItem key={line.variantId} line={line} compact />
              ))}
            </div>

            <footer className="border-t border-linen-deep px-5 py-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-ink-soft">
                  Μερικό σύνολο{' '}
                  <span className="text-xs">(με ΦΠΑ 24%)</span>
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatPrice(subtotal)}
                </p>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Τα μεταφορικά υπολογίζονται στο επόμενο βήμα.
              </p>
              <div className="mt-4 space-y-2">
                <CheckoutButton />
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-secondary w-full"
                >
                  Δες το καλάθι
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
