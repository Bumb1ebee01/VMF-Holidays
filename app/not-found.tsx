import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.sub}>
          Looks like this page went off-itinerary. Let&apos;s get you back on track.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary btn--lg">Back to Homepage</Link>
          <Link href="/destinations" className="btn btn-outline btn--lg">Browse Destinations</Link>
        </div>
      </div>
    </div>
  );
}
