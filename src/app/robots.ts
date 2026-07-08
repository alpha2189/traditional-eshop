import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Μην κάνεις index admin, api, checkout, αναζήτηση, καλάθι
      disallow: ['/admin', '/api', '/checkout', '/search', '/cart'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
