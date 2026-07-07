"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Stats.module.css";

const STATS = [
  { target: 25, suffix: "+", label: "Destinations" },
  { target: 100, suffix: "%", label: "Transparent Pricing" },
];

function StatItem({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const [value, setValue] = useState(0);

  // Count up on a timer (not requestAnimationFrame — rAF is paused in background/
  // hidden tabs, which left the number stuck at 0). Eased, finishes on the target.
  useEffect(() => {
    if (!active) return;
    const steps = 45;
    const stepMs = 1600 / steps;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      const p = Math.min(i / steps, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * stat.target));
      if (p >= 1) clearInterval(id);
    }, stepMs);
    return () => clearInterval(id);
  }, [active, stat.target]);

  return (
    <div className={styles.item}>
      <div className={styles.numWrap}>
        <span className={styles.number}>
          {value}<span>{stat.suffix}</span>
        </span>
      </div>
      <div className={styles.divider} />
      <p className={styles.label}>{stat.label}</p>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Start the count-up when the stats scroll into view. Uses a scroll + rect check
  // (reliable under the site's Lenis smooth-scroll, where IntersectionObserver was
  // not firing and left the numbers stuck at "0+") plus a safety timer so the count
  // is never left at 0 even if no scroll event reaches us.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let fired = false;
    const activate = () => {
      if (fired) return;
      fired = true;
      setActive(true);
      cleanup();
    };
    const maybeActivate = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) activate();
    };
    function cleanup() {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("scroll", maybeActivate);
    }
    const raf = requestAnimationFrame(maybeActivate); // already in view on load?
    window.addEventListener("scroll", maybeActivate, { passive: true });
    const timer = setTimeout(activate, 1800);
    return cleanup;
  }, []);

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
