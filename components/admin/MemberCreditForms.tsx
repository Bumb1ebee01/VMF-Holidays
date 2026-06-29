"use client";

import { useActionState } from "react";
import { adjustMemberCredit, awardBooking, type CreditState } from "@/app/admin/(panel)/members/actions";
import shared from "./shared.module.css";

const initial: CreditState = {};
const formStyle = { marginTop: 14, display: "flex", flexDirection: "column" as const, gap: 12 };

export default function MemberCreditForms({
  memberId,
  alreadyBooked,
}: {
  memberId: string;
  alreadyBooked: boolean;
}) {
  const [adjState, adjAction, adjPending] = useActionState(adjustMemberCredit, initial);
  const [bookState, bookAction, bookPending] = useActionState(awardBooking, initial);

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
        <h3 className={shared.cardTitle}>Record booking &amp; award credit</h3>
        <p className={shared.cardSub}>
          {alreadyBooked
            ? "This member's first booking is already recorded."
            : "Marks this member's first booking. If they were referred, both they and their referrer get credit."}
        </p>
        <form action={bookAction} style={formStyle}>
          <input type="hidden" name="memberId" value={memberId} />
          <div className="form-group">
            <label className="form-label" htmlFor="book-value">Booking value ₹ (optional)</label>
            <input
              id="book-value"
              name="bookingValue"
              type="number"
              step="1"
              min="0"
              className="form-input"
              placeholder="e.g. 80000"
              disabled={alreadyBooked}
            />
          </div>
          {bookState.error && <p className={shared.error}>{bookState.error}</p>}
          {bookState.success && <p className={shared.success}>{bookState.success}</p>}
          <button type="submit" className="btn btn-navy btn--sm" disabled={bookPending || alreadyBooked}>
            {bookPending ? "Recording…" : "Confirm booking & credit"}
          </button>
        </form>
      </div>
    </div>
  );
}
