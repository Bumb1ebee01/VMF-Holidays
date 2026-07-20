> # ⛔ ARCHIVED — DO NOT FOLLOW THIS DOCUMENT
>
> **This is the original 2025 build plan. It is historical only, and parts of it
> are now wrong. Archived 21 July 2026. Flagged for deletion — keep it only as
> long as someone wants the record.**
>
> Why it must not be followed:
>
> 1. **Everything below marked 🔲 is already built.** Phases 2–10 all shipped —
>    homepage, packages, package detail, destinations, trip builder, about,
>    contact, category landings, privacy, terms, sitemap, robots, WhatsApp float.
> 2. **It tells you to make tenure claims that are false.** Phase 2 asks for trust
>    badges reading "10+ Years Experience" / "500+ Happy Travellers", and Phase 7
>    asks for "years in business". VMF was founded **3 July 2025** — never claim
>    tenure beyond that. This rule is in `CLAUDE.md` and it overrides this file.
> 3. **The business details table at the bottom is wrong.** "Phone 2" lists a
>    number that appears nowhere on the live site, and the tagline has a stray
>    comma. The authoritative sources are `CLAUDE.md` and `BUSINESS` in
>    `lib/seo.tsx` — never this file.
>
> For the current state of the project, read `CLAUDE.md`. For a returning
> developer's orientation, read `SHAUN-CATCHUP.md`.

---

# VMF Holidays — Website Build Plan

## Project Overview
Travel agency website for VMF Holidays Pvt. Ltd., Goa-based. Built with Next.js (App Router).
Brand: Navy `#002464` + Orange `#FE5C10` | Font: Roboto

---

## Status

### Phase 1 — Foundation ✅ COMPLETE
- [x] Global design system (`globals.css`) — colors, typography, spacing, buttons, badges, cards, forms, grids
- [x] `layout.tsx` — Roboto font, SEO metadata, OpenGraph/Twitter tags
- [x] `Navbar.tsx` — scroll-aware transparency, mobile hamburger, "Plan My Trip" CTA
- [x] `Footer.tsx` — 4-col grid, social icons, WhatsApp CTA, Goa address + 2 phone numbers
- [x] `lib/utils.ts` — utility helpers

---

### Phase 2 — Homepage 🔲 NEXT
Build `app/page.tsx` as a full marketing homepage with these sections (in order):

1. **Hero** — Full-screen, navy gradient background, headline "Discover Your World, Your Way", search bar (destination + dates + travelers), two CTAs: "Explore Packages" + "Build My Trip", trust badges below (e.g. "500+ Happy Travellers", "10+ Years Experience", "100% Transparent Pricing")

2. **Popular Destinations** — Horizontal scroll or 4-col grid of destination cards (image, name, country, "from ₹X" price tag). Destinations: Kerala, Rajasthan, Goa, Manali, Maldives, Dubai, Thailand, Bali

3. **Featured Packages** — 3-col grid of package cards with image, title, duration, highlights, price, "View Details" button. Mix of domestic + international.

4. **Why Choose VMF** — 4 icon cards: Transparent Pricing, Personalised Itineraries, 24/7 Support, Experienced Team

5. **Trip Categories** — Visual grid: Honeymoon, Family, Adventure, Corporate/MICE, Pilgrimage, College Tours — each as a styled tile with icon/image

6. **Testimonials** — 3 customer review cards with star rating, quote, name, trip taken

7. **How It Works** — 3-step process: "Tell Us Your Dream" → "We Plan Everything" → "You Enjoy the Journey"

8. **CTA Banner** — Full-width navy/orange gradient: "Ready to explore?" with WhatsApp button + "Get a Free Quote" form link

---

### Phase 3 — Packages Page 🔲
`app/packages/page.tsx`
- Filter sidebar: destination type (Domestic/International), category (Honeymoon, Family, Adventure…), duration, budget range
- Package grid: cards with image, title, duration, inclusions summary, price, "Enquire Now" CTA
- Each package links to a detail page

---

### Phase 4 — Package Detail Page 🔲
`app/packages/[slug]/page.tsx`
- Hero image + title + quick stats (duration, group size, rating)
- Tabbed layout: Overview | Itinerary | Inclusions | Gallery | Pricing
- Day-by-day itinerary accordion
- Sticky enquiry sidebar with WhatsApp + callback form
- Related packages at bottom

---

### Phase 5 — Destinations Page 🔲
`app/destinations/page.tsx`
- World map visual or region tabs (India, Southeast Asia, Europe, Middle East, etc.)
- Destination cards grid with hero image, country, # packages available
- Each links to filtered packages for that destination

---

### Phase 6 — Trip Builder 🔲
`app/trip-builder/page.tsx`
- Multi-step form wizard:
  1. Where do you want to go? (destination picker)
  2. When? (date range picker)
  3. Who's coming? (adults, children, seniors)
  4. What's your budget? (range slider)
  5. Interests? (checkboxes: beach, culture, adventure, food, etc.)
  6. Contact details (name, phone, email)
- Submits to WhatsApp message or email

---

### Phase 7 — About Page 🔲
`app/about/page.tsx`
- Company story + founding year
- Mission & values
- Team section (owner/founder card)
- Stats: years in business, travellers served, destinations covered, 5-star reviews
- MICE/Corporate highlight
- Trust logos (if any: tourism board registrations, affiliations)

---

### Phase 8 — Contact Page 🔲
`app/contact/page.tsx`
- Contact form (name, phone, email, message, enquiry type)
- Contact details card (address, phones, email, hours)
- Embedded Google Map for Nagoa, Bardez, Goa
- WhatsApp floating button (site-wide)

---

### Phase 9 — Additional Pages 🔲
- `app/honeymoon/page.tsx` — Honeymoon packages landing
- `app/family/page.tsx` — Family tours landing
- `app/adventure/page.tsx` — Adventure tours landing
- `app/corporate/page.tsx` — MICE & corporate landing
- `app/visa/page.tsx` — Visa assistance info page
- `app/privacy/page.tsx` — Privacy policy
- `app/terms/page.tsx` — Terms & conditions

---

### Phase 10 — Polish & Launch Prep 🔲
- [ ] WhatsApp floating button component (site-wide, fixed bottom-right)
- [ ] Loading skeletons for package cards
- [ ] `not-found.tsx` (404 page)
- [ ] `sitemap.ts` — dynamic sitemap generation
- [ ] `robots.txt`
- [ ] Performance audit (images via `next/image`, font optimization confirmed)
- [ ] Mobile QA pass on all pages
- [ ] Final SEO metadata on all pages

---

## Key Business Details (use everywhere)

| Field | Value |
|---|---|
| Company | VMF Holidays Pvt. Ltd. |
| Tagline | Discover Your World, Your Way |
| Phone 1 | +91 7499322412 |
| Phone 2 | +91 8788324054 |
| Email | info@vmfholidays.com |
| Address | Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516 |
| WhatsApp | https://wa.me/917499322412 |

## Design Tokens (quick ref)

| Token | Value |
|---|---|
| `--navy` | #002464 |
| `--orange` | #FE5C10 |
| `--yellow` | #FFEE33 |
| Font | Roboto (300/400/500/700/900) |
| Container | 1280px |
| Nav height | 72px |
