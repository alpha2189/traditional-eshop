'use client';

import { useState } from 'react';
import { useCart } from '@/lib/store/cart';

export function CheckoutButton() {
  const lines = useCart((s) => s.lines);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            variantId: l.variantId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Κάτι πήγε στραβά. Δοκίμασε ξανά.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Δεν υπάρχει σύνδεση. Έλεγξε το δίκτυο και δοκίμασε ξανά.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={checkout}
        disabled={loading || lines.length === 0}
        className="btn-primary w-full"
      >
        {loading ? 'Μεταφορά στην πληρωμή…' : 'Ολοκλήρωση αγοράς'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-center text-xs text-ink-soft">
        Ασφαλής πληρωμή μέσω Stripe · Ελλάδα &amp; ΕΕ
      </p>
    </div>
  );
}
