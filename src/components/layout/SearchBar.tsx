'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={submit} role="search" className="relative">
      <label htmlFor="site-search" className="sr-only">
        Αναζήτηση προϊόντων
      </label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Αναζήτηση…"
        className="w-28 border border-linen-deep bg-paper px-3 py-1.5 text-sm
          placeholder:text-ink-soft focus:w-44 sm:w-40 sm:focus:w-56
          transition-[width]"
      />
      <button type="submit" className="sr-only">
        Αναζήτηση
      </button>
    </form>
  );
}
