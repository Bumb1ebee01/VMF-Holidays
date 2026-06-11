"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Hero.module.css";

const FILTER_PILLS = [
  { label: "Beach Escapes", href: "/adventure" },
  { label: "Honeymoon", href: "/honeymoon" },
  { label: "Adventure", href: "/adventure" },
  { label: "Family Trips", href: "/family" },
  { label: "Heritage Tours", href: "/pilgrimage" },
];

const MARQUEE = [
  "Goa", "Kerala", "Rajasthan", "Maldives", "Dubai",
  "Thailand", "Ladakh", "Singapore", "Bali", "Andaman",
  "Shimla", "Manali", "Kashmir", "Coorg", "Ooty",
];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBgLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/packages?q=${encodeURIComponent(query.trim())}`);
    else router.push("/packages");
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={`${styles.heroBg} ${bgLoaded ? styles.heroBgLoaded : ""}`} />
        <div className={styles.heroOverlay} />

        <div className={`container ${styles.content}`}>
          <div className={styles.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            India&apos;s Trust-First Travel Company
          </div>

          <h1 className={styles.headline}>
            Discover Your World,<br /><em>Your Way.</em>
          </h1>

          <p className={styles.sub}>
            We don&apos;t just plan trips — we craft journeys for those who want more than a destination.
            Trusted by 500+ travellers across India.
          </p>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Where do you want to go? e.g. Goa, Maldives, Dubai…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>Search Packages</button>
          </form>

          <div className={styles.pills}>
            {FILTER_PILLS.map((p) => (
              <Link key={p.href + p.label} href={p.href} className={styles.pill}>
                {p.label}
              </Link>
            ))}
          </div>

          <div className={styles.ctas}>
            <Link href="/packages" className={styles.btnPrimary}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Browse Packages
            </Link>
            <a
              href="https://wa.me/917499322412?text=Hi%20VMF%20Holidays!%20I%27d%20like%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutline}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Talk to an Expert
            </a>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>Explore</span>
        </div>
      </section>

      {/* Marquee strip */}
      <div className={styles.marqueeStrip}>
        <div className={styles.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <div key={i} className={styles.marqueeItem}>
              {item}
              <span>·</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
