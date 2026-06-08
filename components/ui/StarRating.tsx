import styles from "./StarRating.module.css";

export default function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rating ? styles.filled : styles.empty}>★</span>
      ))}
    </div>
  );
}
