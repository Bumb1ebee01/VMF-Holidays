"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { slugify } from "@/lib/utils";

export interface DestinationPayload {
  id?: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  heroImage: string;
  fromPrice: number;
  blurb: string;
  tags: string[];
}

export type SaveResult = { error: string } | undefined;

export async function saveDestination(payload: DestinationPayload): Promise<SaveResult> {
  await requireUser();

  const name = payload.name.trim();
  const slug = slugify(payload.slug.trim() || name);
  if (!name) return { error: "Name is required." };
  if (!slug) return { error: "Slug is required." };
  if (!payload.country.trim()) return { error: "Country is required." };
  if (payload.region !== "domestic" && payload.region !== "international") {
    return { error: "Region must be domestic or international." };
  }
  if (!payload.heroImage.trim()) return { error: "A hero image is required." };

  const clash = await db.destination.findUnique({ where: { slug } });
  if (clash && clash.id !== payload.id) {
    return { error: `Slug "${slug}" is already used by another destination.` };
  }

  const data = {
    name,
    slug,
    country: payload.country.trim(),
    region: payload.region as "domestic" | "international",
    heroImage: payload.heroImage.trim(),
    fromPrice: Math.max(0, Math.floor(payload.fromPrice)),
    blurb: payload.blurb.trim(),
    tags: payload.tags.map((t) => t.trim()).filter(Boolean),
  };

  if (payload.id) {
    await db.destination.update({ where: { id: payload.id }, data });
  } else {
    await db.destination.create({ data });
  }

  revalidatePath("/", "layout");
  redirect("/admin/destinations");
}

export async function deleteDestination(id: string) {
  await requireUser();
  await db.destination.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/destinations");
}
