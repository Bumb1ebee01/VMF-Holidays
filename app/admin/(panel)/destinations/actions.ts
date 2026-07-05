"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";

export interface DestinationPayload {
  id?: string;
  name: string;
  slug: string;
  country: string;
  /** State the destination rolls up into on the domestic tiles (India only). */
  state?: string;
  region: string;
  heroImage: string;
  fromPrice: number;
  blurb: string;
  tags: string[];
  // Travel-guide content (all optional).
  guideIntro?: string;
  guideBestTime?: string;
  guideThingsToDo?: string[];
  guideTip?: string;
  guideGallery?: string[];
  guideSections?: { heading: string; body: string }[];
}

export type SaveResult = { error: string } | undefined;

export async function saveDestination(payload: DestinationPayload): Promise<SaveResult> {
  const actor = await requirePermission("destinations:manage");

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
    // State only applies to domestic (India) destinations; clear it for international.
    state: payload.region === "domestic" ? payload.state?.trim() || null : null,
    region: payload.region as "domestic" | "international",
    heroImage: payload.heroImage.trim(),
    fromPrice: Math.max(0, Math.floor(payload.fromPrice)),
    blurb: payload.blurb.trim(),
    tags: payload.tags.map((t) => t.trim()).filter(Boolean),
    guideIntro: payload.guideIntro?.trim() || null,
    guideBestTime: payload.guideBestTime?.trim() || null,
    guideThingsToDo: (payload.guideThingsToDo ?? []).map((t) => t.trim()).filter(Boolean),
    guideTip: payload.guideTip?.trim() || null,
    guideGallery: (payload.guideGallery ?? []).map((u) => u.trim()).filter(Boolean),
    guideSections: (payload.guideSections ?? [])
      .map((s) => ({ heading: s.heading.trim(), body: s.body.trim() }))
      .filter((s) => s.heading || s.body),
  };

  if (payload.id) {
    await db.destination.update({ where: { id: payload.id }, data });
    await logActivity(actor, { action: "destination.update", entity: "Destination", entityId: payload.id, detail: `Updated destination “${name}”` });
  } else {
    const created = await db.destination.create({ data });
    await logActivity(actor, { action: "destination.create", entity: "Destination", entityId: created.id, detail: `Created destination “${name}”` });
  }

  revalidatePath("/", "layout");
  redirect("/admin/destinations");
}

export async function deleteDestination(id: string) {
  const actor = await requirePermission("destinations:manage");
  const dest = await db.destination.delete({ where: { id } });
  await logActivity(actor, { action: "destination.delete", entity: "Destination", entityId: id, detail: `Deleted destination “${dest.name}”` });
  revalidatePath("/", "layout");
  redirect("/admin/destinations");
}
