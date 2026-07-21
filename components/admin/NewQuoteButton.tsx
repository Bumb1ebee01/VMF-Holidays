"use client";

import { useState, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createQuote,
  duplicateQuote,
  type QuoteState,
} from "@/app/admin/(panel)/quotes/actions";
import shared from "./shared.module.css";
import styles from "./NewQuoteButton.module.css";

const initial: QuoteState = {};

/** Recent quotes offered as a starting point — most trips resemble a previous one. */
export interface CopySource {
  id: string;
  label: string;
}

/**
 * Starts a standalone quote. A quote normally hangs off an enquiry — that's the
 * "Quote this" button on a lead — but a scratch quote with just a name is useful
 * for pricing something up quickly on a call.
 */
export default function NewQuoteButton({
  leadId,
  copySources = [],
}: {
  leadId?: string;
  copySources?: CopySource[];
}) {
  const [open, setOpen] = useState(false);
  const [copyFrom, setCopyFrom] = useState("");
  const [state, action, pending] = useActionState(createQuote, initial);
  const [copying, startCopy] = useTransition();
  const router = useRouter();

  if (!open) {
    return (
      <button type="button" className="btn btn-primary btn--sm" onClick={() => setOpen(true)}>
        {leadId ? "Quote this enquiry" : "New quote"}
      </button>
    );
  }

  return (
    <form action={action} className={styles.form}>
      {leadId && <input type="hidden" name="leadId" value={leadId} />}
      <div className={styles.row}>
        {!leadId && (
          <input
            name="customerName"
            className="form-input"
            placeholder="Customer name (optional)"
            maxLength={120}
            aria-label="Customer name"
          />
        )}
        <input
          name="optionLabel"
          className="form-input"
          placeholder="Option label, e.g. 4-star (optional)"
          maxLength={60}
          aria-label="Option label"
        />
        <button type="submit" className="btn btn-primary btn--sm" disabled={pending || copying}>
          {pending ? "Creating…" : "Create blank"}
        </button>
        <button
          type="button"
          className="btn btn-outline btn--sm"
          onClick={() => setOpen(false)}
          disabled={pending || copying}
        >
          Cancel
        </button>
      </div>

      {/* Copying a previous quote is the real time-saver — most trips resemble
          one already priced, and rebuilding cost lines by hand is the slow part. */}
      {copySources.length > 0 && (
        <div className={styles.row} style={{ marginTop: "0.6rem" }}>
          <select
            className="form-input"
            value={copyFrom}
            onChange={(e) => setCopyFrom(e.target.value)}
            aria-label="Copy costs from an earlier quote"
            disabled={copying}
          >
            <option value="">Or start from an earlier quote…</option>
            {copySources.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-outline btn--sm"
            disabled={!copyFrom || copying}
            onClick={() =>
              startCopy(async () => {
                const id = await duplicateQuote(copyFrom, leadId);
                if (id) router.push(`/admin/quotes/${id}`);
              })
            }
          >
            {copying ? "Copying…" : "Copy costs"}
          </button>
        </div>
      )}

      {state.error && <p className={shared.error}>{state.error}</p>}
      <p className={styles.hint}>
        Leave the option blank for a single quote. Name it when you&apos;re sending
        the customer a choice. Copying brings the cost lines and markup across —
        never an agreed price.
      </p>
    </form>
  );
}
