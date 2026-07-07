import type { Testimonial } from "@/lib/types";

// No placeholder testimonials are shipped. Real customer reviews are added
// manually via the admin CMS (e.g. from the Google Business Profile) — marking
// up invented reviews as schema.org Review/AggregateRating violates Google's
// guidelines. The homepage testimonials section and the review JSON-LD both
// auto-hide while this list is empty.
export const testimonials: Testimonial[] = [];
