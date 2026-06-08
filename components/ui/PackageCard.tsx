import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import type { Package } from "@/lib/types";
import styles from "./PackageCard.module.css";

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
        {pkg.badge && <span className={`badge badge-orange ${styles.badge}`}>{pkg.badge}</span>}
        <span className={`badge badge-white ${styles.duration}`}>{pkg.duration}</span>
      </div>
      <div className={styles.body}>
        <p className={styles.destination}>{pkg.destination}</p>
        <h3 className={styles.title}>{pkg.title}</h3>
        <ul className={styles.highlights}>
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className={styles.footer}>
          <div>
            <span className={styles.fromLabel}>from</span>
            <span className={styles.price}>{formatINR(pkg.fromPrice)}</span>
            <span className={styles.perPerson}>per person</span>
          </div>
          <Link href={`/packages/${pkg.slug}`} className="btn btn-primary btn--sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
