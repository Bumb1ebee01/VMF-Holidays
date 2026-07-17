"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DownloadItineraryButton.module.css";

// Tiered itinerary-PDF download (ROADMAP item). Shown to everyone; the gate
// differs by who's clicking:
//   • Logged-in Travellers Club member → one click, no form (server personalises
//     + trace-stamps the PDF).
//   • Logged-out → a small modal asks name + email, captured as a lead, then the
//     sample (watermarked) PDF downloads.
export default function DownloadItineraryButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) nameRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  async function download(payload: { name?: string; email?: string }): Promise<boolean> {
    const res = await fetch(`/api/itinerary/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error ?? "Something went wrong. Please try again.");
      return false;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vmf-${slug}-itinerary.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  }

  // First click: if a member is logged in, download immediately; else open the form.
  async function onClick() {
    setError(null);
    setBusy(true);
    try {
      const me = await fetch("/api/club/me", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => ({ loggedIn: false }));
      if (me.loggedIn) {
        await download({});
      } else {
        setOpen(true);
      }
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const ok = await download({ name: name.trim(), email: email.trim() });
      if (ok) setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className={`btn btn-ghost-white btn--sm ${styles.trigger}`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {busy && !open ? "Preparing…" : "Download itinerary (PDF)"}
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => !busy && setOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dl-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="dl-title" className={styles.title}>Download your sample itinerary</h3>
            <p className={styles.sub}>
              We&apos;ll email you a copy and our travel experts can tailor it to your dates and budget.
            </p>
            <form onSubmit={onSubmit} className={styles.form}>
              <label className={styles.label}>
                Name
                <input
                  ref={nameRef}
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
              <label className={styles.label}>
                Email
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.actions}>
                <button type="button" className="btn btn-outline btn--sm" onClick={() => setOpen(false)} disabled={busy}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn--sm" disabled={busy}>
                  {busy ? "Preparing…" : "Download PDF"}
                </button>
              </div>
            </form>
            <p className={styles.fine}>Sample itinerary — not a confirmed quote.</p>
          </div>
        </div>
      )}
    </>
  );
}
