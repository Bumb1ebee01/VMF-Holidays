"use client";

import { useState } from "react";
import PackageCard from "./PackageCard";
import type { Package } from "@/lib/types";
import styles from "./PackageGrid.module.css";

export default function PackageGrid({
  packages,
  initial = 6,
}: {
  packages: Package[];
  initial?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? packages : packages.slice(0, initial);
  const hidden = packages.length - initial;

  return (
    <>
      <div className="grid-3">
        {visible.map((pkg, i) => (
          <div
            key={pkg.slug}
            className={expanded && i >= initial ? styles.cellReveal : ""}
            style={
              expanded && i >= initial
                ? { animationDelay: `${Math.min((i - initial) * 0.05, 0.5)}s` }
                : undefined
            }
          >
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </div>

      {hidden > 0 && (
        <div className={styles.moreWrap}>
          <button
            type="button"
            className={styles.moreBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `View ${hidden} more`}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={expanded ? styles.chevUp : ""}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
