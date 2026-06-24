"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";

export interface PhotoPayload {
  id?: string;
  image: string;
  caption: string;
  location: string;
  published: boolean;
  sortOrder: number;
}

export type SaveResult = { error: string } | undefined;

export async function savePhoto(payload: PhotoPayload): Promise<SaveResult> {
  const actor = await requirePermission("gallery:manage");

  if (!payload.image.trim()) return { error: "Upload a photo first." };

  const data = {
    image: payload.image.trim(),
    caption: payload.caption.trim() || null,
    location: payload.location.trim() || null,
    published: payload.published,
    sortOrder: Number.isFinite(payload.sortOrder) ? payload.sortOrder : 0,
  };

  if (payload.id) {
    await db.galleryPhoto.update({ where: { id: payload.id }, data });
    await logActivity(actor, { action: "gallery.update", entity: "GalleryPhoto", entityId: payload.id, detail: "Updated a gallery photo" });
  } else {
    const created = await db.galleryPhoto.create({ data });
    await logActivity(actor, { action: "gallery.create", entity: "GalleryPhoto", entityId: created.id, detail: "Added a gallery photo" });
  }

  revalidatePath("/", "layout");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function deletePhoto(id: string) {
  const actor = await requirePermission("gallery:manage");
  await db.galleryPhoto.delete({ where: { id } });
  await logActivity(actor, { action: "gallery.delete", entity: "GalleryPhoto", entityId: id, detail: "Deleted a gallery photo" });
  revalidatePath("/", "layout");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}
