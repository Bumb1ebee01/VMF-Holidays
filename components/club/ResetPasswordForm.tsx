"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword, type ResetPasswordState } from "@/app/(site)/travellers-club/actions";
import styles from "./club.module.css";

const initial: ResetPasswordState = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, initial);

  if (state.done) {
    return (
      <div>
        <p className={styles.resetNote}>Your password has been reset. You can now log in with your new password.</p>
        <Link href="/travellers-club/login" className="btn btn-primary btn--lg">Log in</Link>
      </div>
    );
  }

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="token" value={token} />
      <div className="form-group">
        <label className="form-label" htmlFor="rp-password">New password</label>
        <input
          id="rp-password"
          name="password"
          type="password"
          className="form-input"
          autoComplete="new-password"
          minLength={8}
          placeholder="At least 8 characters"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="rp-confirm">Confirm new password</label>
        <input
          id="rp-confirm"
          name="confirm"
          type="password"
          className="form-input"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {state.error && <p className={styles.error}>{state.error}</p>}

      <button type="submit" className="btn btn-primary btn--lg" disabled={pending}>
        {pending ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}
