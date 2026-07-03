"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { applyRedemption, rejectRedemption, reverseRedemption } from "@/lib/redemption";

export type RedemptionActionState = { error?: string };

export async function applyRedemptionAction(requestId: string): Promise<RedemptionActionState> {
  const actor = await requirePermission("members:manage");
  const r = await applyRedemption(requestId, actor.id);
  if (!r.error) {
    await logActivity(actor, {
      action: "redemption.apply",
      entity: "RedemptionRequest",
      entityId: requestId,
      detail: "Applied a credit redemption",
    });
  }
  revalidatePath("/admin/redemptions");
  return r;
}

export async function rejectRedemptionAction(requestId: string): Promise<RedemptionActionState> {
  const actor = await requirePermission("members:manage");
  const r = await rejectRedemption(requestId, actor.id);
  if (!r.error) {
    await logActivity(actor, {
      action: "redemption.reject",
      entity: "RedemptionRequest",
      entityId: requestId,
      detail: "Rejected a credit redemption",
    });
  }
  revalidatePath("/admin/redemptions");
  return r;
}

export async function reverseRedemptionAction(requestId: string): Promise<RedemptionActionState> {
  const actor = await requirePermission("members:manage");
  const r = await reverseRedemption(requestId, actor.id);
  if (!r.error) {
    await logActivity(actor, {
      action: "redemption.reverse",
      entity: "RedemptionRequest",
      entityId: requestId,
      detail: "Reversed a redemption — credit restored",
    });
  }
  revalidatePath("/admin/redemptions");
  return r;
}
