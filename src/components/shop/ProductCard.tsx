import Image from 'next/image';
import Link from 'next/link';
import type { ProductWithRelations } from '@/lib/types';
import { formatPrice, productImageUrl } from '@/lib/utils';

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = [...product.product_images].sort(
    (a, b) => a.position - b.position,
  )[0];
  const totalStock = product.product_variants.reduce(
    (sum, v) => sum + v.stock,
    0,
  );

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus-visible:ring-2 focus-visible:ring-ink"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        {image ? (
          <Image
            src={productImageUrl(image.storage_path)}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center font-display
              text-4xl font-extrabold text-linen-deep"
            aria-hidden="true"
          >
            Τ
          </div>
        )}
        {totalStock === 0 && (
          <span className="absolute left-0 top-3 bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-widest text-paper">
            Εξαντλημένο
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-sm font-semibold tabular-nums">
          {formatPrice(product.price_cents)}
        </p>
      </div>
      <p className="mt-0.5 text-xs text-ink-soft">{product.category.name}</p>
    </Link>
  );
}
