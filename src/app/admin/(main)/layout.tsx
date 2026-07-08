import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { LogoutButton } from '@/components/admin/LogoutButton';

export const metadata: Metadata = {
  title: { default: 'Διαχείριση', template: '%s | Διαχείριση' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Προστασία: κάθε /admin/* σελίδα (εκτός login) απαιτεί admin.
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-linen-deep">
        <div className="mx-auto flex h-14 w-full max-w-site items-center gap-6 px-4 sm:px-6">
          <Link href="/admin" className="font-display text-base font-extrabold">
            ΤΡΑΝΤΙΣΙΟΝΑΛ
            <span className="ml-2 text-xs font-normal text-ink-soft">Διαχείριση</span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-ink-soft hover:text-ink"
            >
              Δες το κατάστημα ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-site flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
