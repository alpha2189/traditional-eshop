/** Μορφοποίηση τιμής: 2490 -> "24,90 €" (τιμές ΠΑΝΤΑ με ΦΠΑ 24%). */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

/** Slug από ελληνικό/λατινικό όνομα προϊόντος. */
export function slugify(input: string): string {
  const greekMap: Record<string, string> = {
    α: 'a', ά: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', έ: 'e', ζ: 'z',
    η: 'i', ή: 'i', θ: 'th', ι: 'i', ί: 'i', ϊ: 'i', ΐ: 'i', κ: 'k',
    λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'o', π: 'p', ρ: 'r',
    σ: 's', ς: 's', τ: 't', υ: 'y', ύ: 'y', ϋ: 'y', ΰ: 'y', φ: 'f',
    χ: 'ch', ψ: 'ps', ω: 'o', ώ: 'o',
  };

  return input
    .toLowerCase()
    .split('')
    .map((ch) => greekMap[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Public URL εικόνας από path στο bucket product-images. */
export function productImageUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}
