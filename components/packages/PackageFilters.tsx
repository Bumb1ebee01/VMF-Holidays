"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import type { Destination, TripCategory } from "@/lib/types";
import styles from "./PackageFilters.module.css";

interface Props {
  destinations: Destination[];
  categories: TripCategory[];
  activeDestination: string;
  activeCategory: string;
  activeRegion: string;
  activeQuery: string;
}

export default function PackageFilters({
  destinations,
  categories,
  activeDestination,
  activeCategory,
  activeRegion,
  activeQuery,
}: Props) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    const next = {
      destination: activeDestination,
      category: activeCategory,
      region: activeRegion,
      q: activeQuery,
      [key]: value,
    };
    if (next.region) params.set("region", next.region);
    if (next.destination) params.set("destination", next.destination);
    if (next.category) params.set("category", next.category);
    if (next.q?.trim()) params.set("q", next.q.trim());
    const qs = params.toString();
    router.push(qs ? `/packages?${qs}` : "/packages");
  }

  function toggle(key: string, current: string, value: string) {
    update(key, current === value ? "" : value);
  }

  const hasActive =
    activeDestination || activeCategory || activeQuery.trim() || (activeRegion && activeRegion !== "");

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

      {/* Search */}
      <form
        className={styles.searchForm}
        onSubmit={(e) => {
          e.preventDefault();
          update("q", searchRef.current?.value.trim() ?? "");
        }}
      >
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          key={activeQuery}
          ref={searchRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search packages…"
          defaultValue={activeQuery}
          aria-label="Search packages"
        />
        <button type="submit" className={styles.searchBtn} aria-label="Search">Go</button>
      </form>

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
