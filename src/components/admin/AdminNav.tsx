'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Επισκόπηση', exact: true },
  { href: '/admin/products', label: 'Προϊόντα' },
  { href: '/admin/orders', label: 'Παραγγελίες' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Διαχείριση" className="hidden sm:block">
      <ul className="flex items-center gap-1">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
