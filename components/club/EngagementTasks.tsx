"use client";

import { useTransition, useState } from "react";
import { claimEngagementAction } from "@/app/(site)/travellers-club/actions";
import { ENGAGEMENT_TASKS, creditsToRupees } from "@/lib/referral";
import styles from "./club.module.css";

type ClaimInfo = { status: string; note: string | null };

export default function EngagementTasks({ claimed }: { claimed: Record<string, ClaimInfo> }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [done, setDone] = useState<Record<string, ClaimInfo>>(claimed);

  const claim = (key: string, url?: string) => {
    // Tasks that live on another platform (e.g. Instagram) open there so the member
    // can actually do them; the claim itself queues for admin review either way.
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    start(async () => {
      const r = await claimEngagementAction(key);
      if (r.error) {
        setMsg({ ok: false, text: r.error });
      } else {
        setMsg({ ok: true, text: r.success ?? "Done." });
        setDone((d) => ({ ...d, [key]: { status: r.status ?? "PENDING", note: null } }));
      }
    });
  };

  const label = (s: string) =>
    s === "APPROVED" ? "Earned" : s === "PENDING" ? "In review" : s === "REJECTED" ? "Not approved" : "Claimed";

  return (
    <div className={styles.taskList}>
      {ENGAGEMENT_TASKS.map((t) => {
        const info = done[t.key];
        const status = info?.status;
        return (
          <div key={t.key} className={styles.task}>
            <div className={styles.taskInfo}>
              <strong>{t.label}</strong>
              <span>
                +{creditsToRupees(t.credit)}
                {t.verify === "manual" ? " · needs review" : ""}
              </span>
              {status === "REJECTED" && (
                <span className={styles.taskNote}>
                  {info?.note ? `Not approved: ${info.note}` : "Not approved by our team."}
                </span>
              )}
            </div>
            {status ? (
              <span className={status === "REJECTED" ? styles.taskFailed : styles.taskDone}>
                {label(status)}
              </span>
            ) : (
              <button
                type="button"
                className="btn btn-outline btn--sm"
                disabled={pending}
                onClick={() => claim(t.key, t.url)}
              >
                {t.url ? "Do it" : "Claim"}
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
