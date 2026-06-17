import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import type { Destination } from "@/lib/types";
import styles from "./DestinationCard.module.css";

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link href={`/packages?destination=${destination.slug}`} className={styles.card}>
      <Image
        src={destination.heroImage}
        alt={destination.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={styles.image}
      />
      <div className={styles.overlay} />

      <span className={styles.badge}>{destination.country}</span>

      <div className={styles.content}>
        <h3 className={styles.name}>{destination.name}</h3>
        <div className={styles.meta}>
          <span className={styles.from}>from {formatINR(destination.fromPrice)}</span>
          <span className={styles.explore}>Explore →</span>
        </div>
      </div>
    </Link>
  );
}
