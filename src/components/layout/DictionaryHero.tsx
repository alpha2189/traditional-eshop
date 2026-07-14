'use client';

// Το «signature» του brand: κάθε παλιά λέξη σαν λήμμα λεξικού με
// χιουμοριστικό ορισμό. Premium εμφάνιση: λεπτή κορνίζα + ένδειξη σελίδας.
// Σέβεται το prefers-reduced-motion (τότε δείχνει στατικά την πρώτη).
import { useEffect, useState } from 'react';
import { GENERAL_WORDS } from '@/lib/dictionary';

export function DictionaryHero() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % GENERAL_WORDS.length);
        setFading(false);
      }, 350);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  const entry = GENERAL_WORDS[index];

  return (
    <div className="frame relative bg-paper px-6 py-7 sm:px-8">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Από το λεξικό μας</p>
        <p className="font-body text-[11px] tabular-nums text-ink-soft">
          {String(index + 1).padStart(2, '0')} / {GENERAL_WORDS.length}
        </p>
      </div>

      <div
        className={`mt-4 transition-opacity duration-300 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <p className="font-display text-[6.5vw] font-bold leading-tight tracking-tight sm:text-4xl">
          {entry.word}
          <span className="ml-2 align-middle font-body text-xs font-normal italic text-ink-soft sm:ml-3 sm:text-sm">
            {entry.pos}
          </span>
        </p>
        <p className="lex-dash mt-2 max-w-xl text-ink-soft">{entry.definition}</p>
      </div>
    </div>
  );
}
