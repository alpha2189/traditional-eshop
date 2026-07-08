'use client';

// Αδειάζει το καλάθι μόλις φορτώσει η σελίδα επιβεβαίωσης —
// η πληρωμή ολοκληρώθηκε, το καλάθι δεν χρειάζεται πια.
import { useEffect } from 'react';
import { useCart } from '@/lib/store/cart';

export function ClearCartOnMount() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
