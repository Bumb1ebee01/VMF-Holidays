import { getPublishedTestimonials } from "@/lib/queries";
import styles from "./Testimonials.module.css";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rating ? "var(--orange)" : "none"}
          stroke="var(--orange)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  const shown = testimonials.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={`${styles.eyebrow} reveal`}>Testimonials</div>
          <h2 className={`${styles.title} reveal`}>What Our Travellers Say</h2>
          <p className={`${styles.sub} reveal`}>
            Real stories from real people who trusted us with their most precious time.
          </p>
        </div>

        <div className={styles.grid}>
          {shown.map((t) => (
            <div key={t.name} className={`${styles.card} reveal`}>
              <div className={styles.qMark}>&ldquo;</div>
              <StarRating rating={t.rating} />
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorDest}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {t.trip || t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
