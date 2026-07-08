const LABELS: Record<string, string> = {
  pending: 'Εκκρεμεί',
  paid: 'Πληρώθηκε',
  shipped: 'Απεστάλη',
  delivered: 'Παραδόθηκε',
};

const STYLES: Record<string, string> = {
  pending: 'bg-linen text-ink-soft',
  paid: 'bg-ink text-paper',
  shipped: 'bg-linen-deep text-ink',
  delivered: 'bg-linen text-ink',
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${STYLES[status] ?? 'bg-linen'}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
