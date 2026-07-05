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
      /* clipboard unavailable — the link is still visible to copy manually */
    }
  };

  const waText = `Plan your next trip with VMF Holidays — join the Travellers Club via my link and we both earn travel credit: ${link}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  return (
    <div className={styles.linkbox}>
      <code className={styles.linkText}>{link}</code>
      <div className={styles.linkActions}>
        <button type="button" className={styles.copyBtn} onClick={copy}>
          {copied ? "Copied!" : "Copy"}
        </button>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
