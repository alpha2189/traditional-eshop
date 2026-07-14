import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COLLECTIONS, getCollection } from '@/lib/collections';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const col = getCollection(params.slug);
  if (!col) return { title: 'Δεν βρέθηκε' };
  return {
    title: col.title,
    description: `${col.title} — ${col.tagline}. ${col.intro}`,
    openGraph: { title: `${col.title} | Τραντισιοναλ`, description: col.tagline },
  };
}

export default function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const col = getCollection(params.slug);
  if (!col) notFound();

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
        Συλλογή
      </p>
      <h1 className="mt-3 font-display text-[10vw] font-bold leading-[1] tracking-tight sm:text-6xl">
        {col.title}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">{col.intro}</p>

      {/* Λήμματα λεξικού */}
      <section aria-label="Λέξεις" className="mt-12 border-t border-linen-deep">
        <ul className="divide-y divide-linen">
          {col.words.map((w) => {
            const long = w.word.length > 16;
            return (
              <li key={w.word} className="py-6">
                <p
                  className={
                    long
                      ? 'font-display text-[5vw] font-bold leading-snug tracking-tight sm:text-xl'
                      : 'font-display text-[6vw] font-bold leading-tight tracking-tight sm:text-3xl'
                  }
                >
                  {w.word}
                  <span className="ml-2 align-middle font-body text-xs font-normal italic text-ink-soft sm:ml-3 sm:text-sm">
                    {w.pos}
                  </span>
                </p>
                <p className="mt-2 max-w-2xl text-ink-soft">— {w.definition}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/shop" className="btn-primary">
          Δες τη συλλογή
        </Link>
        <Link href="/lexiko" className="btn-secondary">
          Όλο το λεξικό
        </Link>
      </div>
    </main>
  );
}
