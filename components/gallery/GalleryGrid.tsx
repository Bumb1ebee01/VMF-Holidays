"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import type { GalleryPhoto } from "@/lib/types";
import styles from "./GalleryGrid.module.css";

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: number) =>
      setActive((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  const current = active === null ? null : photos[active];

  return (
    <>
      <div className={styles.grid}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={styles.item}
            onClick={() => setActive(i)}
            aria-label={p.caption || p.location || "Open photo"}
          >
            <Image
              src={p.image}
              alt={p.caption || p.location || "VMF Holidays trip photo"}
              width={500}
              height={500}
              sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={styles.img}
            />
            {(p.caption || p.location) && (
              <span className={styles.overlay}>{p.caption || p.location}</span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" onClick={close}>
          <button className={styles.close} onClick={close} aria-label="Close">✕</button>
          <button
            className={`${styles.navBtn} ${styles.prev}`}
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous photo"
          >‹</button>
          <figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.image}
              alt={current.caption || current.location || "VMF Holidays trip photo"}
              width={1400}
              height={1000}
              sizes="90vw"
              className={styles.full}
            />
            {(current.caption || current.location) && (
              <figcaption className={styles.caption}>
                {current.caption}
                {current.caption && current.location ? " · " : ""}
                {current.location && <span className={styles.loc}>{current.location}</span>}
              </figcaption>
            )}
          </figure>
          <button
            className={`${styles.navBtn} ${styles.next}`}
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next photo"
          >›</button>
        </div>
      )}
    </>
  );
}
