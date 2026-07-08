'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-site flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Κάτι πήγε στραβά</h1>
      <p className="mt-3 max-w-sm text-sm text-ink-soft">
        Δεν μπορέσαμε να φορτώσουμε τη σελίδα. Δοκίμασε ξανά — αν επιμένει,
        έλεγξε ότι τα Supabase κλειδιά στο .env.local είναι σωστά.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-8">
        Δοκίμασε ξανά
      </button>
    </main>
  );
}
