import Image from "next/image";
import Link from "next/link";
import type { TripCategory } from "@/lib/types";
import styles from "./CategoryTile.module.css";

export default function CategoryTile({ category }: { category: TripCategory }) {
  return (
    <Link href={`/${category.slug}`} className={styles.tile}>
      <Image
        src={category.image}
        alt={category.label}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={styles.image}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.icon}>{category.icon}</span>
        <h3 className={styles.label}>{category.label}</h3>
        <p className={styles.blurb}>{category.blurb}</p>
      </div>
    </Link>
  );
}
