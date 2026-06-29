"use client";

import { useActionState } from "react";
import { markLeadBooked, type BookedState } from "@/app/admin/(panel)/leads/actions";
import shared from "./shared.module.css";

const initial: BookedState = {};
const formStyle = { marginTop: 12, display: "flex", flexDirection: "column" as const, gap: 10 };

export default function LeadBookingPanel({
  leadId,
  memberName,
}: {
  leadId: string;
  memberName: string | null;
}) {
  const [state, action, pending] = useActionState(markLeadBooked, initial);

  return (
    <div>
      <h3 className={shared.cardTitle}>Mark as booked</h3>
      <p className={shared.cardSub}>
        {memberName
          ? `${memberName} is a Travellers Club member — marking booked will award their referral credit.`
          : "Not linked to a club member, so no credit is awarded. Records the booking and sets status to Won."}
      </p>
      <form action={action} style={formStyle}>
        <input type="hidden" name="leadId" value={leadId} />
        <div className="form-group">
          <label className="form-label" htmlFor="lead-book-value">Booking value ₹ (optional)</label>
          <input
            id="lead-book-value"
            name="bookingValue"
            type="number"
            step="1"
            min="0"
            className="form-input"
            placeholder="e.g. 80000"
          />
        </div>
        {state.error && <p className={shared.error}>{state.error}</p>}
        {state.success && <p className={shared.success}>{state.success}</p>}
        <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
          {pending ? "Saving…" : "Mark booked"}
        </button>
      </form>
    </div>
  );
}
