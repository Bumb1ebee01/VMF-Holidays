import { getPublishedTestimonials } from "@/lib/queries";
import { BUSINESS, JsonLd, reviewsJsonLd } from "@/lib/seo";
import AnimatedTestimonials from "./AnimatedTestimonials";
import ReviewInvite from "./ReviewInvite";

export default async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  if (testimonials.length === 0) return <ReviewInvite />;

  const schema = reviewsJsonLd(testimonials);
  return (
    <>
      {schema && <JsonLd data={schema} />}
      <AnimatedTestimonials testimonials={testimonials} reviewUrl={BUSINESS.googleReview} />
    </>
  );
}
