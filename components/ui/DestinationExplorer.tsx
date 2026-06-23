"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./DestinationExplorer.module.css";

export interface ExplorerPlace {
  slug: string;
  name: string;
  images: string[];
  href: string;
  activityCount: number;
}

export interface ExplorerCountry {
  code: string;
  name: string;
  flag: string;
  images: string[];
  placeCount: number;
  places: ExplorerPlace[];
}

const INITIAL = 8;

/** Cross-fading slideshow + hover-reveal tile, shared by country and place tiles. */
function Tile({
  images,
  flag,
  name,
  meta,
  href,
  onClick,
}: {
  images: string[];
  flag?: string;
  name: string;
  meta: string;
  href?: string;
  onClick?: () => void;
}) {
  const slides = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hovered && slides.length > 1 && !reduce) {
      timer.current = setInterval(() => setActive((i) => (i + 1) % slides.length), 1300);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [hovered, slides.length]);

  const enter = () => setHovered(true);
  const leave = () => {
    setHovered(false);
    setActive(0);
  };

  const inner = (
    <>
      <span className={styles.slides} aria-hidden="true">
        {slides.map((src, i) => (
          <span
            key={`${src}-${i}`}
            className={styles.slide}
            style={{ backgroundImage: src ? `url(${src})` : undefined, opacity: i === active ? 1 : 0 }}
          />
        ))}
      </span>
      <span className={styles.overlay} />
      {flag && <span className={styles.flag}>{flag}</span>}
      {slides.length > 1 && (
        <span className={styles.dots} aria-hidden="true">
          {slides.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === active ? styles.dotOn : ""}`} />
          ))}
        </span>
      )}
      <span className={styles.body}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
      </span>
    </>
  );

  return href ? (
    <Link href={href} className={styles.tile} onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
      {inner}
    </Link>
  ) : (
    <button
      type="button"
      className={`${styles.tile} ${styles.tileBtn}`}
      onClick={onClick}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      {inner}
    </button>
  );
}

function ViewMore({
  hidden,
  expanded,
  onClick,
}: {
  hidden: number;
  expanded: boolean;
  onClick: () => void;
}) {
  if (hidden <= 0) return null;
  return (
    <div className={styles.moreWrap}>
      <button type="button" className={styles.moreBtn} onClick={onClick} aria-expanded={expanded}>
        {expanded ? "Show less" : `View ${hidden} more`}
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          className={expanded ? styles.chevUp : ""}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

export default function DestinationExplorer({ countries }: { countries: ExplorerCountry[] }) {
  // Domestic = a single country (India): skip the country level, show its places.
  const single = countries.length === 1;
  const [selected, setSelected] = useState<ExplorerCountry | null>(null);
  const [countryExpanded, setCountryExpanded] = useState(false);
  const [placeExpanded, setPlaceExpanded] = useState(false);

  const activeCountry = single ? countries[0] : selected;

  // ── Places view ───────────────────────────────────────────────────────────
  if (activeCountry) {
    const all = activeCountry.places;
    const visible = placeExpanded ? all : all.slice(0, INITIAL);
    return (
      <div>
        {!single && (
          <div className={styles.crumbBar}>
            <button
              type="button"
              className={styles.back}
              onClick={() => {
                setSelected(null);
                setPlaceExpanded(false);
              }}
            >
              ← All countries
            </button>
            <span className={styles.crumbTitle}>
              {activeCountry.flag} {activeCountry.name}
            </span>
          </div>
        )}
        <div className={styles.grid}>
          {visible.map((p, i) => (
            <div
              key={p.slug}
              className={placeExpanded && i >= INITIAL ? styles.reveal : ""}
              style={placeExpanded && i >= INITIAL ? { animationDelay: `${Math.min((i - INITIAL) * 0.05, 0.5)}s` } : undefined}
            >
              <Tile
                images={p.images}
                name={p.name}
                meta={p.activityCount > 0 ? `${p.activityCount} things to do →` : "Explore →"}
                href={p.href}
              />
            </div>
          ))}
        </div>
        <ViewMore hidden={all.length - INITIAL} expanded={placeExpanded} onClick={() => setPlaceExpanded((v) => !v)} />
      </div>
    );
  }

  // ── Countries view ──────────────────────────────────────────────────────────
  const visible = countryExpanded ? countries : countries.slice(0, INITIAL);
  return (
    <div>
      <div className={styles.grid}>
        {visible.map((c, i) => (
          <div
            key={c.code}
            className={countryExpanded && i >= INITIAL ? styles.reveal : ""}
            style={countryExpanded && i >= INITIAL ? { animationDelay: `${Math.min((i - INITIAL) * 0.05, 0.5)}s` } : undefined}
          >
            <Tile
              images={c.images}
              flag={c.flag}
              name={c.name}
              meta={`${c.placeCount} ${c.placeCount === 1 ? "place" : "places"} →`}
              onClick={() => {
                setSelected(c);
                setPlaceExpanded(false);
              }}
            />
          </div>
        ))}
      </div>
      <ViewMore hidden={countries.length - INITIAL} expanded={countryExpanded} onClick={() => setCountryExpanded((v) => !v)} />
    </div>
  );
}
