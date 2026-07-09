import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getActiveProductsInCategories,
  getCategoryBySlug,
  getChildCategories,
} from '@/lib/queries';
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

  // Γονική κατηγορία (π.χ. Παιδικά): μάζεψε και τις υποκατηγορίες,
  // ώστε η σελίδα να δείχνει και τα προϊόντα των παιδιών (π.χ. Δίδυμα).
  const children = await getChildCategories(category.id);
  const categoryIds = [category.id, ...children.map((c) => c.id)];
  const products = await getActiveProductsInCategories(categoryIds);

  const { sizes, colors } = collectFacets(products);
  const filtered = applyFilters(products, searchParams);

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {category.name}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {filtered.length}{' '}
        {filtered.length === 1 ? 'προϊόν' : 'προϊόντα'} · οι τιμές
        περιλαμβάνουν ΦΠΑ 24%
      </p>

      {/* Υποκατηγορίες (π.χ. Δίδυμα κάτω από Παιδικά) */}
      {children.length > 0 && (
        <nav aria-label="Υποκατηγορίες" className="mt-5">
          <ul className="flex flex-wrap gap-2">
            <li>
              <span className="inline-block border border-ink bg-ink px-3 py-1.5 text-xs font-medium text-paper">
                Όλα
              </span>
            </li>
            {children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/shop/${child.slug}`}
                  className="inline-block border border-linen-deep px-3 py-1.5 text-xs font-medium transition-colors hover:border-ink"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

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
