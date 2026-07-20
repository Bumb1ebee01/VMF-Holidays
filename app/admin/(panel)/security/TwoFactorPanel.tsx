"use client";

import { useState, useTransition } from "react";
import shared from "@/components/admin/shared.module.css";
import styles from "./page.module.css";
import { startTotpSetup, confirmTotpSetup, disableTotp, type TotpSetup } from "./actions";

type Props = { enabled: boolean; remainingBackupCodes: number };

export default function TwoFactorPanel({ enabled, remainingBackupCodes }: Props) {
  const [isOn, setIsOn] = useState(enabled);
  const [codesLeft, setCodesLeft] = useState(remainingBackupCodes);
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const begin = () => {
    setError("");
    startTransition(async () => {
      const result = await startTotpSetup();
      if ("error" in result) setError(result.error);
      else setSetup(result);
    });
  };

  const confirm = () => {
    setError("");
    startTransition(async () => {
      const result = await confirmTotpSetup(code);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setBackupCodes(result.backupCodes);
      setCodesLeft(result.backupCodes.length);
      setSetup(null);
      setCode("");
      setIsOn(true);
    });
  };

  const turnOff = () => {
    setError("");
    startTransition(async () => {
      const result = await disableTotp(code);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setIsOn(false);
      setCodesLeft(0);
      setCode("");
      setBackupCodes(null);
    });
  };

  // ── Backup codes are shown exactly once, right after enrolling ──────────────
  if (backupCodes) {
    return (
      <div className={shared.panel}>
        <div className={shared.panelPad}>
          <h2 className={styles.heading}>Two-factor is on — save these backup codes</h2>
          <p className={styles.lede}>
            Each code works once, and they&apos;re the only way in if you lose your phone.
            Save them somewhere safe now — <strong>this is the only time they&apos;ll be shown.</strong>
          </p>

          <ul className={styles.codeGrid}>
            {backupCodes.map((c) => (
              <li key={c} className={styles.backupCode}>{c}</li>
            ))}
          </ul>

          <div className={shared.formActions}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigator.clipboard?.writeText(backupCodes.join("\n"))}
            >
              Copy all
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setBackupCodes(null)}>
              I&apos;ve saved them
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={shared.panel}>
      <div className={shared.panelPad}>
        <div className={styles.statusRow}>
          <div>
            <h2 className={styles.heading}>Two-factor authentication</h2>
            <p className={styles.lede}>
              Asks for a 6-digit code from your phone after your password, so a stolen password
              isn&apos;t enough on its own.
            </p>
          </div>
          <span className={isOn ? styles.pillOn : styles.pillOff}>{isOn ? "On" : "Off"}</span>
        </div>

        {error && <p className={shared.error}>{error}</p>}

        {/* ── Enrolled ─────────────────────────────────────────────────────── */}
        {isOn && (
          <>
            <p className={styles.meta}>
              {codesLeft > 0
                ? `${codesLeft} unused backup ${codesLeft === 1 ? "code" : "codes"} remaining.`
                : "No backup codes left — turn 2FA off and on again to issue a fresh set."}
            </p>
            <div className={styles.divider} />
            <h3 className={styles.subheading}>Turn off two-factor</h3>
            <p className={styles.lede}>
              Enter a current code from your authenticator app (or one of your backup codes) to
              confirm it&apos;s really you.
            </p>
            <div className={styles.inlineForm}>
              <input
                className={`form-input ${styles.codeInput}`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                inputMode="text"
                autoComplete="one-time-code"
                aria-label="Authenticator or backup code"
              />
              <button
                type="button"
                className={shared.dangerBtn}
                onClick={turnOff}
                disabled={pending || !code}
              >
                {pending ? "Checking…" : "Turn off"}
              </button>
            </div>
          </>
        )}

        {/* ── Not enrolled, setup not started ──────────────────────────────── */}
        {!isOn && !setup && (
          <div className={shared.formActions}>
            <button type="button" className="btn btn-primary" onClick={begin} disabled={pending}>
              {pending ? "Preparing…" : "Set up two-factor"}
            </button>
          </div>
        )}

        {/* ── Setup in progress ────────────────────────────────────────────── */}
        {!isOn && setup && (
          <>
            <div className={styles.divider} />
            <h3 className={styles.subheading}>Step 1 — add VMF to your authenticator app</h3>
            <p className={styles.lede}>
              Use Google Authenticator, Microsoft Authenticator, or any TOTP app. Open it, choose
              &ldquo;add account&rdquo; → &ldquo;enter a setup key&rdquo;, and type this key:
            </p>
            <p className={styles.secret}>{setup.formatted}</p>
            <p className={styles.meta}>
              On your phone? <a className={styles.link} href={setup.uri}>Tap here to add it automatically.</a>
            </p>

            <h3 className={styles.subheading}>Step 2 — confirm the code</h3>
            <p className={styles.lede}>
              Enter the 6-digit code your app is showing. It changes every 30 seconds.
            </p>
            <div className={styles.inlineForm}>
              <input
                className={`form-input ${styles.codeInput}`}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label="6-digit code from your authenticator app"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirm}
                disabled={pending || code.length !== 6}
              >
                {pending ? "Verifying…" : "Verify & turn on"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSetup(null);
                  setCode("");
                  setError("");
                }}
                disabled={pending}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
