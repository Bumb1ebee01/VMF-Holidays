"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { WordReveal, LineReveal } from "@/components/ui/Motion";
import type { Destination } from "@/lib/types";
import styles from "./Hero.module.css";

interface Suggestion {
  title: string;
  slug: string;
  destination: string;
  heroImage?: string;
  fromPrice?: number;
  priceOnRequest?: boolean;
  duration?: string;
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

const SPRING = { type: "spring" as const, stiffness: 210, damping: 24 };

export default function Hero({
  suggestions = [],
  destinations = [],
}: {
  suggestions?: Suggestion[];
  destinations?: Destination[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax: shift the oversized photo plate down as the hero scrolls past.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  // Moving backdrop — cross-fade through hero photos of real destinations.
  const KERALA = "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/kerala.jpg";
  const bgImages = useMemo(() => {
    const fromDest = destinations
      .map((d) => d.heroImage)
      .filter((src) => src.startsWith("https://"));
    return Array.from(new Set([KERALA, ...fromDest])).slice(0, 10);
  }, [destinations]);
  const [bgIndex, setBgIndex] = useState(0);
  // Bumped on manual swipe/tap so the auto-advance interval restarts and doesn't
  // immediately pull the photo away from the one the visitor just chose.
  const [bgManualTick, setBgManualTick] = useState(0);

  useEffect(() => {
    if (bgImages.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setBgIndex((i) => (i + 1) % bgImages.length), 4500);
    return () => clearInterval(id);
  }, [bgImages.length, bgManualTick]);

  const goBg = (dir: 1 | -1) => {
    setBgIndex((i) => (i + dir + bgImages.length) % bgImages.length);
    setBgManualTick((t) => t + 1);
  };

  // Swipe the cover photos on touch devices.
  const touchStartX = useRef<number | null>(null);
  const onHeroTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onHeroTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || bgImages.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) goBg(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  // Gate the big reveals so they animate in as the intro curtain lifts.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setReady(true), reduce ? 0 : 1400);
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

  const filtered =
    query.trim().length > 0
      ? suggestions.filter(
          (s) =>
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.destination.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    setShowDropdown(false);
    // The standalone packages page was merged into Destinations; type-ahead
    // suggestions (below) jump straight to a package, and submitting browses all.
    router.push("/destinations");
  }

  function pickSuggestion(s: Suggestion) {
    setQuery(s.title);
    setShowDropdown(false);
    router.push(`/packages/${s.slug}`);
  }

  return (
    <>
      <section
        className={styles.hero}
        ref={heroRef}
        onTouchStart={onHeroTouchStart}
        onTouchEnd={onHeroTouchEnd}
      >
        {/* Parallax photo plate */}
        <motion.div className={styles.heroPlate} style={{ y: plateY }} aria-hidden="true">
          {bgImages.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={styles.heroImg}
              style={{ opacity: i === bgIndex ? 1 : 0, transition: "opacity 1.4s ease" }}
            />
          ))}
        </motion.div>
        <div className={styles.heroOverlay} />

        <div className={`container ${styles.content}`}>
          <div className={styles.left}>
            <motion.div
              className={styles.heroBadge}
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={SPRING}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              India&apos;s Trust-First Travel Company
            </motion.div>

            <WordReveal
              as="h1"
              className={styles.headline}
              text="Discover Your World"
              play={ready}
              stagger={0.14}
              duration={1.1}
            />

            <LineReveal
              as="p"
              className={styles.tagline}
              lines={["Your Way."]}
              play={ready}
              delay={0.35}
              duration={0.9}
            />

            <motion.p
              className={styles.sub}
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...SPRING, delay: 0.1 }}
            >
              We don&apos;t just plan trips — we craft journeys for those who want
              more than a destination. Trusted by 200+ travellers across India.
            </motion.p>

            <motion.div
              className={styles.searchWrap}
              ref={searchRef}
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...SPRING, delay: 0.2 }}
            >
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
              {showDropdown && query.trim().length > 0 && (
                <div className={styles.dropdown}>
                  {filtered.length > 0 ? (
                    <>
                      <ul className={styles.dropdownList}>
                        {filtered.slice(0, 6).map((s) => (
                          <li key={s.slug}>
                            <button type="button" className={styles.dropdownItem} onClick={() => pickSuggestion(s)}>
                              <span
                                className={styles.dropdownThumb}
                                style={s.heroImage ? { backgroundImage: `url(${s.heroImage})` } : undefined}
                                aria-hidden="true"
                              />
                              <span className={styles.dropdownText}>
                                <span className={styles.dropdownTitle}>{s.title}</span>
                                <span className={styles.dropdownDest}>
                                  {s.destination}{s.duration ? ` · ${s.duration}` : ""}
                                </span>
                              </span>
                              {s.priceOnRequest ? (
                                <span className={styles.dropdownPrice}>On Request</span>
                              ) : typeof s.fromPrice === "number" ? (
                                <span className={styles.dropdownPrice}>
                                  ₹{(s.fromPrice / 1000).toFixed(0)}k
                                </span>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button type="button" className={styles.dropdownAll} onClick={handleSearch}>
                        See all {filtered.length} result{filtered.length !== 1 ? "s" : ""} for “{query.trim()}” →
                      </button>
                    </>
                  ) : (
                    <button type="button" className={styles.dropdownEmpty} onClick={handleSearch}>
                      No packages match “{query.trim()}” — search all packages →
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div
              className={styles.pills}
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...SPRING, delay: 0.3 }}
            >
              {FILTER_PILLS.map((p) => (
                <Link key={p.href + p.label} href={p.href} className={styles.pill}>
                  {p.label}
                </Link>
              ))}
            </motion.div>

            <motion.div
              className={styles.ctas}
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...SPRING, delay: 0.4 }}
            >
              <Link href="/destinations" className={styles.btnPrimary}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Explore Destinations
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
          </div>

          {/* Glass card cluster — featured destination slider + members card */}
          <div className={styles.cardCluster}>
            <CollectionSlider destinations={destinations} ready={ready} />
            <MembersCard ready={ready} />
          </div>
        </div>

        {bgImages.length > 1 && (
          <div className={styles.bgDots} aria-label="Cover photos">
            {bgImages.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`${styles.bgDot} ${i === bgIndex ? styles.bgDotActive : ""}`}
                aria-label={`Show cover photo ${i + 1}`}
                aria-current={i === bgIndex}
                onClick={() => { setBgIndex(i); setBgManualTick((t) => t + 1); }}
              />
            ))}
          </div>
        )}

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

function CollectionSlider({
  destinations,
  ready,
}: {
  destinations: Destination[];
  ready: boolean;
}) {
  const slides = destinations.slice(0, 4);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!ready || slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3800);
    return () => clearInterval(id);
  }, [ready, slides.length]);

  if (slides.length === 0) return null;
  const active = slides[index];

  return (
    <motion.div
      className={styles.slider}
      initial={{ opacity: 0, y: 28 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.65 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={SPRING}
        >
          <Link href="/destinations" className={styles.slideCard}>
            <span className={styles.slideThumb} style={{ backgroundImage: `url(${active.heroImage})` }} />
            <span className={styles.slideMeta}>
              <span className={styles.slideBrand}>
                {active.region === "domestic" ? "India" : "International"}
              </span>
              <span className={styles.slideTitle}>{active.name}</span>
              <span className={styles.slideCta}>
                from ₹{(active.fromPrice / 1000).toFixed(0)}k →
              </span>
            </span>
          </Link>
        </motion.div>
      </AnimatePresence>
      <div className={styles.dots}>
        {slides.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            aria-label={`Show ${s.name}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MembersCard({ ready }: { ready: boolean }) {
  const AVATARS = ["#5790e6", "#FFA333", "#0b6e97", "#FE5C10"];
  return (
    <motion.article
      className={styles.membersCard}
      initial={{ opacity: 0, y: 28 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.78 }}
    >
      <div className={styles.membersInfo}>
        <span className={styles.membersValue}>200+</span>
        <div className={styles.avatars}>
          {AVATARS.map((c, i) => (
            <span key={i} className={styles.avatar} style={{ background: c }} />
          ))}
        </div>
        <span className={styles.membersLabel}>Travellers served</span>
      </div>
      <span
        className={styles.membersThumb}
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/maldives.jpg)",
        }}
      />
    </motion.article>
  );
}
