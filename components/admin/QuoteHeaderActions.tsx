"use client";

import { useTransition } from "react";
import { setQuoteStatus, reviseQuote } from "@/app/admin/(panel)/quotes/actions";
import { QUOTE_STATUSES, QUOTE_STATUS_LABELS, type QuoteStatusValue } from "@/lib/quotes";
import styles from "./QuoteHeaderActions.module.css";

export default function QuoteHeaderActions({
  quoteId,
  status,
}: {
  quoteId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={styles.wrap}>
      <select
        className={styles.status}
        value={status}
        data-status={status}
        disabled={pending}
        onChange={(e) =>
          startTransition(() => {
            void setQuoteStatus(quoteId, e.target.value);
          })
        }
        aria-label="Quote status"
      >
        {QUOTE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {QUOTE_STATUS_LABELS[s as QuoteStatusValue]}
          </option>
        ))}
      </select>

      {/* A revision copies the figures forward and supersedes this one, so the
          version the customer already saw stays on record. */}
      <button
        type="button"
        className="btn btn-outline btn--sm"
        disabled={pending}
        onClick={() => {
          if (!confirm("Create a new version? This one is kept as superseded.")) return;
          startTransition(() => {
            void reviseQuote(quoteId);
          });
        }}
      >
        {pending ? "Working…" : "New version"}
      </button>
    </div>
  );
}
