'use client';

// Φίλτρα + ταξινόμηση μέσω URL params — bookmarkable & SEO-friendly.
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SORTS = [
  { value: 'newest', label: 'Νεότερα' },
  { value: 'price-asc', label: 'Τιμή: αύξουσα' },
  { value: 'price-desc', label: 'Τιμή: φθίνουσα' },
];

export function Filters({
  sizes,
  colors,
}: {
  sizes: string[];
  colors: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const hasFilters = ['size', 'color', 'min', 'max'].some((k) =>
    params.get(k),
  );

  const selectCls =
    'border border-linen-deep bg-paper px-3 py-2 text-sm focus:border-ink';
  const inputCls =
    'w-24 border border-linen-deep bg-paper px-3 py-2 text-sm placeholder:text-ink-soft focus:border-ink';

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      role="group"
      aria-label="Φίλτρα και ταξινόμηση"
    >
      {sizes.length > 0 && (
        <div>
          <label htmlFor="f-size" className="sr-only">Μέγεθος</label>
          <select
            id="f-size"
            className={selectCls}
            value={params.get('size') ?? ''}
            onChange={(e) => setParam('size', e.target.value)}
          >
            <option value="">Μέγεθος: όλα</option>
            {sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <label htmlFor="f-color" className="sr-only">Χρώμα</label>
          <select
            id="f-color"
            className={selectCls}
            value={params.get('color') ?? ''}
            onChange={(e) => setParam('color', e.target.value)}
          >
            <option value="">Χρώμα: όλα</option>
            {colors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor="f-min" className="sr-only">Ελάχιστη τιμή (€)</label>
        <input
          id="f-min"
          type="number"
          min={0}
          placeholder="από €"
          className={inputCls}
          defaultValue={params.get('min') ?? ''}
          onBlur={(e) => setParam('min', e.target.value)}
        />
        <span aria-hidden="true" className="text-ink-soft">–</span>
        <label htmlFor="f-max" className="sr-only">Μέγιστη τιμή (€)</label>
        <input
          id="f-max"
          type="number"
          min={0}
          placeholder="έως €"
          className={inputCls}
          defaultValue={params.get('max') ?? ''}
          onBlur={(e) => setParam('max', e.target.value)}
        />
      </div>

      <div className="ml-auto">
        <label htmlFor="f-sort" className="sr-only">Ταξινόμηση</label>
        <select
          id="f-sort"
          className={selectCls}
          value={params.get('sort') ?? 'newest'}
          onChange={(e) => setParam('sort', e.target.value)}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
        >
          Καθαρισμός
        </button>
      )}
    </div>
  );
}
