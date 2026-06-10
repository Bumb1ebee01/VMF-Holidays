"use client";

import { useRouter } from "next/navigation";
import type { Destination, TripCategory } from "@/lib/types";
import styles from "./PackageFilters.module.css";

interface Props {
  destinations: Destination[];
  categories: TripCategory[];
  activeDestination: string;
  activeCategory: string;
  activeRegion: string;
}

export default function PackageFilters({
  destinations,
  categories,
  activeDestination,
  activeCategory,
  activeRegion,
}: Props) {
  const router = useRouter();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    const next = {
      destination: activeDestination,
      category: activeCategory,
      region: activeRegion,
      [key]: value,
    };
    if (next.region) params.set("region", next.region);
    if (next.destination) params.set("destination", next.destination);
    if (next.category) params.set("category", next.category);
    router.push(`/packages?${params.toString()}`);
  }

  function toggle(key: string, current: string, value: string) {
    update(key, current === value ? "" : value);
  }

  const hasActive = activeDestination || activeCategory || (activeRegion && activeRegion !== "");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        {hasActive && (
          <button className={styles.clearBtn} onClick={() => router.push("/packages")}>
            Clear all
          </button>
        )}
      </div>

      {/* Region */}
      <div className={styles.group}>
        <h3 className={styles.groupLabel}>Region</h3>
        <div className={styles.pills}>
          {[
            { label: "All", value: "" },
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ].map((r) => (
            <button
              key={r.label}
              className={`${styles.pill} ${activeRegion === r.value ? styles.pillActive : ""}`}
              onClick={() => update("region", r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className={styles.group}>
        <h3 className={styles.groupLabel}>Trip Type</h3>
        <div className={styles.pills}>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={`${styles.pill} ${activeCategory === cat.slug ? styles.pillActive : ""}`}
              onClick={() => toggle("category", activeCategory, cat.slug)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destination */}
      <div className={styles.group}>
        <h3 className={styles.groupLabel}>Destination</h3>
        <ul className={styles.destList}>
          {destinations.map((d) => (
            <li key={d.slug}>
              <button
                className={`${styles.destItem} ${activeDestination === d.slug ? styles.destActive : ""}`}
                onClick={() => toggle("destination", activeDestination, d.slug)}
              >
                <span className={styles.destName}>{d.name}</span>
                <span className={styles.destCountry}>{d.country}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
