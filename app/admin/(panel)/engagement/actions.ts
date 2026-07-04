"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { approveEngagement, rejectEngagement } from "@/lib/engagement";

export type EngagementActionState = { error?: string };

export async function approveEngagementAction(claimId: string): Promise<EngagementActionState> {
  const actor = await requirePermission("members:manage");
  const r = await approveEngagement(claimId, actor.id);
  if (!r.error) {
    await logActivity(actor, {
      action: "engagement.approve",
      entity: "EngagementClaim",
      entityId: claimId,
      detail: "Approved an engagement claim",
    });
  }
  revalidatePath("/admin/engagement");
  return r;
}

export async function rejectEngagementAction(claimId: string, note?: string): Promise<EngagementActionState> {
  const actor = await requirePermission("members:manage");
  const r = await rejectEngagement(claimId, actor.id, note);
  if (!r.error) {
    const reason = (note ?? "").trim();
    await logActivity(actor, {
      action: "engagement.reject",
      entity: "EngagementClaim",
      entityId: claimId,
      detail: reason ? `Rejected an engagement claim — ${reason}` : "Rejected an engagement claim",
    });
  }
  revalidatePath("/admin/engagement");
  return r;
}
