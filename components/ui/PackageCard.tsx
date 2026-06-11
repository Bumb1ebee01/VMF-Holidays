import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import type { Package } from "@/lib/types";
import styles from "./PackageCard.module.css";

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
        <div className={styles.imgOverlay} />
        {pkg.badge && (
          <span className={styles.typeBadge}>{pkg.badge}</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{pkg.title}</h3>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /><path d="M12 7v5l3 3" />
            </svg>
            {pkg.duration}
          </div>
          <div className={styles.metaItem}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {pkg.destination}
          </div>
          {pkg.highlights[0] && (
            <div className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {pkg.highlights[0]}
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div>
          <span className={styles.priceLabel}>starting from</span>
          <div className={styles.price}>
            <sup>₹</sup>{pkg.fromPrice.toLocaleString("en-IN")}
          </div>
        </div>
        <Link href={`/packages/${pkg.slug}`} className={styles.viewBtn}>
          View Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
