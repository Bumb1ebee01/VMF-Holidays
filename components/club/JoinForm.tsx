"use client";

import Link from "next/link";
import { useActionState } from "react";
import { joinClub, type ClubFormState } from "@/app/(site)/travellers-club/actions";
import styles from "./club.module.css";

const initial: ClubFormState = {};

export default function JoinForm({ refCode = "" }: { refCode?: string }) {
  const [state, action, pending] = useActionState(joinClub, initial);

  return (
    <form action={action} className={styles.form}>
      {refCode && (
        <p className={styles.refNote}>
          A friend invited you — you&apos;ll both earn VMF travel credit when you book your first trip.
        </p>
      )}
      <input type="hidden" name="ref" defaultValue={refCode} />
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
          placeholder="+91 XXXXX XXXXX"
          required
        />
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

      {state.error && <p className={styles.error}>{state.error}</p>}

      <button type="submit" className="btn btn-primary btn--lg" disabled={pending}>
        {pending ? "Creating your account…" : "Join the Club — it's free"}
      </button>
      <p className={styles.switch}>
        Already a member? <Link href="/travellers-club/login">Log in</Link>
      </p>
    </form>
  );
}
