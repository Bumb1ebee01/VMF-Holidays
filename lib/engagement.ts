import { db } from "@/lib/db";
import {
  ENGAGEMENT_TASKS,
  ENGAGEMENT_LIFETIME_CAP,
  balanceCapForTier,
  tierLabel,
  creditsToRupees,
} from "@/lib/referral";

// Server-only engagement-credit engine (WI-13). Small one-time credits for light
// actions, capped at ENGAGEMENT_LIFETIME_CAP per member and one-per-task (enforced
// by the EngagementClaim @@unique). Auto tasks credit immediately; manual ones
// queue for the admin Engagement screen.

const TASK_BY_KEY = new Map(ENGAGEMENT_TASKS.map((t) => [t.key, t]));

export type ClaimResult =
  | { ok: false; error: string }
  | { ok: true; status: "APPROVED" | "PENDING"; credit: number };

/** Total engagement credit already granted (APPROVED) to a member. */
async function engagementTotal(memberId: string): Promise<number> {
  const claims = await db.engagementClaim.findMany({
    where: { memberId, status: "APPROVED" },
    select: { credit: true },
  });
  return claims.reduce((s, c) => s + c.credit, 0);
}

/** Member claims an engagement task. Auto tasks credit immediately; manual → PENDING. */
export async function claimEngagement(memberId: string, taskKey: string): Promise<ClaimResult> {
  const task = TASK_BY_KEY.get(taskKey);
  if (!task) return { ok: false, error: "Unknown task." };

  const existing = await db.engagementClaim.findUnique({
    where: { memberId_taskKey: { memberId, taskKey } },
    select: { id: true },
  });
  if (existing) return { ok: false, error: "You've already claimed this one." };

  // Light gate: "complete your profile" requires travel styles to be set.
  if (taskKey === "PROFILE_STYLES") {
    const m = await db.member.findUnique({ where: { id: memberId }, select: { travelStyles: true } });
    if (!m || m.travelStyles.length === 0) return { ok: false, error: "Pick your travel styles first." };
  }

  if ((await engagementTotal(memberId)) + task.credit > ENGAGEMENT_LIFETIME_CAP) {
    return { ok: false, error: `That would exceed the ₹${ENGAGEMENT_LIFETIME_CAP} engagement cap.` };
  }

  if (task.verify === "manual") {
    await db.engagementClaim.create({ data: { memberId, taskKey, credit: task.credit, status: "PENDING" } });
    return { ok: true, status: "PENDING", credit: task.credit };
  }

  // Balance cap: don't push the member over their tier's hold limit.
  const capMember = await db.member.findUnique({ where: { id: memberId }, select: { creditBalance: true, tier: true } });
  if (capMember && capMember.creditBalance + task.credit > balanceCapForTier(capMember.tier)) {
    return {
      ok: false,
      error: `Your balance is at the ${tierLabel(capMember.tier)} limit of ${creditsToRupees(balanceCapForTier(capMember.tier))}. Redeem some credit or reach the next tier to claim this.`,
    };
  }

  await db.$transaction(async (tx) => {
    await tx.engagementClaim.create({
      data: { memberId, taskKey, credit: task.credit, status: "APPROVED", approvedBy: "SYSTEM_AUTO", approvedAt: new Date() },
    });
    await tx.creditEntry.create({
      data: { memberId, amount: task.credit, reason: "ENGAGEMENT", note: task.label, approvedBy: "SYSTEM_AUTO" },
    });
    await tx.member.update({
      where: { id: memberId },
      data: { creditBalance: { increment: task.credit }, lastActivityAt: new Date() },
    });
  });
  return { ok: true, status: "APPROVED", credit: task.credit };
}

/** Admin approves a PENDING claim — credits it if still within the lifetime cap. */
export async function approveEngagement(claimId: string, adminId: string): Promise<{ error?: string }> {
  return db.$transaction(async (tx) => {
    const claim = await tx.engagementClaim.findUnique({ where: { id: claimId } });
    if (!claim) return { error: "Claim not found." };
    if (claim.status !== "PENDING") return { error: "Only a pending claim can be approved." };

    const prior = await tx.engagementClaim.findMany({
      where: { memberId: claim.memberId, status: "APPROVED" },
      select: { credit: true },
    });
    const already = prior.reduce((s, c) => s + c.credit, 0);
    if (already + claim.credit > ENGAGEMENT_LIFETIME_CAP) {
      return { error: `That would exceed the ₹${ENGAGEMENT_LIFETIME_CAP} engagement cap.` };
    }

    const mem = await tx.member.findUnique({ where: { id: claim.memberId }, select: { creditBalance: true, tier: true } });
    if (mem && mem.creditBalance + claim.credit > balanceCapForTier(mem.tier)) {
      return { error: `Member is at their ${tierLabel(mem.tier)} balance limit (${creditsToRupees(balanceCapForTier(mem.tier))}).` };
    }

    await tx.engagementClaim.update({
      where: { id: claimId },
      data: { status: "APPROVED", approvedBy: adminId, approvedAt: new Date() },
    });
    await tx.creditEntry.create({
      data: { memberId: claim.memberId, amount: claim.credit, reason: "ENGAGEMENT", note: claim.taskKey, approvedBy: adminId },
    });
    await tx.member.update({
      where: { id: claim.memberId },
      data: { creditBalance: { increment: claim.credit }, lastActivityAt: new Date() },
    });
    return {};
  });
}

/** Admin rejects a PENDING claim (no credit moves). The optional note is the
 *  reason, shown back to the member on their dashboard. */
export async function rejectEngagement(
  claimId: string,
  adminId: string,
  note?: string
): Promise<{ error?: string }> {
  const claim = await db.engagementClaim.findUnique({ where: { id: claimId }, select: { status: true } });
  if (!claim) return { error: "Claim not found." };
  if (claim.status !== "PENDING") return { error: "Only a pending claim can be rejected." };
  const reviewNote = (note ?? "").trim().slice(0, 300) || null;
  await db.engagementClaim.update({
    where: { id: claimId },
    data: { status: "REJECTED", approvedBy: adminId, approvedAt: new Date(), reviewNote },
  });
  return {};
}
