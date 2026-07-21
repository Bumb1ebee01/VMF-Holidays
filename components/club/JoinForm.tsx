"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { joinClub, checkReferralCode, type ClubFormState, type RefCheck } from "@/app/(site)/travellers-club/actions";
import ConsentCheckbox from "@/components/ui/ConsentCheckbox";
import styles from "./club.module.css";
import { PHONE_HINT } from "@/lib/contact";

const initial: ClubFormState = {};

export default function JoinForm({ refCode = "", refName = "" }: { refCode?: string; refName?: string }) {
  const [state, action, pending] = useActionState(joinClub, initial);
  const [showCode, setShowCode] = useState(Boolean(refCode));
  const [code, setCode] = useState(refCode);
  const [check, setCheck] = useState<RefCheck | null>(refCode && refName ? { ok: true, label: refName } : null);
  const [checking, startCheck] = useTransition();

  function validate(value: string) {
    const v = value.trim();
    if (!v) {
      setCheck(null);
      return;
    }
    startCheck(async () => {
      setCheck(await checkReferralCode(v));
    });
  }

  return (
    <form action={action} className={styles.form}>
      {refCode && (
        <p className={styles.refNote}>
          {refName ? `${refName} invited you` : "A friend invited you"} — keep their code below so they get
          credit when you travel, and you&apos;ll get ₹1,000 off your first trip.
        </p>
      )}
      {/* honeypot — hidden from real users */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="form-group">
        <label className="form-label" htmlFor="cf-name">Full name</label>
        <input id="cf-name" name="name" type="text" className="form-input" autoComplete="name" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" className="form-input" autoComplete="email" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-phone">Phone (WhatsApp)</label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          className="form-input"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          required
        />
        <p className="form-hint">{PHONE_HINT}</p>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-password">Create a password</label>
        <input
          id="cf-password"
          name="password"
          type="password"
          className="form-input"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {/* WI-15: optional referral code — collapsed by default, auto-open when prefilled. */}
      <input type="hidden" name="ref" value={code} />
      {!showCode ? (
        <button type="button" className={styles.codeToggle} onClick={() => setShowCode(true)}>
          Have a referral code?
        </button>
      ) : (
        <div className="form-group">
          <label className="form-label" htmlFor="cf-ref">Referral code (optional)</label>
          <input
            id="cf-ref"
            type="text"
            className="form-input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onBlur={(e) => validate(e.target.value)}
            placeholder="e.g. AARAV7KD"
            autoComplete="off"
          />
          {checking && <p className={styles.refCheck}>Checking…</p>}
          {!checking && check?.ok && (
            <p className={`${styles.refCheck} ${styles.refOk}`}>✓ Referred by {check.label ?? "a friend"}</p>
          )}
          {!checking && check && !check.ok && code.trim() !== "" && (
            <p className={styles.refCheck}>We couldn&apos;t find that code — you can still join.</p>
          )}
        </div>
      )}

      {state.error && <p className={styles.error}>{state.error}</p>}

      <ConsentCheckbox name="consent" context="about my membership and trips" />

      <button type="submit" className="btn btn-primary btn--lg" disabled={pending}>
        {pending ? "Creating your account…" : "Join the Club — it's free"}
      </button>
      <p className={styles.switch}>
        Already a member? <Link href="/travellers-club/login">Log in</Link>
      </p>
    </form>
  );
}
