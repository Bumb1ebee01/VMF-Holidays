# VMF Holidays — Backlog

**The single source of truth for pending work.** Before asking "what's left?", check
here. Any new idea or change request → add it here. When something ships → tick it
off and note the commit. This replaces scattered notes so everything lives in one place.

**Reflects `main` @ `515ea58` · last updated 24 July 2026.**
Recently *shipped* work is logged in `SHAUN-CATCHUP.md` (Appendix changelog) — this
file is **open items only**.

### How to use
- `- [ ]` = open, `- [x]` = done. Leave a done item with its commit for a little while, then prune.
- Sections are ordered by priority (P0 highest). Items are roughly ordered within a section.
- **Owner** in bold where known. Size = rough T-shirt (S/M/L).
- IDs (`#1`…) are stable references — say "let's do #1" and we know what you mean.
- Add a new item under the right priority with the next free `#`.

---

## 🔴 P0 — Broken / customer-impacting (do first)

- [ ] **#1 · Email pipeline is down** — forgot-password *and* lead-notification emails don't send. Config, not code: set `RESEND_API_KEY` + verify `vmfholidays.com` as a Resend domain. Enquiry emails are best-effort with **no failure alert**, so a lead can land in the DB with nobody notified. **Owner: Shaun.** `npm run test:email` diagnoses it. — M
- [ ] **#2 · Consent not enforced (DPDP)** — `ConsentCheckbox` renders `required` but no server code reads it; `/api/enquiry` accepts submissions without consent and nothing is recorded. Need a consent record (who/what/when/policy version) + server enforcement on enquiry, club signup, and PDF download. — M
- [ ] **#3 · No error monitoring** — zero visibility into prod failures (no Sentry). A 500 is only found via customer complaint. Cheapest thing that protects everything else. — S

## P1 — Daily ops & revenue lift

- [x] **#4 · Departures + payment-due dashboard** *(shipped `965b923`)* — `/admin/departures`: upcoming trips + "balance to collect" (travel start = implicit due date), plus a "Departures Due" card on the dashboard. No explicit per-booking due-date field yet (uses travel start) — add one only if wanted. — M
- [ ] **#5 · Customer trip page** — private tokenised link showing itinerary, payments, balance, travellers. Cuts status-chasing messages. Needs unguessable tokens. — M
- [ ] **#6 · Activate GA4** — code-complete, consent-gated, but off (`NEXT_PUBLIC_GA_ID` empty) pending the final domain. Domain is now live, so this is a quick win — set the ID. — S
- [ ] **#7 · Group / MICE / college enquiry forms** — landing pages exist but have no group-specific fields (group size, date flexibility, budget per head, organiser vs decision-maker) or routing to whoever handles bulk quotes. — M

## P2 — Hardening & infrastructure

- [ ] **#8 · CI on PRs** — `.github/workflows` has only `keep-alive.yml`. Add lint + typecheck (+ `npm test`) on push/PR. No staging env or uptime monitoring either. — S/M
- [ ] **#9 · Distributed rate limiting** — `UPSTASH_*` unset in prod, so the login brute-force cap is per-serverless-instance (leaks across instances). Wire up Upstash Redis. — S
- [ ] **#10 · WAF** — not in place (infra hardening from the security pass). — S (infra)
- [ ] **#11 · Dependency scanning** — `npm audit` reports issues; never actioned. — S
- [ ] **#12 · Finish + merge 2FA** — `feature/admin-2fa-totp`; crypto proven vs RFC 6238 but never driven end-to-end. DB columns already live. **Owner: Shaun** (`ADMIN-2FA-HANDOFF.md`). — M
- [ ] **#13 · Tests for DB-backed money code** — `lib/redemption.ts`, `lib/engagement.ts`, `lib/expiry.ts`, `lib/referral-credit.ts` are untested. Needs a decision first (mock Prisma / local Postgres / inject `db`). Never point tests at prod. — M

## P3 — Polish, content & tech debt

- [ ] **#14 · Send a quote as a PDF from the quote screen** — the quotation PDF exists but only generates from a *booking*; no one-click "send this quote as a PDF" on the quote itself. — S/M
- [ ] **#15 · Align Google Business Profile NAP** — site is internally consistent; GBP still shows the old "Calangute/Nagva" address. Align to `Nagoa, Bardez`. (Edwin verifying.) — S
- [ ] **#16 · Video testimonials** — section is live but empty (`lib/data/videoTestimonials.ts`). Add real YouTube IDs. — S
- [ ] **#17 · Real trip-builder place prices** — `prisma/import-places.ts` uses placeholder per-country "from" estimates. — S
- [ ] **#18 · Replace promo placeholder photos** — `lib/data/promos.ts`. — S
- [ ] **#19 · Money-unit consistency** — quotes/cost lines in *paise*, bookings/payments in *whole rupees*, bridged by rounding. Works today; decide a convention before payments logic grows. — S
- [ ] **#20 · (Optional) Destination → package visibility cascade** — hiding a destination currently leaves its published packages visible (independent toggles, by design). Add a cascade only if wanted. — S
- [ ] **#21 · Performance pass** — baseline only (2.7 MB client JS, 442 KB largest chunk; `framer-motion` in 10 client components incl. above-the-fold `Hero`). Measure with `@next/bundle-analyzer` before optimising — don't guess. — M

## Deferred (not scheduled — revisit after the above)

- [ ] **#22 · Plan §6 growth features** — reels feed on destination pages, "ask travellers who've been here" Q&A, family-composition filtering, anniversary/return-trip remarketing, AI concierge.
- [ ] **#23 · Formal §9 infrastructure audit** — most is in place; the confirmed gaps are #3–#11 above. A formal pass would catch the rest.

---

*Convention: this file is the backlog. When we finish a batch, tick items here and add the changelog line to `SHAUN-CATCHUP.md`.*
