"use client";

import { useTransition } from "react";
import {
  approveEngagementAction,
  rejectEngagementAction,
  type EngagementActionState,
} from "@/app/admin/(panel)/engagement/actions";

export default function EngagementActions({ id }: { id: string }) {
  const [pending, start] = useTransition();

  const run = (fn: (id: string) => Promise<EngagementActionState>) =>
    start(async () => {
      const r = await fn(id);
      if (r?.error) alert(r.error);
    });

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <button type="button" className="btn btn-primary btn--sm" disabled={pending} onClick={() => run(approveEngagementAction)}>
        Approve
      </button>
      <button type="button" className="btn btn-outline btn--sm" disabled={pending} onClick={() => run(rejectEngagementAction)}>
        Reject
      </button>
    </div>
  );
}
