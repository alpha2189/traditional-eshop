'use client';

import { useEffect, useState } from 'react';
import { useCart, selectTotalQuantity } from '@/lib/store/cart';

export function CartButton() {
  const count = useCart(selectTotalQuantity);
  const openCart = useCart((s) => s.openCart);

  // Αποφυγή hydration mismatch: το localStorage διαβάζεται μόνο client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-10 w-10 items-center justify-center
        transition-colors hover:bg-linen"
      aria-label={`Καλάθι${mounted && count > 0 ? `, ${count} προϊόντα` : ''}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {mounted && count > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center
            justify-center bg-ink px-1 text-[11px] font-bold text-paper"
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </button>
  );
}
