// Signature στοιχείο: «σφραγίδα γνησιότητας». Ταιριάζει με το brand —
// τα προϊόντα είναι στάμπες/σφραγίδες. Κυκλικό κείμενο γύρω, μονόγραμμα στο
// κέντρο. Χρησιμοποιείται με φειδώ (hero, footer) για craft/premium αίσθηση.
export function Seal({
  size = 104,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Γνήσιο ελληνικό — Τραντισιοναλ"
    >
      <defs>
        <path
          id="seal-circle"
          d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
        />
      </defs>

      {/* Εξωτερικοί δακτύλιοι */}
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />

      {/* Κυκλικό κείμενο */}
      <text
        fill="currentColor"
        style={{ fontSize: '13px', letterSpacing: '3px', fontWeight: 600 }}
      >
        <textPath href="#seal-circle" startOffset="0%">
          ΤΡΑΝΤΙΣΙΟΝΑΛ · ΓΝΗΣΙΟ ΕΛΛΗΝΙΚΟ · ΤΡΑΝΤΙΣΙΟΝΑΛ · ΓΝΗΣΙΟ ΕΛΛΗΝΙΚΟ ·
        </textPath>
      </text>

      {/* Μονόγραμμα κέντρου */}
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-display), serif', fontSize: '46px', fontWeight: 700 }}
      >
        Τ
      </text>
      <text
        x="100"
        y="130"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontSize: '9px', letterSpacing: '2px', fontWeight: 600 }}
        opacity="0.7"
      >
        EST. MMXXVI
      </text>
    </svg>
  );
}
