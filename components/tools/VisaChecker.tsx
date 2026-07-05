"use client";

import { useState, useMemo } from "react";
import { VISAS, VISA_CATEGORIES, VISA_REVIEWED, type VisaCategory } from "@/lib/data/visas";
import styles from "./VisaChecker.module.css";

const CAT_LABEL: Record<VisaCategory, string> = Object.fromEntries(
  VISA_CATEGORIES.map((c) => [c.key, c.label])
) as Record<VisaCategory, string>;

export default function VisaChecker() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<VisaCategory | "all">("all");

  const countByCat = useMemo(() => {
    const m = {} as Record<VisaCategory, number>;
    for (const v of VISAS) m[v.category] = (m[v.category] ?? 0) + 1;
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VISAS.filter((v) => {
      if (active !== "all" && v.category !== active) return false;
      if (!q) return true;
      return v.country.toLowerCase().includes(q) || v.region.toLowerCase().includes(q);
    });
  }, [query, active]);

  return (
    <div className={styles.tool}>
      <div className={styles.controls}>
        <div className={styles.searchRow}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className={styles.search}
            placeholder="Search a country or region — e.g. Dubai, Thailand, Europe…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search destinations"
          />
          {query && (
            <button type="button" className={styles.clear} onClick={() => setQuery("")} aria-label="Clear search">×</button>
          )}
        </div>

        <div className={styles.filters} role="tablist" aria-label="Filter by visa type">
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            className={`${styles.chip} ${active === "all" ? styles.chipActive : ""}`}
            onClick={() => setActive("all")}
          >
            All <span className={styles.count}>{VISAS.length}</span>
          </button>
          {VISA_CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={active === c.key}
              title={c.meaning}
              data-cat={c.key}
              className={`${styles.chip} ${active === c.key ? styles.chipActive : ""}`}
              onClick={() => setActive(c.key)}
            >
              <span className={styles.dot} data-cat={c.key} aria-hidden="true" />
              {c.label} <span className={styles.count}>{countByCat[c.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          No destinations match “{query.trim()}”. Try another country — or ask us and we&apos;ll check it for you.
        </p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((v) => (
            <article key={v.country} className={styles.card} data-cat={v.category}>
              <div className={styles.cardTop}>
                <span className={styles.flag} aria-hidden="true">{v.flag}</span>
                <div className={styles.head}>
                  <h3 className={styles.country}>{v.country}</h3>
                  <span className={styles.region}>{v.region}</span>
                </div>
                <span className={styles.badge} data-cat={v.category}>{CAT_LABEL[v.category]}</span>
              </div>

              <p className={styles.summary}>{v.summary}</p>

              <div className={styles.stayRow}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>Tourist stay: <strong>{v.stay}</strong></span>
              </div>

              {v.note && <p className={styles.note}>{v.note}</p>}

              <a href={v.officialUrl} target="_blank" rel="noopener noreferrer" className={styles.official}>
                Official source — {v.officialLabel}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      )}

      <p className={styles.reviewed}>
        Showing {filtered.length} of {VISAS.length} destinations · compiled from official government sources · last reviewed {VISA_REVIEWED}
      </p>
    </div>
  );
}
