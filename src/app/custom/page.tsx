'use client';

import { useMemo, useState } from 'react';
import {
  CUSTOM_GARMENTS,
  MAX_CUSTOM_LEN,
  sanitizeCustomText,
} from '@/lib/customConfig';
import { useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

// Χρώμα φόντου προεπισκόπησης ανά επιλογή
const SWATCH: Record<string, string> = {
  Λευκό: '#fdfcf9',
  Μπεζ: '#e9e0d1',
  Μαύρο: '#141311',
};

export default function CustomPage() {
  const addLine = useCart((s) => s.addLine);

  const [garmentKey, setGarmentKey] = useState(CUSTOM_GARMENTS[0].key);
  const garment =
    CUSTOM_GARMENTS.find((g) => g.key === garmentKey) ?? CUSTOM_GARMENTS[0];

  const [color, setColor] = useState(garment.colors[0]);
  const [size, setSize] = useState(garment.sizes[0]);
  const [text, setText] = useState('');
  const [added, setAdded] = useState(false);

  // Όταν αλλάζει ρούχο, επανέφερε χρώμα/μέγεθος σε έγκυρες τιμές
  function changeGarment(key: string) {
    const g = CUSTOM_GARMENTS.find((x) => x.key === key)!;
    setGarmentKey(key);
    setColor(g.colors[0]);
    setSize(g.sizes[0]);
  }

  const clean = useMemo(() => sanitizeCustomText(text), [text]);
  const canAdd = clean.length >= 1;

  const bg = SWATCH[color] ?? '#e9e0d1';
  const isDark = color === 'Μαύρο';

  function handleAdd() {
    if (!canAdd) return;
    addLine(
      {
        variantId: `custom-${garment.key}-${color}-${size}-${clean}`,
        productId: 'custom',
        slug: 'custom',
        name: `${garment.label} με δική σου στάμπα`,
        size,
        color,
        priceCents: garment.priceCents,
        imagePath: null,
        maxStock: 99,
        custom: { garmentKey: garment.key, text: clean },
      },
      1,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const optionCls = (active: boolean) =>
    `min-w-12 border px-3 py-2 text-sm font-medium transition-colors ${
      active ? 'border-ink bg-ink text-paper' : 'border-linen-deep hover:border-ink'
    }`;

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
        Φτιάξε το δικό σου
      </p>
      <h1 className="mt-3 font-display text-[10vw] font-bold leading-[1] tracking-tight sm:text-5xl">
        Η δική σου λέξη, στάμπα
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Διάλεξε ρούχο, χρώμα και μέγεθος, γράψε τη λέξη ή τη φράση σου — και την
        τυπώνουμε ειδικά για σένα.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Προεπισκόπηση */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div
            className="flex aspect-[4/5] items-center justify-center border border-linen-deep p-8"
            style={{ backgroundColor: bg }}
          >
            <div
              className={`flex min-h-[40%] w-full max-w-xs items-center justify-center border-2 px-4 py-6 text-center ${
                isDark ? 'border-paper/40' : 'border-ink/30'
              }`}
            >
              <span
                className={`font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl ${
                  isDark ? 'text-paper' : 'text-ink'
                }`}
              >
                {clean || 'Η ΛΕΞΗ ΣΟΥ'}
              </span>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-ink-soft">
            Ενδεικτική προεπισκόπηση της στάμπας
          </p>
        </div>

        {/* Επιλογές */}
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">Ρούχο</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CUSTOM_GARMENTS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => changeGarment(g.key)}
                  className={optionCls(g.key === garmentKey)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">Χρώμα</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {garment.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={optionCls(c === color)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest">Μέγεθος</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {garment.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={optionCls(s === size)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="custom-text"
              className="text-xs font-semibold uppercase tracking-widest"
            >
              Η λέξη ή φράση σου
            </label>
            <input
              id="custom-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={MAX_CUSTOM_LEN + 10}
              placeholder="π.χ. ΜΑΓΚΑΣ"
              className="mt-2 w-full border border-linen-deep bg-paper px-3 py-2.5 text-sm focus:border-ink"
            />
            <p className="mt-1 text-xs text-ink-soft">
              {clean.length}/{MAX_CUSTOM_LEN} χαρακτήρες · κεφαλαία, ελληνικά ή
              λατινικά
            </p>
          </div>

          <div className="border-t border-linen-deep pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">Τιμή</span>
              <span className="text-2xl font-semibold tabular-nums">
                {formatPrice(garment.priceCents)}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Περιλαμβάνει ΦΠΑ 24%. Τα custom προϊόντα κατασκευάζονται κατόπιν
              παραγγελίας και εξαιρούνται από το δικαίωμα υπαναχώρησης.
            </p>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              className="btn-primary mt-4 w-full"
            >
              {added ? 'Προστέθηκε ✓' : 'Προσθήκη στο καλάθι'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
