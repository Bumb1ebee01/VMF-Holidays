"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { adjustCredit, awardBookingCredits } from "@/lib/referral-credit";
import { creditsToRupees } from "@/lib/referral";

export type CreditState = { error?: string; success?: string };

/** Manually add or deduct credit for a member (writes a ledger row). */
export async function adjustMemberCredit(_prev: CreditState, formData: FormData): Promise<CreditState> {
  const actor = await requirePermission("members:manage");
  const memberId = String(formData.get("memberId") ?? "");
  const amount = Math.round(Number(formData.get("amount")));
  const note = String(formData.get("note") ?? "").trim().slice(0, 200);

  if (!memberId) return { error: "Missing member." };
  if (!Number.isFinite(amount) || amount === 0) return { error: "Enter a non-zero credit amount." };

  const member = await db.member.findUnique({ where: { id: memberId }, select: { name: true } });
  if (!member) return { error: "Member not found." };

  await adjustCredit(memberId, amount, note);
  await logActivity(actor, {
    action: "member.credit",
    entity: "Member",
    entityId: memberId,
    detail: `${amount > 0 ? "+" : ""}${amount} credit to ${member.name}${note ? ` (${note})` : ""}`,
  });
  revalidatePath(`/admin/members/${memberId}`);
  return { success: `${amount > 0 ? "Added" : "Deducted"} ${creditsToRupees(Math.abs(amount))}.` };
}

/** Record a member's first booking and pay out the two-sided referral credit. */
export async function awardBooking(_prev: CreditState, formData: FormData): Promise<CreditState> {
  const actor = await requirePermission("members:manage");
  const memberId = String(formData.get("memberId") ?? "");
  const raw = String(formData.get("bookingValue") ?? "").trim();

  if (!memberId) return { error: "Missing member." };

  let bookingValue: number | null = null;
  if (raw) {
    const n = Math.round(Number(raw));
    if (!Number.isFinite(n) || n < 0) return { error: "Enter a valid booking value (or leave it blank)." };
    bookingValue = n;
  }

  const member = await db.member.findUnique({ where: { id: memberId }, select: { name: true } });
  if (!member) return { error: "Member not found." };

  const result = await awardBookingCredits(memberId, bookingValue);
  if (result.alreadyBooked) {
    return { error: "This member's first booking was already recorded — no new credit awarded." };
  }

  await logActivity(actor, {
    action: "member.booking",
    entity: "Member",
    entityId: memberId,
    detail: `Booking recorded for ${member.name}; welcome ${result.welcomeBonus}, referrer reward ${result.referrerReward}`,
  });
  revalidatePath(`/admin/members/${memberId}`);
  if (result.referrerId) revalidatePath(`/admin/members/${result.referrerId}`);

  return {
    success: result.referrerReward
      ? `Booking recorded. ${creditsToRupees(result.welcomeBonus)} welcome credit to ${member.name}; ${creditsToRupees(result.referrerReward)} to their referrer.`
      : `Booking recorded for ${member.name} (no referrer to reward).`,
  };
}
