import Image from "next/image";
import Link from "next/link";
import type { Package } from "@/lib/types";
import styles from "./PackageCard.module.css";

export default function PackageCard({ pkg }: { pkg: Package }) {
  const overview = pkg.highlights[0] ?? "";

  return (
    <Link href={`/packages/${pkg.slug}`} className={styles.card}>
      <Image
        src={pkg.heroImage}
        alt={pkg.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={styles.image}
      />
      <div className={styles.overlay} />

      {pkg.badge && <span className={styles.badge}>{pkg.badge}</span>}
      <span className={styles.durationPill}>{pkg.duration}</span>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{pkg.title}</h3>
          <p className={styles.location}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {pkg.destination}
          </p>
          {overview && <p className={styles.overview}>{overview}</p>}
        </div>
      </div>

      <div className={styles.reveal}>
        <div className={styles.priceWrap}>
          <span className={styles.priceLabel}>starting from</span>
          <div className={styles.price}>
            <sup>₹</sup>{pkg.fromPrice.toLocaleString("en-IN")}
          </div>
          <p className={styles.priceNote}>per person</p>
        </div>
        <span className={styles.viewBtn}>
          View Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
