import { db } from "@/lib/db";
import { REFERRAL_REWARD, WELCOME_BONUS, tierForReferrals } from "@/lib/referral";

// Server-only credit engine for the Travellers Club. Awards happen inside a
// transaction so the ledger entries and the cached balances never drift.

export type AwardResult = {
  alreadyBooked: boolean;
  welcomeBonus: number; // credited to the referee (this member)
  referrerReward: number; // credited to the referrer
  referrerId: string | null;
};

/**
 * Record a member's first booking and pay out the two-sided credit:
 *  - the referee (this member) gets the welcome bonus (only if they were referred),
 *  - their referrer gets the referral reward, and the referrer's tier is recomputed.
 * Idempotent per member: only the FIRST booking triggers credit (gated on
 * firstBookingAt), so calling it twice is safe.
 */
export async function awardBookingCredits(
  memberId: string,
  bookingValue: number | null
): Promise<AwardResult> {
  return db.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
      select: { id: true, name: true, firstBookingAt: true, referredById: true },
    });
    if (!member) throw new Error("Member not found");

    if (member.firstBookingAt) {
      return { alreadyBooked: true, welcomeBonus: 0, referrerReward: 0, referrerId: member.referredById };
    }

    await tx.member.update({ where: { id: member.id }, data: { firstBookingAt: new Date() } });

    if (!member.referredById) {
      return { alreadyBooked: false, welcomeBonus: 0, referrerReward: 0, referrerId: null };
    }

    // Welcome bonus → the referee (this member).
    await tx.creditEntry.create({
      data: { memberId: member.id, amount: WELCOME_BONUS, reason: "WELCOME_BONUS", note: "First-booking welcome bonus" },
    });
    await tx.member.update({
      where: { id: member.id },
      data: { creditBalance: { increment: WELCOME_BONUS } },
    });

    // Referral reward → the referrer.
    await tx.creditEntry.create({
      data: { memberId: member.referredById, amount: REFERRAL_REWARD, reason: "REFERRAL_REWARD", note: `${member.name} booked` },
    });
    await tx.member.update({
      where: { id: member.referredById },
      data: { creditBalance: { increment: REFERRAL_REWARD } },
    });

    // Audit record + recompute the referrer's tier from their booked referrals.
    await tx.referral.create({
      data: {
        referrerId: member.referredById,
        refereeName: member.name,
        status: "REWARDED",
        bookingValue: bookingValue ?? null,
        rewardAmount: REFERRAL_REWARD,
      },
    });
    const booked = await tx.member.count({
      where: { referredById: member.referredById, firstBookingAt: { not: null } },
    });
    await tx.member.update({
      where: { id: member.referredById },
      data: { tier: tierForReferrals(booked) },
    });

    return {
      alreadyBooked: false,
      welcomeBonus: WELCOME_BONUS,
      referrerReward: REFERRAL_REWARD,
      referrerId: member.referredById,
    };
  });
}

/** Apply a manual credit adjustment (+/-) to a member, writing a ledger row. */
export async function adjustCredit(memberId: string, amount: number, note: string) {
  await db.$transaction(async (tx) => {
    await tx.creditEntry.create({
      data: { memberId, amount, reason: "ADJUSTMENT", note: note || null },
    });
    await tx.member.update({
      where: { id: memberId },
      data: { creditBalance: { increment: amount } },
    });
  });
}
