// Server client (Server Components / Route Handlers / Server Actions).
// Διαβάζει το auth session από cookies — και πάλι με anon key + RLS.
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Καλέστηκε από Server Component — αγνοείται με ασφάλεια,
            // το middleware ανανεώνει τα sessions.
          }
        },
      },
    },
  );
}
