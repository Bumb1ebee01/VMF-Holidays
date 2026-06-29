"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PackageCard from "@/components/ui/PackageCard";
import type { Package } from "@/lib/types";
import styles from "./DestinationExplorer.module.css";

export interface ExplorerPlace {
  slug: string;
  name: string;
  images: string[];
  activityCount: number;
  packages: Package[];
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
  active,
}: {
  images: string[];
  flag?: string;
  name: string;
  meta: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const slides = images.length > 0 ? images : [""];
  const [activeSlide, setActiveSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hovered && slides.length > 1 && !reduce) {
      timer.current = setInterval(() => setActiveSlide((i) => (i + 1) % slides.length), 1300);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [hovered, slides.length]);

  const enter = () => setHovered(true);
  const leave = () => {
    setHovered(false);
    setActiveSlide(0);
  };

  const inner = (
    <>
      <span className={styles.slides} aria-hidden="true">
        {slides.map((src, i) => (
          <span
            key={`${src}-${i}`}
            className={styles.slide}
            style={{ backgroundImage: src ? `url(${src})` : undefined, opacity: i === activeSlide ? 1 : 0 }}
          />
        ))}
      </span>
      <span className={styles.overlay} />
      {flag && <span className={styles.flag}>{flag}</span>}
      {slides.length > 1 && (
        <span className={styles.dots} aria-hidden="true">
          {slides.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === activeSlide ? styles.dotOn : ""}`} />
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
      className={`${styles.tile} ${styles.tileBtn} ${active ? styles.tileActive : ""}`}
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

/** The inline packages panel revealed when a place tile is clicked. */
function PlacePanel({ place, onClose }: { place: ExplorerPlace; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return (
    <div ref={ref} className={styles.panel}>
      <div className={styles.panelHead}>
        <h3 className={styles.panelTitle}>
          {place.name}
          <span className={styles.panelCount}>
            {place.packages.length > 0
              ? ` · ${place.packages.length} package${place.packages.length > 1 ? "s" : ""}`
              : ""}
          </span>
        </h3>
        <button type="button" className={styles.panelClose} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      {place.packages.length > 0 ? (
        <div className={styles.panelGrid}>
          {place.packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      ) : (
        <p className={styles.panelEmpty}>
          We don&apos;t list fixed packages for {place.name} yet — every {place.name} trip is
          planned around you. Tell us what you have in mind and we&apos;ll build it.
        </p>
      )}

      <div className={styles.panelCta}>
        <Link href="/trip-builder" className="btn btn-primary">
          Build a {place.name} trip
        </Link>
      </div>
    </div>
  );
}

export default function DestinationExplorer({ countries }: { countries: ExplorerCountry[] }) {
  // Domestic = a single country (India): skip the country level, show its places.
  const single = countries.length === 1;
  const [selected, setSelected] = useState<ExplorerCountry | null>(null);
  const [countryExpanded, setCountryExpanded] = useState(false);
  const [placeExpanded, setPlaceExpanded] = useState(false);
  const [openPlace, setOpenPlace] = useState<string | null>(null);

  const activeCountry = single ? countries[0] : selected;

  // ── Places view ───────────────────────────────────────────────────────────
  if (activeCountry) {
    const all = activeCountry.places;
    const visible = placeExpanded ? all : all.slice(0, INITIAL);
    const openPlaceData = openPlace ? all.find((p) => p.slug === openPlace) ?? null : null;
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
                setOpenPlace(null);
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
                meta={
                  p.packages.length > 0
                    ? `${p.packages.length} package${p.packages.length > 1 ? "s" : ""} →`
                    : "Plan a custom trip →"
                }
                active={openPlace === p.slug}
                onClick={() => setOpenPlace((cur) => (cur === p.slug ? null : p.slug))}
              />
            </div>
          ))}
        </div>

        {openPlaceData && (
          <PlacePanel place={openPlaceData} onClose={() => setOpenPlace(null)} />
        )}

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
                setOpenPlace(null);
              }}
            />
          </div>
        ))}
      </div>
      <ViewMore hidden={countries.length - INITIAL} expanded={countryExpanded} onClick={() => setCountryExpanded((v) => !v)} />
    </div>
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
