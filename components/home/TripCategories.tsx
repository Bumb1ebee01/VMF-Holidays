"use client";

import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { FadeIn, LineReveal } from "@/components/ui/Motion";
import styles from "./TripCategories.module.css";

export default function TripCategories() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Travel Your Way</span>
          <LineReveal
            as="h2"
            className={styles.title}
            lines={["Built for", "every journey"]}
            stagger={0.12}
          />
        </div>

        <ul className={styles.list}>
          {categories.map((cat, i) => (
            <li key={cat.slug}>
              <FadeIn delay={i * 0.09} y={26}>
                <Link href={`/${cat.slug}`} className={styles.row}>
                  <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.body}>
                    <span className={styles.name}>{cat.label}</span>
                    <span className={styles.desc}>{cat.blurb}</span>
                  </span>
                  <span className={styles.arrow}>
                    <svg className={styles.arrowIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
