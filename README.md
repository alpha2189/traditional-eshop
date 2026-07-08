# Τραντισιοναλ — E-shop

Ηλεκτρονικό κατάστημα ρούχων (t-shirts, φούτερ, καπέλα, κάλτσες) χτισμένο με
Next.js 14, Supabase, Stripe και Tailwind CSS. Ελληνικό UI, τιμές με ΦΠΑ 24%,
αποστολές Ελλάδα + ΕΕ.

---

## Τεχνολογίες

- **Next.js 14** (App Router, TypeScript) — `src/app`
- **Tailwind CSS** — παλέτα λευκό/μπεζ/μαύρο
- **Supabase** — PostgreSQL, Auth, Storage (εικόνες προϊόντων), RLS
- **Stripe Checkout** — πληρωμές + webhook
- **Zustand** — καλάθι με persistence στο localStorage

---

## Τοπική εγκατάσταση

### 1. Προαπαιτούμενα
- Node.js 18.18+ (ή 20+)
- Λογαριασμός Supabase και Stripe
- Stripe CLI (για τοπικό webhook)

### 2. Εγκατάσταση
```bash
npm install
cp .env.example .env.local
```

### 3. Μεταβλητές περιβάλλοντος (`.env.local`)
| Μεταβλητή | Πού βρίσκεται |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → service_role (μυστικό!) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys → Publishable key |
| `STRIPE_WEBHOOK_SECRET` | από `stripe listen` (τοπικά) ή Stripe Dashboard (production) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` τοπικά · το domain σου σε production |

> ⚠️ Το `SUPABASE_SERVICE_ROLE_KEY` και το `STRIPE_SECRET_KEY` είναι μυστικά.
> Ποτέ μην τα κάνεις commit ή μοιραστείς. Το `.env.local` αγνοείται από το git.

### 4. Βάση δεδομένων
Στο Supabase → SQL Editor, τρέξε με τη σειρά:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_grant_decrement_stock.sql`

### 5. Δημιουργία admin χρήστη
1. Supabase → Authentication → Users → **Add user** (email + κωδικός, Auto Confirm)
2. Αντέγραψε το UID του και τρέξε στο SQL Editor:
   ```sql
   insert into public.admins (user_id) values ('ΤΟ-UID-ΣΟΥ');
   ```

### 6. Τοπικό webhook (Stripe CLI)
Σε ξεχωριστό terminal:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Αντέγραψε το `whsec_...` που τυπώνει στο `STRIPE_WEBHOOK_SECRET`.

### 7. Εκκίνηση
```bash
npm run dev
```
- Κατάστημα: http://localhost:3000
- Διαχείριση: http://localhost:3000/admin

Δοκιμαστική κάρτα Stripe: `4242 4242 4242 4242`, οποιαδήποτε μελλοντική
ημερομηνία, οποιοδήποτε CVC/ΤΚ.

---

## Δομή project

```
src/
  app/
    (legal)/          Νομικές σελίδες (privacy, terms, shipping, withdrawal)
    admin/
      login/          Σύνδεση (ΕΚΤΟΣ προστασίας)
      (main)/         Προστατευμένο: dashboard, προϊόντα, παραγγελίες
    api/
      checkout/       Δημιουργία Stripe session
      webhooks/stripe/ Order creation + stock decrement
    product/[slug]/   Σελίδα προϊόντος
    shop/             Κατάστημα + κατηγορίες
    cart/ search/     Καλάθι, αναζήτηση
  components/         layout, shop, cart, admin
  lib/                supabase, stripe, store (Zustand), queries, utils
supabase/migrations/  SQL
```

---

## Deployment στο Vercel

1. Ανέβασε τον κώδικα σε GitHub repo.
2. Vercel → **New Project** → import το repo (auto-detect Next.js).
3. **Environment Variables**: πρόσθεσε ΟΛΕΣ τις μεταβλητές του `.env.local`.
   - `NEXT_PUBLIC_SITE_URL` = το production domain (π.χ. `https://traditional.gr`)
4. **Deploy**.
5. Στο Supabase → Authentication → URL Configuration, πρόσθεσε το production
   domain στα allowed URLs.

---

## ✅ Go-live checklist (μετάβαση σε πραγματικές πληρωμές)

- [ ] **Stripe live keys**: στο Vercel άλλαξε `STRIPE_SECRET_KEY` και
      `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` από `sk_test_/pk_test_` σε
      `sk_live_/pk_live_` (Stripe → toggle σε Live mode → API keys).
- [ ] **Production webhook**: Stripe → Developers → Webhooks → Add endpoint →
      `https://το-domain-σου/api/webhooks/stripe` → event `checkout.session.completed`.
      Αντέγραψε το νέο `whsec_...` στο `STRIPE_WEBHOOK_SECRET` του Vercel.
- [ ] **Admin χρήστης** δημιουργημένος στη production βάση + εγγραφή στον πίνακα `admins`.
- [ ] **JWT secret** έχει γίνει rotate αν εκτέθηκε ποτέ κάποιο key.
- [ ] **Νομικές σελίδες** ενημερωμένες με πραγματικά στοιχεία (ΑΦΜ, επωνυμία,
      διεύθυνση) — δες `src/app/(legal)/`.
- [ ] **Στοιχεία επικοινωνίας** ενημερωμένα στο footer και στις νομικές σελίδες.
- [ ] **Μεταφορικά** ελεγμένα/προσαρμοσμένα στο `src/app/api/checkout/route.ts`
      (σταθερές `SHIPPING_GR_CENTS`, `SHIPPING_EU_CENTS`).
- [ ] **Δοκιμαστική live αγορά** με πραγματική κάρτα (μικρό ποσό) → επιβεβαίωση
      παραγγελίας στο `/admin/orders` και μείωσης αποθέματος.
- [ ] **Προϊόντα** προστεθειμένα με φωτογραφίες, ενεργά (status = active).
- [ ] `NEXT_PUBLIC_SITE_URL` δείχνει στο σωστό production domain.

---

## Χρήσιμες σημειώσεις

- **Μην τρέχεις `npm audit fix --force`** — αναβαθμίζει το Next.js σε breaking
  έκδοση. Αν χρειαστεί, `npm install next@14.2.35`.
- Οι τιμές αποθηκεύονται σε **λεπτά (cents)** στη βάση, με ΦΠΑ ήδη μέσα.
- Το καλάθι ζει στο localStorage· καθαρίζει μετά από επιτυχή πληρωμή.
- Οι εικόνες προϊόντων πάνε στο Supabase Storage bucket `product-images` (public read, admin write).
```
