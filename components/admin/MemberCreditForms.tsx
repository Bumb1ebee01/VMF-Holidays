"use client";

import { useActionState } from "react";
import { adjustMemberCredit, markTripCompleted, type CreditState } from "@/app/admin/(panel)/members/actions";
import shared from "./shared.module.css";

const initial: CreditState = {};
const formStyle = { marginTop: 14, display: "flex", flexDirection: "column" as const, gap: 12 };

export default function MemberCreditForms({ memberId }: { memberId: string }) {
  const [adjState, adjAction, adjPending] = useActionState(adjustMemberCredit, initial);
  const [tripState, tripAction, tripPending] = useActionState(markTripCompleted, initial);

  return (
    <div className={shared.grid2}>
      <div className={shared.card}>
        <h3 className={shared.cardTitle}>Adjust credit</h3>
        <p className={shared.cardSub}>Add or deduct VMF credit manually (use a negative number to deduct).</p>
        <form action={adjAction} style={formStyle}>
          <input type="hidden" name="memberId" value={memberId} />
          <div className="form-group">
            <label className="form-label" htmlFor="adj-amount">Amount (credits)</label>
            <input id="adj-amount" name="amount" type="number" step="1" className="form-input" placeholder="e.g. 500 or -500" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="adj-note">Note (optional)</label>
            <input id="adj-note" name="note" type="text" className="form-input" maxLength={200} />
          </div>
          {adjState.error && <p className={shared.error}>{adjState.error}</p>}
          {adjState.success && <p className={shared.success}>{adjState.success}</p>}
          <button type="submit" className="btn btn-primary btn--sm" disabled={adjPending}>
            {adjPending ? "Saving…" : "Apply adjustment"}
          </button>
        </form>
      </div>

      <div className={shared.card}>
        <h3 className={shared.cardTitle}>Mark trip completed</h3>
        <p className={shared.cardSub}>
          Confirms this member has travelled. If they were referred, this releases their ₹1,000 welcome and — for
          bookings ≥ ₹25,000 that pass the margin guard — their referrer&apos;s reward. Rewards fire on travel, not
          booking.
        </p>
        <form action={tripAction} style={formStyle}>
          <input type="hidden" name="memberId" value={memberId} />
          <div className="form-group">
            <label className="form-label" htmlFor="trip-value">Booking value ₹</label>
            <input id="trip-value" name="bookingValue" type="number" step="1" min="0" className="form-input" placeholder="e.g. 80000" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="trip-margin">Trip margin ₹ (needed to release the referrer reward)</label>
            <input id="trip-margin" name="tripMargin" type="number" step="1" className="form-input" placeholder="e.g. 18000" />
          </div>
          {tripState.error && <p className={shared.error}>{tripState.error}</p>}
          {tripState.success && <p className={shared.success}>{tripState.success}</p>}
          <button type="submit" className="btn btn-navy btn--sm" disabled={tripPending}>
            {tripPending ? "Saving…" : "Mark trip completed"}
          </button>
        </form>
      </div>
    </div>
  );
}
