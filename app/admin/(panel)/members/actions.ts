"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { adjustCredit, completeMemberTrip, type TripCompletionResult } from "@/lib/referral-credit";
import {
  creditsToRupees,
  WELCOME_BONUS,
  MIN_WELCOME_BOOKING,
  MIN_QUALIFYING_BOOKING,
  MARGIN_GUARD_PCT,
} from "@/lib/referral";

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

/**
 * Mark that a member completed their trip — the event that fires the referral
 * reward chain (friend's welcome + margin-guarded referrer reward). Replaces the
 * old award-on-booking flow: rewards now pay on completed travel, not on booking.
 */
export async function markTripCompleted(_prev: CreditState, formData: FormData): Promise<CreditState> {
  const actor = await requirePermission("members:manage");
  const memberId = String(formData.get("memberId") ?? "");
  if (!memberId) return { error: "Missing member." };

  let bookingValue: number | null = null;
  const rawValue = String(formData.get("bookingValue") ?? "").trim();
  if (rawValue) {
    const n = Math.round(Number(rawValue));
    if (!Number.isFinite(n) || n < 0) return { error: "Enter a valid booking value (or leave it blank)." };
    bookingValue = n;
  }

  let tripMargin: number | null = null;
  const rawMargin = String(formData.get("tripMargin") ?? "").trim();
  if (rawMargin) {
    const n = Math.round(Number(rawMargin));
    if (!Number.isFinite(n)) return { error: "Enter a valid trip margin (or leave it blank)." };
    tripMargin = n;
  }

  const member = await db.member.findUnique({ where: { id: memberId }, select: { name: true } });
  if (!member) return { error: "Member not found." };

  const result = await completeMemberTrip(memberId, { bookingValue, tripMargin });

  await logActivity(actor, {
    action: "member.tripCompleted",
    entity: "Member",
    entityId: memberId,
    detail: `Trip completed for ${member.name} — ${result.outcome}${result.referrerReward ? `, referrer +${result.referrerReward}` : ""}`,
  });
  revalidatePath(`/admin/members/${memberId}`);
  if (result.referrerId) revalidatePath(`/admin/members/${result.referrerId}`);

  return { success: tripCompletionMessage(result, member.name, bookingValue) };
}

function tripCompletionMessage(r: TripCompletionResult, name: string, bookingValue: number | null): string {
  const welcome = creditsToRupees(WELCOME_BONUS);
  if (r.outcome === "REWARDED") {
    return `Full reward: ${name} got their ${welcome} welcome and their referrer earned ${creditsToRupees(r.referrerReward)}.`;
  }
  if (r.outcome === "REJECTED_MARGIN") {
    return `${name} got their ${welcome} welcome. The referrer reward was blocked by the margin guard (it would exceed ${MARGIN_GUARD_PCT}% of the trip margin).`;
  }
  if (r.outcome === "WELCOME_PAID") {
    return `${name} got their ${welcome} welcome. This trip didn't reach ${creditsToRupees(MIN_QUALIFYING_BOOKING)}, so no referrer reward.`;
  }
  if (r.outcome === "NEEDS_DATA") {
    return bookingValue === null
      ? "Enter the booking value to release the friend's welcome and the referrer reward."
      : `${name}'s ${welcome} welcome is paid. Add the trip margin and re-submit to release the referrer reward.`;
  }
  if (r.outcome === "BELOW_FLOOR") {
    return `Trip recorded. The booking is under ${creditsToRupees(MIN_WELCOME_BOOKING)}, so no welcome credit applies.`;
  }
  if (r.outcome === "ALREADY_REWARDED") {
    return `${name}'s referral was already fully rewarded — no change.`;
  }
  return `Trip recorded for ${name}. They weren't referred, so there's no referral credit.`;
}
