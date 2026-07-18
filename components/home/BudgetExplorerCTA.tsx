import Link from "next/link";
import { FadeIn } from "@/components/ui/Motion";
import styles from "./BudgetExplorerCTA.module.css";

const AMOUNTS = [
  { label: "₹25k", value: 25000 },
  { label: "₹50k", value: 50000 },
  { label: "₹1L", value: 100000 },
  { label: "₹2L+", value: 200000 },
];

export default function BudgetExplorerCTA() {
  return (
    <section className={styles.section}>
      <div className="container">
        <FadeIn className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Budget-first</span>
            <h2 className={styles.title}>Tell us your budget, see where you can go</h2>
            <p className={styles.sub}>
              Slide to what you want to spend per person and instantly see every destination and
              package that fits — from a weekend in Goa to an overwater villa in the Maldives. No
              sign-up, no guesswork.
            </p>
            <div className={styles.chips}>
              {AMOUNTS.map((a) => (
                <Link
                  key={a.value}
                  href={`/tools/budget-explorer?budget=${a.value}`}
                  className={styles.chip}
                  aria-label={`See trips within ${a.label} per person`}
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/tools/budget-explorer" className={`btn btn-primary btn--lg ${styles.btn}`}>
            Explore by budget
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
