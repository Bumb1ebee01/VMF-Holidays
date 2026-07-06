import Link from "next/link";
import { FadeIn } from "@/components/ui/Motion";
import styles from "./TripFinderCTA.module.css";

export default function TripFinderCTA() {
  return (
    <section className={styles.section}>
      <div className="container">
        <FadeIn className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Not sure where to go?</span>
            <h2 className={styles.title}>Let&apos;s find your kind of trip</h2>
            <p className={styles.sub}>
              Answer four quick questions — your vibe, budget and who&apos;s coming — and we&apos;ll
              match you to three destinations you&apos;ll love, with a trip for each.
            </p>
          </div>
          <Link href="/tools/trip-finder" className={`btn btn-primary btn--lg ${styles.btn}`}>
            Take the quiz
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
