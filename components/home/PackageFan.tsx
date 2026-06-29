"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Stagger, fadeUp } from "@/components/ui/Motion";
import type { Package } from "@/lib/types";
import styles from "./PackageFan.module.css";

interface CardItem {
  imgUrl: string;
  alt: string;
  title: string;
  meta: string;
}

export default function PackageFan({ packages }: { packages: Package[] }) {
  const cards: CardItem[] = useMemo(
    () =>
      packages.map((p) => ({
        imgUrl: p.heroImage,
        alt: p.title,
        title: p.title,
        meta: `${p.duration} · ${p.priceOnRequest ? "On Request" : `from ₹${(p.fromPrice / 1000).toFixed(0)}k`}`,
      })),
    [packages]
  );

  // Tapping/clicking a tile opens a detail "splash" with the full highlights.
  const [preview, setPreview] = useState<number | null>(null);
  const closeNow = () => setPreview(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreview(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!cards.length) return null;

  const activePkg = preview !== null ? packages[preview] ?? null : null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <p className="eyebrow">Featured Journeys</p>
          <h2 className={styles.title}>Hand-Picked <em>Holidays</em></h2>
        </div>

        {/* Plain tiles: a grid on desktop, a swipe row on mobile — both reveal on
            scroll. Tapping a tile opens the detail splash below. */}
        <Stagger className={styles.tiles} stagger={0.08}>
          {cards.map((card, index) => (
            <motion.button
              key={index}
              type="button"
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={styles.tile}
              onClick={() => setPreview(index)}
              aria-label={`View ${card.title}`}
            >
              <Image
                src={card.imgUrl}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 68vw, (max-width: 1100px) 30vw, 18vw"
                className={styles.tileImg}
              />
              <div className={styles.tileOverlay} />
              <div className={styles.tileCaption}>
                <span className={styles.tileTitle}>{card.title}</span>
                <span className={styles.tileMeta}>{card.meta}</span>
                <span className={styles.tileTap}>Tap for details</span>
              </div>
            </motion.button>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {activePkg && (
          <motion.div
            className={styles.splashBackdrop}
            onClick={closeNow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className={styles.splash}
              onClick={(e) => e.stopPropagation()}
              initial={{ clipPath: "inset(42% 34% 42% 34% round 24px)", opacity: 0.4 }}
              animate={{ clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1 }}
              exit={{ clipPath: "inset(44% 36% 44% 36% round 24px)", opacity: 0 }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
            >
              <button className={styles.splashClose} onClick={closeNow} aria-label="Close">×</button>
              <div className={styles.splashImageWrap}>
                <motion.div
                  className={styles.splashImageZoom}
                  initial={{ scale: 1.14 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={activePkg.heroImage} alt={activePkg.title} fill sizes="55vw" className={styles.splashImage} />
                </motion.div>
                {activePkg.badge && <span className={styles.splashBadge}>{activePkg.badge}</span>}
              </div>
              <motion.div
                className={styles.splashBody}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.18 }}
              >
                <p className={styles.splashDest}>{activePkg.destination}</p>
                <h3 className={styles.splashTitle}>{activePkg.title}</h3>
                <div className={styles.splashMeta}>
                  <span>{activePkg.duration}</span>
                  <span className={styles.splashPrice}>
                    {activePkg.priceOnRequest ? "On Request" : `from ₹${activePkg.fromPrice.toLocaleString("en-IN")}`}
                  </span>
                </div>
                {activePkg.highlights.length > 0 && (
                  <ul className={styles.splashHighlights}>
                    {activePkg.highlights.slice(0, 5).map((h, i) => (
                      <li key={i}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <a href={`/packages/${activePkg.slug}`} className={styles.splashCta}>
                  View Full Itinerary
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
