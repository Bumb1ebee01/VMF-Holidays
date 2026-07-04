"use client";

import { useTransition } from "react";
import {
  approveEngagementAction,
  rejectEngagementAction,
} from "@/app/admin/(panel)/engagement/actions";

export default function EngagementActions({ id }: { id: string }) {
  const [pending, start] = useTransition();

  const approve = () =>
    start(async () => {
      const r = await approveEngagementAction(id);
      if (r?.error) alert(r.error);
    });

  const reject = () => {
    // The reason is optional but surfaced to the member on their dashboard.
    const note = window.prompt("Reason for rejecting (the member will see this):", "");
    if (note === null) return; // admin cancelled — leave the claim pending
    start(async () => {
      const r = await rejectEngagementAction(id, note.trim());
      if (r?.error) alert(r.error);
    });
  };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <button type="button" className="btn btn-primary btn--sm" disabled={pending} onClick={approve}>
        Approve
      </button>
      <button type="button" className="btn btn-outline btn--sm" disabled={pending} onClick={reject}>
        Reject
      </button>
    </div>
  );
}
