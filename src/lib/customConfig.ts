// Ρυθμίσεις για custom προϊόντα («φτιάξε το δικό σου»).
// ⚠️ ΑΛΛΑΞΕ τις τιμές (priceCents, σε λεπτά με ΦΠΑ) στις δικές σου.
// Η τιμή υπολογίζεται ΠΑΝΤΑ server-side από εδώ — ποτέ από τον client.

export interface CustomGarment {
  key: string;
  label: string;
  priceCents: number; // τελική τιμή με ΦΠΑ 24%
  colors: string[];
  sizes: string[];
}

export const CUSTOM_GARMENTS: CustomGarment[] = [
  {
    key: 'tshirt',
    label: 'T-Shirt',
    priceCents: 2790, // 27,90 € — ΑΛΛΑΞΕ ΤΟ
    colors: ['Λευκό', 'Μαύρο', 'Μπεζ'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    key: 'hoodie',
    label: 'Φούτερ',
    priceCents: 4690, // 46,90 € — ΑΛΛΑΞΕ ΤΟ
    colors: ['Μαύρο', 'Μπεζ'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    key: 'kids',
    label: 'Παιδικό',
    priceCents: 2290, // 22,90 € — ΑΛΛΑΞΕ ΤΟ
    colors: ['Λευκό', 'Μπεζ'],
    sizes: ['2-3', '4-5', '6-7', '8-9'],
  },
];

export const MAX_CUSTOM_LEN = 52;

export function getCustomGarment(key: string): CustomGarment | undefined {
  return CUSTOM_GARMENTS.find((g) => g.key === key);
}

/** Καθαρισμός κειμένου πελάτη: επιτρέπονται ελληνικά/λατινικά (κεφαλαία ΚΑΙ
 *  μικρά), αριθμοί, κενά και λίγα σημεία στίξης. Διατηρεί πεζά/κεφαλαία όπως
 *  τα έγραψε ο πελάτης. Κόβει στο μέγιστο μήκος. */
export function sanitizeCustomText(input: string): string {
  return input
    .replace(/[^Α-Ωα-ωΆ-ώA-Za-z0-9 .,!'&-]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart()
    .slice(0, MAX_CUSTOM_LEN);
}
