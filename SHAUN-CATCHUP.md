# VMF Holidays — Catch-Up & Re-Onboarding Brief

**For:** Shaun (original developer, returning after a break)
**Purpose:** get your machine, database and mental model in sync with `main`.
**Repo:** `github.com/Bumb1ebee01/VMF-Holidays` · **Branch:** `main` · **Deploy:** Vercel (auto-deploys on every push to `main`).
**Reflects `main` @ `965b923`** · last updated 24 July 2026.

> Read **§0** (what's new), **§1** (sync) and **§3** (⚠️ database) first. The database
> is what silently breaks things if it's stale. Everything else is context.

---

## 0. What changed since you last pulled

### 🔴 24 July 2026 batch — do these three first

1. **`npm install`** — `sharp` is now a **direct dependency** (the PDF routes use it
   to normalise cover images to baseline JPEG). Skip it and the itinerary/quotation
   PDF routes throw at runtime.
2. **`npx prisma generate`** — two new columns.
3. **`npm run db:push` against YOUR local/dev DB** — adds `Package.published` and
   `Destination.published` (both default `true`). Production is already migrated;
   this is only so your machine's schema matches.

**What shipped (`781f724`…`1c1db40`):**

| What | Where |
|---|---|
| **PDF core rewrite** — fixed a blank 2nd page (cover overflow), stranded section headings, and footer/text overlap; the hero **now always renders** — the bundled/Unsplash JPEGs were *progressive*, which @react-pdf silently drops, so images are re-encoded to baseline via `sharp`. Local `/images/...` paths are read off disk too. | `lib/itinerary-pdf.tsx`, `lib/pdf-images.ts` |
| **Quote builder** — five **default cost rows** on every new quote, cost lines are now **editable** (not just add/remove), "Quote an enquiry" lead search folded into the Quotes **search bar**, and cost basis **defaults to the group total** (per-pax still available). | `components/admin/QuoteBuilder.tsx`, `QuoteSearchInput.tsx`, `quotes/actions.ts` |
| **"Show on website" toggle** — on **packages and destinations** (`published`). Off = kept in the CMS for quoting/itineraries only, hidden from the public site. | `Package.published`, `Destination.published`, `lib/queries.ts`, the two CMS forms |
| **Booking ↔ confirmed quote** — pick the winning quote when creating a booking (prefills total + pax, marks it accepted), or **"Accept & create booking"** straight from a quote. Booking shows the confirmed quote's per-pax × pax + margin. | `bookings/actions.ts`, `LeadBookingPanel.tsx`, `BookingQuotesPanel.tsx` |
| **Lead itinerary calendar** — start/end date pickers that auto-compute trip duration from the selected package (UTC-safe). | `components/admin/LeadItineraryPanel.tsx` |
| **Quotation PDF** — now shows the per-person price + a "What's included" section. | `lib/itinerary-pdf.tsx`, `app/api/quotation/[bookingId]` |

**🔑 Gotcha — the public/staff query split (don't get this wrong):** hiding a
package/destination must never break staff tools. `getAllPackages` stays
**unfiltered** (the lead itinerary picker and quoting use backend-only packages);
`getPublishedPackages` is the base for every **public** listing. `getAllDestinations`
is public-only, so it's filtered directly. `getPackageBySlug` stays unfiltered
(staff share route) — the public page/route 404 on `published === false`. If a
public listing ever shows a hidden item, someone pointed it at the unfiltered query.

---

### 20–22 July 2026

A lot landed on 20–22 July. In rough order of "will bite you if you don't know":

**🔴 Run `npx prisma generate` after pulling.** Several new tables exist. Skip it and
you get `Unknown field 'quotes' for include statement on model 'Booking'` and
similar. It happened twice during the build — the fix is always regenerate **and
restart the dev server**, since a running server caches the old client.

**🔴 There is now a test suite.** `npm test` — 234 tests, about 2 seconds. It covers
the money and access-control logic. Please run it before pushing; it's the safety
net that didn't exist before.

**New on `main`:**

| What | Where |
|---|---|
| **Quotes** — price a trip before it's booked, with revisions and options | `/admin/quotes`, `lib/pricing.ts`, `lib/quotes.ts` |
| **Group manifest** — per-traveller records + CSV | `components/admin/TravellerManifest.tsx`, `lib/travellers.ts` |
| **Enquiry references** — `VMF-XXXXXX`, first contact to invoice | `lib/refs.ts` |
| **Contact single-sourcing** — one home for phones/email/WhatsApp | `lib/contact.ts` |
| Quote margin + win-rate reporting, CSV export | `/admin/reports`, `lib/quote-analytics.ts` |
| Trip Builder progress bar | `components/forms/TripWizard.tsx` |

**Two real bugs fixed, both invisible to typechecking:**

- The send-itinerary tool took `.slice(-10)` of a customer's phone and prefixed
  `91`. A UK number `+44 7700 900123` became a valid *Indian* number — a customer's
  itinerary would have gone to a stranger. **Never assume Indian numbers**; use
  `normalizeWhatsAppNumber()` in `lib/contact.ts`.
- Manifest birth dates were stored at *local* midnight, so their UTC date was the
  previous day and every save shifted them a day earlier. Date-only values are now
  anchored to UTC midnight.

**Your 2FA branch is still yours:** `feature/admin-2fa-totp`, unmerged, with
`ADMIN-2FA-HANDOFF.md` on it. Its schema columns are **already live** in the
database (see §3), so don't `db:push` from `main` expecting to add them.

---

## 1. Get in sync (do this first)

```bash
git checkout main
git pull
npm install             # vitest was added
npx prisma generate     # ← REQUIRED, see §0
npm test                # 234 tests should pass
npm run dev             # http://localhost:3000
```

**Requirements:** Node 18+ (20 LTS recommended), npm. Stack is **Next.js 16.2.7
(App Router)**, **React 19 + React Compiler**, **Prisma 7** with the
`@prisma/adapter-pg` driver adapter, PostgreSQL.

> ⚠️ This is **not** the Next.js you may remember — Next 16 has real breaking
> changes (async `params`/`searchParams`, `proxy.ts` middleware). See `AGENTS.md`;
> it tells you to read the bundled docs in `node_modules/next/dist/docs/` before
> writing routing code.

---

## 2. Environment variables

Copy `.env.example` → `.env`. The important ones:

| Var | What it's for | Notes |
|---|---|---|
| `DATABASE_URL` | Postgres connection | **See §3** — do NOT point local dev at production. |
| `AUTH_SECRET` | Signs admin session JWTs (jose) | Any long random string locally. ⚠️ Also derives the key encrypting TOTP secrets on your 2FA branch — rotating it breaks every enrolled authenticator (backup codes survive). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seeds the initial admin user | Used by `npm run db:seed`. |
| `RESEND_API_KEY` | Transactional email | ⚠️ **Currently broken in production** — see §7. |
| `ENQUIRY_TO` / `ENQUIRY_FROM` | Enquiry email routing | From-address must be a verified Resend domain. |
| `CLOUDINARY_*` | Admin image uploads | |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile | Unset → widget hides, verification no-ops. Fine locally. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Distributed rate limiting | **Unset in production** — falls back to an in-memory limiter, which on Vercel is per-serverless-instance, so the login brute-force cap leaks across instances. Worth fixing. |
| `NEXT_PUBLIC_GA_ID` | GA4 | **Deliberately empty** until the final production domain. |
| `WHATSAPP_*` | Auto-confirm via WhatsApp Cloud API | Optional; skipped when unset. |

---

## 3. ⚠️ Database — the part that matters most

Production uses **Neon (PostgreSQL)**. **Do NOT point your local `DATABASE_URL` at
it** — dev and tests can mutate real data.

- **Option A (simplest):** `npm run db:dev` spins up a local Postgres and prints a
  `127.0.0.1` URL.
- **Option B:** create a Neon dev branch and use its connection string.

Then:

```bash
npm run db:push     # applies the schema to YOUR database
npm run db:seed     # destinations, packages, blog, offers, gallery, testimonials, admin
npm run db:geo      # Trip Builder countries
npm run db:places   # Trip Builder places/activities
```

### New models since you left

`User, ActivityLog, Lead, LeadNote, PriceAlert, Destination, Package, Testimonial,
Post, Offer, GalleryPhoto, GeoCountry, GeoPlace, Member, Referral, CreditEntry,
RedemptionRequest, MemberBadge, EngagementClaim, WelcomeDiscountLog, Booking,
Payment,` **`Traveller`, `Quote`, `CostLine`**

- **`Traveller`** — the group manifest, one row per person on a booking.
  **Deliberately stores NO ID document numbers**: passport/Aadhaar are sensitive
  personal data, and private storage of Aadhaar is restricted. That's a decision,
  not an oversight — don't add them without re-deciding.
- **`Quote`** — pricing lives here, **not on Booking**. Carries `version` and
  `optionLabel`. See §4a.
- **`CostLine`** — itemised supplier costs, belonging to a **Quote**.
- **`Lead.ref` / `Booking.ref`** — the `VMF-XXXXXX` enquiry reference.
- **`Booking.paxCount`** — numeric head count (`pax` remains the human summary).
- **`User.totpEnabled` / `totpSecret` / `totpBackupCodes`** — **already live in the
  database**, and declared on `main` even though the 2FA *feature* is only on your
  branch. That's deliberate: without them, `db:push` from `main` generates
  `DROP COLUMN` for all three and would destroy real 2FA secrets once anyone
  enrols. **Do not remove them from the schema.**
- **`Package.published` / `Destination.published`** *(24 July)* — the "show on
  website" flags, default `true`. false = CMS-only (quoting/itineraries), hidden
  from the public site. **Public queries filter on them; staff tools and the PDF
  region/hero lookups deliberately do not** — see the query-split gotcha in §0.
  Already live in prod; run `db:push` on your local DB to add them.

### 🔴 The migration rule (learned the hard way)

**Never run `db:push` ahead of shipping the code that uses it.** Unpushed *code* is
harmless — it sits on your machine doing nothing. A *migration* changes production
immediately. Schema and the code that reads it must land together.

Also: `prisma db push` refuses destructive changes without `--accept-data-loss`.
**Treat that refusal as a prompt to check what would actually be lost**, with a real
query. During this build that check caught live hand-entered data that an earlier
cleanup had wrongly reported as already gone.

> **Rule:** Vercel's build does **not** run migrations or seeds. Any schema change
> must be applied to Neon with `npm run db:push` **with** the deploy, and content
> changes need `npm run db:seed` (idempotent, safe to re-run).

---

## 4. What's on the site now (feature map)

**Public** (`app/(site)/…`): `/` · `/about` · `/contact` · `/faq` · `/privacy` ·
`/terms` · `/gallery` · `/offers` · `/blog(+/[slug])` · `/guides(+/[slug])` ·
`/holidays(+/[slug])` · `/destinations` (+`/domestic(/[state])`,
`/international(/[country])`) · `/packages/[slug]` · `/compare` · `/trip-builder` ·
category landings · `/packages-from/[city]` · **Tools Hub** `/tools` (trip-finder,
budget-explorer, group-expense-splitter, currency-converter, visa-checker) ·
**Travellers Club** `/travellers-club` (+login, dashboard, forgot/reset-password, terms).

**Admin** (`app/admin/…`): leads, **quotes**, bookings, price-alerts, packages,
destinations, trip-builder, testimonials, blog, offers, gallery, members,
redemptions, engagement, reconciliation, reports, activity, team.

**API** (`app/api/…`): `enquiry`, `price-alert`, `club/me`, `admin/upload`,
`cron/expiry`, `keep-alive`, `itinerary/[slug]`, `quotation/[bookingId]`,
**`manifest/[bookingId]`**, **`quotes/export`**.

### 4a. Quotes — read this before touching pricing

The most important modelling decision on the project right now.

**Pricing lives on `Quote`, not `Booking`.** Quoting happens *during* the enquiry and
gets revised repeatedly; an earlier attempt attached costs to a Booking and had
nowhere to put revision 2.

- `version` counts **revisions within an option**; `optionLabel` separates
  **parallel choices** ("Option A — 4-star") sent together. Different axes — they
  must not share a counter.
- A quote can hang off a lead, a booking, or **neither** (a scratch estimate).
- **Revise** = same ref, next version, source superseded.
  **Copy** (`duplicateQuote`) = a new trip at v1 under the target enquiry's ref,
  source untouched, and an **agreed price is deliberately not carried across**.

**The maths** (`lib/pricing.ts`) mirrors the team's real pricing worksheet:

```
land cost → markup% → GST 18% on the MARKUP ONLY → subtotal → TCS 2% on subtotal
```

- **GST and TCS are pass-through** — collected and remitted, **never margin**.
- Money is **integer paise** throughout, so totals don't drift on floating point.
- FX rate is stored **per cost line**, so a quote reproduces months later.
- Runs **both directions** — `quoteFromTotal()` recovers the markup buried inside an
  agreed all-inclusive price, because the website advertises one final figure.
- **Margin guardrails are advisory, never enforced** (10% floor, 20% target).
  Margins get cut deliberately to win work; the builder stays fully editable.
- **Two margin percentages, never interchangeable**: markup *on cost* (24%) and
  margin *of price* (18.3%) — same money, different denominator.

The team's actual worksheet is pinned as a **test fixture**, so the suite fails if an
edit changes their numbers. Everything pricing-related is **ADMIN-only**, on the
pages *and* in the server actions.

---

## 5. Conventions & gotchas (please follow these)

- **CSS Modules, no Tailwind.** Tokens in `app/globals.css`, styles co-located.
- **Dark + light from the start** — every new page/component must work in both. The
  two bug sources: `--navy` doesn't flip (never a text colour on a themed surface),
  and `--white`/`#fff` don't flip (never a background that should darken). Add
  `:global([data-theme="dark"]) .x { … }` in the same module.
- **Orange as *text* → `--orange-ink`**, not `--orange` (contrast).
- **Never hardcode a phone, email or WhatsApp link.** `lib/contact.ts` owns them; a
  grep for the raw digits should return nothing outside that file.
  `whatsappLink(msg)` URL-encodes for you — pass plain text.
- **Customers are not all Indian.** Phone validation is deliberately permissive
  (≥6 digits, no `pattern` attributes, no 10-digit regex) — **do not tighten it**.
- **The address** lives at `BUSINESS.address.full` (`lib/seo.tsx`). Use it verbatim;
  NAP consistency matters for local SEO.
- **Money:** pricing and expense code works in **integer minor units** (paise).
  Convert only at the edges (`toRupees` / `toPaise`).
- **No placeholder/lorem copy** — real VMF copy only.
- **framer-motion + React Compiler:** `<AnimatePresence mode="wait">` swapping a
  keyed step can get stuck. Use a keyed `motion.div` that re-mounts. Also,
  programmatic clicks on `motion.button` don't reliably fire — use a plain
  `<button>` for anything that must be testable.
- `next/image` for images, `next/link` for internal links, `"use client"` only when
  you need interactivity.

### Testing

`npm test` (run once) · `npm run test:watch`. Config in `vitest.config.mts` — node
environment, no jsdom/React stack because nothing renders a component. Tests live in
`tests/` and assert **business rules**, not implementation.

A habit worth keeping: after writing a test, **break the source deliberately** and
confirm the suite goes red. A green suite proves nothing on its own.

**Not yet covered:** anything touching the database — `lib/redemption.ts`,
`lib/engagement.ts`, `lib/expiry.ts`, `lib/referral-credit.ts`. That needs a decision
first (mock Prisma / local Postgres / inject a `db` argument).
**Never point tests at production.**

---

## 6. Deploy & ops

- **Push to `main` → Vercel auto-deploys to production.** No staging gate.
- **Always get sign-off before pushing to `main`.**
- **Schema changes:** `npm run db:push` lands **with** the deploy (see §3).
- **Content changes** (`lib/data/*`): re-seed against Neon for them to appear.
- **GA4** is dormant until the final production domain.

---

## 7. Known open items

> 📋 **The living backlog is now `BACKLOG.md` at the repo root** — the single source
> of truth for pending work, priority-ordered with stable IDs. The list below is a
> snapshot; check `BACKLOG.md` for the current state.


- **🔴 Email pipeline is broken** — forgot-password and lead emails don't send. It's
  config, not code: `RESEND_API_KEY` + verifying `vmfholidays.com` as a Resend
  domain. **You own this.** `npm run test:email` diagnoses it. Worse, enquiry emails
  are best-effort with **no alert on failure**, so a lead can land in the database
  with nobody notified. Worth fixing together.
- **Your 2FA branch** — `feature/admin-2fa-totp`, unmerged. The crypto is proven
  against RFC 6238 vectors, but nobody has driven it end-to-end. See
  `ADMIN-2FA-HANDOFF.md` on that branch. Its DB columns are already live.
- **No error monitoring** — zero visibility into production failures. Next item on
  the backlog.
- **No CI** — `.github/workflows` has only `keep-alive.yml`. No lint/typecheck on
  PRs, no staging environment, no uptime monitoring.
- **Rate limiting is in-memory** in production (see `UPSTASH_*` in §2).
- **Consent is not enforced** — `ConsentCheckbox` renders `required`, but no server
  code reads it, so `/api/enquiry` accepts submissions without consent and nothing
  is recorded. A DPDP gap.
- **No one-click send-quote-PDF** — the quotation PDF (`/api/quotation/[bookingId]`)
  now renders the per-person price + a "What's included" section, but it's generated
  from a **booking**, not straight from a quote. There's still no "send this quote as
  a PDF" button on the quote screen itself. *(The itinerary + quotation PDF layout
  bugs — blank page, stranded headings, missing hero — were fixed on 24 July; see §0.)*
- **NAP** — the site is internally consistent; the Google Business Profile still
  needs aligning to it.
- **Domain** — `vmfholidays.com` still 404s; not serving the app yet.
- **Video testimonials** — section live but empty (`lib/data/videoTestimonials.ts`).

---

## 8. Where to look (orientation)

| Area | Start here |
|---|---|
| Project rules & business facts | `CLAUDE.md`, `AGENTS.md` |
| DB schema | `prisma/schema.prisma`, seeds in `prisma/*.ts` |
| **Quote pricing maths** | `lib/pricing.ts` (+ `tests/pricing.test.ts`) |
| **Quote versions / references** | `lib/quotes.ts`, `lib/refs.ts` |
| **Quote reporting** | `lib/quote-analytics.ts` |
| **Group manifest** | `lib/travellers.ts` |
| **Contact details** | `lib/contact.ts` |
| Booking / payment maths | `lib/bookings.ts` |
| Data (destinations, packages, tools, cities) | `lib/data/*` |
| Queries / data access | `lib/queries.ts`, `lib/db.ts` |
| SEO / structured data | `lib/seo.tsx`, `app/sitemap.ts`, `app/robots.ts` |
| Auth (admin + member) | `lib/auth/*`, `lib/permissions.ts` |
| Travellers Club economics | `lib/referral.ts` |
| Design tokens | `app/globals.css` |
| Archived / superseded plans | `docs/archive/` — **do not follow these** |

---

## Appendix — recent changelog

**24 July 2026 — Departures dashboard** (`965b923`) — *BACKLOG #4*
New `/admin/departures`: upcoming trips + the balance still to collect, using
travel start as the implicit payment deadline (**no schema change**). Summary
tiles, a "balance to collect" chase list (owed + imminent/overdue) and an
"upcoming departures" list; a "Departures Due" card on the admin dashboard; new
sidebar item. `lib/departures.ts` is pure + unit-tested (6 tests → 240 total).

**24 July 2026 — PDF fixes + CRM depth** (`781f724`…`1c1db40`)
PDF renderer rewrite — blank second page (cover overflow), stranded section
headings, footer/text overlap, and blank/progressive-JPEG heroes all fixed;
`sharp` added as a direct dep to normalise images to baseline JPEG, and local
`/images/...` paths read off disk · quote builder: five default cost rows,
**editable** cost lines, lead search folded into the Quotes search bar, cost basis
defaults to the group total · **"Show on website"** toggle on packages **and**
destinations (`published` columns + a public/staff query split) · booking ↔
confirmed-quote linking (pick the winner at booking creation, or "Accept & create
booking" from a quote; per-pax + margin surfaced on the booking) · lead itinerary
calendar with auto trip duration · quotation PDF now shows the per-person price +
"What's included". **Two new columns → `db:push` needed locally (§0).**

**22 July 2026 — Quotes** (`c08a9f9`…`8d640b5`)
Quote model with versions and named options; enquiry references spanning
enquiry → quotes → booking; itemised cost lines with per-line FX; GST-on-markup and
TCS maths verified against the real worksheet; advisory margin guardrails;
copy-a-quote-onto-another-enquiry; margin and **win-rate-by-margin-band** reporting;
CSV export; live totals in the builder.

**21–22 July 2026**
Group manifest (`Traveller` + CSV export, no ID documents by design) · phone and
contact single-sourcing with international support · NAP/JSON-LD cleanup · Trip
Builder progress bar (and ~70 lines of dead stepper CSS removed) · Vitest suite from
zero to 234 tests · expense-splitter fix so exact splits can't create or destroy
money · two obsolete build plans archived to `docs/archive/`.

**Earlier**
Tools Hub · Travellers Club referral/loyalty · enquiry urgency routing and price-drop
alerts · Compare rebuild · destination guides and city SEO landings · DPDP
privacy/consent pages and cookie banner · admin security hardening · itinerary PDF
and send-itinerary tool · bookings and payments CRM.

---

*Questions on any of this — ping the team. Welcome back. 👋*
