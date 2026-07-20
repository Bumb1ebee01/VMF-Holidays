# VMF Holidays — Catch-Up & Re-Onboarding Brief

**For:** Shaun (original developer, returning after a break)
**Purpose:** get your machine, database and mental model fully in sync with what's on `main` right now.
**Repo:** `github.com/Bumb1ebee01/VMF-Holidays` · **Branch:** `main` · **Deploy:** Vercel (auto-deploys on every push to `main`).
**Reflects `main` @ commit `a00cc5f`** (a full commit changelog is in the Appendix at the end).

> ⚠️ **This doc is slightly behind.** `main` is now at `61a5301`. The commits since
> `a00cc5f` are the a11y contrast pass, the DPDP privacy/consent work, and the
> admin-security hardening (login brute-force limit, stateful session revocation).
> Everything below is still accurate — it just doesn't cover those. Section 7 has
> the in-flight items, including the **admin 2FA branch waiting for you**.

> Read section **1** (sync) and section **3** (⚠️ database) first — the DB is what silently breaks things if it's stale. Everything else is context.

---

## 1. Get in sync (do this first)

```bash
git checkout main
git pull                # fast-forward to the latest main
npm install             # picks up new deps (resend, jspdf, jspdf-autotable, lenis, react-day-picker, jose, @prisma/adapter-pg, pg …)
npx prisma generate     # regenerate the typed Prisma client from the current schema
```

Then set up your **`.env`** (see section 2) and your **local database** (section 3), then:

```bash
npm run dev             # http://localhost:3000
```

**Requirements:** Node 18+ (20 LTS recommended), npm. Stack is **Next.js 16.2.7 (App Router)**, **React 19 + React Compiler**, **Prisma 7** with the `@prisma/adapter-pg` driver adapter, PostgreSQL.

> ⚠️ This is **not** the Next.js you may remember — Next 16 has real breaking changes (async `params`/`searchParams`, `proxy.ts` middleware, etc.). See `AGENTS.md` — it tells you to read the bundled docs in `node_modules/next/dist/docs/` before writing routing code.

---

## 2. Environment variables

Copy `.env.example` → `.env` and fill it in. The important ones:

| Var | What it's for | Notes |
|---|---|---|
| `DATABASE_URL` | Postgres connection | **See section 3** — do NOT point local dev at production. |
| `AUTH_SECRET` | Signs admin session JWTs (jose) | Any long random string locally. ⚠️ If the 2FA branch merges this also derives the key that encrypts stored TOTP secrets — rotating it would break every enrolled authenticator (backup codes survive). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seeds the initial admin user | Used by `npm run db:seed`. |
| `RESEND_API_KEY` | Transactional email (enquiries, password reset) | Emails only send when set. Local: leave empty (flows still work, they just skip sending). |
| `ENQUIRY_TO` / `ENQUIRY_FROM` | Enquiry email routing | From-address must be a verified Resend domain. |
| `CLOUDINARY_*` | Admin image uploads | Needed for the admin media features. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile on forms | When unset, the widget hides and verification no-ops (fine locally). |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Distributed rate limiting | Optional; falls back to in-memory. |
| `NEXT_PUBLIC_GA_ID` | GA4 | **Deliberately empty** — analytics is code-complete but OFF until the final production domain. |
| `GOOGLE_SITE_VERIFICATION` | Search Console meta tag | Optional. |
| `WHATSAPP_COMMUNITY_URL` | Travellers Club community button | Optional. |

---

## 3. ⚠️ Database — the part that matters most

Production uses **Neon (PostgreSQL)**. A lot of schema has changed since you left, so your local DB and generated client are almost certainly out of date.

### Recommended local setup (safe)
**Do NOT point your local `DATABASE_URL` at the production Neon DB** — dev/testing can mutate real data. Use one of:

- **Option A — local Postgres (simplest):** `npm run db:dev` spins up a local WASM Postgres and prints a `127.0.0.1` URL. Put that in `.env` as `DATABASE_URL`.
- **Option B — a Neon dev branch:** create a branch of the DB in the Neon console and use its connection string. Gets you real-shaped data without touching prod.

### Then apply the schema + seed data
```bash
npm run db:push     # applies the current schema to YOUR database (creates all tables/columns/enums)
npm run db:seed     # seeds destinations (with guide content), packages, blog posts, offers, gallery, testimonials + admin user
npm run db:geo      # seeds Trip Builder geography (countries)
npm run db:places   # seeds Trip Builder places/activities
```

Other DB scripts: `npm run db:studio` (Prisma Studio GUI), `npm run db:admin` (reset the admin password), `npm run test:email` (diagnose the Resend pipeline).

### What changed in the schema (highlights)
Full model list: `User, ActivityLog, Lead, LeadNote, PriceAlert, Destination, Package, Testimonial, Post, Offer, GalleryPhoto, GeoCountry, GeoPlace, Member, Referral, CreditEntry, RedemptionRequest, MemberBadge, EngagementClaim, WelcomeDiscountLog`.

New / changed since older versions — `npm run db:push` applies all of these, but so you know:
- **`PriceAlert`** — new table. "Notify me if the price drops" sign-ups (phone-only).
- **`Lead.timeframe`** — new column. "When are you travelling?" → drives urgency routing.
- **`LeadSource` enum** — added `ASK_QUESTION` (the soft "Ask a question" CTA).
- **`Member.resetTokenHash` / `resetTokenExpiresAt`** — new columns for the password-reset flow.
- **`Destination` guide fields** (`guideIntro`, `guideBestTime`, `guideThingsToDo`, `guideTip`, `guideSections`, `guideGallery`) — now populated for all 25 destinations (the `/guides/[slug]` content).
- The full **Travellers Club** referral schema (Member, Referral, CreditEntry, RedemptionRequest, MemberBadge, EngagementClaim, WelcomeDiscountLog + related enums).

> **Rule:** Vercel's build does **not** run migrations or seeds. Any schema change must be applied to the production Neon DB with `npm run db:push` **before/with** the deploy, and content (packages/destinations) needs `npm run db:seed` (it's idempotent — upserts, and count-guards the create-many tables, so it's safe to re-run).

---

## 4. What's on the site now (feature map)

**Public routes** (`app/(site)/…`):
`/` · `/about` · `/contact` · `/faq` · `/privacy` · `/terms` · `/gallery` · `/offers` · `/blog(+/[slug])` · `/guides(+/[slug])` · `/holidays(+/[slug])` · `/destinations` (+`/domestic(/[state])`, `/international(/[country])`) · `/packages/[slug]` · `/compare` · `/trip-builder` · category landings (`/honeymoon`, `/family`, `/adventure`, `/corporate`, `/pilgrimage`, `/college`) · **`/packages-from/[city]`** (city SEO landings) · **Tools Hub** `/tools` with `/tools/trip-finder`, `/tools/budget-explorer`, `/tools/group-expense-splitter`, `/tools/currency-converter`, `/tools/visa-checker` · **Travellers Club** `/travellers-club` (+`/login`, `/dashboard`, `/forgot-password`, `/reset-password`, `/terms`).

**Admin** (`app/admin/…`): full CRM/CMS — leads, **price-alerts**, packages, destinations, trip-builder, testimonials, blog, offers, gallery, members, redemptions, engagement, reconciliation, activity, team. jose-based auth + a permissions system (`lib/permissions.ts`).

**API** (`app/api/…`): `enquiry`, `price-alert`, `club/me`, `admin/upload`, `cron/expiry`, `keep-alive`.

**Notable features added while you were away:**
- **Tools Hub** — registry-driven (`lib/data/tools.ts`); a new live tool = one registry entry + a page, and it auto-appears in the navbar dropdown, the hub, and the sitemap.
- **Trip Finder** mood quiz, **Budget Explorer** (inverse budget search), **Compare** rebuild (shareable URL, diff-highlighting, "you might also consider").
- **Travellers Club** referral/loyalty program (economics single-sourced in `lib/referral.ts`) + **forgot-password / reset**.
- **Enquiry flow**: soft **"Ask a question"** CTA, **urgency routing** ("travelling soon" → flagged team email + admin badge), **price-drop alerts**.
- **Trust/engagement**: "what happens after you enquire" strip, **video testimonials** section (empty until videos added to `lib/data/videoTestimonials.ts`).
- **Reviews**: a **"Review us on Google"** link in the footer socials, testimonials that **invite reviews** when the section is empty (instead of hiding), and `AggregateRating` schema built from real testimonials. A Travellers Club engagement task also collects post-trip testimonials.
- **SEO**: destination guides (all 25), city landing pages, category FAQ + FAQPage schema, TravelAgency + Mangalore-branch structured data, sitemap/robots, OG tags everywhere.
- **a11y**: `--orange-ink` for orange-as-text (4.5:1 contrast), associated form labels, larger tap targets, light/dark heading fixes on navy heroes.
- **Design system** ("The Journal"): CSS custom properties + CSS Modules, dark/light theming, Lenis smooth scroll, framer-motion.

---

## 5. Conventions & gotchas (please follow these)

- **CSS Modules, no Tailwind.** Global tokens/utilities in `app/globals.css`; component styles in co-located `*.module.css`.
- **Dark + light from the start** — every new page/component must work in **both** themes (toggle it before committing). The two bug sources:
  - `--navy` (#002464) stays fixed in dark mode → never use it as body/heading text on a themed surface; add a `:global([data-theme="dark"]) .x { color: var(--text) }` override, or use adaptive tokens (`--text`, `--card-bg`, `--off-white`, `--border`).
  - `--white` / literal `#fff` don't flip → never a background that should darken.
- **Orange as *text* → use `--orange-ink`, not `--orange`.** Plain `--orange` only hits ~2.6–3.1:1 on our warm light surfaces (below the 4.5:1 WCAG minimum). `--orange-ink` clears it and auto-reverts to `--orange` in dark mode. `--orange` is fine as a **fill**, **border**, or on **large display type**. (See `CLAUDE.md`.)
- **NAP is sacred.** Use the business name/address/phone **verbatim** everywhere (site, schema, emails). Goa office: *Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516*. Founded **3 July 2025** — never claim tenure beyond that. (There's an open NAP verification: the Google profile shows "Calangute/Nagva" vs the site's "Nagoa/Bardez" — being confirmed; don't "fix" the site to Calangute.)
- **framer-motion + React Compiler gotcha:** `<AnimatePresence mode="wait">` swapping a keyed step can get stuck (state advances, old view stays). Fix: drop `AnimatePresence`/`exit` and let a keyed `motion.div` re-mount and replay `initial→animate`. Also: programmatic clicks on `motion.button` don't reliably fire handlers — use a plain `<button>` for anything that must be testable.
- **No placeholder/lorem copy** — real VMF copy only.
- `next/image` for all images, `next/link` for internal links, `"use client"` only when you need interactivity.

---

## 6. Deploy & ops

- **Push to `main` → Vercel auto-deploys to production.** There's no staging gate, so treat `main` as production.
- **Always get sign-off before pushing to `main`** (shared repo, live site).
- **Schema changes:** run `npm run db:push` against Neon **before/with** the deploy — Vercel does not migrate.
- **Content changes** (packages/destinations in `lib/data/*`): the DB is the source of truth for the live site, so after committing you must **re-seed** (`npm run db:seed`) against Neon for them to appear. Seed is idempotent.
- **GA4** is dormant — flip on by setting `NEXT_PUBLIC_GA_ID` once the final production domain is live.
- **Email pipeline:** if forgot-password / lead emails aren't sending, it's config, not code — verify `RESEND_API_KEY` and that `vmfholidays.com` is a verified Resend domain. `npm run test:email` diagnoses it.

---

## 7. Known open items

- **🔨 Admin 2FA — built, unmerged, and waiting for you.** Branch
  **`feature/admin-2fa-totp`** adds opt-in TOTP two-factor auth for `/admin`.
  It typechecks, lints, and its crypto is proven against the RFC 6238 test
  vectors — but **nobody has clicked through it end-to-end yet**, and that's the
  main thing left. Full detail, the exact walkthrough, and the gotchas are in
  **`ADMIN-2FA-HANDOFF.md` on that branch**. Two things to know before you start:
  - The DB columns (`totpEnabled` / `totpSecret` / `totpBackupCodes`) are
    **already live in production Neon** — `db:push` was run on 20 Jul 2026.
    They're additive and defaulted, so `main` runs fine without the branch.
  - It's **opt-in per user**, so merging it locks nobody out. There's also a
    recovery script — `npm run 2fa:disable -- <email>` — for a lost phone.
- **Rate limiting is in-memory in production.** `UPSTASH_REDIS_REST_*` is unset,
  so `lib/ratelimit.ts` falls back to a per-instance memory limiter. On Vercel
  that means the login brute-force cap leaks across serverless instances. This
  affects the **existing** login lockout, not just the 2FA branch — worth wiring
  up Upstash (free tier is plenty) as its own task.
- **NAP verification** — confirm the official Goa address, then align the site + Google Business Profile so name/address/phone are byte-identical.
- **GA4 activation** — pending the final production domain.
- **Video testimonials** — the section is live but empty; add YouTube IDs to `lib/data/videoTestimonials.ts`.
- **Domain** — canonical is `vmfholidays.com`; confirm DNS/cutover status (the live app has also run on a `*.vercel.app` URL).

---

## 8. Where to look (orientation)

| Area | Start here |
|---|---|
| Project rules & business facts | `CLAUDE.md`, `AGENTS.md` |
| DB schema | `prisma/schema.prisma`, seeds in `prisma/*.ts` |
| Data (destinations, packages, tools, cities, geography) | `lib/data/*` |
| Queries / data access | `lib/queries.ts`, `lib/db.ts` |
| SEO / structured data | `lib/seo.tsx`, `app/sitemap.ts`, `app/robots.ts` |
| Auth (admin + member) | `lib/auth/*`, `lib/permissions.ts` |
| Travellers Club economics | `lib/referral.ts` |
| Design tokens | `app/globals.css` |

---

## Appendix — changelog by theme

The significant work on `main`, grouped. (Run `git log --oneline` for the exact, full list — this is the readable summary.)

**Tools Hub**
- Added `/tools` hub + **Group Trip Expense Splitter** (with flexible split modes + branded PDF export via `jspdf`).
- **Visa & eVisa Checker** (Indian passports, 28 destinations, official sources).
- **Currency Converter** (live INR rates, 30 travel currencies, IST timestamp + fetch timeout).
- **Trip Finder** mood quiz + **Budget Explorer** (inverse budget search).

**Travellers Club (referral/loyalty)**
- Full program: tiers, per-tier balance caps, redemption rules (group/college/MICE/pilgrimage/10+ pax excluded), welcome-credit floor aligned to ₹25,000.
- **Forgot-password / reset** flow (secure single-use tokens).

**Enquiries / CRM**
- Soft **"Ask a question"** CTA, **urgency routing** ("travelling soon" flag), **price-drop alerts** (capture-only), `npm run test:email` diagnostic.

**Compare**
- Rebuilt: shareable URL, diff-highlighting, "you might also consider", site-wide entry points, and sell-first copy.

**Destinations / Guides**
- 25-destination catalog with real hero images; **admin-editable travel guides** (DB-backed) with rich layout, and **guide content written for all 25**.
- Domestic/International nav dropdown + country/state tiles with live package counts.

**Packages / Content**
- Packages added across all destinations (every destination now has ≥1); removed unverifiable claims + placeholder testimonials; 8 blog posts.

**SEO**
- Destination guides, **city landing pages** (`/packages-from/[city]`), category FAQ + FAQPage schema, OpenGraph + breadcrumb/ItemList JSON-LD, TravelAgency + Mangalore-branch structured data, sitemap/robots, internal-linking pass.

**Design system / a11y**
- Dark/light theming enforced site-wide (multiple invisible-text/white-surface fixes), **`--orange-ink`** contrast rule, navbar mobile overflow fix + accordion menu, form-label associations, larger tap targets.
- **Reviews:** "Review us on Google" footer link + review-inviting testimonials section.

---

*Questions on any of this — ping the team. Welcome back. 👋*
