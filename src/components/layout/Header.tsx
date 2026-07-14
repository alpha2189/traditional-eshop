import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { CartButton } from './CartButton';
import { MobileNav } from './MobileNav';

const NAV = [
  { href: '/shop/t-shirts', label: 'T-Shirts' },
  { href: '/custom', label: 'Φτιάξε το δικό σου' },
  { href: '/lexiko', label: 'Το Λεξικό' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-linen-deep bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-site items-center gap-4 px-4 sm:px-6">
        <MobileNav items={NAV} />

        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight"
          aria-label="Τραντισιοναλ — Αρχική"
        >
          ΤΡΑΝΤΙΣΙΟΝΑΛ
        </Link>

        <nav aria-label="Κατηγορίες" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBar />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
