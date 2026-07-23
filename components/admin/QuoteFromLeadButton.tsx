"use client";

import { useEffect, useState, useTransition } from "react";
import {
  searchLeadsForQuote,
  startQuoteFromLead,
  type LeadPick,
} from "@/app/admin/(panel)/quotes/actions";
import styles from "./QuoteFromLeadButton.module.css";

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  WON: "Won",
  LOST: "Lost",
};

/**
 * Quote an EXISTING enquiry from the Quotes page: search leads by name, ref,
 * phone or destination and start a priced quote against the chosen one in a
 * click — no retyping the customer's details. Complements NewQuoteButton, which
 * starts a standalone/scratch quote.
 */
export default function QuoteFromLeadButton() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LeadPick[]>([]);
  const [searching, startSearch] = useTransition();
  const [starting, startCreate] = useTransition();

  // Load recent leads on open, then re-search as the query changes (debounced).
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      startSearch(async () => setResults(await searchLeadsForQuote(query)));
    }, 200);
    return () => clearTimeout(t);
  }, [open, query]);

  return (
    <div className={styles.wrap}>
      <button type="button" className="btn btn-outline btn--sm" onClick={() => setOpen((o) => !o)}>
        Quote an enquiry
      </button>
      {open && (
    <div className={styles.panel}>
      <div className={styles.head}>
        <input
          autoFocus
          type="search"
          className="form-input"
          placeholder="Search enquiries — name, VMF-ref, phone or destination…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search enquiries"
        />
        <button type="button" className="btn btn-outline btn--sm" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>

      <div className={styles.list}>
        {searching && results.length === 0 ? (
          <p className={styles.empty}>Searching…</p>
        ) : results.length === 0 ? (
          <p className={styles.empty}>No enquiries match “{query}”.</p>
        ) : (
          results.map((l) => (
            <button
              key={l.id}
              type="button"
              className={styles.item}
              disabled={starting}
              onClick={() => startCreate(() => startQuoteFromLead(l.id))}
            >
              <span className={styles.itemMain}>
                <span className={styles.itemName}>{l.name}</span>
                {l.ref && <span className={styles.itemRef}>{l.ref}</span>}
              </span>
              <span className={styles.itemSub}>
                {[l.destination || l.packageTitle, l.phone, STATUS_LABELS[l.status] ?? l.status]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </button>
          ))
        )}
      </div>
      {starting && <p className={styles.empty}>Starting quote…</p>}
    </div>
      )}
    </div>
  );
}
