import type { Metadata } from "next";
import TestimonialForm from "@/components/admin/TestimonialForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Testimonial" };

export default function NewTestimonialPage() {
  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Testimonials</p>
          <h1 className={shared.pageTitle}>New Testimonial</h1>
        </div>
      </div>
      <TestimonialForm />
    </div>
  );
}
