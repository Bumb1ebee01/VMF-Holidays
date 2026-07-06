import Image from "next/image";
import Link from "next/link";
import type { Package } from "@/lib/types";
import styles from "./PackageCard.module.css";

export default function PackageCard({ pkg }: { pkg: Package }) {
  const overview = pkg.highlights[0] ?? "";

  return (
    <div className={styles.card}>
      {/* Stretched link makes the whole card navigate to the package while leaving
          the Compare button as a separate, valid interactive element above it. */}
      <Link
        href={`/packages/${pkg.slug}`}
        className={styles.cardLink}
        aria-label={`View ${pkg.title}`}
      />
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
      <Link
        href={`/compare?p=${pkg.slug}`}
        className={styles.compareBtn}
        aria-label={`Compare ${pkg.title} with other packages`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
        Compare
      </Link>

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
          {pkg.hotel && (
            <div className={styles.hotelRow}>
              {pkg.hotelImage && (
                <div className={styles.hotelThumb}>
                  <Image src={pkg.hotelImage} alt={pkg.hotel} fill sizes="48px" className={styles.hotelThumbImg} />
                </div>
              )}
              <span className={styles.hotelName}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {pkg.hotel}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.reveal}>
        <div className={styles.priceWrap}>
          {pkg.priceOnRequest ? (
            <>
              <span className={styles.priceLabel}>pricing</span>
              <div className={styles.price} style={{ fontSize: "1.5rem", whiteSpace: "nowrap" }}>On Request</div>
              <p className={styles.priceNote}>tailored quote</p>
            </>
          ) : (
            <>
              <span className={styles.priceLabel}>starting from</span>
              <div className={styles.price}>
                <sup>₹</sup>{pkg.fromPrice.toLocaleString("en-IN")}
              </div>
              <p className={styles.priceNote}>per person</p>
            </>
          )}
        </div>
        <span className={styles.viewBtn}>
          View Details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}
