import Link from 'next/link';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

const CATEGORIES = [
  { slug: 't-shirts', name: 'T-Shirts', tagline: 'Το βασικό, σωστά' },
  { slug: 'hoodies', name: 'Φούτερ', tagline: 'Βαρύ βαμβάκι, καθαρή γραμμή' },
  { slug: 'hats', name: 'Καπέλα', tagline: 'Χαμηλό προφίλ' },
  { slug: 'socks', name: 'Κάλτσες', tagline: 'Η λεπτομέρεια μετράει' },
];

export default function Home() {
  return (
    <main id="main" className="flex-1">
      {/* Hero */}
      <section className="mx-auto w-full max-w-site px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
          Traditional — Ελληνικό streetwear
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          ΤΡΑΝΤΙΣΙΟΝΑΛ
        </h1>
        <p className="mt-6 max-w-md text-ink-soft">
          Ρούχα που φοριούνται κάθε μέρα. Καθαρές γραμμές, τίμια υλικά, χωρίς
          περιττά.
        </p>
        <div className="mt-10">
          <Link href="/shop" className="btn-primary">
            Δες τη συλλογή
          </Link>
        </div>
      </section>

      <div className="rule-linen" />

      {/* Κατηγορίες */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-site px-4 py-16 sm:px-6"
      >
        <h2
          id="categories-heading"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft"
        >
          Κατηγορίες
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/shop/${cat.slug}`}
                className="group flex aspect-square flex-col justify-between
                  bg-linen p-6 transition-colors hover:bg-linen-deep"
              >
                <span className="text-xs uppercase tracking-widest text-ink-soft">
                  {cat.tagline}
                </span>
                <span className="font-display text-3xl font-extrabold tracking-tight">
                  {cat.name}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="rule-linen" />

      {/* Newsletter */}
      <section
        aria-labelledby="newsletter-heading"
        className="mx-auto w-full max-w-site px-4 py-16 sm:px-6"
      >
        <div className="max-w-lg">
          <h2
            id="newsletter-heading"
            className="font-display text-2xl font-bold"
          >
            Μάθε πρώτος για νέες κυκλοφορίες
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Χωρίς spam. Μόνο όταν έχουμε κάτι καινούργιο.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
