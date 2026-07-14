import Link from 'next/link';

export function Footer() {
  return (
    <footer className="rule-linen mt-auto">
      <div className="mx-auto grid w-full max-w-site gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div>
          <p className="font-display text-lg font-extrabold">ΤΡΑΝΤΙΣΙΟΝΑΛ</p>
          <p className="mt-2 text-sm text-ink-soft">
            Streetwear με καθαρές γραμμές.
            <br />
            Σχεδιασμένο στην Ελλάδα.
          </p>
        </div>

        <nav aria-label="Κατάστημα">
          <p className="text-xs font-semibold uppercase tracking-widest">
            Κατάστημα
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/shop/t-shirts" className="hover:text-ink">T-Shirts</Link></li>
            <li><Link href="/custom" className="hover:text-ink">Φτιάξε το δικό σου</Link></li>
          </ul>
        </nav>

        <nav aria-label="Συλλογές">
          <p className="text-xs font-semibold uppercase tracking-widest">
            Συλλογές
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/collections/gia-ekeinon" className="hover:text-ink">Για εκείνον</Link></li>
            <li><Link href="/collections/gia-ekeini" className="hover:text-ink">Για εκείνη</Link></li>
            <li><Link href="/collections/gia-tous-mikrous" className="hover:text-ink">Για τους μικρούς</Link></li>
            <li><Link href="/collections/ekfraseis" className="hover:text-ink">Ιδιωματικές εκφράσεις</Link></li>
            <li><Link href="/collections/paroimies" className="hover:text-ink">Παροιμίες</Link></li>
          </ul>
        </nav>

        <nav aria-label="Πληροφορίες">
          <p className="text-xs font-semibold uppercase tracking-widest">
            Πληροφορίες
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/shipping-returns" className="hover:text-ink">Αποστολές &amp; Επιστροφές</Link></li>
            <li><Link href="/withdrawal" className="hover:text-ink">Δικαίωμα Υπαναχώρησης</Link></li>
            <li><Link href="/terms" className="hover:text-ink">Όροι Χρήσης</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">Πολιτική Απορρήτου</Link></li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest">
            Επικοινωνία
          </p>
          <p className="mt-3 text-sm text-ink-soft">traditional@gmail.com</p>
        </div>
      </div>

      <div className="rule-linen">
        <p className="mx-auto max-w-site px-4 py-4 text-xs text-ink-soft sm:px-6">
          © {new Date().getFullYear()} Τραντισιοναλ. Οι τιμές περιλαμβάνουν ΦΠΑ 24%.
        </p>
      </div>
    </footer>
  );
}
