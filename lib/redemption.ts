import { db } from "@/lib/db";
import { MIN_REDEMPTION, redeemableForTrip, creditsToRupees } from "@/lib/referral";

// Server-only redemption engine for the Travellers Club (WI-3 / WI-14b / WI-18B).
// Members request to redeem credit against a trip; clean requests auto-apply, the
// rest queue for the admin Redemptions screen. Every applied redemption is
// reversible, and all balance changes go through the ledger in one transaction.

export type RedemptionInput = {
  amount: number;
  tripType: "DOMESTIC" | "INTERNATIONAL";
  packageNote: string;
  tripValue: number | null;
};

export type RedemptionResult =
  | { ok: false; error: string }
  | { ok: true; status: "APPLIED" | "PENDING"; amount: number };

/**
 * A member requests to redeem credit against a trip. A clean request — a stated
 * trip value with the amount within the 5% (domestic) / 10% (international) cap —
 * auto-applies immediately (SYSTEM_AUTO, reversible). Anything ambiguous (no trip
 * value, or over the cap) is left PENDING for the admin Redemptions screen.
 */
export async function requestRedemption(memberId: string, input: RedemptionInput): Promise<RedemptionResult> {
  const member = await db.member.findUnique({
    where: { id: memberId },
    select: { creditBalance: true },
  });
  if (!member) return { ok: false, error: "Member not found." };
  if (member.creditBalance < MIN_REDEMPTION) {
    return { ok: false, error: `You need a balance of at least ${creditsToRupees(MIN_REDEMPTION)} to redeem.` };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Enter a valid amount to redeem." };
  }
  if (input.amount > member.creditBalance) {
    return { ok: false, error: "You can't redeem more than your balance." };
  }

  const international = input.tripType === "INTERNATIONAL";
  const tripValue = input.tripValue;
  const cap =
    tripValue !== null && tripValue > 0
      ? redeemableForTrip(member.creditBalance, tripValue, international)
      : null;

  // Ambiguous (no stated value, or over the cap) → queue for admin review.
  if (cap === null || input.amount > cap) {
    await db.redemptionRequest.create({
      data: {
        memberId,
        amount: input.amount,
        packageNote: input.packageNote || null,
        tripType: input.tripType,
        status: "PENDING",
      },
    });
    return { ok: true, status: "PENDING", amount: input.amount };
  }

  // Clean → auto-approve + apply atomically (reversible from the admin screen).
  await db.$transaction(async (tx) => {
    await tx.redemptionRequest.create({
      data: {
        memberId,
        amount: input.amount,
        packageNote: input.packageNote || null,
        tripType: input.tripType,
        status: "APPLIED",
        resolvedBy: "SYSTEM_AUTO",
        resolvedAt: new Date(),
      },
    });
    await tx.creditEntry.create({
      data: {
        memberId,
        amount: -input.amount,
        reason: "REDEMPTION",
        note: `Applied to ${input.packageNote || "a trip"}`,
        approvedBy: "SYSTEM_AUTO",
      },
    });
    await tx.member.update({
      where: { id: memberId },
      data: { creditBalance: { decrement: input.amount }, lastActivityAt: new Date() },
    });
  });
  return { ok: true, status: "APPLIED", amount: input.amount };
}

/** Admin: apply a PENDING/APPROVED request — deduct the credit and mark APPLIED. */
export async function applyRedemption(requestId: string, adminId: string): Promise<{ error?: string }> {
  return db.$transaction(async (tx) => {
    const req = await tx.redemptionRequest.findUnique({ where: { id: requestId } });
    if (!req) return { error: "Request not found." };
    if (req.status !== "PENDING" && req.status !== "APPROVED") {
      return { error: "Only a pending request can be applied." };
    }
    const member = await tx.member.findUnique({ where: { id: req.memberId }, select: { creditBalance: true } });
    if (!member) return { error: "Member not found." };
    if (req.amount > member.creditBalance) return { error: "The member's balance is now too low for this amount." };

    await tx.creditEntry.create({
      data: {
        memberId: req.memberId,
        amount: -req.amount,
        reason: "REDEMPTION",
        note: `Applied to ${req.packageNote ?? "a trip"}`,
        approvedBy: adminId,
      },
    });
    await tx.member.update({
      where: { id: req.memberId },
      data: { creditBalance: { decrement: req.amount }, lastActivityAt: new Date() },
    });
    await tx.redemptionRequest.update({
      where: { id: requestId },
      data: { status: "APPLIED", resolvedBy: adminId, resolvedAt: new Date() },
    });
    return {};
  });
}

/** Admin: reject a PENDING/APPROVED request (no credit moves). */
export async function rejectRedemption(requestId: string, adminId: string): Promise<{ error?: string }> {
  const req = await db.redemptionRequest.findUnique({ where: { id: requestId }, select: { status: true } });
  if (!req) return { error: "Request not found." };
  if (req.status !== "PENDING" && req.status !== "APPROVED") {
    return { error: "Only a pending request can be rejected." };
  }
  await db.redemptionRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", resolvedBy: adminId, resolvedAt: new Date() },
  });
  return {};
}

/**
 * Admin: reverse an APPLIED redemption — writes an offsetting positive ledger
 * entry, restores the balance, marks REVERSED (WI-14b, and the WI-18B trip-
 * cancellation path).
 */
export async function reverseRedemption(requestId: string, adminId: string): Promise<{ error?: string }> {
  return db.$transaction(async (tx) => {
    const req = await tx.redemptionRequest.findUnique({ where: { id: requestId } });
    if (!req) return { error: "Request not found." };
    if (req.status !== "APPLIED") return { error: "Only an applied redemption can be reversed." };

    await tx.creditEntry.create({
      data: {
        memberId: req.memberId,
        amount: req.amount,
        reason: "REDEMPTION",
        note: `Reversed: ${req.packageNote ?? "a trip"}`,
        approvedBy: adminId,
      },
    });
    await tx.member.update({
      where: { id: req.memberId },
      data: { creditBalance: { increment: req.amount }, lastActivityAt: new Date() },
    });
    await tx.redemptionRequest.update({
      where: { id: requestId },
      data: { status: "REVERSED", resolvedBy: adminId, resolvedAt: new Date() },
    });
    return {};
  });
}
