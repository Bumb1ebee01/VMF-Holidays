import { db } from "./db";
import type { Package, Destination, Testimonial, ItineraryDay, TripCategorySlug } from "./types";
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

export async function getAllDestinations(): Promise<Destination[]> {
  const rows = await db.destination.findMany({ orderBy: { name: "asc" } });
  return rows.map(toDestination);
}

export async function getAllPackages(): Promise<Package[]> {
  const rows = await db.package.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toPackage);
}

export async function getFeaturedPackages(): Promise<Package[]> {
  const rows = await db.package.findMany({
    where: { featured: true },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
  return rows.map(toPackage);
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const row = await db.package.findUnique({ where: { slug } });
  return row ? toPackage(row) : null;
}

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
