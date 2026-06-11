"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";

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
  await requireUser();

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
  } else {
    await db.testimonial.create({ data });
  }

  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireUser();
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}
