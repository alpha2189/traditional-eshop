import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Σύνδεση διαχειριστή',
  robots: { index: false },
};

// Η σελίδα login ΔΕΝ κάνει κανέναν έλεγχο auth και ΚΑΝΕΝΑ redirect.
// Δείχνει πάντα τη φόρμα (200). Έτσι είναι αδύνατο να δημιουργηθεί βρόχος:
// το μόνο redirect στο σύστημα είναι /admin -> /admin/login (από το
// requireAdmin, όταν δεν υπάρχει session). Μετά το login, το LoginForm
// κάνει router.push('/admin') με φρέσκα cookies.
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl font-extrabold tracking-tight">
          ΤΡΑΝΤΙΣΙΟΝΑΛ
        </p>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.3em] text-ink-soft">
          Διαχείριση
        </p>
        <div className="mt-8 border border-linen-deep p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
