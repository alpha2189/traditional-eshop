'use client';

// Placeholder newsletter — δεν στέλνει πουθενά ακόμα.
// Όταν διαλέξεις πάροχο (π.χ. Mailchimp/Resend), κουμπώνει εδώ.
import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setDone(true);
  }

  if (done) {
    return (
      <p className="mt-6 border border-linen-deep bg-linen px-4 py-3 text-sm" role="status">
        Ευχαριστούμε! Θα τα πούμε σύντομα. (Placeholder — δεν αποθηκεύτηκε
        πουθενά ακόμα.)
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 flex max-w-md gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="min-w-0 flex-1 border border-linen-deep bg-paper px-4 py-3
          text-sm placeholder:text-ink-soft focus:border-ink"
      />
      <button type="submit" className="btn-primary">
        Εγγραφή
      </button>
    </form>
  );
}
