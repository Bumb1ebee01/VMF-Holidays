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
          ? `${memberName} is a Travellers Club member. Marking booked sets their referral to Booked — the reward pays later, when you mark their trip completed on their member profile.`
          : "Not linked to a club member. Records the booking and sets status to Won."}
      </p>
      <form action={action} style={formStyle}>
        <input type="hidden" name="leadId" value={leadId} />
        {state.error && <p className={shared.error}>{state.error}</p>}
        {state.success && <p className={shared.success}>{state.success}</p>}
        <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
          {pending ? "Saving…" : "Mark booked"}
        </button>
      </form>
    </div>
  );
}
