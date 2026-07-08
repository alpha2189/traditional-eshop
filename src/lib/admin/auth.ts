// Ελέγχει ότι ο τρέχων χρήστης είναι ΚΑΙ συνδεδεμένος ΚΑΙ admin.
// Μοναδικό σημείο redirect προστασίας: /admin/* -> /admin/login.
import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Χωρίς session -> login (η σελίδα login ΔΕΝ κάνει redirect πίσω,
  // άρα δεν υπάρχει βρόχος).
  if (!user) redirect('/admin/login');

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) redirect('/admin/login?error=not-admin');

  return user;
}
