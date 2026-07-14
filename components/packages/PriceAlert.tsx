"use client";

import { useState } from "react";
import styles from "./PriceAlert.module.css";

// "Notify me if the price drops" — a phone-only, no-account way to bring a warm
// visitor back when a package is discounted (capture-only; team follows up).
export default function PriceAlert({
  packageSlug,
  packageTitle,
  fromPrice,
}: {
  packageSlug: string;
  packageTitle: string;
  fromPrice: number;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/price-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, packageSlug, packageTitle, priceAtSignup: fromPrice, company }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className={styles.done}>✓ Done — we&apos;ll text you if this price drops.</p>;
  }

  if (!open) {
    return (
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        Notify me if the price drops
      </button>
    );
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <input
        className="form-input"
        type="tel"
        placeholder="Your phone number"
        autoComplete="tel"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {status === "error" && <span className={styles.err}>Couldn&apos;t save — please try again.</span>}
      <button type="submit" className="btn btn-outline btn--sm" disabled={status === "sending"}>
        {status === "sending" ? "Saving…" : "Notify me"}
      </button>
    </form>
  );
}
