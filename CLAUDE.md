@AGENTS.md

# VMF Holidays — Project Context

## What This Is
Travel agency website for VMF Holidays Pvt. Ltd., Goa, India.
Next.js App Router. Brand: Navy `#002464` + Orange `#FE5C10` | Font: Roboto.
See `PLAN.md` for the full phased build plan.

## Business Details

| Field | Value |
|---|---|
| Company | VMF Holidays Pvt. Ltd. |
| Tagline | Discover Your World Your Way |
| Phone 1 | +91 7499322412 |
| Phone 2 | +91 9270354828 |
| Email | info@vmfholidays.com |
| Address | Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516, India |
| Founded | 3 July 2025 |
| WhatsApp | https://wa.me/917499322412 |

> NAP note: use the address above **verbatim** everywhere (site, schema, emails,
> Google Business Profile). Do not reintroduce "Calangute" / "Nagva". The company
> was founded 3 July 2025 — never claim tenure beyond that ("Since 2016" etc.).

## What's Already Built (Phase 1 ✅)

- `app/globals.css` — full design system: CSS custom properties for colors, spacing, typography, shadows, radius, transitions, and utility classes (`.btn`, `.badge`, `.card`, `.container`, `.section`, `.eyebrow`, grids)
- `app/layout.tsx` — Roboto font (next/font/google), SEO metadata with OpenGraph + Twitter cards, wraps `<Navbar>` + `<Footer>`
- `components/layout/Navbar.tsx` — scroll-aware (transparent → white), mobile hamburger menu, nav links: Packages / Destinations / Trip Builder / About / Contact, "Plan My Trip" CTA button
- `components/layout/Footer.tsx` — 4-col grid: brand + tagline + about + socials (Instagram, Facebook, WhatsApp), Explore links, Services links, Contact info
- `app/page.tsx` — placeholder only (replace with full homepage in Phase 2)
- `lib/utils.ts` — utility helpers

## Design Tokens (quick ref)

```
--navy:        #002464
--navy-mid:    #154667
--orange:      #FE5C10
--orange-lt:   #FFA333
--yellow:      #FFEE33
--text:        #1A1F36
--muted:       #7B8298
--container:   1280px
--nav-h:       72px
```

Button classes: `.btn .btn-primary`, `.btn-navy`, `.btn-outline`, `.btn-outline-orange`, `.btn-ghost-white`  
Size modifiers: `.btn--sm`, `.btn--lg`, `.btn--xl`  
Badge classes: `.badge .badge-orange`, `.badge-navy`, `.badge-white`, `.badge-green`

## Coding Conventions

- CSS Modules for component-scoped styles (e.g. `Navbar.module.css`), global utilities via `globals.css`
- No Tailwind — use CSS custom properties from the design system
- `next/image` for all images, `next/link` for all internal links
- `"use client"` only when component needs interactivity (hooks, event listeners)
- No comments unless the WHY is non-obvious
- No placeholder/lorem ipsum text — use real VMF Holidays copy

## Next Up: Phase 2 — Homepage

Replace `app/page.tsx` with a full marketing homepage. Sections in order:

1. **Hero** — full-screen navy gradient, headline, destination search bar (destination + dates + travelers), two CTAs, trust badges
2. **Popular Destinations** — 4-col card grid (Kerala, Rajasthan, Goa, Manali, Maldives, Dubai, Thailand, Bali)
3. **Featured Packages** — 3-col grid with image, title, duration, price, "View Details"
4. **Why Choose VMF** — 4 icon cards: Transparent Pricing, Personalised Itineraries, 24/7 Support, Experienced Team
5. **Trip Categories** — visual tiles: Honeymoon, Family, Adventure, Corporate/MICE, Pilgrimage, College Tours
6. **Testimonials** — 3 customer review cards
7. **How It Works** — 3-step process
8. **CTA Banner** — navy/orange gradient, WhatsApp + quote form CTA
