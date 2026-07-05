import { cache } from "react";
import { db } from "./db";
import { slugify } from "./utils";
import type { Package, Destination, Testimonial, ItineraryDay, TripCategorySlug, BlogPost, Offer, GalleryPhoto } from "./types";
import type { Package as DbPackage, Destination as DbDestination } from "./generated/prisma/client";

function toPackage(row: DbPackage): Package {
  return {
    slug: row.slug,
    title: row.title,
    destination: row.destination,
    destinationSlug: row.destinationSlug,
    category: row.category as TripCategorySlug,
    duration: row.duration,
    nights: row.nights,
    heroImage: row.heroImage,
    gallery: row.gallery,
    hotel: row.hotel ?? undefined,
    hotelImage: row.hotelImage ?? undefined,
    fromPrice: row.fromPrice,
    priceOnRequest: row.priceOnRequest,
    highlights: row.highlights,
    inclusions: row.inclusions,
    exclusions: row.exclusions,
    itinerary: (Array.isArray(row.itinerary) ? row.itinerary : []) as unknown as ItineraryDay[],
    featured: row.featured,
    badge: row.badge ?? undefined,
  };
}

function toDestination(row: DbDestination): Destination {
  return {
    slug: row.slug,
    name: row.name,
    country: row.country,
    state: row.state ?? undefined,
    region: row.region,
    heroImage: row.heroImage,
    fromPrice: row.fromPrice,
    blurb: row.blurb,
    tags: row.tags,
  };
}

// React `cache` dedupes these within a single request, so the page body,
// generateMetadata, and the sitemap can each call them without re-hitting the DB.
export const getAllDestinations = cache(async (): Promise<Destination[]> => {
  const rows = await db.destination.findMany({ orderBy: { name: "asc" } });
  return rows.map(toDestination);
});

export const getAllPackages = cache(async (): Promise<Package[]> => {
  const rows = await db.package.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toPackage);
});

// ── Destination tiles: group by state (domestic) / country (international) ─────
// The tile counts are derived live from Package rows, so adding a package in the
// admin automatically bumps the right state/country tile.
export type LocationTile = {
  name: string;
  slug: string;
  image: string;
  packageCount: number;
  destinationCount: number;
  fromPrice: number | null;
};

async function buildLocationTiles(
  region: "domestic" | "international",
  keyOf: (d: Destination) => string | undefined
): Promise<LocationTile[]> {
  const [dests, packages] = await Promise.all([getAllDestinations(), getAllPackages()]);
  const countBySlug = new Map<string, number>();
  for (const p of packages) countBySlug.set(p.destinationSlug, (countBySlug.get(p.destinationSlug) ?? 0) + 1);

  const groups = new Map<string, Omit<LocationTile, "slug">>();
  for (const d of dests.filter((x) => x.region === region)) {
    const name = keyOf(d);
    if (!name) continue;
    const slug = slugify(name);
    const pkgs = countBySlug.get(d.slug) ?? 0;
    const g = groups.get(slug);
    if (g) {
      g.packageCount += pkgs;
      g.destinationCount += 1;
      if (!g.image) g.image = d.heroImage;
      if (d.fromPrice > 0) g.fromPrice = g.fromPrice == null ? d.fromPrice : Math.min(g.fromPrice, d.fromPrice);
    } else {
      groups.set(slug, {
        name,
        image: d.heroImage,
        packageCount: pkgs,
        destinationCount: 1,
        fromPrice: d.fromPrice > 0 ? d.fromPrice : null,
      });
    }
  }
  return [...groups.entries()]
    .map(([slug, g]) => ({ slug, ...g }))
    .sort((a, b) => b.packageCount - a.packageCount || a.name.localeCompare(b.name));
}

// Domestic groups by state (falls back to the destination name until states are set).
export const getDomesticStates = cache(() => buildLocationTiles("domestic", (d) => d.state ?? d.name));
export const getInternationalCountries = cache(() => buildLocationTiles("international", (d) => d.country));

async function packagesForGroup(
  region: "domestic" | "international",
  keyOf: (d: Destination) => string | undefined,
  groupSlug: string
): Promise<{ name: string; packages: Package[] } | null> {
  const [dests, packages] = await Promise.all([getAllDestinations(), getAllPackages()]);
  const inGroup = dests.filter((d) => d.region === region && !!keyOf(d) && slugify(keyOf(d)!) === groupSlug);
  if (inGroup.length === 0) return null;
  const slugs = new Set(inGroup.map((d) => d.slug));
  return {
    name: keyOf(inGroup[0])!,
    packages: packages.filter((p) => slugs.has(p.destinationSlug)),
  };
}

export const getPackagesByState = cache((stateSlug: string) =>
  packagesForGroup("domestic", (d) => d.state ?? d.name, stateSlug)
);
export const getPackagesByCountry = cache((countrySlug: string) =>
  packagesForGroup("international", (d) => d.country, countrySlug)
);

export async function getFeaturedPackages(): Promise<Package[]> {
  const rows = await db.package.findMany({
    where: { featured: true },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
  return rows.map(toPackage);
}

export const getPackageBySlug = cache(async (slug: string): Promise<Package | null> => {
  const row = await db.package.findUnique({ where: { slug } });
  return row ? toPackage(row) : null;
});

export async function getRelatedPackages(pkg: Package): Promise<Package[]> {
  const rows = await db.package.findMany({
    where: {
      slug: { not: pkg.slug },
      OR: [{ destinationSlug: pkg.destinationSlug }, { category: pkg.category as TripCategorySlug }],
    },
    take: 3,
  });
  return rows.map(toPackage);
}

export async function getPackagesByCategory(category: string): Promise<Package[]> {
  const rows = await db.package.findMany({
    where: { category: category as TripCategorySlug },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toPackage);
}

// ── Programmatic SEO: destination × category landing pages ────────────────────
// One landing per (destination, category) combo that actually has packages, e.g.
// "bali-honeymoon" → /holidays/bali-honeymoon. Targets high-intent searches like
// "Bali honeymoon packages".
export type HolidayLanding = {
  slug: string;
  destinationSlug: string;
  destinationName: string;
  category: TripCategorySlug;
  fromPrice: number;
  count: number;
};

export const getHolidayLandings = cache(async (): Promise<HolidayLanding[]> => {
  const rows = await db.package.findMany({
    select: { destinationSlug: true, destination: true, category: true, fromPrice: true },
  });
  const map = new Map<string, HolidayLanding>();
  for (const r of rows) {
    const slug = `${r.destinationSlug}-${r.category}`;
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
      existing.fromPrice = Math.min(existing.fromPrice, r.fromPrice);
    } else {
      map.set(slug, {
        slug,
        destinationSlug: r.destinationSlug,
        destinationName: r.destination,
        category: r.category as TripCategorySlug,
        fromPrice: r.fromPrice,
        count: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) => a.slug.localeCompare(b.slug));
});

export const getHolidayLanding = cache(async (slug: string): Promise<HolidayLanding | null> => {
  return (await getHolidayLandings()).find((h) => h.slug === slug) ?? null;
});

export async function getPackagesForLanding(landing: HolidayLanding): Promise<Package[]> {
  const rows = await db.package.findMany({
    where: {
      destinationSlug: landing.destinationSlug,
      category: landing.category as TripCategorySlug,
    },
    orderBy: { fromPrice: "asc" },
  });
  return rows.map(toPackage);
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const rows = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((t) => ({
    name: t.name,
    location: t.location,
    trip: t.trip,
    rating: t.rating,
    quote: t.quote,
  }));
}

function toPost(row: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string[];
  publishedAt: Date | null;
}): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    author: row.author,
    tags: row.tags,
    publishedAt: row.publishedAt,
  };
}

export const getPublishedPosts = cache(async (): Promise<BlogPost[]> => {
  const rows = await db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toPost);
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const row = await db.post.findUnique({ where: { slug } });
  if (!row || !row.published) return null;
  return toPost(row);
});

export const getPublishedOffers = cache(async (): Promise<Offer[]> => {
  const rows = await db.offer.findMany({
    where: {
      published: true,
      OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    image: o.image,
    ctaLabel: o.ctaLabel,
    ctaHref: o.ctaHref,
    badge: o.badge,
    endsAt: o.endsAt,
  }));
});

export const getPublishedGalleryPhotos = cache(async (): Promise<GalleryPhoto[]> => {
  const rows = await db.galleryPhoto.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((p) => ({
    id: p.id,
    image: p.image,
    caption: p.caption,
    location: p.location,
  }));
});
