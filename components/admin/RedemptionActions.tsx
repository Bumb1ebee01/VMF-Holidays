"use client";

import { useTransition } from "react";
import {
  applyRedemptionAction,
  rejectRedemptionAction,
  reverseRedemptionAction,
  type RedemptionActionState,
} from "@/app/admin/(panel)/redemptions/actions";

export default function RedemptionActions({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();

  const run = (fn: (id: string) => Promise<RedemptionActionState>) =>
    start(async () => {
      const r = await fn(id);
      if (r?.error) alert(r.error);
    });

  if (status === "PENDING" || status === "APPROVED") {
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-primary btn--sm" disabled={pending} onClick={() => run(applyRedemptionAction)}>
          Apply
        </button>
        <button type="button" className="btn btn-outline btn--sm" disabled={pending} onClick={() => run(rejectRedemptionAction)}>
          Reject
        </button>
      </div>
    );
  }
  if (status === "APPLIED") {
    return (
      <button type="button" className="btn btn-outline btn--sm" disabled={pending} onClick={() => run(reverseRedemptionAction)}>
        Reverse
      </button>
    );
  }
  return null;
}
