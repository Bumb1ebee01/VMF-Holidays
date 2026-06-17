"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";

interface Suggestion {
  title: string;
  slug: string;
  destination: string;
}

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

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CONTENT = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export default function Hero({ suggestions = [] }: { suggestions?: Suggestion[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setBgLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = query.trim().length > 0
    ? suggestions.filter((s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.destination.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowDropdown(false);
    if (query.trim()) router.push(`/packages?q=${encodeURIComponent(query.trim())}`);
    else router.push("/packages");
  }

  function pickSuggestion(s: Suggestion) {
    setQuery(s.title);
    setShowDropdown(false);
    router.push(`/packages/${s.slug}`);
  }

  return (
    <>
      <section className={styles.hero}>
        {/* Background */}
        <div className={`${styles.heroBg} ${bgLoaded ? styles.heroBgLoaded : ""}`} />
        <div className={styles.heroOverlay} />

        {/* Aurora orbs */}
        <div className={styles.orb1} aria-hidden="true" />
        <div className={styles.orb2} aria-hidden="true" />
        <div className={styles.orb3} aria-hidden="true" />

        <div className={`container ${styles.content}`}>
          <motion.div
            className={styles.contentInner}
            variants={CONTENT}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={ITEM} className={styles.heroBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              India&apos;s Trust-First Travel Company
            </motion.div>

            <motion.h1 variants={ITEM} className={styles.headline}>
              Discover Your World,<br /><em>Your Way.</em>
            </motion.h1>

            <motion.p variants={ITEM} className={styles.sub}>
              We don&apos;t just plan trips — we craft journeys for those who want more than a destination.
              Trusted by 200+ travellers across India.
            </motion.p>

            <motion.div variants={ITEM} className={styles.searchWrap} ref={searchRef}>
              <form className={styles.searchBar} onSubmit={handleSearch}>
                <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Where do you want to go? e.g. Goa, Maldives, Dubai…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => { if (query.trim()) setShowDropdown(true); }}
                  autoComplete="off"
                />
                <button type="submit" className={styles.searchBtn}>Search Packages</button>
              </form>
              {showDropdown && filtered.length > 0 && (
                <ul className={styles.dropdown}>
                  {filtered.map((s) => (
                    <li key={s.slug}>
                      <button type="button" className={styles.dropdownItem} onClick={() => pickSuggestion(s)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <span className={styles.dropdownTitle}>{s.title}</span>
                        <span className={styles.dropdownDest}>{s.destination}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            <motion.div variants={ITEM} className={styles.pills}>
              {FILTER_PILLS.map((p) => (
                <Link key={p.href + p.label} href={p.href} className={styles.pill}>
                  {p.label}
                </Link>
              ))}
            </motion.div>

            <motion.div variants={ITEM} className={styles.ctas}>
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
            </motion.div>
          </motion.div>
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
