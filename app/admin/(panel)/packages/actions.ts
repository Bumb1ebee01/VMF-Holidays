"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { slugify } from "@/lib/utils";

const CATEGORIES = ["honeymoon", "family", "adventure", "corporate", "pilgrimage", "college"] as const;
type Category = (typeof CATEGORIES)[number];

export interface PackagePayload {
  id?: string;
  title: string;
  slug: string;
  destination: string;
  destinationSlug: string;
  category: string;
  duration: string;
  nights: number;
  fromPrice: number;
  heroImage: string;
  gallery: string[];
  hotel: string;
  hotelImage: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { title: string; description: string }[];
  featured: boolean;
  badge: string;
}

export type SaveResult = { error: string } | undefined;

export async function savePackage(payload: PackagePayload): Promise<SaveResult> {
  await requireUser();

  const title = payload.title.trim();
  const slug = slugify(payload.slug.trim() || title);
  if (!title) return { error: "Title is required." };
  if (!slug) return { error: "Slug is required." };
  if (!payload.destination.trim()) return { error: "Destination is required." };
  if (!CATEGORIES.includes(payload.category as Category)) return { error: "Pick a valid category." };
  if (!payload.heroImage.trim()) return { error: "A hero image is required." };
  if (payload.nights < 0 || payload.fromPrice < 0) return { error: "Nights and price must be positive." };

  const clash = await db.package.findUnique({ where: { slug } });
  if (clash && clash.id !== payload.id) {
    return { error: `Slug "${slug}" is already used by another package.` };
  }

  const data = {
    slug,
    title,
    destination: payload.destination.trim(),
    destinationSlug: payload.destinationSlug.trim() || slugify(payload.destination),
    category: payload.category as Category,
    duration: payload.duration.trim(),
    nights: Math.floor(payload.nights),
    fromPrice: Math.floor(payload.fromPrice),
    heroImage: payload.heroImage.trim(),
    gallery: payload.gallery.map((g) => g.trim()).filter(Boolean),
    hotel: payload.hotel.trim() || null,
    hotelImage: payload.hotelImage.trim() || null,
    highlights: payload.highlights.map((h) => h.trim()).filter(Boolean),
    inclusions: payload.inclusions.map((i) => i.trim()).filter(Boolean),
    exclusions: payload.exclusions.map((e) => e.trim()).filter(Boolean),
    itinerary: payload.itinerary
      .filter((d) => d.title.trim() || d.description.trim())
      .map((d, i) => ({ day: i + 1, title: d.title.trim(), description: d.description.trim() })),
    featured: payload.featured,
    badge: payload.badge.trim() || null,
  };

  if (payload.id) {
    await db.package.update({ where: { id: payload.id }, data });
  } else {
    await db.package.create({ data });
  }

  revalidatePath("/", "layout");
  redirect("/admin/packages");
}

export async function deletePackage(id: string) {
  await requireUser();
  await db.package.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/packages");
}
