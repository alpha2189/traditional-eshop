'use client';

// Cookie consent GDPR-friendly. ΔΕΝ φορτώνει κανένα script παρακολούθησης
// πριν τη συγκατάθεση. Η επιλογή αποθηκεύεται τοπικά (localStorage).
// Όταn προσθέσεις analytics στο μέλλον, φόρτωσέ τα ΜΟΝΟ αν consent === 'accepted'.
import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'traditional-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage μη διαθέσιμο — μη δείχνεις banner
    }
  }, []);

  function decide(choice: 'accepted' | 'declined') {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      // αγνόησε
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Συγκατάθεση cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-linen-deep bg-paper"
    >
      <div className="mx-auto flex w-full max-w-site flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="flex-1 text-sm text-ink-soft">
          Χρησιμοποιούμε μόνο απαραίτητα cookies για τη λειτουργία του καλαθιού.
          Δεν υπάρχει παρακολούθηση χωρίς τη συγκατάθεσή σου. Δες την{' '}
          <Link href="/privacy" className="text-ink underline underline-offset-2">
            Πολιτική Απορρήτου
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide('declined')}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Μόνο απαραίτητα
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="btn-primary px-4 py-2 text-xs"
          >
            Αποδοχή όλων
          </button>
        </div>
      </div>
    </div>
  );
}
