"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginMember, type ClubFormState } from "@/app/(site)/travellers-club/actions";
import styles from "./club.module.css";

const initial: ClubFormState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginMember, initial);

  return (
    <form action={action} className={styles.form}>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-email">Email</label>
        <input id="lf-email" name="email" type="email" className="form-input" autoComplete="email" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-password">Password</label>
        <input
          id="lf-password"
          name="password"
          type="password"
          className="form-input"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <button type="submit" className="btn btn-primary btn--lg" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </button>
      <p className={styles.switch}>
        <Link href="/travellers-club/forgot-password">Forgot password?</Link>
      </p>
      <p className={styles.switch}>
        New here? <Link href="/travellers-club">Join the Club</Link>
      </p>
    </form>
  );
}
