import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import type { Destination } from "@/lib/types";
import styles from "./DestinationCard.module.css";

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link href={`/packages?destination=${destination.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={styles.image}
        />
        <div className={styles.overlay} />
        <span className={`badge badge-white ${styles.badge}`}>{destination.country}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{destination.name}</h3>
        <p className={styles.from}>from {formatINR(destination.fromPrice)}</p>
      </div>
    </Link>
  );
}
