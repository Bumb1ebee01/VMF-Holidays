"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginMember, type ClubFormState } from "@/app/(site)/travellers-club/actions";
import styles from "./club.module.css";

const initial: ClubFormState = {};

export default function LoginForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const [state, action, pending] = useActionState(loginMember, initial);

  return (
    <form action={action} className={styles.form}>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-id">Email or phone</label>
        <input
          id="lf-id"
          name="identifier"
          type="text"
          className="form-input"
          autoComplete="username"
          placeholder="you@example.com or +91 XXXXX XXXXX"
          required
        />
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

      {googleEnabled && (
        <>
          <div className={styles.orDivider}>
            <span>or</span>
          </div>
          <a href="/api/auth/google" className={styles.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z" />
              <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34Z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
            </svg>
            Continue with Google
          </a>
        </>
      )}

      <p className={styles.switch}>
        New here? <Link href="/travellers-club">Join the Club</Link>
      </p>
    </form>
  );
}
