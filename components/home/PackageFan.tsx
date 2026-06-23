"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Package } from "@/lib/types";
import styles from "./PackageFan.module.css";

interface CardItem {
  imgUrl: string;
  alt: string;
  linkUrl: string;
  title: string;
  meta: string;
  note: string;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const GSAP_SRC = "https://unpkg.com/gsap@3.12.5/dist/gsap.min.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadGsap(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { gsap?: unknown };
    if (w.gsap) return resolve(w.gsap);
    let s = document.querySelector<HTMLScriptElement>(`script[src="${GSAP_SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = GSAP_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
    s.addEventListener("load", () => resolve((window as unknown as { gsap?: unknown }).gsap));
    s.addEventListener("error", () => reject(new Error("Failed to load GSAP")));
  });
}

export default function PackageFan({ packages }: { packages: Package[] }) {
  const cards: CardItem[] = useMemo(
    () =>
      packages.map((p) => ({
        imgUrl: p.heroImage,
        alt: p.title,
        linkUrl: `/packages/${p.slug}`,
        title: p.title,
        meta: `${p.duration} · from ₹${(p.fromPrice / 1000).toFixed(0)}k`,
        note: p.highlights?.[0] ?? "",
      })),
    [packages]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gsapRef = useRef<any>(null);
  const [gsapReady, setGsapReady] = useState(false);
  const [gsapFailed, setGsapFailed] = useState(false);

  // Hover "splash" — a big detail panel for the hovered card.
  const [preview, setPreview] = useState<number | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  const cardEnter = (i: number) => {
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setPreview(i), 140);
  };
  const cardLeave = () => {
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setPreview(null), 180);
  };
  const panelEnter = () => clearHoverTimer();
  const panelLeave = () => {
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setPreview(null), 160);
  };
  const closeNow = () => {
    clearHoverTimer();
    setPreview(null);
  };

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  useEffect(() => {
    let cancelled = false;
    loadGsap()
      .then((g) => {
        if (!cancelled) {
          gsapRef.current = g;
          setGsapReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setGsapFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreview(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        cards.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set((((center + slot - HALF) % totalCards) + totalCards) % totalCards, slot);
      }
      return map;
    },
    [totalCards, needsPagination, cards]
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
      );
    },
    [totalCards, needsPagination]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards || !gsapReady) return;
    const gsap = gsapRef.current;
    if (!gsap) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>("[data-fan-card]"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: 0.5, delay, ease: "elastic.out(1,.75)", overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, gsapReady]);

  if (!totalCards) return null;

  const activePkg = preview !== null ? packages[preview] ?? null : null;

  const chevron = (direction: "left" | "right") => (
    <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <p className="eyebrow">Featured Journeys</p>
          <h2 className={styles.title}>Hand-Picked <em>Holidays</em></h2>
        </div>

        <div className={styles.stage}>
          <div ref={containerRef} className={`${styles.fanLayout} ${gsapFailed ? styles.fallback : ""}`}>
            {cards.map((card, index) => {
              const inner = (
                <div className={styles.cardInner}>
                  <Image src={card.imgUrl} alt={card.alt} fill sizes="(max-width: 768px) 45vw, 16rem" className={styles.cardImage} />
                  <div className={styles.cardOverlay} />
                  <div className={styles.caption}>
                    <span className={styles.cardTitle}>{card.title}</span>
                    <span className={styles.cardMeta}>{card.meta}</span>
                    {card.note && <span className={styles.cardNote}>{card.note}</span>}
                  </div>
                </div>
              );
              return (
                <a
                  key={index}
                  data-fan-card
                  href={card.linkUrl}
                  className={styles.fanCard}
                  onMouseEnter={() => cardEnter(index)}
                  onMouseLeave={cardLeave}
                >
                  {inner}
                </a>
              );
            })}
          </div>
        </div>

        {needsPagination && (
          <div className={styles.controls}>
            <button className={styles.arrow} onClick={() => cycle("left")} aria-label="Previous">
              {chevron("left")}
            </button>
            <div className={styles.dots}>
              {cards.map((_, i) => (
                <span key={i} className={`${styles.dot} ${i === centerIndex ? styles.dotActive : ""}`} />
              ))}
            </div>
            <button className={styles.arrow} onClick={() => cycle("right")} aria-label="Next">
              {chevron("right")}
            </button>
          </div>
        )}
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
              onMouseEnter={panelEnter}
              onMouseLeave={panelLeave}
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
                  <span className={styles.splashPrice}>from ₹{activePkg.fromPrice.toLocaleString("en-IN")}</span>
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
