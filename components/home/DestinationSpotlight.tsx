"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { Destination } from "@/lib/types";
import styles from "./DestinationSpotlight.module.css";

interface Slide {
  slug: string;
  headline: [string, string, string, string]; // 2 rows of 2; word[2] is ink-coloured
  name: string;
  tagline: string;
}

const SLIDES: Slide[] = [
  { slug: "kerala",    headline: ["Emerald", "Backwaters", "Endless", "Calm"],  name: "Kerala",    tagline: "Houseboats & spice trails" },
  { slug: "maldives",  headline: ["Turquoise", "Lagoons", "Private", "Shores"], name: "Maldives",  tagline: "Overwater honeymoon escape" },
  { slug: "rajasthan", headline: ["Majestic", "Forts", "Desert", "Gold"],       name: "Rajasthan", tagline: "Palaces of the Land of Kings" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function GhostWord({ word, ink, delay, play }: { word: string; ink?: boolean; delay: number; play: boolean }) {
  return (
    <span className={styles.ghostClip}>
      <motion.span
        className={`${styles.ghostWord} ${ink ? styles.ghostInk : ""}`}
        initial={{ y: "115%", opacity: 0 }}
        animate={play ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function DestinationSpotlight({ destinations }: { destinations: Destination[] }) {
  const bySlug = new Map(destinations.map((d) => [d.slug, d]));
  const slides = SLIDES.filter((s) => bySlug.has(s.slug));
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" });

  if (slides.length === 0) return null;

  const slide = slides[index];
  const dest = bySlug.get(slide.slug)!;
  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Top badges */}
      <div className={styles.badges}>
        <motion.div
          className={styles.percentBadge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <span className={styles.percentNum}>100%</span>
          <span className={styles.percentCap}>Tailored to how you travel</span>
        </motion.div>

        <motion.article
          className={styles.badgeCard}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.12 }}
        >
          <span className={styles.indexChip}>#0{index + 1}</span>
          <div>
            <h3 className={styles.badgeTitle}>Trusted by serious travellers</h3>
            <p className={styles.badgeBody}>
              From first honeymoons to multi-family tours, travellers book with VMF
              because the trip lands exactly as promised — no surprises.
            </p>
          </div>
        </motion.article>
      </div>

      <div className={styles.stage}>
        {/* Oversized ghost heading */}
        <h2 className={styles.ghostHeading} aria-label={slide.headline.join(" ")}>
          <span className={styles.ghostRow}>
            <GhostWord key={`${index}-0`} word={slide.headline[0]} delay={0.0} play={inView} />
            <GhostWord key={`${index}-1`} word={slide.headline[1]} delay={0.08} play={inView} />
          </span>
          <span className={styles.ghostRow}>
            <GhostWord key={`${index}-2`} word={slide.headline[2]} ink delay={0.16} play={inView} />
            <GhostWord key={`${index}-3`} word={slide.headline[3]} delay={0.24} play={inView} />
          </span>
        </h2>

        {/* Tilted photo card */}
        <motion.figure
          className={styles.photoCard}
          initial={{ opacity: 0, y: 60, scale: 0.92, rotate: 6 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, rotate: 6 } : { opacity: 0, y: 60, scale: 0.92, rotate: 6 }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={dest.slug}
              className={styles.photoInner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <Image
                src={dest.heroImage}
                alt={`${slide.name} — ${slide.tagline}`}
                fill
                sizes="(max-width: 640px) 60vw, 16rem"
                className={styles.photoImg}
              />
            </motion.div>
          </AnimatePresence>
          <Link href={`/packages?destination=${dest.slug}`} className={styles.photoCaption}>
            <span className={styles.photoName}>{slide.name}</span>
            <span className={styles.photoRole}>{slide.tagline}</span>
          </Link>
        </motion.figure>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button type="button" className={`${styles.arrow} ${styles.arrowOutline}`} aria-label="Previous destination" onClick={() => go(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
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
        <button type="button" className={`${styles.arrow} ${styles.arrowSolid}`} aria-label="Next destination" onClick={() => go(1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
