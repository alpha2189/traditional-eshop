'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CartLine } from '@/lib/types';
import { useCart } from '@/lib/store/cart';
import { formatPrice, productImageUrl } from '@/lib/utils';

export function CartLineItem({
  line,
  compact = false,
}: {
  line: CartLine;
  compact?: boolean;
}) {
  const setQuantity = useCart((s) => s.setQuantity);
  const removeLine = useCart((s) => s.removeLine);

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/product/${line.slug}`}
        className={`relative block shrink-0 overflow-hidden bg-linen ${
          compact ? 'h-20 w-16' : 'h-28 w-24'
        }`}
      >
        {line.imagePath ? (
          <Image
            src={productImageUrl(line.imagePath)}
            alt={line.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <span
            className="flex h-full items-center justify-center font-display
              text-2xl font-extrabold text-linen-deep"
            aria-hidden="true"
          >
            Τ
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${line.slug}`}
              className="block truncate text-sm font-medium hover:underline"
            >
              {line.name}
            </Link>
            <p className="mt-0.5 text-xs text-ink-soft">
              {line.size} · {line.color}
            </p>
            {line.custom && (
              <p className="mt-0.5 text-xs italic text-ink-soft">
                Στάμπα: «{line.custom.text}»
              </p>
            )}
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums">
            {formatPrice(line.priceCents * line.quantity)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div
            className="flex items-center border border-linen-deep"
            role="group"
            aria-label={`Ποσότητα για ${line.name}`}
          >
            <button
              type="button"
              onClick={() => setQuantity(line.variantId, line.quantity - 1)}
              aria-label="Μείωση ποσότητας"
              className="h-8 w-8 text-sm hover:bg-linen"
            >
              −
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(line.variantId, line.quantity + 1)}
              disabled={line.quantity >= line.maxStock}
              aria-label="Αύξηση ποσότητας"
              className="h-8 w-8 text-sm hover:bg-linen disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeLine(line.variantId)}
            className="text-xs text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Αφαίρεση
          </button>
        </div>

        {line.quantity >= line.maxStock && (
          <p className="mt-1 text-xs text-danger" role="status">
            Μέγιστη διαθέσιμη ποσότητα
          </p>
        )}
      </div>
    </div>
  );
}
