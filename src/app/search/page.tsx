import type { Metadata } from 'next';
import { searchProducts } from '@/lib/queries';
import { ProductGrid } from '@/components/shop/ProductGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Αναζήτηση',
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const term = (searchParams.q ?? '').trim();
  const products = term ? await searchProducts(term) : [];

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Αναζήτηση
      </h1>
      {term ? (
        <p className="mt-1 text-sm text-ink-soft">
          {products.length}{' '}
          {products.length === 1 ? 'αποτέλεσμα' : 'αποτελέσματα'} για «{term}»
        </p>
      ) : (
        <p className="mt-1 text-sm text-ink-soft">
          Γράψε κάτι στην αναζήτηση πάνω δεξιά.
        </p>
      )}

      <div className="mt-10">
        {term && (
          <ProductGrid
            products={products}
            emptyTitle={`Τίποτα για «${term}»`}
            emptyBody="Δοκίμασε άλλη λέξη — ή δες όλη τη συλλογή από το μενού."
          />
        )}
      </div>
    </main>
  );
}
