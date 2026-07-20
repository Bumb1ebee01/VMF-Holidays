@AGENTS.md

# VMF Holidays — Project Context

## What This Is
Travel agency website for VMF Holidays Pvt. Ltd., Goa, India.
Next.js App Router. Brand: Navy `#002464` + Orange `#FE5C10` | Font: Roboto.
The site is fully built and live. (The original phased build plan is archived at
`docs/archive/PLAN-2025-original.md` — historical only, do not follow it.)

## Business Details

| Field | Value |
|---|---|
| Company | VMF Holidays Pvt. Ltd. |
| Tagline | Discover Your World Your Way |
| Phone 1 | +91 7499322412 |
| Phone 2 | +91 9270354828 |
| Email | info@vmfholidays.com |
| Address (Goa HQ) | Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516, India |
| Mangalore branch | First Floor, Lotus Paradise Plaza, Shop No. 116, Door No. 15, 23-1429/43, Bendoorwell, Mangaluru, Karnataka 575001 |
| Mangalore phone | +91 9481384953 |
| Founded | 3 July 2025 |
| WhatsApp | https://wa.me/917499322412 |

> NAP note: use the address above **verbatim** everywhere (site, schema, emails,
> Google Business Profile). Do not reintroduce "Calangute" / "Nagva". The company
> was founded 3 July 2025 — never claim tenure beyond that ("Since 2016" etc.).
>
> The canonical one-line string lives in code as `BUSINESS.address.full`
> (`lib/seo.tsx`) — import it rather than retyping the address, which is how the
> surfaces drift apart in the first place.

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

### Orange as *text* → use `--orange-ink`, not `--orange`

`--orange` (#FE5C10) only reaches **2.6–3.1:1** on our warm light surfaces — below
the 4.5:1 WCAG minimum for body-size text. It's fine as a **fill** (`.btn-primary`
is white-on-orange), as a **border**, and on **large display type** (≥24px, where
3:1 applies).

- Orange carrying **small text** on a light surface (eyebrows, badges, inline
  links, outline buttons) → `color: var(--orange-ink)`. It clears 4.5:1 on every
  light surface and auto-reverts to `--orange` in dark mode.
- Orange text on a **navy/dark** surface → keep `--orange` or `--orange-lt`;
  `--orange-ink` would make it *worse*. This is why the Navbar only uses
  `--orange-ink` in its `.scrolled` (white bar) states.
- Most sections define their **own module-scoped `.eyebrow`** rather than the
  global one — so fixing `globals.css` alone does not fix a new section. Set the
  colour in the module.

## Coding Conventions

- CSS Modules for component-scoped styles (e.g. `Navbar.module.css`), global utilities via `globals.css`
- No Tailwind — use CSS custom properties from the design system
- `next/image` for all images, `next/link` for all internal links
- `"use client"` only when component needs interactivity (hooks, event listeners)
- No comments unless the WHY is non-obvious
- No placeholder/lorem ipsum text — use real VMF Holidays copy
- **Dark + light from the start** — see Dark Mode below; never ship a page that only works in one theme

## Dark Mode (REQUIRED for every new page/component)

The site ships a light **and** dark theme, toggled via `[data-theme="dark"]` on
`<html>` (`components/ui/ThemeToggle.tsx`; persisted in `localStorage` key
`vmf-theme`). Every new page/component must be built for **both** themes up front —
retrofitting is how bugs slip in (whole pages rendered white, text going
invisible). Verify by toggling the theme in the browser before committing.

- **Prefer semantic tokens that auto-flip** (redefined under `[data-theme="dark"]`
  in `globals.css`): backgrounds `--bg`, `--card-bg`, `--surface`, `--off-white`,
  `--cream`; text `--text`, `--text-light`, `--muted`; borders `--border`, `--hairline`.
- **These do NOT flip — misuse breaks dark mode:**
  - `--navy` (stays `#002464`, near-black) → never a body/heading text color on a
    themed surface. Fine only as a fixed brand color on a light/white/orange chip.
  - `--white`, literal `#fff` / `white` → stay white. Never a page/card background
    that should darken. Fine only as text on a permanently-navy hero/banner.
- If a fixed navy hero or intentionally-white card is required, add the matching
  `:global([data-theme="dark"]) .x { … }` override **in the same module** (darken
  the surface with `--bg`/`--card-bg`, redirect navy text to `--text`).

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
