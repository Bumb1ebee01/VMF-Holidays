"use client";

import { useState, useActionState } from "react";
import { saveTravelStyles, type StylesState } from "@/app/(site)/travellers-club/actions";
import { TRAVEL_STYLES } from "@/lib/referral";
import styles from "./club.module.css";

const initial: StylesState = {};

export default function TravelStylesPicker({ current }: { current: string[] }) {
  const [state, action, pending] = useActionState(saveTravelStyles, initial);
  const [selected, setSelected] = useState<string[]>(current);

  const toggle = (key: string) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : prev.length < 3 ? [...prev, key] : prev
    );

  return (
    <form action={action}>
      <input type="hidden" name="styles" value={selected.join(",")} />
      <div className={styles.styleChips}>
        {TRAVEL_STYLES.map((s) => {
          const on = selected.includes(s.key);
          return (
            <button
              type="button"
              key={s.key}
              className={`${styles.styleChip} ${on ? styles.styleChipOn : ""}`}
              onClick={() => toggle(s.key)}
              aria-pressed={on}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {state.error && <p className={styles.error}>{state.error}</p>}
      {state.success && <p className={styles.refOk}>{state.success}</p>}
      <button type="submit" className="btn btn-primary btn--sm" disabled={pending} style={{ marginTop: 12 }}>
        {pending ? "Saving…" : "Save styles"}
      </button>
    </form>
  );
}
