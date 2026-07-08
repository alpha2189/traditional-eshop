// Κοινό layout για τις νομικές σελίδες — στενή στήλη, ευανάγνωστο.
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <article className="prose-legal">{children}</article>
    </main>
  );
}
