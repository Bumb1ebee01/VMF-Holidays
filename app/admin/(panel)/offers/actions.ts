"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";

export interface OfferPayload {
  id?: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  badge: string;
  published: boolean;
  sortOrder: number;
  endsAt: string;
}

export type SaveResult = { error: string } | undefined;

export async function saveOffer(payload: OfferPayload): Promise<SaveResult> {
  const actor = await requirePermission("offers:manage");

  const title = payload.title.trim();
  if (!title) return { error: "A title is required." };
  if (!payload.image.trim()) return { error: "Upload the offer flyer or image first." };

  let endsAt: Date | null = null;
  if (payload.endsAt.trim()) {
    const parsed = new Date(payload.endsAt);
    if (Number.isNaN(parsed.getTime())) return { error: "The end date isn't valid." };
    endsAt = parsed;
  }

  const data = {
    title,
    description: payload.description.trim() || null,
    image: payload.image.trim(),
    ctaLabel: payload.ctaLabel.trim() || null,
    ctaHref: payload.ctaHref.trim() || null,
    badge: payload.badge.trim() || null,
    published: payload.published,
    sortOrder: Number.isFinite(payload.sortOrder) ? payload.sortOrder : 0,
    endsAt,
  };

  if (payload.id) {
    await db.offer.update({ where: { id: payload.id }, data });
    await logActivity(actor, { action: "offer.update", entity: "Offer", entityId: payload.id, detail: `Updated offer "${title}"` });
  } else {
    const created = await db.offer.create({ data });
    await logActivity(actor, { action: "offer.create", entity: "Offer", entityId: created.id, detail: `Created offer "${title}"` });
  }

  revalidatePath("/", "layout");
  revalidatePath("/offers");
  redirect("/admin/offers");
}

export async function deleteOffer(id: string) {
  const actor = await requirePermission("offers:manage");
  const offer = await db.offer.delete({ where: { id } });
  await logActivity(actor, { action: "offer.delete", entity: "Offer", entityId: id, detail: `Deleted offer "${offer.title}"` });
  revalidatePath("/", "layout");
  revalidatePath("/offers");
  redirect("/admin/offers");
}
