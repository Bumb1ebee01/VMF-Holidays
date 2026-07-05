import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import type { LocationTile } from "@/lib/queries";
import styles from "./LocationTiles.module.css";

// Grid of destination tiles (a state for domestic, a country for international).
// Each tile links to its detail page and shows the live package count.
export default function LocationTiles({ tiles, hrefBase }: { tiles: LocationTile[]; hrefBase: string }) {
  return (
    <div className={styles.grid}>
      {tiles.map((t) => (
        <Link key={t.slug} href={`${hrefBase}/${t.slug}`} className={styles.tile}>
          <Image
            src={t.image}
            alt={t.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={styles.img}
          />
          <div className={styles.overlay} />
          <div className={styles.body}>
            <h3 className={styles.name}>{t.name}</h3>
            <div className={styles.meta}>
              <span className={styles.count}>
                {t.packageCount} package{t.packageCount === 1 ? "" : "s"}
              </span>
              {t.fromPrice != null && <span className={styles.price}>from {formatINR(t.fromPrice)}</span>}
            </div>
          </div>
          <span className={styles.arrow} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
