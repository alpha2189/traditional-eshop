import type { Metadata } from 'next';
import Link from 'next/link';
import { GENERAL_WORDS } from '@/lib/dictionary';
import { COLLECTIONS } from '@/lib/collections';
import { Seal } from '@/components/layout/Seal';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Το Λεξικό',
  description:
    'Το λεξικό της Τραντισιοναλ: παλιές ελληνικές λέξεις, εκφράσεις και παροιμίες με χιουμοριστικό ορισμό. Λιμοκοντόρος, σουρουκλεμές, μερακλής και πολλές ακόμα.',
  openGraph: {
    title: 'Το Λεξικό | Τραντισιοναλ',
    description:
      'Παλιές ελληνικές λέξεις με χιουμοριστικό ορισμό — φορεμένες, όχι ξεχασμένες.',
  },
};

interface Entry {
  word: string;
  pos: string;
  definition: string;
}

function EntryRow({ e }: { e: Entry }) {
  const long = e.word.length > 16;
  return (
    <li className="py-6">
      <p
        className={
          long
            ? 'font-display text-[5vw] font-bold leading-snug tracking-tight sm:text-xl'
            : 'font-display text-[6.5vw] font-bold leading-tight tracking-tight sm:text-3xl'
        }
      >
        {e.word}
        <span className="ml-2 align-middle font-body text-xs font-normal italic text-ink-soft sm:ml-3 sm:text-sm">
          {e.pos}
        </span>
      </p>
      <p className="lex-dash mt-2 max-w-2xl text-ink-soft">{e.definition}</p>
    </li>
  );
}

export default function LexikoPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-12 sm:px-6">
      <div className="relative">
        <Seal className="absolute right-0 top-0 hidden text-ink sm:block" size={92} />
        <p className="eyebrow">Το λεξικό μας</p>
        <h1 className="mt-3 font-display text-[12vw] font-bold leading-[1] tracking-tight sm:text-6xl">
          Λέξεις που άξιζαν καλύτερη τύχη
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          Παλιές ελληνικές λέξεις, εκφράσεις και παροιμίες — με τον ορισμό που
          τους αξίζει. Διάλεξε την αγαπημένη σου· κάπου εδώ γίνεται t-shirt.
        </p>
      </div>

      {/* Γενικές λέξεις */}
      <section className="mt-14">
        <h2 className="eyebrow border-t border-linen-deep pt-6">Οι λέξεις</h2>
        <ul className="mt-2 divide-y divide-linen">
          {GENERAL_WORDS.map((e) => (
            <EntryRow key={e.word} e={e} />
          ))}
        </ul>
      </section>

      {/* Ανά συλλογή */}
      {COLLECTIONS.map((col) => (
        <section key={col.slug} className="mt-14">
          <div className="flex items-baseline justify-between border-t border-linen-deep pt-6">
            <h2 className="eyebrow">{col.title}</h2>
            <Link
              href={`/collections/${col.slug}`}
              className="text-xs text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Δες τη συλλογή
            </Link>
          </div>
          <ul className="mt-2 divide-y divide-linen">
            {col.words.map((e) => (
              <EntryRow key={e.word} e={e} />
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-16 flex flex-wrap gap-3 border-t border-linen-deep pt-10">
        <Link href="/shop/t-shirts" className="btn-primary">
          Δες τα T-Shirts
        </Link>
        <Link href="/custom" className="btn-secondary">
          Δεν τη βρήκες; Φτιάξ' την
        </Link>
      </div>
    </main>
  );
}
