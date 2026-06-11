"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import styles from "./page.module.css";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoVmf}>VMF</span>
          <span className={styles.logoHols}>Holidays</span>
        </div>
        <p className={styles.kicker}>Team Console</p>
        <h1 className={styles.title}>Sign in</h1>

        <form action={formAction} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${styles.input}`}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input ${styles.input}`}
              autoComplete="current-password"
              required
            />
          </div>

          {state.error && <p className={styles.error}>{state.error}</p>}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className={styles.note}>Access is for VMF Holidays staff only.</p>
      </div>
    </div>
  );
}
