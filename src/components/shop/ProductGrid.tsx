import type { ProductWithRelations } from '@/lib/types';
import { ProductCard } from './ProductCard';

export interface ShopSearchParams {
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  sort?: string;
}

/** Εφαρμογή φίλτρων/ταξινόμησης από τα URL params. */
export function applyFilters(
  products: ProductWithRelations[],
  params: ShopSearchParams,
): ProductWithRelations[] {
  let result = products;

  if (params.size) {
    result = result.filter((p) =>
      p.product_variants.some((v) => v.size === params.size && v.stock > 0),
    );
  }
  if (params.color) {
    result = result.filter((p) =>
      p.product_variants.some((v) => v.color === params.color && v.stock > 0),
    );
  }
  const min = Number(params.min);
  if (params.min && !Number.isNaN(min)) {
    result = result.filter((p) => p.price_cents >= min * 100);
  }
  const max = Number(params.max);
  if (params.max && !Number.isNaN(max)) {
    result = result.filter((p) => p.price_cents <= max * 100);
  }

  switch (params.sort) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price_cents - b.price_cents);
      break;
    case 'price-desc':
      result = [...result].sort((a, b) => b.price_cents - a.price_cents);
      break;
    default:
      break; // newest — ήδη ταξινομημένα από τη βάση
  }

  return result;
}

/** Μοναδικά μεγέθη/χρώματα για τα dropdowns των φίλτρων. */
export function collectFacets(products: ProductWithRelations[]) {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  for (const p of products) {
    for (const v of p.product_variants) {
      sizes.add(v.size);
      colors.add(v.color);
    }
  }
  return { sizes: [...sizes], colors: [...colors] };
}

export function ProductGrid({
  products,
  emptyTitle = 'Τα προϊόντα έρχονται σύντομα',
  emptyBody = 'Ετοιμάζουμε τη συλλογή. Πέρνα ξανά σε λίγες μέρες.',
}: {
  products: ProductWithRelations[];
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rule-linen w-16" />
        <h2 className="mt-8 font-display text-2xl font-bold">{emptyTitle}</h2>
        <p className="mt-3 max-w-sm text-sm text-ink-soft">{emptyBody}</p>
        <div className="rule-linen mt-8 w-16" />
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
