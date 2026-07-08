// POST /api/checkout — δημιουργεί Stripe Checkout Session.
// ΑΣΦΑΛΕΙΑ: τιμές & stock διαβάζονται ΑΠΟ ΤΗ ΒΑΣΗ, ποτέ από τον client.
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';
import { productImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Χώρες αποστολής: Ελλάδα + ΕΕ
const ALLOWED_COUNTRIES = [
  'GR', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
] as const;

// Μεταφορικά (σε λεπτά) — άλλαξέ τα εδώ όποτε θες.
const SHIPPING_GR_CENTS = 350; // Ελλάδα: 3,50 €
const SHIPPING_EU_CENTS = 990; // Υπόλοιπη ΕΕ: 9,90 €

interface CheckoutLine {
  variantId: string;
  quantity: number;
}

export async function POST(request: Request) {
  let body: { lines?: CheckoutLine[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Μη έγκυρο αίτημα.' }, { status: 400 });
  }

  const lines = (body.lines ?? []).filter(
    (l) =>
      typeof l?.variantId === 'string' &&
      Number.isInteger(l?.quantity) &&
      l.quantity > 0 &&
      l.quantity <= 50,
  );

  if (lines.length === 0 || lines.length > 30) {
    return NextResponse.json({ error: 'Το καλάθι είναι άδειο.' }, { status: 400 });
  }

  // Φόρτωση variants από τη βάση (anon client + RLS: μόνο active προϊόντα)
  const supabase = createClient();
  const { data: variants, error } = await supabase
    .from('product_variants')
    .select(
      'id, size, color, stock, product:products(id, name, slug, price_cents, status, product_images(storage_path, position))',
    )
    .in('id', lines.map((l) => l.variantId));

  if (error) {
    return NextResponse.json(
      { error: 'Πρόβλημα επικοινωνίας με τη βάση. Δοκίμασε ξανά.' },
      { status: 500 },
    );
  }

  const variantMap = new Map((variants ?? []).map((v) => [v.id, v]));

  const lineItems = [];
  for (const line of lines) {
    const variant = variantMap.get(line.variantId);
    const product = Array.isArray(variant?.product)
      ? variant?.product[0]
      : variant?.product;

    if (!variant || !product) {
      return NextResponse.json(
        { error: 'Κάποιο προϊόν του καλαθιού δεν είναι πλέον διαθέσιμο. Άδειασε το καλάθι και δοκίμασε ξανά.' },
        { status: 409 },
      );
    }
    if (variant.stock < line.quantity) {
      return NextResponse.json(
        {
          error: `Το «${product.name}» (${variant.size}/${variant.color}) έχει μόνο ${variant.stock} διαθέσιμα τεμάχια. Μείωσε την ποσότητα.`,
        },
        { status: 409 },
      );
    }

    const image = [...(product.product_images ?? [])].sort(
      (a, b) => a.position - b.position,
    )[0];

    lineItems.push({
      quantity: line.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: product.price_cents, // τιμή ΑΠΟ ΤΗ ΒΑΣΗ, με ΦΠΑ
        product_data: {
          name: `${product.name} — ${variant.size} / ${variant.color}`,
          ...(image ? { images: [productImageUrl(image.storage_path)] } : {}),
          metadata: {
            // Τα διαβάζει το webhook για να φτιάξει το order & να μειώσει stock
            variant_id: variant.id,
            product_name: product.name,
            size: variant.size,
            color: variant.color,
          },
        },
      },
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: [...ALLOWED_COUNTRIES],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Ελλάδα — Κούριερ (1–3 εργάσιμες)',
            type: 'fixed_amount',
            fixed_amount: { amount: SHIPPING_GR_CENTS, currency: 'eur' },
          },
        },
        {
          shipping_rate_data: {
            display_name: 'Ευρωπαϊκή Ένωση (5–10 εργάσιμες)',
            type: 'fixed_amount',
            fixed_amount: { amount: SHIPPING_EU_CENTS, currency: 'eur' },
          },
        },
      ],
      locale: 'el',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Η υπηρεσία πληρωμών δεν αποκρίνεται. Δοκίμασε σε λίγο.' },
      { status: 502 },
    );
  }
}
