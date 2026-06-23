"use client";

import * as React from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import styles from "./MultiMonthCalendar.module.css";

export type { DateRange };

const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleString("en-US", { month: "long" })
);

interface ChevronProps {
  orientation?: "up" | "down" | "left" | "right";
}

function Chevron({ orientation }: ChevronProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {orientation === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

interface Props {
  numberOfMonths?: number;
  mode?: "single" | "range";
  selected?: Date | DateRange | undefined;
  onSelect?: (value: Date | DateRange | undefined) => void;
  disabledBefore?: Date;
  showOutsideDays?: boolean;
}

export function MultiMonthCalendar({
  numberOfMonths = 2,
  mode = "single",
  selected,
  onSelect,
  disabledBefore,
  showOutsideDays = true,
}: Props) {
  const today = React.useMemo(() => new Date(), []);

  const initial = React.useMemo<Date>(() => {
    if (selected instanceof Date) return selected;
    if (selected && "from" in selected && selected.from) return selected.from;
    return today;
  }, [selected, today]);

  const [month, setMonth] = React.useState<Date>(initial);
  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const years = Array.from({ length: 6 }, (_, i) => today.getFullYear() + i);

  const disabled = disabledBefore ? { before: disabledBefore } : undefined;

  const shared = {
    numberOfMonths,
    month,
    onMonthChange: setMonth,
    showOutsideDays,
    disabled,
    components: { Chevron },
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.selects}>
        <label className={styles.selectWrap}>
          <select
            className={styles.select}
            value={monthIdx}
            onChange={(e) => setMonth(new Date(year, Number(e.target.value), 1))}
            aria-label="Month"
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </label>
        <label className={styles.selectWrap}>
          <select
            className={styles.select}
            value={year}
            onChange={(e) => setMonth(new Date(Number(e.target.value), monthIdx, 1))}
            aria-label="Year"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>

      {mode === "range" ? (
        <DayPicker
          mode="range"
          selected={selected as DateRange | undefined}
          onSelect={onSelect as (r: DateRange | undefined) => void}
          {...shared}
        />
      ) : (
        <DayPicker
          mode="single"
          selected={selected as Date | undefined}
          onSelect={onSelect as (d: Date | undefined) => void}
          {...shared}
        />
      )}
    </div>
  );
}
