import Link from 'next/link';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { DictionaryHero } from '@/components/layout/DictionaryHero';

const CATEGORIES = [
  { slug: 't-shirts', name: 'T-Shirts', tagline: 'Το βασικό, σωστά' },
  { slug: 'hoodies', name: 'Φούτερ', tagline: 'Βαρύ βαμβάκι' },
  { slug: 'hats', name: 'Καπέλα', tagline: 'Χαμηλό προφίλ' },
  { slug: 'socks', name: 'Κάλτσες', tagline: 'Η λεπτομέρεια μετράει' },
  { slug: 'kids', name: 'Παιδικά', tagline: 'Μικρά μεγέθη, μεγάλο χιούμορ' },
];

export default function Home() {
  return (
    <main id="main" className="flex-1">
      {/* Hero — η θέση του brand: παλιές ελληνικές λέξεις, με χιούμορ */}
      <section className="mx-auto w-full max-w-site px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
          Ελληνικό streetwear
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-8xl">
          ΤΡΑΝΤΙΣΙΟΝΑΛ
        </h1>
        <p className="mt-6 max-w-lg text-lg text-ink-soft">
          Παλιές λέξεις που ξέχασες πόσο σου λείπουν — τυπωμένες σε ρούχα που
          φοριούνται κάθε μέρα.
        </p>

        <div className="mt-10">
          <DictionaryHero />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">
            Δες τη συλλογή
          </Link>
          <Link href="/shop/kids" className="btn-secondary">
            Παιδικά &amp; Δίδυμα
          </Link>
        </div>
      </section>

      {/* Κατηγορίες */}
      <section
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-site px-4 py-14 sm:px-6"
      >
        <h2
          id="categories-heading"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft"
        >
          Κατηγορίες
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/shop/${cat.slug}`}
                className="group flex aspect-square flex-col justify-between
                  bg-linen p-5 transition-colors hover:bg-linen-deep"
              >
                <span className="text-[11px] uppercase tracking-widest text-ink-soft">
                  {cat.tagline}
                </span>
                <span className="font-display text-2xl font-bold tracking-tight">
                  {cat.name}
                  <span
                    aria-hidden="true"
                    className="ml-1.5 inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Concept strip — γιατί υπάρχουμε */}
      <section className="mx-auto w-full max-w-site px-4 py-14 sm:px-6">
        <div className="border-t border-linen-deep pt-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-display text-xl font-bold">Νοσταλγία που φοριέται</p>
              <p className="mt-2 text-sm text-ink-soft">
                Λέξεις από τα '90s και τα 2000s, με μια ματιά χιούμορ που τις
                φέρνει στο σήμερα.
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-bold">Τυπωμένο στην Ελλάδα</p>
              <p className="mt-2 text-sm text-ink-soft">
                Καθαρές στάμπες, τίμια υφάσματα. Ρούχα που αντέχουν στο πλυντήριο
                και στα σχόλια.
              </p>
            </div>
            <div>
              <p className="font-display text-xl font-bold">Και για τους μικρούς</p>
              <p className="mt-2 text-sm text-ink-soft">
                Παιδικά φορμάκια — και ειδικά σετ για δίδυμα, που κλέβουν την
                παράσταση.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        aria-labelledby="newsletter-heading"
        className="mx-auto w-full max-w-site px-4 py-14 sm:px-6"
      >
        <div className="max-w-lg border-t border-linen-deep pt-10">
          <h2 id="newsletter-heading" className="font-display text-2xl font-bold">
            Μάθε πρώτος για νέες λέξεις
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Χωρίς spam. Μόνο όταν βγαίνει κάτι καινούργιο.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
