"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { creditsToRupees, JOIN_BONUS } from "@/lib/referral";
import styles from "./ClubPopup.module.css";

const DISMISS_COOKIE = "vmf_club_popup";

function hasDismissCookie() {
  return typeof document !== "undefined" && document.cookie.split("; ").some((c) => c.startsWith(`${DISMISS_COOKIE}=`));
}

function setDismissCookie() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  document.cookie = `${DISMISS_COOKIE}=1; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
}

// Homepage Travellers Club popup + floating tab (WI-10). Non-members only; the
// popup fires on the first of ~15s / 50% scroll / exit-intent, is dismissible for
// 30 days (the tab stays), and is a bottom sheet on mobile.
export default function ClubPopup() {
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/club/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (alive) setIsMember(!!d.loggedIn); })
      .catch(() => { if (alive) setIsMember(false); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (isMember !== false || hasDismissCookie()) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setShowPopup(true);
      cleanup();
    };
    const t = setTimeout(fire, 15000);
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.5) fire();
    };
    const onLeave = (e: MouseEvent) => { if (!reduce && e.clientY <= 0) fire(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    function cleanup() {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    }
    return cleanup;
  }, [isMember]);

  const dismiss = () => {
    setShowPopup(false);
    setDismissCookie();
  };

  // Render nothing for members or until membership is known.
  if (isMember !== false) return null;

  return (
    <>
      {!showPopup && (
        <button type="button" className={styles.tab} onClick={() => setShowPopup(true)}>
          Join the Club
        </button>
      )}
      {showPopup && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Join the Travellers Club">
          <div className={styles.card}>
            <button type="button" className={styles.close} onClick={dismiss} aria-label="Dismiss">×</button>
            <span className={styles.eyebrow}>Travellers Club</span>
            <h3 className={styles.title}>Travel more, together.</h3>
            <p className={styles.body}>
              Join free and start with {creditsToRupees(JOIN_BONUS)} credit. Refer friends and you both earn VMF
              travel credit toward your next trip — plus a members-only WhatsApp community.
            </p>
            <Link href="/travellers-club" className={styles.cta} onClick={dismiss}>
              Join the Club — it&apos;s free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
