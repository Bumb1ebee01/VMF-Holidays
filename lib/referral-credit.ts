import { db } from "@/lib/db";
import { WELCOME_BONUS, tierForMember, maxTier, referrerRewardForTier } from "@/lib/referral";

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

    // Referral reward → the referrer. The amount escalates with the referrer's
    // CURRENT tier (§4), and is stamped SYSTEM_AUTO for the reconciliation report.
    const referrer = await tx.member.findUnique({
      where: { id: member.referredById },
      select: { id: true, tier: true, completedTrips: true },
    });
    const reward = referrerRewardForTier(referrer?.tier ?? "EXPLORER");

    await tx.creditEntry.create({
      data: {
        memberId: member.referredById,
        amount: reward,
        reason: "REFERRAL_REWARD",
        note: `${member.name} booked`,
        approvedBy: "SYSTEM_AUTO",
      },
    });
    await tx.member.update({
      where: { id: member.referredById },
      data: { creditBalance: { increment: reward } },
    });

    // Advance the referee's canonical referral row to REWARDED (it was created at
    // signup / enquiry), or create it if this member predates referral tracking —
    // so there's exactly one Referral per referee. Then re-evaluate the referrer's
    // tier from BOTH successful referrals and completed trips, never downgrading
    // (maxTier keeps the highest tier they've ever reached).
    const existingReferral = await tx.referral.findFirst({
      where: { referrerId: member.referredById, refereeMemberId: member.id },
      select: { id: true },
    });
    const rewardData = {
      status: "REWARDED" as const,
      refereeMemberId: member.id,
      refereeName: member.name,
      bookingValue: bookingValue ?? null,
      rewardAmount: reward,
      rewardEligible: true,
    };
    if (existingReferral) {
      await tx.referral.update({ where: { id: existingReferral.id }, data: rewardData });
    } else {
      await tx.referral.create({ data: { referrerId: member.referredById, ...rewardData } });
    }
    const booked = await tx.member.count({
      where: { referredById: member.referredById, firstBookingAt: { not: null } },
    });
    await tx.member.update({
      where: { id: member.referredById },
      data: {
        tier: maxTier(referrer?.tier ?? "EXPLORER", tierForMember(booked, referrer?.completedTrips ?? 0)),
      },
    });

    return {
      alreadyBooked: false,
      welcomeBonus: WELCOME_BONUS,
      referrerReward: reward,
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

// Referral lifecycle stages, ordered so a row is only ever moved forward.
const REFERRAL_STAGE_RANK: Record<string, number> = {
  PENDING: 0,
  ENQUIRED: 1,
  BOOKED: 2,
  WELCOME_PAID: 3,
  REWARDED: 4,
};

/**
 * Create or advance the single canonical Referral row for a referee under a
 * referrer — keyed by member id (preferred), else by phone (an enquiry made
 * before signup). Status only ever advances, never regressing a further-along
 * referral. Best-effort attribution used by the enquiry API (ENQUIRED) and signup
 * (PENDING + refereeMemberId → "Joined"); the money-moving REWARDED transition
 * stays inside awardBookingCredits' transaction.
 */
export async function upsertReferralStage(params: {
  referrerId: string;
  status: "PENDING" | "ENQUIRED" | "BOOKED" | "WELCOME_PAID" | "REWARDED";
  refereeMemberId?: string | null;
  refereeName?: string | null;
  refereePhone?: string | null;
  leadId?: string | null;
}): Promise<void> {
  let existing = params.refereeMemberId
    ? await db.referral.findFirst({
        where: { referrerId: params.referrerId, refereeMemberId: params.refereeMemberId },
      })
    : null;
  if (!existing && params.refereePhone) {
    existing = await db.referral.findFirst({
      where: { referrerId: params.referrerId, refereePhone: params.refereePhone },
    });
  }

  if (existing) {
    const curRank = REFERRAL_STAGE_RANK[existing.status] ?? -1;
    const advance = curRank >= 0 && REFERRAL_STAGE_RANK[params.status] > curRank;
    await db.referral.update({
      where: { id: existing.id },
      data: {
        status: advance ? params.status : existing.status,
        refereeMemberId: params.refereeMemberId ?? existing.refereeMemberId,
        refereeName: params.refereeName ?? existing.refereeName,
        refereePhone: params.refereePhone ?? existing.refereePhone,
        leadId: params.leadId ?? existing.leadId,
      },
    });
  } else {
    await db.referral.create({
      data: {
        referrerId: params.referrerId,
        status: params.status,
        refereeMemberId: params.refereeMemberId ?? null,
        refereeName: params.refereeName ?? null,
        refereePhone: params.refereePhone ?? null,
        leadId: params.leadId ?? null,
      },
    });
  }
}
