> # ⛔ ARCHIVED — DO NOT FOLLOW THIS DOCUMENT
>
> **Original Phase 2 homepage plan, historical only. Archived 21 July 2026.
> Flagged for deletion — keep it only as long as someone wants the record.**
>
> It describes a state of the repo that no longer exists ("the Navbar, Footer,
> and components directory do not exist yet" — they all do, and the homepage
> shipped long ago). It also proposes a **"500+ Trips Planned"** trust badge;
> that claim was never shipped and must not be, since VMF was founded
> **3 July 2025** and unverifiable volume/tenure claims are forbidden by
> `CLAUDE.md`.
>
> For the current state of the project, read `CLAUDE.md`. For a returning
> developer's orientation, read `SHAUN-CATCHUP.md`.

---

# Plan: VMF Holidays — Phase 2 Homepage

## Context
Phase 1 laid down the design system (`globals.css`), layout (`layout.tsx`), but the Navbar, Footer, and components directory **do not exist yet** — `layout.tsx` already imports them, so `npm install` + building will fail until they're created. Phase 2 replaces the placeholder `app/page.tsx` with a full marketing homepage (8 sections), and completes the missing Phase 1 layout components.

---

## File Structure to Create

```
components/
  layout/
    Navbar.tsx          "use client" — scroll-aware transparent→white, hamburger
    Navbar.module.css
    Footer.tsx          server component — 4-col grid
    Footer.module.css
  home/
    Hero.tsx            "use client" — search bar state
    Hero.module.css
    PopularDestinations.tsx
    PopularDestinations.module.css
    FeaturedPackages.tsx
    FeaturedPackages.module.css
    WhyChooseVMF.tsx
    WhyChooseVMF.module.css
    TripCategories.tsx
    TripCategories.module.css
    Testimonials.tsx
    Testimonials.module.css
    HowItWorks.tsx
    HowItWorks.module.css
    CTABanner.tsx
    CTABanner.module.css
```

**Files to modify:**
- `app/page.tsx` — replace placeholder with assembled homepage
- `app/page.module.css` — delete (unused default scaffold)
- `next.config.ts` — add `images.remotePatterns` for Unsplash

---

## Component Plans

### Navbar (`"use client"`)
- State: `scrolled` (boolean), `mobileOpen` (boolean)
- `useEffect` — adds `scroll` listener; sets `scrolled = window.scrollY > 10`
- CSS: `.nav` base transparent; `.navScrolled` → white bg + shadow
- Links: Packages / Destinations / Trip Builder / About / Contact
- Right: "Plan My Trip" → `.btn .btn-primary .btn--sm`
- Mobile: hamburger icon toggles `.mobileMenu` drawer
- Height: `var(--nav-h)` (72px)

### Footer (server component)
- 4-col grid: (1) Brand + tagline + socials, (2) Explore links, (3) Services, (4) Contact info
- Real copy from CLAUDE.md: phone numbers, email, address, WhatsApp link
- Bottom bar: © 2024 VMF Holidays Pvt. Ltd. | Goa, India

### Hero (`"use client"`)
- Full-viewport (`min-height: 100svh`), navy → navy-mid gradient + subtle dark overlay
- Headline: "Discover Your World, Your Way"
- Sub: "Expertly crafted domestic & international holidays from Goa. Transparent pricing, full itineraries, personal service."
- Search bar (white card): Destination text input + Check-in date + Check-out date + Travelers select + "Search" button (orange)
- Two CTAs below search: "Explore Packages" (`.btn-primary`) + "Talk to an Expert" (`.btn-ghost-white`)
- Trust badges: ✦ 500+ Trips Planned · ✦ Transparent Pricing · ✦ 24/7 Support

### Popular Destinations
- Eyebrow + section title + `.grid-4` (collapses to 2 then 1 via globals)
- 8 destinations: Kerala, Rajasthan, Goa, Manali, Maldives, Dubai, Thailand, Bali
- Each card: Unsplash image (aspect-ratio 3/4), gradient overlay, destination name + country badge
- Images sourced from `images.unsplash.com` (configured in next.config.ts)

### Featured Packages
- `.grid-3` of 3 package cards
- Card: image (16/9), `.badge-orange` duration, title, highlights list, price "from ₹X,XXX", "View Details" button
- Packages: Kerala Backwaters (5N/6D, ₹18,999), Rajasthan Royal (7N/8D, ₹24,999), Dubai Explorer (4N/5D, ₹32,999)

### Why Choose VMF
- `.grid-4` of 4 icon-cards
- Icons: SVG inline (shield/check, map-pin, headset, users)
- Cards: Transparent Pricing, Personalised Itineraries, 24/7 Support, Experienced Team
- Light navy-subtle background on section

### Trip Categories
- Eyebrow + title + 6 visual tiles (2×3 grid)
- Tiles: Honeymoon, Family, Adventure, Corporate/MICE, Pilgrimage, College Tours
- Each tile: Unsplash background image + gradient overlay + label + icon
- Hover: scale(1.03) + deeper overlay

### Testimonials
- `.grid-3` of 3 review cards
- Each: star rating (5★), quote text, reviewer name + location + trip type badge
- Real-looking names (Priya S., Rahul M., Anjali D.) — Goa/India context

### How It Works
- 3-step horizontal layout (icons + connecting line on desktop)
- Steps: 1. Share Your Dream → 2. We Plan It → 3. You Explore
- Short description under each step

### CTA Banner
- Navy→orange gradient, full-width
- Headline: "Ready to Start Your Journey?"
- Sub: "Talk to our travel experts today"
- Two CTAs: WhatsApp link (`https://wa.me/917499322412`) + "Get a Free Quote" (scroll-to form or contact page)

---

## Implementation Details

### next.config.ts
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};
export default nextConfig;
```

### app/page.tsx (final shape)
```tsx
import Hero from "@/components/home/Hero";
import PopularDestinations from "@/components/home/PopularDestinations";
// ... all 8 imports
export default function HomePage() {
  return (
    <main>
      <Hero />
      <PopularDestinations />
      <FeaturedPackages />
      <WhyChooseVMF />
      <TripCategories />
      <Testimonials />
      <HowItWorks />
      <CTABanner />
    </main>
  );
}
```

### CSS conventions (all component modules)
- Use `var(--navy)`, `var(--orange)`, etc. — no hardcoded hex
- Use `var(--sp-*)` spacing tokens
- Mobile-first with breakpoints at 640px / 1024px
- Hover transitions via `var(--dur-base) var(--ease)`

---

## Dependency Flow

```
app/layout.tsx
  ├── components/layout/Navbar.tsx   ← must exist for build
  └── components/layout/Footer.tsx   ← must exist for build

app/page.tsx
  ├── Hero
  ├── PopularDestinations
  ├── FeaturedPackages
  ├── WhyChooseVMF
  ├── TripCategories
  ├── Testimonials
  ├── HowItWorks
  └── CTABanner
```

---

## Order of Implementation
1. `npm install` (deps not installed)
2. Navbar + Navbar.module.css
3. Footer + Footer.module.css
4. next.config.ts update (image domains)
5. Hero + Hero.module.css
6. PopularDestinations + css
7. FeaturedPackages + css
8. WhyChooseVMF + css
9. TripCategories + css
10. Testimonials + css
11. HowItWorks + css
12. CTABanner + css
13. app/page.tsx (assemble all sections)
14. Delete app/page.module.css

---

## Verification
1. `npm run build` — zero TypeScript/lint errors
2. `npm run dev` — visit localhost:3000, check all 8 sections render
3. Scroll: Navbar transitions transparent → white
4. Mobile (375px): hamburger menu opens/closes; grids go single-column
5. Destination cards and package cards show Unsplash images
6. WhatsApp CTA link resolves to correct number