import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-site flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-linen-deep">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">
        Η σελίδα δεν βρέθηκε
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink-soft">
        Ό,τι έψαχνες δεν υπάρχει εδώ — ίσως μετακόμισε ή γράφτηκε λάθος.
      </p>
      <Link href="/shop" className="btn-primary mt-8">
        Πίσω στο κατάστημα
      </Link>
    </main>
  );
}
