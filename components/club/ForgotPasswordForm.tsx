"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { requestPasswordReset, type RequestResetState } from "@/app/(site)/travellers-club/actions";
import Turnstile from "@/components/ui/Turnstile";
import styles from "./club.module.css";

const initial: RequestResetState = {};

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);
  const [captcha, setCaptcha] = useState("");

  if (state.sent) {
    return (
      <div>
        <p className={styles.resetNote}>
          If an account exists for that email, we&apos;ve sent a link to reset your password. It&apos;s
          valid for 1 hour — please check your inbox (and spam folder).
        </p>
        <p className={styles.switch}>
          <Link href="/travellers-club/login">Back to log in</Link>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className={styles.form}>
      {/* Honeypot — hidden from real users. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="form-group">
        <label className="form-label" htmlFor="fp-email">Email</label>
        <input
          id="fp-email"
          name="email"
          type="email"
          className="form-input"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <input type="hidden" name="turnstileToken" value={captcha} />
      <Turnstile onVerify={setCaptcha} />

      {state.error && <p className={styles.error}>{state.error}</p>}

      <button type="submit" className="btn btn-primary btn--lg" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <p className={styles.switch}>
        Remembered it? <Link href="/travellers-club/login">Log in</Link>
      </p>
    </form>
  );
}
