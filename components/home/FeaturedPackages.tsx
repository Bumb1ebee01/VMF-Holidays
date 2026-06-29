import Link from "next/link";
import PackageCard from "@/components/ui/PackageCard";
import { getFeaturedPackages } from "@/lib/queries";
import styles from "./FeaturedPackages.module.css";

export default async function FeaturedPackages() {
  const featured = await getFeaturedPackages();

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={`${styles.eyebrow} reveal`}>Featured Packages</div>
          <h2 className={`${styles.title} reveal`}>Handpicked For You</h2>
          <p className={`${styles.sub} reveal`}>
            Every package is curated by our expert team — best routes, best stays, best value.
          </p>
          <Link href="/trip-builder" className={`${styles.buildBtn} reveal`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="11" y2="18" />
              <circle cx="18" cy="18" r="3" /><line x1="21" y1="15" x2="15" y2="21" />
            </svg>
            Build My Own Trip
          </Link>
        </div>
        <div className="grid-3">
          {featured.map((pkg, i) => (
            <div key={pkg.slug} className={`reveal reveal-d${i + 1}`}>
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
        <div className={styles.viewAll}>
          <Link href="/destinations" className={styles.viewAllBtn}>
            Explore Destinations →
          </Link>
        </div>
      </div>
    </section>
  );
}
