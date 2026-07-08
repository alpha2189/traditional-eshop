'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/lib/admin/actions';

const OPTIONS = [
  { value: 'pending', label: 'Εκκρεμεί' },
  { value: 'paid', label: 'Πληρώθηκε' },
  { value: 'shipped', label: 'Απεστάλη' },
  { value: 'delivered', label: 'Παραδόθηκε' },
] as const;

export function OrderStatusControl({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);

  async function change(next: string) {
    setStatus(next);
    setSaving(true);
    await updateOrderStatus(
      orderId,
      next as 'pending' | 'paid' | 'shipped' | 'delivered',
    );
    setSaving(false);
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-ink-soft">Κατάσταση:</span>
      <select
        value={status}
        onChange={(e) => change(e.target.value)}
        disabled={saving}
        className="border border-linen-deep bg-paper px-3 py-1.5 text-sm focus:border-ink"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
