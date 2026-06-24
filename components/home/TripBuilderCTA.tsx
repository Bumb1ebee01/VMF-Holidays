"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn, Stagger, fadeUp } from "@/components/ui/Motion";
import styles from "./TripBuilderCTA.module.css";

const STEPS = [
  { n: "1", label: "Countries" },
  { n: "2", label: "Cities" },
  { n: "3", label: "Experiences" },
  { n: "4", label: "Dates" },
  { n: "5", label: "Preferences" },
];

export default function TripBuilderCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Link href="/trip-builder" className={styles.card} aria-label="Open the Trip Builder">
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.inner}>
            <FadeIn className={styles.copy}>
              <span className={styles.eyebrow}>Plan It Yourself</span>
              <h2 className={styles.title}>
                Build your dream trip,<br /><em>your way.</em>
              </h2>
              <p className={styles.sub}>
                Pick your countries, cities and experiences, set your dates and
                preferences, and we&apos;ll turn it into a personalised itinerary —
                all in a few clicks.
              </p>
              <span className={styles.btn}>
                Start Building
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </FadeIn>

            <Stagger className={styles.steps} stagger={0.1} delay={0.15}>
              {STEPS.map((s) => (
                <motion.div key={s.n} variants={fadeUp} className={styles.step}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <span className={styles.stepLabel}>{s.label}</span>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </Link>
      </div>
    </section>
  );
}
