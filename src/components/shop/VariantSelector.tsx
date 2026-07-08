'use client';

import { useMemo, useState } from 'react';
import type { ProductVariant, ProductWithRelations } from '@/lib/types';
import { useCart } from '@/lib/store/cart';

export function VariantSelector({
  product,
}: {
  product: ProductWithRelations;
}) {
  const variants = product.product_variants;
  const addLine = useCart((s) => s.addLine);

  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.size))],
    [variants],
  );
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color))],
    [variants],
  );

  const [size, setSize] = useState<string | null>(
    sizes.length === 1 ? sizes[0] : null,
  );
  const [color, setColor] = useState<string | null>(
    colors.length === 1 ? colors[0] : null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected: ProductVariant | undefined = variants.find(
    (v) => v.size === size && v.color === color,
  );

  const sizeHasStock = (s: string) =>
    variants.some((v) => v.size === s && v.stock > 0 && (!color || v.color === color));
  const colorHasStock = (c: string) =>
    variants.some((v) => v.color === c && v.stock > 0 && (!size || v.size === size));

  const allOut = variants.every((v) => v.stock === 0);
  const canAdd = !!selected && selected.stock > 0;

  function handleAdd() {
    if (!selected || selected.stock === 0) return;
    const image = [...product.product_images].sort(
      (a, b) => a.position - b.position,
    )[0];
    addLine(
      {
        variantId: selected.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: selected.size,
        color: selected.color,
        priceCents: product.price_cents,
        imagePath: image?.storage_path ?? null,
        maxStock: selected.stock,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const optionCls = (activeOpt: boolean, out: boolean) =>
    `min-w-12 border px-3 py-2 text-sm font-medium transition-colors
     ${activeOpt ? 'border-ink bg-ink text-paper' : 'border-linen-deep hover:border-ink'}
     ${out ? 'cursor-not-allowed text-ink-soft line-through opacity-50' : ''}`;

  return (
    <div className="mt-8 space-y-6">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-widest">
          Μέγεθος
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const out = !sizeHasStock(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => !out && setSize(s)}
                disabled={out}
                aria-pressed={size === s}
                className={optionCls(size === s, out)}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-widest">
          Χρώμα
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((c) => {
            const out = !colorHasStock(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => !out && setColor(c)}
                disabled={out}
                aria-pressed={color === c}
                className={optionCls(color === c, out)}
              >
                {c}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-end gap-4">
        <div>
          <label
            htmlFor="qty"
            className="text-xs font-semibold uppercase tracking-widest"
          >
            Ποσότητα
          </label>
          <div className="mt-2 flex items-center border border-linen-deep">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Μείωση ποσότητας"
              className="h-11 w-11 hover:bg-linen"
            >
              −
            </button>
            <input
              id="qty"
              type="number"
              min={1}
              max={selected?.stock ?? 99}
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(Number(e.target.value) || 1, selected?.stock ?? 99)))
              }
              className="h-11 w-12 border-x border-linen-deep bg-paper text-center text-sm"
            />
            <button
              type="button"
              onClick={() =>
                setQty(Math.min(qty + 1, selected?.stock ?? 99))
              }
              aria-label="Αύξηση ποσότητας"
              className="h-11 w-11 hover:bg-linen"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="btn-primary h-11 flex-1"
        >
          {allOut
            ? 'Εξαντλημένο'
            : added
              ? 'Προστέθηκε ✓'
              : !selected
                ? 'Διάλεξε μέγεθος & χρώμα'
                : selected.stock === 0
                  ? 'Μη διαθέσιμος συνδυασμός'
                  : 'Προσθήκη στο καλάθι'}
        </button>
      </div>

      {selected && selected.stock > 0 && selected.stock <= 3 && (
        <p className="text-sm font-medium text-danger" role="status">
          Μόνο {selected.stock} τεμάχια διαθέσιμα
        </p>
      )}
    </div>
  );
}
