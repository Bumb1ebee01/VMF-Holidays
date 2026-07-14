"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import styles from "./BudgetExplorer.module.css";

export interface BudgetDestination {
  slug: string;
  name: string;
  country: string;
  region: "domestic" | "international";
  fromPrice: number;
  tags: string[];
}

const MIN = 10000;
const MAX = 200000;
const STEP = 5000;
const WA_NUMBER = "917499322412";

function Group({ title, items }: { title: string; items: BudgetDestination[] }) {
  if (items.length === 0) return null;
  return (
    <div className={styles.group}>
      <h2 className={styles.groupTitle}>
        {title} <span className={styles.count}>({items.length})</span>
      </h2>
      <div className={styles.grid}>
        {items.map((d) => (
          <Link key={d.slug} href={`/guides/${d.slug}`} className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.name}>{d.name}</span>
              <span className={styles.price}>from {formatINR(d.fromPrice)}</span>
            </div>
            <span className={styles.tags}>{d.tags.slice(0, 3).join(" · ")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BudgetExplorer({ destinations }: { destinations: BudgetDestination[] }) {
  const [budget, setBudget] = useState(50000);

  const matches = useMemo(
    () =>
      destinations
        .filter((d) => d.fromPrice <= budget)
        .sort((a, b) => a.fromPrice - b.fromPrice),
    [destinations, budget]
  );

  const domestic = matches.filter((d) => d.region === "domestic");
  const international = matches.filter((d) => d.region === "international");

  const budgetLabel = budget >= MAX ? "₹2,00,000+" : formatINR(budget);
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi VMF Holidays! My budget is around ${budgetLabel} per person — what trips can you suggest?`
  )}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.control}>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Your budget, per person</span>
          <span className={styles.budgetValue}>{budgetLabel}</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={MIN}
          max={MAX}
          step={STEP}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          aria-label="Budget per person"
        />
        <div className={styles.scale}>
          <span>₹10k</span>
          <span>₹2L+</span>
        </div>
      </div>

      <p className={styles.summary}>
        {matches.length > 0 ? (
          <>
            <strong>{matches.length}</strong> destination{matches.length !== 1 ? "s" : ""} within{" "}
            {budgetLabel}
          </>
        ) : (
          <>Nothing starts under {budgetLabel} yet — nudge your budget up, or ask us for a custom plan.</>
        )}
      </p>

      <Group title="In India" items={domestic} />
      <Group title="International" items={international} />

      <div className={styles.cta}>
        <p className={styles.ctaText}>Prices are starting points and fully customisable to your dates and style.</p>
        <div className={styles.ctaActions}>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn--lg">
            Get ideas on WhatsApp
          </a>
          <Link href="/trip-builder" className="btn btn-outline btn--lg">Build a custom trip</Link>
        </div>
      </div>
    </div>
  );
}
