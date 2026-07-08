// Stripe server-side client (lazy singleton — δεν σκάει στο build αν λείπει
// προσωρινά το key). Test/live mode αλλάζει ΜΟΝΟ από το .env.local.
import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        'Λείπει το STRIPE_SECRET_KEY από το .env.local — βλ. οδηγίες Φάσης 3.',
      );
    }
    client = new Stripe(key, { apiVersion: '2025-02-24.acacia', typescript: true });
  }
  return client;
}
