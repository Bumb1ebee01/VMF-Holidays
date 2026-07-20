"use client";

import Image from "next/image";
import { useActionState } from "react";
import { verifyTwoFactor, cancelTwoFactor, type VerifyState } from "./actions";
import styles from "../page.module.css";

const initialState: VerifyState = {};

export default function VerifyForm() {
  const [state, formAction, pending] = useActionState(verifyTwoFactor, initialState);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image
            src="/logo-blue.png"
            alt="VMF Holidays"
            width={160}
            height={67}
            className={`${styles.logoImg} ${styles.logoBlue}`}
            priority
          />
          <Image
            src="/logo-white.png"
            alt="VMF Holidays"
            width={160}
            height={66}
            className={`${styles.logoImg} ${styles.logoWhite}`}
          />
        </div>
        <p className={styles.kicker}>Team Console</p>
        <h1 className={styles.title}>Enter your code</h1>

        <form action={formAction} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="code">
              6-digit code from your authenticator app
            </label>
            <input
              id="code"
              name="code"
              type="text"
              className={`form-input ${styles.input} ${styles.codeInput}`}
              inputMode="text"
              autoComplete="one-time-code"
              autoFocus
              required
            />
          </div>

          {state.error && <p className={styles.error}>{state.error}</p>}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Verifying…" : "Verify"}
          </button>
        </form>

        <form action={cancelTwoFactor} className={styles.cancelRow}>
          <button type="submit" className={styles.linkBtn}>
            Cancel and sign in as someone else
          </button>
        </form>

        <p className={styles.note}>
          Lost your phone? Enter one of your backup codes instead.
        </p>
      </div>
    </div>
  );
}
