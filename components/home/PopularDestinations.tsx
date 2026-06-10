"use client";

import { useState } from "react";
import Link from "next/link";
import { destinations } from "@/lib/data/destinations";
import styles from "./PopularDestinations.module.css";

const FILTERS = ["all", "domestic", "international"] as const;
type Filter = typeof FILTERS[number];
const LABELS: Record<Filter, string> = { all: "All", domestic: "India", international: "International" };

export default function PopularDestinations() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? destinations.slice(0, 5)
      : destinations.filter((d) => d.region === filter);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={`${styles.eyebrow} reveal`}>Top Destinations</p>
            <h2 className={`${styles.title} reveal`}>Where Will You Go Next?</h2>
          </div>
          <div className={`${styles.filterTabs} reveal`}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterTab} ${filter === f ? styles.filterActive : ""}`}
                onClick={() => setFilter(f)}
              >
                {LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        <div className={`${styles.grid} ${filter === "all" ? styles.gridMagazine : styles.gridNormal}`}>
          {visible.map((dest, i) => (
            <Link
              key={dest.slug}
              href={`/packages?destination=${dest.slug}`}
              className={`${styles.card} ${i === 0 && filter === "all" ? styles.cardFeat : ""} reveal`}
            >
              <div
                className={styles.cardImg}
                style={{ backgroundImage: `url(${dest.heroImage})` }}
              />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <span className={styles.destBadge}>
                  {dest.region === "domestic" ? "India" : "International"}
                </span>
                <h3 className={styles.destName}>{dest.name}</h3>
                <p className={styles.destMeta}>
                  from ₹{(dest.fromPrice / 1000).toFixed(0)}k per person
                </p>
                <span className={styles.destExplore}>Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
