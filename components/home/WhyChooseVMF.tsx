"use client";

import { motion } from "framer-motion";
import { FadeIn, Stagger, fadeUp } from "@/components/ui/Motion";
import styles from "./WhyChooseVMF.module.css";

const REASONS = [
  {
    num: "01",
    title: "Transparent Pricing",
    desc: "Full cost breakdown upfront — no hidden charges, no surprises at checkout or on the trip.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Personalised Itineraries",
    desc: "Every trip is tailored to your interests, budget and travel style — not a copy-paste package.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "24/7 Support",
    desc: "Your travel expert is reachable round the clock — before, during and after your journey.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 5.69 5.69l.41-.41a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Experienced Team",
    desc: "Travel expertise, 200+ happy trips and deep destination knowledge across India and beyond.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
  },
];

export default function WhyChooseVMF() {
  return (
    <section className={styles.section}>
      <div className="container">
        <FadeIn className={styles.header}>
          <p className={styles.eyebrow}>Why Choose VMF</p>
          <h2 className={styles.title}>We Do Things Differently</h2>
          <p className={styles.sub}>
            Your holiday deserves more than a booking — it deserves an experience built around you.
          </p>
        </FadeIn>

        <Stagger className={styles.grid} stagger={0.1} delay={0.05}>
          {REASONS.map((r) => (
            <motion.div key={r.num} className={styles.card} variants={fadeUp}>
              <span className={styles.num}>{r.num}</span>
              <div className={styles.iconWrap}>{r.icon}</div>
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.cardDesc}>{r.desc}</p>
              <div className={styles.cardGlow} aria-hidden="true" />
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
