import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/queries';
import { Gallery } from '@/components/shop/Gallery';
import { VariantSelector } from '@/components/shop/VariantSelector';
import { formatPrice, productImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Δεν βρέθηκε' };

  const image = [...product.product_images].sort(
    (a, b) => a.position - b.position,
  )[0];

  return {
    title: product.name,
    description:
      product.description.slice(0, 150) ||
      `${product.name} — ${product.category.name} από την Τραντισιοναλ.`,
    openGraph: {
      title: product.name,
      images: image ? [productImageUrl(image.storage_path)] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const totalStock = product.product_variants.reduce((s, v) => s + v.stock, 0);
  const image = [...product.product_images].sort(
    (a, b) => a.position - b.position,
  )[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    category: product.category.name,
    ...(image ? { image: productImageUrl(image.storage_path) } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (product.price_cents / 100).toFixed(2),
      availability:
        totalStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <main id="main" className="mx-auto w-full max-w-site flex-1 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/shop" className="hover:text-ink">Κατάστημα</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop/${product.category.slug}`}
              className="hover:text-ink"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={product.product_images} productName={product.name} />

        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold tabular-nums">
            {formatPrice(product.price_cents)}
            <span className="ml-2 text-xs font-normal text-ink-soft">
              περιλαμβάνει ΦΠΑ 24%
            </span>
          </p>

          <VariantSelector product={product} />

          {product.description && (
            <div className="rule-linen mt-10 pt-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest">
                Περιγραφή
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {product.description}
              </p>
            </div>
          )}

          <div className="rule-linen mt-10 pt-8 text-sm text-ink-soft">
            <p>Αποστολή σε Ελλάδα &amp; ΕΕ · Επιστροφές εντός 14 ημερών</p>
          </div>
        </div>
      </div>
    </main>
  );
}
