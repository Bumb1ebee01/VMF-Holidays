"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/lib/types";
import styles from "./ItineraryAccordion.module.css";

export default function ItineraryAccordion({ itinerary }: { itinerary: ItineraryDay[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={styles.accordion}>
      {itinerary.map((day, i) => {
        const isOpen = open === i;
        return (
          <div key={day.day} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
            <button
              className={styles.trigger}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <div className={styles.triggerLeft}>
                <span className={styles.dayBadge}>Day {day.day}</span>
                <span className={styles.dayTitle}>{day.title}</span>
              </div>
              <svg
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={styles.panel} style={{ maxHeight: isOpen ? "400px" : "0px" }}>
              <p className={styles.desc}>{day.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
