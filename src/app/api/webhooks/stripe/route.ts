// POST /api/webhooks/stripe — δημιουργεί την παραγγελία στο
// checkout.session.completed και μειώνει το stock. Idempotent:
// το unique constraint στο stripe_session_id κόβει τα διπλά events.
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Λείπει το STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Misconfigured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error('Invalid webhook signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    await handleCompletedCheckout(session);
  } catch (err) {
    console.error('Webhook processing error:', err);
    // 500 => το Stripe θα ξαναπροσπαθήσει (retry) — θέλουμε να μη χαθεί παραγγελία
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCompletedCheckout(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  // Idempotency: αν υπάρχει ήδη order για αυτό το session, τελειώσαμε.
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle();
  if (existing) return;

  // Γραμμές παραγγελίας από το Stripe (με τα product metadata που βάλαμε
  // στο /api/checkout) — αξιόπιστη πηγή, όχι ο client.
  const lineItems = await getStripe().checkout.sessions.listLineItems(
    session.id,
    { limit: 100, expand: ['data.price.product'] },
  );

  // Διεύθυνση αποστολής: το πεδίο μετακινήθηκε μεταξύ εκδόσεων του Stripe
  // API, οπότε ελέγχουμε και τις δύο θέσεις.
  const shipping =
    (session as unknown as { shipping_details?: { name?: string; address?: object } })
      .shipping_details ??
    (session as unknown as {
      collected_information?: { shipping_details?: { name?: string; address?: object } };
    }).collected_information?.shipping_details ??
    null;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      stripe_session_id: session.id,
      email: session.customer_details?.email ?? '',
      customer_name:
        shipping?.name ?? session.customer_details?.name ?? '',
      shipping_address: shipping?.address ?? {},
      amount_cents: session.amount_total ?? 0,
      currency: session.currency ?? 'eur',
      status: 'paid',
    })
    .select('id')
    .single();

  if (orderError) {
    // 23505 = unique violation: άλλο retry πρόλαβε να γράψει το order — ΟΚ.
    if (orderError.code === '23505') return;
    throw orderError;
  }

  for (const item of lineItems.data) {
    const product = item.price?.product as Stripe.Product | null;
    const meta = product?.metadata ?? {};
    const quantity = item.quantity ?? 1;

    const { error: itemError } = await supabase.from('order_items').insert({
      order_id: order.id,
      variant_id: meta.variant_id || null,
      product_name: meta.product_name || item.description || 'Προϊόν',
      size: meta.size || '-',
      color: meta.color || '-',
      unit_price_cents: item.price?.unit_amount ?? 0,
      quantity,
    });
    if (itemError) throw itemError;

    if (meta.variant_id) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        p_variant_id: meta.variant_id,
        p_qty: quantity,
      });
      if (stockError) throw stockError;
    }
  }
}
