"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Stats.module.css";

const STATS = [
  { target: 200, suffix: "+", label: "Happy Travellers" },
  { target: 50,  suffix: "+", label: "Destinations" },
];

function StatItem({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const dur = 2200;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * stat.target));
      if (p < 1) requestAnimationFrame(tick);
      else setValue(stat.target);
    };
    requestAnimationFrame(tick);
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
