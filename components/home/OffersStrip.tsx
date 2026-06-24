import Link from "next/link";
import Image from "next/image";
import type { Offer } from "@/lib/types";
import styles from "./OffersStrip.module.css";

const WA_DEFAULT =
  "https://wa.me/917499322412?text=Hi%20VMF%20Holidays!%20I%27d%20like%20details%20on%20your%20current%20offers.";

export default function OffersStrip({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;
  const strip = [...offers, ...offers];

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <span className="eyebrow">Limited-time deals</span>
            <h2 className={styles.title}>Latest Offers</h2>
          </div>
          <Link href="/offers" className={styles.seeAll}>
            View all offers
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.track}>
          {strip.map((o, i) => (
            <Link
              key={`${o.id}-${i}`}
              href={o.ctaHref?.trim() ? o.ctaHref : WA_DEFAULT}
              className={styles.tile}
            >
              <Image src={o.image} alt={o.title} fill sizes="340px" className={styles.img} />
              {o.badge && <span className={styles.badge}>{o.badge}</span>}
              <span className={styles.tileBody}>
                <span className={styles.tileTitle}>{o.title}</span>
                <span className={styles.tileCta}>{o.ctaLabel?.trim() || "Enquire now"} →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
