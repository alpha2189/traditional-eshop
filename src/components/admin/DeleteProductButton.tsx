'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/lib/admin/actions';

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    const result = await deleteProduct(productId);
    setBusy(false);
    if (result.ok) {
      router.refresh();
    } else {
      alert(result.error ?? 'Αποτυχία διαγραφής.');
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-ink-soft">Σίγουρα;</span>
        <button type="button" onClick={handleDelete} disabled={busy} className="font-semibold text-danger hover:underline">
          {busy ? '…' : 'Ναι'}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-ink-soft hover:underline">
          Όχι
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-ink-soft underline underline-offset-4 hover:text-danger"
      aria-label={`Διαγραφή ${productName}`}
    >
      Διαγραφή
    </button>
  );
}
