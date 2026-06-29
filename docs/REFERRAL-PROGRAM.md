# VMF Holidays Travellers Club — Referral Program Spec

A two-sided **travel-credit** referral program, anchored by a **trusted WhatsApp
community + compounding credit** as the moat. This spec is the build contract:
strategy, data model (already in `prisma/schema.prisma`), flows, APIs, admin,
WhatsApp integration, economics, anti-fraud, KPIs, and a phased plan.

> Decisions locked with the owner: **reward = two-sided travel credit**;
> **moat = community + compounding credit**; **build = schema now, feature next**.

---

## 1. Goal & moat

**Goal:** turn happy travellers into a compounding acquisition + retention engine —
more first-time trust, more repeat bookings, lower CAC than paid ads.

**Moat (why it's defensible):** not the reward (anyone can copy a discount) but the
*combination*:
1. **Community** — a curated WhatsApp Travellers Club (stories, exclusives, early
   access, group-trip polls, founder AMAs). Network effects + belonging; keeps you
   top-of-mind between infrequent trips. OTAs can't replicate the intimacy.
2. **Compounding travel credit** — rewards as VMF credit, not cash: self-funding
   (paid only on a new booking), creates switching cost, drives repeat sales.
3. **Status tiers** — recognition people don't want to lose.

Tagline: *"Not a discount scheme — a community of travellers where your rewards
compound into your next trip."*

---

## 2. Member journey (happy path)

1. **Join** at `/travellers-club` (name, phone, email) → unique referral code/link
   generated → one-tap **join the WhatsApp Community**.
2. **Share** their link (`vmfholidays.com/?ref=CODE` or `/travellers-club?ref=CODE`).
3. **Friend arrives** via the link → `ref` code stored in a cookie → friend sees a
   **welcome offer**.
4. **Friend enquires** → `/api/enquiry` saves the `referralCode` on the `Lead` and
   opens/updates a `Referral` (status `ENQUIRED`).
5. **Friend books (paid)** → admin marks the lead **WON** → `Referral` → `BOOKED`.
6. **Reward** → admin approves → referrer gets **travel credit** (`CreditEntry` +
   `creditBalance`), friend's **welcome credit** applied; `Referral` → `REWARDED`;
   both notified on WhatsApp. Tiers re-evaluated.
7. **Redeem** → credit auto-suggested on the next quote, capped per trip.

---

## 3. Reward design (two-sided travel credit)

Starting values — **owner to confirm**; keep them in config/admin, not hardcoded:

| Who | Reward | When |
|---|---|---|
| Referrer | **₹2,500 travel credit** per friend who completes a paid booking | On `BOOKED` → approved |
| Friend (referee) | **₹1,500 off** first trip (or a free add-on: airport transfer / candlelight dinner) | On their first booking |

Credit rules: INR, applied to a future booking, **never expires** (or 24 months),
**stackable up to 10% of trip value**, non-transferable, no cash-out.

### Tiers (recognition + escalating value)
| Tier | Unlock | Perks |
|---|---|---|
| **Explorer** | join | community access, referral link, welcome offer |
| **Voyager** | 1 trip *or* 1 referred booking | priority planning, birthday perk |
| **Globetrotter** | 3 trips *or* 3 referred bookings | free room/category upgrade where possible, higher referral credit (e.g. ₹3,500) |
| **Ambassador** | 5+ | dedicated planner, members-only trips, top referral credit, surprise perks |

---

## 4. WhatsApp community architecture

- **The hub:** a WhatsApp **Community/Group** members join via an invite link
  (`chat.whatsapp.com/…`). **Owner creates this and provides the link** (store it in
  an env var / admin setting, e.g. `WHATSAPP_COMMUNITY_URL`). The site shows a
  "Join the Club on WhatsApp" button after sign-up and on `/travellers-club`.
- **Automated 1:1 messages** (welcome, "your friend booked — ₹2,500 credit added",
  tier upgrades) run through the **existing WhatsApp Cloud API** helper
  (`lib/whatsapp.ts`, `sendEnquiryWhatsApp` pattern). Business-initiated messages
  need an **approved template** — add templates for: welcome, referral-credited,
  tier-upgrade. Set `WHATSAPP_TEMPLATE*` envs (already supported in the helper).
- **Cadence (run by the team):** weekly exclusive deal, monthly member spotlight,
  quarterly group-trip poll, founder AMA. This is the engagement engine — assign an
  owner for it; a dead community kills the moat.

---

## 5. Data model (already added to `prisma/schema.prisma`)

- **`Member`** — `name, phone (unique), email?, referralCode (unique), tier,
  creditBalance (INR), whatsappJoinedAt?, referredById? (self-relation), active`.
- **`Referral`** — `referrerId → Member, refereeName?, refereePhone?, status
  (PENDING→ENQUIRED→BOOKED→REWARDED/EXPIRED/REJECTED), bookingValue?, rewardAmount?,
  leadId? (loose link)`.
- **`CreditEntry`** — ledger: `memberId → Member, amount (±INR), reason
  (REFERRAL_REWARD/WELCOME_BONUS/REDEMPTION/ADJUSTMENT/EXPIRY), note?`.
- **`Lead.referralCode`** — added so an enquiry is attributed to a referrer.

`creditBalance` is a denormalised cache of the sum of `CreditEntry.amount`; always
write a ledger row + update the balance in the same transaction (audit trail).
Apply with **`npm run db:push`** when the feature build lands.

---

## 6. APIs & pages to build (next phase)

**Public**
- `app/(site)/travellers-club/page.tsx` — explainer + join form + WhatsApp CTA +
  (for members) "your link + credit balance". Add `Service`/FAQ JSON-LD + metadata.
- `?ref=CODE` capture — a small client effect (or in the existing referral landing)
  that stores the code in a cookie for 30–60 days.

**API**
- `POST /api/club/join` — validate (reuse the enquiry validation/rate-limit/honeypot
  helpers), create `Member` + unique `referralCode`, return the WhatsApp invite link,
  fire welcome WhatsApp. Dedupe by phone.
- Extend `POST /api/enquiry` — read the `ref` cookie/body, store `Lead.referralCode`,
  upsert a `Referral` (`ENQUIRED`).

**Admin** (mirror existing CRUD pages)
- **Members** — list/search, tier, balance, manual credit adjust (writes a
  `CreditEntry`).
- **Referrals** — pipeline board (PENDING→…→REWARDED); "Mark booked" + "Approve
  reward" actions (transaction: ledger + balance + status + WhatsApp + tier re-eval).
- Hook into the existing **Leads** screen: when a lead with a `referralCode` is set
  to **WON**, prompt to convert its `Referral` to `BOOKED`.

**Helpers**
- `lib/referral.ts` — `generateCode()`, `creditMember(memberId, amount, reason, tx)`,
  `recalcTier(member)`, `attachReferralToLead(lead, code)`.

---

## 7. Anti-fraud guardrails (build these in, not later)

- Reward **only** on an admin-verified **paid booking** (never on signup/enquiry).
- **No self-referral**: reject if referee phone/email matches the referrer's; basic
  device/IP heuristics.
- One welcome benefit per **new** customer (dedupe by phone); existing customers
  don't get the first-trip welcome.
- **Credit cap** per trip (≤10%); **manual payout approval** in v1.
- Reuse the shipped **rate-limit + honeypot + validation** on the join form.

---

## 8. Economics & KPIs

**Why it's affordable:** on an ₹80k couple booking, ₹2,500 + ₹1,500 ≈ 5% all-in —
and the ₹2,500 is *credit redeemed only on a future booking*, so it funds itself and
drives a repeat sale. Paid acquisition is typically ₹3k–8k+ CAC with weaker trust.

**Track:** members joined · referral links shared · referred enquiries · referred
**bookings** · referral conversion % · % of revenue from referrals · repeat-booking
rate · reward cost as % of referred revenue · **K-factor** (referrals × conversion)
· community active members. Wire `generate_lead`/`whatsapp_click` (already added) +
add a `club_join` and `referral_booked` event.

**First-90-day targets (illustrative):** 150–300 members · K-factor > 0.3 ·
≥ 10% of new bookings referral-attributed.

---

## 9. Phased build

- **Phase 0 — schema (DONE here):** models in `prisma/schema.prisma`.
- **Phase 1 — MVP:** `/travellers-club` join page + `POST /api/club/join` + referral
  capture on enquiry + admin Members/Referrals + WhatsApp community link + welcome
  message. Manual reward approval.
- **Phase 2 — credit & tiers:** credit ledger redemption on quotes, automated
  tier upgrades, WhatsApp reward/upgrade templates, referral leaderboard.
- **Phase 3 — community flywheel:** members-only group trips, scheduled community
  posts, win-back nudges, `aggregateRating` once reviews flow in.

---

## 10. What the owner needs to provide

1. **Confirm reward amounts** (₹2,500 referrer / ₹1,500 friend?) and credit expiry.
2. **Create the WhatsApp Community** and share the invite link (`WHATSAPP_COMMUNITY_URL`).
3. **WhatsApp templates** approved in Meta for welcome / referral-credited / tier-up
   (then set `WHATSAPP_TEMPLATE*` envs) — for proactive messages.
4. **Assign a community owner** to post weekly — the community is the moat; it must
   stay alive.

---

## 11. Launch checklist

- [ ] Reward amounts + credit rules confirmed
- [ ] WhatsApp Community created + link in env; templates approved
- [ ] Phase-1 code built, `npm run db:push` run, verified on preview
- [ ] `/travellers-club` page live + linked in nav/footer + a homepage strip
- [ ] Seed the founder + first members; soft-launch to recent happy customers
- [ ] Announce in the community + email; add the referral CTA to post-trip follow-ups
- [ ] Watch KPIs weekly; tune reward/copy after the first 30 days
