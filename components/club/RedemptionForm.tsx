"use client";

import { useActionState, useState } from "react";
import { requestRedemptionAction, type RedemptionFormState } from "@/app/(site)/travellers-club/actions";
import { CAP_DOMESTIC_PCT, CAP_INTERNATIONAL_PCT, creditsToRupees } from "@/lib/referral";
import styles from "./club.module.css";

const initial: RedemptionFormState = {};

export default function RedemptionForm({ balance }: { balance: number }) {
  const [state, action, pending] = useActionState(requestRedemptionAction, initial);
  const [tripType, setTripType] = useState<"DOMESTIC" | "INTERNATIONAL">("DOMESTIC");
  const [tripValue, setTripValue] = useState("");

  const pct = tripType === "INTERNATIONAL" ? CAP_INTERNATIONAL_PCT : CAP_DOMESTIC_PCT;
  const tv = Number(tripValue);
  // Mirror lib/referral.redeemableForTrip so the member sees the cap live.
  const usable = tv > 0 ? Math.max(0, Math.min(balance, Math.floor((pct / 100) * tv))) : null;

  return (
    <form action={action} className={styles.form}>
      <div className="form-group">
        <label className="form-label" htmlFor="rd-amount">Amount to redeem (₹)</label>
        <input
          id="rd-amount"
          name="amount"
          type="number"
          step="1"
          min="1"
          max={balance}
          className="form-input"
          placeholder={`up to ${balance.toLocaleString("en-IN")}`}
          required
        />
      </div>

      <div className="form-group">
        <span className="form-label">Trip type</span>
        <div className={styles.radioRow}>
          <label className={styles.radio}>
            <input type="radio" name="tripType" value="DOMESTIC" checked={tripType === "DOMESTIC"} onChange={() => setTripType("DOMESTIC")} />
            Domestic ({CAP_DOMESTIC_PCT}% cap)
          </label>
          <label className={styles.radio}>
            <input type="radio" name="tripType" value="INTERNATIONAL" checked={tripType === "INTERNATIONAL"} onChange={() => setTripType("INTERNATIONAL")} />
            International ({CAP_INTERNATIONAL_PCT}% cap)
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="rd-package">Which trip / package</label>
        <input id="rd-package" name="packageNote" type="text" className="form-input" maxLength={200} placeholder="e.g. Kerala Backwaters 5N" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="rd-value">Approx. trip value (₹)</label>
        <input
          id="rd-value"
          name="tripValue"
          type="number"
          step="1"
          min="0"
          className="form-input"
          value={tripValue}
          onChange={(e) => setTripValue(e.target.value)}
          placeholder="e.g. 80000"
        />
      </div>

      {usable !== null && (
        <p className={styles.usable}>
          Usable on this trip: <strong>{creditsToRupees(usable)}</strong> — up to {pct}% of the trip value.
        </p>
      )}

      {state.error && <p className={styles.error}>{state.error}</p>}
      {state.success && <p className={styles.refOk}>{state.success}</p>}

      <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
        {pending ? "Submitting…" : "Request redemption"}
      </button>
    </form>
  );
}
