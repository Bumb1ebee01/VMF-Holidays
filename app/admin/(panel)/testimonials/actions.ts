"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";

export interface TestimonialPayload {
  id?: string;
  name: string;
  location: string;
  trip: string;
  rating: number;
  quote: string;
  published: boolean;
}

export type SaveResult = { error: string } | undefined;

export async function saveTestimonial(payload: TestimonialPayload): Promise<SaveResult> {
  const actor = await requirePermission("testimonials:manage");

  if (!payload.name.trim()) return { error: "Name is required." };
  if (!payload.quote.trim()) return { error: "Quote is required." };
  const rating = Math.round(payload.rating);
  if (rating < 1 || rating > 5) return { error: "Rating must be between 1 and 5." };

  const data = {
    name: payload.name.trim(),
    location: payload.location.trim(),
    trip: payload.trip.trim(),
    rating,
    quote: payload.quote.trim(),
    published: payload.published,
  };

  if (payload.id) {
    await db.testimonial.update({ where: { id: payload.id }, data });
    await logActivity(actor, { action: "testimonial.update", entity: "Testimonial", entityId: payload.id, detail: `Updated testimonial from ${data.name}` });
  } else {
    const created = await db.testimonial.create({ data });
    await logActivity(actor, { action: "testimonial.create", entity: "Testimonial", entityId: created.id, detail: `Created testimonial from ${data.name}` });
  }

  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const actor = await requirePermission("testimonials:manage");
  const t = await db.testimonial.delete({ where: { id } });
  await logActivity(actor, { action: "testimonial.delete", entity: "Testimonial", entityId: id, detail: `Deleted testimonial from ${t.name}` });
  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}
