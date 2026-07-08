import type { Metadata } from 'next';
import { Commissioner, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CookieConsent } from '@/components/layout/CookieConsent';

const display = Commissioner({
  subsets: ['latin', 'greek'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin', 'greek'],
  variable: '--font-body',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Τραντισιοναλ — Streetwear',
    template: '%s | Τραντισιοναλ',
  },
  description:
    'Τραντισιοναλ: t-shirts, φούτερ, καπέλα και κάλτσες. Ελληνικό streetwear με καθαρές γραμμές.',
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    siteName: 'Τραντισιοναλ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col font-body">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Μετάβαση στο περιεχόμενο
        </a>
        <Header />
        {children}
        <Footer />
        <CartDrawer />
        <CookieConsent />
      </body>
    </html>
  );
}
