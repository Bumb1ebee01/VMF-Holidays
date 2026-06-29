"use client";

import { useState } from "react";
import styles from "./club.module.css";

export default function ReferralShare({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the field is selectable as a fallback */
    }
  };

  const waText = `Plan your next trip with VMF Holidays — join the Travellers Club via my link and we both earn travel credit: ${link}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  return (
    <div className={styles.shareRow}>
      <input
        readOnly
        value={link}
        className={`form-input ${styles.shareInput}`}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Your referral link"
      />
      <button type="button" className="btn btn-navy" onClick={copy}>
        {copied ? "Copied!" : "Copy"}
      </button>
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        Share on WhatsApp
      </a>
    </div>
  );
}
