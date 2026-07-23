"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  searchLeadsForQuote,
  startQuoteFromLead,
  type LeadPick,
} from "@/app/admin/(panel)/quotes/actions";
import styles from "./QuoteSearchInput.module.css";

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  WON: "Won",
  LOST: "Lost",
};

/**
 * The Quotes-page search bar, doubling as a live enquiry finder. Typing still
 * filters the quotes table on submit (name="q", Enter / Filter), but as you type
 * a dropdown surfaces matching LEADS so you can start a quote against one in a
 * click — useful when you land here first. Focusing the empty box shows recent
 * enquiries.
 */
export default function QuoteSearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<LeadPick[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, startSearch] = useTransition();
  const [starting, startCreate] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Debounced lead search as the user types (empty query returns recent leads).
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      startSearch(async () => setResults(await searchLeadsForQuote(query)));
    }, 200);
    return () => clearTimeout(t);
  }, [query, open]);

  // Close the dropdown on an outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <input
        type="search"
        name="q"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Search a quote, or an enquiry to quote…"
        className="form-input"
        aria-label="Search quotes, or find an enquiry to quote"
      />
      {open && (
        <div className={styles.dropdown}>
          <p className={styles.head}>Start a quote for an enquiry</p>
          {searching && results.length === 0 ? (
            <p className={styles.empty}>Searching…</p>
          ) : results.length === 0 ? (
            <p className={styles.empty}>No enquiries match “{query}”.</p>
          ) : (
            <div className={styles.list}>
              {results.map((l) => (
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
              ))}
            </div>
          )}
          <p className={styles.hint}>
            {starting ? "Starting quote…" : "Press Enter to filter the quotes table by this text instead."}
          </p>
        </div>
      )}
    </div>
  );
}
