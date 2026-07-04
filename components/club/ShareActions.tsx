"use client";

import { useState, useSyncExternalStore } from "react";
import styles from "./club.module.css";

const NOOP_SUBSCRIBE = () => () => {};
// Web Share API support, read without a hydration gap: false on the server and
// first client render, then true after hydration where navigator.share exists.
function useCanNativeShare(): boolean {
  return useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );
}

// Reusable share primitive for the Travellers Club. One implementation powers the
// dashboard referral link, the "share this trip" button, and per-referral re-share
// nudges. Community and refer-&-earn led — no discount-% or FOMO language (brand rule).
type Props = {
  /** The URL being shared (already carrying ?ref= where relevant). */
  link: string;
  /** Native-share body + base of every channel message. Should NOT include the link. */
  message: string;
  /** Override the WhatsApp/email body (defaults to `${message} ${link}`). */
  shareText?: string;
  /** Show the read-only, selectable link field (full variant only). */
  showLink?: boolean;
  /** "full" = copy + share + WhatsApp + email; "compact" = one share button. */
  variant?: "full" | "compact";
  /** Label for the single compact button. */
  compactLabel?: string;
  /** Class for the compact button (lets callers match dark/light surfaces). */
  compactClassName?: string;
  /** aria-label for the link input. */
  linkLabel?: string;
};

export default function ShareActions({
  link,
  message,
  shareText,
  showLink = false,
  variant = "full",
  compactLabel = "Share",
  compactClassName = "btn btn-outline btn--sm",
  linkLabel = "Your referral link",
}: Props) {
  const [copied, setCopied] = useState(false);
  const canNative = useCanNativeShare();

  const body = shareText ?? `${message} ${link}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(body)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent("Travel with VMF Holidays")}&body=${encodeURIComponent(body)}`;

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "VMF Holidays", text: message, url: link });
    } catch {
      /* user cancelled or unsupported — no-op */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the field is selectable as a fallback */
    }
  };

  // Compact: one tap → the native sheet where available, else straight to WhatsApp.
  if (variant === "compact") {
    return canNative ? (
      <button type="button" className={compactClassName} onClick={nativeShare}>
        {compactLabel}
      </button>
    ) : (
      <a href={waHref} target="_blank" rel="noopener noreferrer" className={compactClassName}>
        {compactLabel}
      </a>
    );
  }

  return (
    <div className={styles.shareRow}>
      {showLink && (
        <input
          readOnly
          value={link}
          className={`form-input ${styles.shareInput}`}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={linkLabel}
        />
      )}
      <button type="button" className="btn btn-navy" onClick={copy}>
        {copied ? "Copied!" : "Copy"}
      </button>
      {canNative && (
        <button type="button" className="btn btn-primary" onClick={nativeShare}>
          Share
        </button>
      )}
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        WhatsApp
      </a>
      <a href={mailHref} className="btn btn-outline">
        Email
      </a>
    </div>
  );
}
