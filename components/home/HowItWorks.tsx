"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, Stagger, fadeUp } from "@/components/ui/Motion";
import styles from "./HowItWorks.module.css";
import { whatsappLink } from "@/lib/contact";

const STEPS = [
  {
    number: "01",
    title: "Share Your Dream",
    desc: "Tell us where you want to go, when, and what experience you're after. WhatsApp, call, or fill our form — we make it easy.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "We Craft It",
    desc: "Our experts build a detailed itinerary — hotels, transfers, activities, transparent pricing — revised until you're delighted.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "You Explore",
    desc: "Sit back and enjoy your holiday. We handle everything end-to-end and remain one WhatsApp away the entire journey.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10,8 16,12 10,16 10,8" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <FadeIn className={styles.header}>
          <span className={styles.eyebrow}>The Process</span>
          <h2 className={styles.title}>
            Your perfect holiday<br /><em>in 3 steps.</em>
          </h2>
          <p className={styles.sub}>
            We remove the complexity of travel planning so you only feel the excitement.
          </p>
        </FadeIn>

        <Stagger className={styles.steps} stagger={0.14} delay={0.1}>
          {STEPS.map((step) => (
            <motion.div key={step.number} variants={fadeUp} className={styles.step}>
              <span className={styles.ghostNum} aria-hidden="true">{step.number}</span>
              <div className={styles.iconCircle}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </Stagger>

        <FadeIn delay={0.5} className={styles.ctaRow}>
          <a
            href={whatsappLink("Hi VMF Holidays! I'd like to start planning my trip.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.1 1.523 5.819L.035 23.453a.5.5 0 0 0 .614.612l5.757-1.505A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.833a9.83 9.83 0 0 1-5.015-1.371l-.36-.214-3.726.974.996-3.633-.234-.374A9.821 9.821 0 0 1 2.167 12c0-5.422 4.411-9.833 9.833-9.833 5.421 0 9.833 4.411 9.833 9.833 0 5.421-4.412 9.833-9.834 9.833z" />
            </svg>
            Start Planning on WhatsApp
          </a>
          <Link href="/trip-builder" className={styles.builderLink}>
            Or use our Trip Builder →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
