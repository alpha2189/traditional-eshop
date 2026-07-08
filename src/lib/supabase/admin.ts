// Service-role client — ΜΟΝΟ server-side (Stripe webhook).
// Παρακάμπτει το RLS. ΠΟΤΕ μην τον κάνεις import σε client component.
import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
