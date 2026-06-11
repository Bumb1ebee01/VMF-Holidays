import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import TestimonialForm from "@/components/admin/TestimonialForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Testimonial" };
export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await db.testimonial.findUnique({ where: { id } });
  if (!t) notFound();

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Testimonials</p>
          <h1 className={shared.pageTitle}>{t.name}</h1>
        </div>
      </div>
      <TestimonialForm
        initial={{
          id: t.id,
          name: t.name,
          location: t.location,
          trip: t.trip,
          rating: t.rating,
          quote: t.quote,
          published: t.published,
        }}
      />
    </div>
  );
}
