import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActiveProducts, getCategoryBySlug } from '@/lib/queries';
import { Filters } from '@/components/shop/Filters';
import {
  ProductGrid,
  applyFilters,
  collectFacets,
  type ShopSearchParams,
} from '@/components/shop/ProductGrid';

export const dynamic = 'force-dynamic';

interface Props {
  params: { category: string };
  searchParams: ShopSearchParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: 'Δεν βρέθηκε' };
  return {
    title: category.name,
    description: `${category.name} από την Τραντισιοναλ. Τιμές με ΦΠΑ 24%.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const products = await getActiveProducts(category.id);
  const { sizes, colors } = collectFacets(products);
  const filtered = applyFilters(products, searchParams);

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {category.name}
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
              ? `${category.name}: έρχονται σύντομα`
              : 'Κανένα προϊόν με αυτά τα φίλτρα'
          }
          emptyBody={
            products.length === 0
              ? 'Η κατηγορία γεμίζει σιγά σιγά. Ρίξε μια ματιά στις υπόλοιπες.'
              : 'Δοκίμασε να καθαρίσεις κάποιο φίλτρο.'
          }
        />
      </div>
    </main>
  );
}
