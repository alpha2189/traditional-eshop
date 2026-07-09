'use client';

// Το «signature» του brand: κάθε παλιά λέξη σαν λήμμα λεξικού με
// χιουμοριστικό ορισμό. Εναλλάσσονται με διακριτικό fade. Σέβεται το
// prefers-reduced-motion (τότε δείχνει στατικά την πρώτη).
import { useEffect, useState } from 'react';

interface Entry {
  word: string;
  pos: string; // μέρος του λόγου
  definition: string;
}

const ENTRIES: Entry[] = [
  {
    word: 'ΛΙΜΟΚΟΝΤΟΡΟΣ',
    pos: 'ουσ. [ο]',
    definition:
      'ο κομψευόμενος που δεν έχει φράγκο — αλλά το στιλ δεν πληρώνεται.',
  },
  {
    word: 'ΣΟΥΡΟΥΚΛΕΜΕΣ',
    pos: 'ουσ. [ο]',
    definition: 'ο ατημέλητος που το έκανε τρόπος ζωής, με καμάρι.',
  },
  {
    word: 'ΤΕΜΠΕΛΧΑΝΑΣ',
    pos: 'ουσ. [ο]',
    definition: 'αυτός που ξεκουράζεται προληπτικά, πριν καν κουραστεί.',
  },
  {
    word: 'ΛΙΝΑΤΣΑΣ',
    pos: 'ουσ. [ο]',
    definition: 'ντύνεται φτηνά, το φοράει ακριβά. Στάση ζωής.',
  },
];

export function DictionaryHero() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduce) return;

    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ENTRIES.length);
        setFading(false);
      }, 350);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const entry = ENTRIES[index];

  return (
    <div
      className="border-t border-b border-linen-deep py-8"
      aria-live="off"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-soft">
        Από το λεξικό μας
      </p>
      <div
        className={`mt-3 transition-opacity duration-300 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {entry.word}
          <span className="ml-3 align-middle font-body text-sm font-normal italic text-ink-soft">
            {entry.pos}
          </span>
        </p>
        <p className="mt-2 max-w-xl text-ink-soft">— {entry.definition}</p>
      </div>
    </div>
  );
}
