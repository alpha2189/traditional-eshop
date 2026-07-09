'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function MobileNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  // ESC κλείνει· κλείδωμα scroll όσο είναι ανοιχτό.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
        className="flex h-10 w-10 items-center justify-center hover:bg-linen"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop — κλείνει με κλικ έξω, καλύπτει το hero από κάτω */}
          <button
            type="button"
            aria-label="Κλείσιμο μενού"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-ink/30"
          />
          <nav
            id="mobile-menu"
            aria-label="Κατηγορίες"
            className="absolute inset-x-0 top-16 z-50 border-b border-linen-deep bg-paper shadow-lg"
          >
            <ul className="mx-auto max-w-site px-4 py-2 sm:px-6">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-linen py-3.5 text-base font-medium last:border-0 hover:bg-linen"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
