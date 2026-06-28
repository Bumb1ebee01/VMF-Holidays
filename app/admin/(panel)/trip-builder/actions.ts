"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";
import { CONTINENT_ORDER } from "@/lib/data/geography";

export interface GeoPlaceInput {
  slug: string;
  name: string;
  destinationSlug?: string;
  image?: string;
  lat?: number | null;
  lng?: number | null;
  activities: string[];
}

export interface GeoCountryPayload {
  id?: string;
  code: string;
  name: string;
  flag: string;
  continent: string;
  region: string;
  heroImage: string;
  places: GeoPlaceInput[];
}

export type SaveResult = { error: string } | undefined;

function sanitizePlaces(input: GeoPlaceInput[]) {
  const seen = new Set<string>();
  return input
    .map((p) => ({ ...p, name: p.name.trim() }))
    .filter((p) => p.name)
    .map((p, i) => {
      let slug = slugify(p.slug.trim() || p.name) || `place-${i + 1}`;
      while (seen.has(slug)) slug = `${slug}-x`;
      seen.add(slug);
      return {
        slug,
        name: p.name,
        destinationSlug: p.destinationSlug?.trim() || null,
        image: p.image?.trim() || null,
        lat: typeof p.lat === "number" && Number.isFinite(p.lat) ? p.lat : null,
        lng: typeof p.lng === "number" && Number.isFinite(p.lng) ? p.lng : null,
        activities: p.activities.map((a) => a.trim()).filter(Boolean),
        sortOrder: i,
      };
    });
}

export async function saveCountry(payload: GeoCountryPayload): Promise<SaveResult> {
  const actor = await requirePermission("destinations:manage");

  const name = payload.name.trim();
  const code = slugify(payload.code.trim() || name);
  if (!name) return { error: "Country name is required." };
  if (!code) return { error: "Country code is required." };
  if (!CONTINENT_ORDER.includes(payload.continent as (typeof CONTINENT_ORDER)[number])) {
    return { error: "Pick a valid continent." };
  }
  if (payload.region !== "domestic" && payload.region !== "international") {
    return { error: "Region must be domestic or international." };
  }
  if (!payload.heroImage.trim()) return { error: "A hero image is required." };

  const clash = await db.geoCountry.findUnique({ where: { code } });
  if (clash && clash.id !== payload.id) {
    return { error: `Code "${code}" is already used by another country.` };
  }

  const places = sanitizePlaces(payload.places);
  const data = {
    code,
    name,
    flag: payload.flag.trim(),
    continent: payload.continent,
    region: payload.region as "domestic" | "international",
    heroImage: payload.heroImage.trim(),
  };

  if (payload.id) {
    await db.$transaction([
      db.geoPlace.deleteMany({ where: { countryId: payload.id } }),
      db.geoCountry.update({
        where: { id: payload.id },
        data: { ...data, places: { create: places } },
      }),
    ]);
    await logActivity(actor, {
      action: "geography.update",
      entity: "GeoCountry",
      entityId: payload.id,
      detail: `Updated country “${name}” (${places.length} places)`,
    });
  } else {
    const created = await db.geoCountry.create({
      data: { ...data, sortOrder: 999, places: { create: places } },
    });
    await logActivity(actor, {
      action: "geography.create",
      entity: "GeoCountry",
      entityId: created.id,
      detail: `Created country “${name}” (${places.length} places)`,
    });
  }

  revalidatePath("/", "layout");
  redirect("/admin/trip-builder");
}

export async function deleteCountry(id: string) {
  const actor = await requirePermission("destinations:manage");
  const country = await db.geoCountry.delete({ where: { id } });
  await logActivity(actor, {
    action: "geography.delete",
    entity: "GeoCountry",
    entityId: id,
    detail: `Deleted country “${country.name}”`,
  });
  revalidatePath("/", "layout");
  redirect("/admin/trip-builder");
}
