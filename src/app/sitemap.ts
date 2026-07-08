import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const staticRoutes = [
    '', '/shop', '/shop/t-shirts', '/shop/hoodies', '/shop/hats', '/shop/socks',
    '/privacy', '/terms', '/shipping-returns', '/withdrawal',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  // Δυναμικές σελίδες προϊόντων (μόνο active)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'active');
    productRoutes = (data ?? []).map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // Αν η βάση δεν είναι διαθέσιμη στο build, επέστρεψε μόνο static
  }

  return [...staticRoutes, ...productRoutes];
}
