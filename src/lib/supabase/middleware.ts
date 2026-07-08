// Ανανεώνει ΜΟΝΟ το Supabase session σε κάθε request.
// ΚΑΝΕΝΑ redirect εδώ: η προστασία του /admin γίνεται αποκλειστικά μέσα
// από το admin layout (requireAdmin) και τη σελίδα login, που διαβάζουν
// τα cookies από την ΙΔΙΑ πηγή (cookies()). Έτσι middleware και server
// components δεν μπορούν να διαφωνήσουν -> κανένας βρόχος redirect.
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Ανανέωση session (κρατά το token ζωντανό). Δεν παίρνουμε αποφάσεις εδώ.
  await supabase.auth.getUser();

  return response;
}
