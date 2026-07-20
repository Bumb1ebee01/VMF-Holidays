"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.css";

export const COOKIE_CONSENT_KEY = "vmf-cookie-consent";
export const COOKIE_CONSENT_EVENT = "vmf-consent";

// Cookie-consent banner. Only shown when non-essential (analytics) cookies would
// actually load — i.e. when NEXT_PUBLIC_GA_ID is configured. Essential cookies
// (session, theme, referral) never require consent, so while analytics is off
// this renders nothing. The stored choice gates GA4 in components/analytics/Analytics.
export default function CookieConsent() {
  const gaEnabled = Boolean(process.env.NEXT_PUBLIC_GA_ID);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!gaEnabled) return;
    // Client-only: localStorage isn't available during SSR, so decide on mount.
    // Show only if the visitor hasn't already made a choice.
    const decide = () => {
      try {
        setShow(!localStorage.getItem(COOKIE_CONSENT_KEY));
      } catch {
        setShow(false);
      }
    };
    decide();
  }, [gaEnabled]);

  function choose(value: "accepted" | "declined") {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setShow(false);
  }

  if (!gaEnabled || !show) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <p className={styles.text}>
        We use essential cookies to run this site and, only with your consent, analytics cookies to improve it. See our{" "}
        <Link href="/privacy" className={styles.link}>
          Privacy &amp; Cookie Policy
        </Link>
        .
      </p>
      <div className={styles.actions}>
        <button type="button" className="btn btn-outline btn--sm" onClick={() => choose("declined")}>
          Essential only
        </button>
        <button type="button" className="btn btn-primary btn--sm" onClick={() => choose("accepted")}>
          Accept all
        </button>
      </div>
    </div>
  );
}
