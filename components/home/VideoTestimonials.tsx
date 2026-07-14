"use client";

import { useState } from "react";
import { VIDEO_TESTIMONIALS } from "@/lib/data/videoTestimonials";
import styles from "./VideoTestimonials.module.css";

// Lazy YouTube facade: shows the thumbnail until clicked, then swaps in the embed —
// so the page stays fast and no YouTube script loads unless a visitor plays a video.
export default function VideoTestimonials() {
  const [playing, setPlaying] = useState<string | null>(null);

  // Hidden until real videos are added to lib/data/videoTestimonials.ts.
  if (VIDEO_TESTIMONIALS.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Real travellers</span>
          <h2 className={styles.title}>Traveller stories</h2>
          <p className={styles.sub}>Hear it straight from the people who&apos;ve travelled with us.</p>
        </div>
        <div className={styles.grid}>
          {VIDEO_TESTIMONIALS.map((v) => (
            <figure key={v.id} className={styles.card}>
              {playing === v.id ? (
                <iframe
                  className={styles.media}
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                  title={`${v.name} — ${v.trip}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className={styles.thumb}
                  style={{ backgroundImage: `url(https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg)` }}
                  onClick={() => setPlaying(v.id)}
                  aria-label={`Play ${v.name}'s story`}
                >
                  <span className={styles.play} aria-hidden="true">▶</span>
                </button>
              )}
              <figcaption className={styles.meta}>
                <span className={styles.name}>{v.name}</span>
                <span className={styles.trip}>{v.trip}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
