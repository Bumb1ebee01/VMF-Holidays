"use client";

import { useEffect, useState } from "react";
import ShareActions from "@/components/club/ShareActions";
import styles from "./ShareTripButton.module.css";

// "Share this trip" on a package page. For a logged-in member it bakes their
// referral code into the current page URL, so a friend who books & travels earns
// them credit (proxy.ts captures ?ref= on any page). For everyone else it still
// shares the plain trip link. Refer-&-earn led — no discount/FOMO copy (brand rule).
export default function ShareTripButton({ title }: { title: string }) {
  const [ready, setReady] = useState(false);
  const [link, setLink] = useState("");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const base = window.location.origin + window.location.pathname;
    let alive = true;
    fetch("/api/club/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        const code = d.loggedIn ? d.referralCode : null;
        setIsMember(!!code);
        setLink(code ? `${base}?ref=${encodeURIComponent(code)}` : base);
        setReady(true);
      })
      .catch(() => {
        if (!alive) return;
        setLink(base);
        setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!ready) return null;

  const message = isMember
    ? `Have a look at this trip with VMF Holidays — book through my link and we both earn travel credit: ${title} —`
    : `Have a look at this trip with VMF Holidays: ${title} —`;

  return (
    <div className={styles.wrap}>
      <ShareActions
        link={link}
        message={message}
        variant="compact"
        compactLabel="Share this trip"
        compactClassName="btn btn-ghost-white btn--sm"
      />
      {isMember && <span className={styles.hint}>You both earn VMF credit when they book &amp; travel.</span>}
    </div>
  );
}
