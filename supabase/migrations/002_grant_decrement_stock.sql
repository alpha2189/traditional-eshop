-- ============================================================
-- 002 — Δικαίωμα εκτέλεσης της decrement_stock στον service_role
-- (το χρησιμοποιεί το Stripe webhook για ατομική μείωση stock).
-- Τρέξε το στο SQL Editor αν δεν το έχεις ήδη κάνει.
-- ============================================================
grant execute on function public.decrement_stock(uuid, int) to service_role;
