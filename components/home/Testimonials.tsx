import SectionHeader from "@/components/ui/SectionHeader";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { testimonials } from "@/lib/data/testimonials";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const shown = testimonials.slice(0, 3);

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          eyebrow="What Travellers Say"
          title="Real Stories, Real Journeys"
          sub="Don't take our word for it — hear from the 500+ families and couples we've sent on holiday."
          centered
        />
        <div className={`grid-3 ${styles.grid}`}>
          {shown.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
