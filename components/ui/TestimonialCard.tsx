import StarRating from "./StarRating";
import type { Testimonial } from "@/lib/types";
import styles from "./TestimonialCard.module.css";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className={styles.card}>
      <StarRating rating={testimonial.rating} />
      <p className={styles.quote}>"{testimonial.quote}"</p>
      <div className={styles.reviewer}>
        <div className={styles.avatar}>
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className={styles.name}>{testimonial.name}</p>
          <p className={styles.meta}>{testimonial.location}</p>
          <span className={`badge badge-orange ${styles.tripBadge}`}>{testimonial.trip}</span>
        </div>
      </div>
    </div>
  );
}
