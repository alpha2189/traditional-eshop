import type { Metadata } from 'next';
import { getActiveProducts } from '@/lib/queries';
import { Filters } from '@/components/shop/Filters';
import {
  ProductGrid,
  applyFilters,
  collectFacets,
  type ShopSearchParams,
} from '@/components/shop/ProductGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Κατάστημα',
  description:
    'Όλα τα προϊόντα Τραντισιοναλ: t-shirts, φούτερ, καπέλα, κάλτσες. Τιμές με ΦΠΑ 24%.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  const products = await getActiveProducts();
  const { sizes, colors } = collectFacets(products);
  const filtered = applyFilters(products, searchParams);

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Όλα τα προϊόντα
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {filtered.length}{' '}
        {filtered.length === 1 ? 'προϊόν' : 'προϊόντα'} · οι τιμές
        περιλαμβάνουν ΦΠΑ 24%
      </p>

      <div className="mt-8">
        <Filters sizes={sizes} colors={colors} />
      </div>

      <div className="mt-8">
        <ProductGrid
          products={filtered}
          emptyTitle={
            products.length === 0
              ? 'Τα προϊόντα έρχονται σύντομα'
              : 'Κανένα προϊόν με αυτά τα φίλτρα'
          }
          emptyBody={
            products.length === 0
              ? 'Ετοιμάζουμε τη συλλογή. Πέρνα ξανά σε λίγες μέρες.'
              : 'Δοκίμασε να καθαρίσεις κάποιο φίλτρο.'
          }
        />
      </div>
    </main>
  );
}
