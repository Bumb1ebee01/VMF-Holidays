import { getPublishedTestimonials } from "@/lib/queries";
import { JsonLd, reviewsJsonLd } from "@/lib/seo";
import AnimatedTestimonials from "./AnimatedTestimonials";

export default async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  const schema = reviewsJsonLd(testimonials);
  return (
    <>
      {schema && <JsonLd data={schema} />}
      <AnimatedTestimonials testimonials={testimonials} />
    </>
  );
}
