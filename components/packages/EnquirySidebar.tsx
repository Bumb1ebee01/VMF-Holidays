"use client";

import Link from "next/link";
import { formatINR } from "@/lib/utils";
import type { Package } from "@/lib/types";
import styles from "./EnquirySidebar.module.css";

const WA_NUMBER = "917499322412";

export default function EnquirySidebar({ pkg }: { pkg: Package }) {
  const priceBit = pkg.priceOnRequest ? "" : `, from ${formatINR(pkg.fromPrice)} per person`;
  const waText = encodeURIComponent(
    `Hi VMF Holidays! I'd like to enquire about the *${pkg.title}* package (${pkg.duration}${priceBit}). Please share more details.`
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.priceBlock}>
          {pkg.priceOnRequest ? (
            <span className={styles.price}>On Request</span>
          ) : (
            <>
              <span className={styles.fromLabel}>from</span>
              <span className={styles.price}>{formatINR(pkg.fromPrice)}</span>
              <span className={styles.perPerson}>per person</span>
            </>
          )}
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{pkg.duration}</span>
          </div>
          <div className={styles.metaItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{pkg.destination}</span>
          </div>
        </div>

        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn--lg ${styles.waBtn}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Enquire on WhatsApp
        </a>

        <Link
          href={`/contact?package=${pkg.slug}&title=${encodeURIComponent(pkg.title)}`}
          className="btn btn-outline btn--lg"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Get a Custom Quote
        </Link>

        <p className={styles.note}>
          Free consultation · No booking fees · Personalised itinerary
        </p>
      </div>

      {pkg.highlights.length > 0 && (
        <div className={styles.highlights}>
          <h3 className={styles.highlightsTitle}>Trip Highlights</h3>
          <ul className={styles.highlightsList}>
            {pkg.highlights.map((h) => (
              <li key={h} className={styles.highlightItem}>
                <span className={styles.check}>✓</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
