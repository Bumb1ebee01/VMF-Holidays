"use client";

import { useState, useActionState } from "react";
import { createQuote, type QuoteState } from "@/app/admin/(panel)/quotes/actions";
import shared from "./shared.module.css";
import styles from "./NewQuoteButton.module.css";

const initial: QuoteState = {};

/**
 * Starts a standalone quote. A quote normally hangs off an enquiry — that's the
 * "Quote this" button on a lead — but a scratch quote with just a name is useful
 * for pricing something up quickly on a call.
 */
export default function NewQuoteButton({ leadId }: { leadId?: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createQuote, initial);

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
        <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
          {pending ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          className="btn btn-outline btn--sm"
          onClick={() => setOpen(false)}
          disabled={pending}
        >
          Cancel
        </button>
      </div>
      {state.error && <p className={shared.error}>{state.error}</p>}
      <p className={styles.hint}>
        Leave the option blank for a single quote. Name it when you&apos;re sending
        the customer a choice.
      </p>
    </form>
  );
}
