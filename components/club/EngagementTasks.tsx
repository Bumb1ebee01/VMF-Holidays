"use client";

import { useTransition, useState } from "react";
import { claimEngagementAction } from "@/app/(site)/travellers-club/actions";
import { ENGAGEMENT_TASKS, creditsToRupees } from "@/lib/referral";
import styles from "./club.module.css";

export default function EngagementTasks({ claimed }: { claimed: Record<string, string> }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [done, setDone] = useState<Record<string, string>>(claimed);

  const claim = (key: string) =>
    start(async () => {
      const r = await claimEngagementAction(key);
      if (r.error) {
        setMsg({ ok: false, text: r.error });
      } else {
        setMsg({ ok: true, text: r.success ?? "Done." });
        setDone((d) => ({ ...d, [key]: r.status ?? "PENDING" }));
      }
    });

  const label = (s: string) => (s === "APPROVED" ? "Earned" : s === "PENDING" ? "In review" : "Claimed");

  return (
    <div className={styles.taskList}>
      {ENGAGEMENT_TASKS.map((t) => {
        const status = done[t.key];
        return (
          <div key={t.key} className={styles.task}>
            <div className={styles.taskInfo}>
              <strong>{t.label}</strong>
              <span>
                +{creditsToRupees(t.credit)}
                {t.verify === "manual" ? " · needs review" : ""}
              </span>
            </div>
            {status ? (
              <span className={styles.taskDone}>{label(status)}</span>
            ) : (
              <button
                type="button"
                className="btn btn-outline btn--sm"
                disabled={pending}
                onClick={() => claim(t.key)}
              >
                Claim
              </button>
            )}
          </div>
        );
      })}
      {msg && (
        <p className={msg.ok ? styles.refOk : styles.error} style={{ marginTop: 10 }}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
