'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await createClient().auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm text-ink-soft hover:text-ink"
    >
      Αποσύνδεση
    </button>
  );
}
