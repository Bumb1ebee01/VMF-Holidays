"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { whatsappLink } from "@/lib/contact";
import styles from "./BudgetExplorer.module.css";

export interface BudgetPackage {
  slug: string;
  title: string;
  duration: string;
  fromPrice: number;
}

export interface BudgetDestination {
  slug: string;
  name: string;
  country: string;
  region: "domestic" | "international";
  fromPrice: number;
  tags: string[];
  packages: BudgetPackage[];
}

type RegionFilter = "all" | "domestic" | "international";

const MIN = 10000;
const MAX = 200000;
const STEP = 5000;
const MAX_PACKAGES_SHOWN = 3;
const DEFAULT_BUDGET = 50000;

// Accept a budget from the URL (e.g. the homepage "₹50k" chips), but never trust
// it blindly: snap to the slider's step and clamp into range, falling back to the
// default for anything missing or malformed.
function clampBudget(v: number | undefined): number {
  if (v === undefined || !Number.isFinite(v)) return DEFAULT_BUDGET;
  const snapped = Math.round(v / STEP) * STEP;
  return Math.min(MAX, Math.max(MIN, snapped));
}

function Card({ d, budget }: { d: BudgetDestination; budget: number }) {
  // Only offer packages that actually fit the chosen budget, cheapest first.
  const affordable = d.packages.filter((p) => p.fromPrice <= budget);
  const shown = affordable.slice(0, MAX_PACKAGES_SHOWN);
  const extra = affordable.length - shown.length;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.cardHead}>
          <span className={styles.name}>{d.name}</span>
          <span className={styles.price}>from {formatINR(d.fromPrice)}</span>
        </div>
        <span className={styles.tags}>{d.tags.slice(0, 3).join(" · ")}</span>
      </div>

      {shown.length > 0 && (
        <div className={styles.pkgs}>
          <span className={styles.pkgsLabel}>
            {affordable.length} {affordable.length === 1 ? "package" : "packages"} in budget
          </span>
          {shown.map((p) => (
            <Link key={p.slug} href={`/packages/${p.slug}`} className={styles.pkgRow}>
              <span className={styles.pkgInfo}>
                <span className={styles.pkgTitle}>{p.title}</span>
                <span className={styles.pkgMeta}>
                  {p.duration} · from {formatINR(p.fromPrice)}
                </span>
              </span>
              <span className={styles.pkgArrow} aria-hidden="true">→</span>
            </Link>
          ))}
          {extra > 0 && (
            <Link href={`/guides/${d.slug}`} className={styles.pkgMore}>
              +{extra} more {extra === 1 ? "package" : "packages"}
            </Link>
          )}
        </div>
      )}

      <Link href={`/guides/${d.slug}`} className={styles.guideLink}>
        {shown.length > 0 ? `${d.name} pocket guide` : `Explore ${d.name}`} →
      </Link>
    </div>
  );
}

function Group({ title, items, budget }: { title: string; items: BudgetDestination[]; budget: number }) {
  if (items.length === 0) return null;
  return (
    <div className={styles.group}>
      <h2 className={styles.groupTitle}>
        {title} <span className={styles.count}>({items.length})</span>
      </h2>
      <div className={styles.grid}>
        {items.map((d) => (
          <Card key={d.slug} d={d} budget={budget} />
        ))}
      </div>
    </div>
  );
}

const REGION_TABS: { value: RegionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "domestic", label: "In India" },
  { value: "international", label: "International" },
];

export default function BudgetExplorer({
  destinations,
  initialBudget,
}: {
  destinations: BudgetDestination[];
  initialBudget?: number;
}) {
  const [budget, setBudget] = useState(() => clampBudget(initialBudget));
  const [region, setRegion] = useState<RegionFilter>("all");

  const matches = useMemo(
    () =>
      destinations
        .filter((d) => d.fromPrice <= budget)
        .sort((a, b) => a.fromPrice - b.fromPrice),
    [destinations, budget]
  );

  const showDomestic = region !== "international";
  const showInternational = region !== "domestic";

  const domestic = matches.filter((d) => d.region === "domestic");
  const international = matches.filter((d) => d.region === "international");
  const visibleCount =
    (showDomestic ? domestic.length : 0) + (showInternational ? international.length : 0);

  const budgetLabel = budget >= MAX ? "₹2,00,000+" : formatINR(budget);
  const waHref = whatsappLink(
    `Hi VMF Holidays! My budget is around ${budgetLabel} per person — what trips can you suggest?`
  );

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

      <div className={styles.filter} role="group" aria-label="Filter destinations by region">
        {REGION_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`${styles.filterBtn} ${region === tab.value ? styles.filterBtnActive : ""}`}
            aria-pressed={region === tab.value}
            onClick={() => setRegion(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className={styles.summary}>
        {visibleCount > 0 ? (
          <>
            <strong>{visibleCount}</strong> destination{visibleCount !== 1 ? "s" : ""} within{" "}
            {budgetLabel}
          </>
        ) : (
          <>Nothing here under {budgetLabel} yet — nudge your budget up, widen the region, or ask us for a custom plan.</>
        )}
      </p>

      {showDomestic && <Group title="In India" items={domestic} budget={budget} />}
      {showInternational && <Group title="International" items={international} budget={budget} />}

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
