# VMF Holidays — Optimization & Feature Roadmap

Agreed backlog of suggestions. **Online payment is intentionally out of scope** —
VMF converts leads offline. Items are grouped by theme; status reflects this build.

> Legend: ✅ done · 🔨 in progress · ⬜ planned · ⛔ out of scope
> Effort: S (small) · M (medium) · L (large) · keys = needs an account/API key

## Conversion & revenue
- ⛔ ~~Online deposit/payment gateway (Razorpay)~~ — out of scope; leads convert offline.
- ⬜ **Group-departures calendar** (L) — fixed-date trips with seat counts; recurring
  revenue + feeds the Travellers Club group trips.
- ⬜ **Package comparison** (M) — compare 2–3 packages side by side.
- ⬜ **Download itinerary as PDF** (M) — gated by email = lead capture.
- ⬜ **Newsletter / email capture** (S) — store as a lead source; drip via Resend.
- ⬜ **Sticky quote CTA / exit-intent** (S) — note: a WhatsApp float already exists.

## SEO / traffic
- ✅ **Reviews + `aggregateRating` schema** (S) — mark up real testimonials (this build).
- ⬜ **Programmatic SEO pages** (M) — destination × category landing pages
  ("Bali Honeymoon Packages", "Kerala Family Tours") from package data.
- ⬜ **Destination guide pages** (M) — things-to-do/best-time content per destination.
- ⬜ **`TouristTrip` schema** on packages (S) — richer than the current Product schema.
- ✅ **General FAQ page + `FAQPage` schema** (S) — this build.
- ⬜ **Site search** (M) — packages/destinations search.
- ⬜ **Hindi / `hreflang`** (L) — India-market localisation.

## Trust & UX
- ⬜ **Trust strip / badges** (S) — registrations, "no hidden fees", secure marks
  (needs the actual logos/registration numbers from the owner).
- 🔨 **Accessibility pass** (S) — `aria-expanded` on the menu (this build), plus
  ongoing: contrast on muted text, focus states, image alt text.
- ⬜ **Real Google reviews widget** (S, keys) — pull GBP reviews (the real star driver).

## AI / differentiation
- ⬜ **AI trip-planner / WhatsApp concierge** (L, keys) — Claude-powered 24/7
  concierge that answers, suggests packages and captures the lead.

## Performance
- ⬜ **Bundle Leaflet** (S) — drop the `unpkg.com` runtime load (blocked in the
  authoring sandbox by the Prisma engine download; do it in a normal env).
- ⬜ **Trim framer-motion/Lenis on low-end mobile + lazy-load below-fold** (M).

## Backend / security / ops
- ⬜ **Cloudflare Turnstile** (S, keys) + **distributed rate-limit (Upstash)** (M, keys).
- ⬜ **Staff lead alerts to WhatsApp/Slack** (S) — currently email only.
- ⬜ **Admin analytics dashboard** (M) — lead source → conversion.
- ⬜ **Error monitoring (Sentry)** (S, keys) + **automated email drip** (M).

---

### Notes on the constraints
This roadmap is being built in a sandbox that **can't run the DB, build, or app**
(only ESLint) and **can't push** — so work ships as lint-clean patches, verified on
the Vercel preview. Items marked **keys** need the owner's account/API credentials to
function and are best finished in a normal environment.
