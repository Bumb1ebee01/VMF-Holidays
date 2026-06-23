import { getPublishedTestimonials } from "@/lib/queries";
import AnimatedTestimonials from "./AnimatedTestimonials";

export default async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  return <AnimatedTestimonials testimonials={testimonials} />;
}
