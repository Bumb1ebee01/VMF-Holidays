import { cache } from "react";
import { db } from "./db";
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

export async function getFeaturedPackages(count = 5): Promise<Package[]> {
  const featured = await db.package.findMany({
    where: { featured: true },
    orderBy: { updatedAt: "desc" },
    take: count,
  });
  if (featured.length >= count) return featured.map(toPackage);

  // Not enough flagged-featured packages — top up with the most recent others
  // so the homepage grid is always full.
  const fill = await db.package.findMany({
    where: { featured: false },
    orderBy: { createdAt: "desc" },
    take: count - featured.length,
  });
  return [...featured, ...fill].map(toPackage);
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
