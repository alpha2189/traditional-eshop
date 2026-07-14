import Link from 'next/link';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { DictionaryHero } from '@/components/layout/DictionaryHero';
import { Seal } from '@/components/layout/Seal';

export default function Home() {
  return (
    <main id="main" className="flex-1">
      {/* Hero — η θέση του brand: παλιές ελληνικές λέξεις, με χιούμορ */}
      <section className="relative mx-auto w-full max-w-site px-4 py-16 sm:px-6 sm:py-24">
        {/* Σφραγίδα γνησιότητας — signature στοιχείο */}
        <Seal className="absolute right-4 top-14 hidden text-ink sm:right-6 sm:block lg:right-10" />

        <p className="eyebrow">Γνήσιο ελληνικό streetwear</p>
        <h1 className="mt-4 max-w-4xl font-display text-[9vw] font-bold leading-[1] tracking-tight sm:text-7xl lg:text-8xl">
          ΤΡΑΝΤΙΣΙΟΝΑΛ
        </h1>
        <p className="mt-6 max-w-lg text-lg text-ink-soft">
          Παλιές ελληνικές λέξεις, με χιούμορ που δεν παλιώνει. Τυπωμένες
          καθαρά, σε ρούχα που θα φοράς μέχρι να σε ρωτήσουν πού τα βρήκες.
        </p>

        <div className="mt-10">
          <DictionaryHero />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop/t-shirts" className="btn-primary">
            Δες τα T-Shirts
          </Link>
          <Link href="/custom" className="btn-secondary">
            Φτιάξε το δικό σου
          </Link>
        </div>
      </section>

      {/* Συλλογές μέσω λέξεων */}
      <section
        aria-labelledby="collections-heading"
        className="mx-auto w-full max-w-site px-4 py-14 sm:px-6"
      >
        <h2 id="collections-heading" className="eyebrow">
          Σε ποια κατηγορία ανήκεις;
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { slug: 'gia-ekeinon', title: 'Για εκείνον', tagline: 'Λέξεις με λεβεντιά' },
            { slug: 'gia-ekeini', title: 'Για εκείνη', tagline: 'Λέξεις με τσαγανό' },
            { slug: 'gia-tous-mikrous', title: 'Για τους μικρούς', tagline: 'Μικρά μεγέθη, μεγάλο χιούμορ' },
            { slug: 'ekfraseis', title: 'Ιδιωματικές εκφράσεις', tagline: 'Φράσεις που λέγαμε' },
            { slug: 'paroimies', title: 'Παροιμίες', tagline: 'Λαϊκή σοφία με χιούμορ' },
          ].map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                className="group flex h-full flex-col justify-between border border-linen-deep p-6 transition-colors hover:bg-linen"
              >
                <span className="text-[11px] uppercase tracking-widest text-ink-soft">
                  {c.tagline}
                </span>
                <span className="mt-8 font-display text-2xl font-bold tracking-tight">
                  {c.title}
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

      {/* Craft strip — premium reassurance */}
      <section className="mx-auto w-full max-w-site px-4 py-14 sm:px-6">
        <div className="grid gap-8 border-t border-linen-deep pt-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">Τυπωμένο στην Ελλάδα</p>
            <p className="mt-2 text-sm text-ink-soft">
              Σχεδιάζεται και τυπώνεται εδώ. Κοντά σου, από την πρώτη ραφή.
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-bold">Βαρύ, μαλακό βαμβάκι</p>
            <p className="mt-2 text-sm text-ink-soft">
              Ύφασμα που το νιώθεις. Στάμπες που αντέχουν πλυντήριο και σχόλια.
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-bold">Δώρο που θυμούνται</p>
            <p className="mt-2 text-sm text-ink-soft">
              Μια λέξη που ταιριάζει στον άνθρωπο. Γέλιο εγγυημένο στο άνοιγμα.
            </p>
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
            Μπες στο κόλπο πρώτος
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Νέες λέξεις, νέα σχέδια, πρώτες παραλαβές. Χωρίς spam — λόγω τιμής.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
