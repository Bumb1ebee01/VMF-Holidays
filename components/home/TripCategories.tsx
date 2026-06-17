"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { categories } from "@/lib/data/categories";
import { FadeIn, Stagger, fadeUp } from "@/components/ui/Motion";
import styles from "./TripCategories.module.css";

export default function TripCategories() {
  const GRID_CLASSES = [
    styles.hero, styles.slot1, styles.slot2, styles.slot3, styles.slot4, styles.wide,
  ];
  return (
    <section className={styles.section}>
      <FadeIn className={styles.header}>
        <div className={styles.headLeft}>
          <span className={styles.eyebrow}>Travel Your Way</span>
          <h2 className={styles.title}>
            Every journey<br /><em>starts here.</em>
          </h2>
        </div>
        <p className={styles.sub}>
          Six curated travel styles. One trusted team. Endless possibilities.
        </p>
      </FadeIn>

      <Stagger className={styles.bentoGrid} stagger={0.07} delay={0.15}>
        {categories.map((cat, i) => (
          <motion.div key={cat.slug} variants={fadeUp} className={`${styles.tile} ${GRID_CLASSES[i]}`}>
            <Link href={`/${cat.slug}`} className={styles.tileLink}>
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className={styles.img}
              />
              <div className={styles.overlay} />
              <div className={styles.tileContent}>
                <h3 className={styles.tileName}>{cat.label}</h3>
                <p className={styles.tileBlurb}>{cat.blurb}</p>
                <span className={styles.tileArrow}>Explore →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </Stagger>
    </section>
  );
}
