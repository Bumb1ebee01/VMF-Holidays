import { db } from "@/lib/db";
import {
  WELCOME_BONUS,
  MIN_WELCOME_BOOKING,
  MIN_QUALIFYING_BOOKING,
  MARGIN_GUARD_PCT,
  tierForMember,
  maxTier,
  referrerRewardForTier,
} from "@/lib/referral";

// Server-only credit engine for the Travellers Club. Awards happen inside a
// transaction so the ledger entries and the cached balances never drift.

export type TripOutcome =
  | "NOT_REFERRED" // member wasn't referred — trip recorded, no referral credit
  | "ALREADY_REWARDED" // this referral already paid out; nothing to do
  | "BELOW_FLOOR" // booking under ₹5,000 — no welcome
  | "NEEDS_DATA" // missing booking value / trip margin — can't finish the decision
  | "WELCOME_PAID" // friend's ₹1,000 welcome paid; trip didn't clear the ₹25k referrer gate
  | "REJECTED_MARGIN" // referrer reward blocked by the margin guard (welcome still paid)
  | "REWARDED"; // full payout — welcome + referrer reward

export type TripCompletionResult = {
  outcome: TripOutcome;
  welcomePaid: number; // credited to the referee on this run (0 if already paid / n/a)
  referrerReward: number; // credited to the referrer on this run
  referrerId: string | null;
};

/**
 * Mark that a member completed a trip (WI-4 / WI-14a). This — NOT booking — is the
 * event that fires the referral reward chain. It:
 *  - counts the member's completed trip (once) and re-evaluates their own tier;
 *  - if they were referred, runs the auto-decision on their inbound referral:
 *      • ₹1,000 welcome to the friend once the booking is ≥ ₹5,000,
 *      • the tier-based referrer reward once the booking is ≥ ₹25,000 AND that
 *        reward is ≤ 20% of the trip margin (the margin guard),
 *      • otherwise WELCOME_PAID / REJECTED_MARGIN / NEEDS_DATA (all overridable).
 * Idempotent: a paid welcome never pays twice and a REWARDED referral is left
 * alone, so re-submitting to fill in missing margin data is safe.
 */
export async function completeMemberTrip(
  memberId: string,
  input: { bookingValue: number | null; tripMargin: number | null }
): Promise<TripCompletionResult> {
  const { bookingValue, tripMargin } = input;
  return db.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
      select: { id: true, name: true, completedTrips: true, tier: true, referredById: true },
    });
    if (!member) throw new Error("Member not found");

    // The referral that brought THIS member in (they are the referee).
    const inbound = await tx.referral.findFirst({ where: { refereeMemberId: member.id } });

    // Count a newly-completed trip once (not on a re-run to correct margin data).
    const firstCompletion = inbound ? inbound.travelCompletedAt === null : true;
    if (firstCompletion) {
      await tx.member.update({
        where: { id: member.id },
        data: { completedTrips: { increment: 1 }, lastActivityAt: new Date() },
      });
    }
    const newTrips = member.completedTrips + (firstCompletion ? 1 : 0);

    let outcome: TripOutcome = "NOT_REFERRED";
    let welcomePaid = 0;
    let referrerReward = 0;
    const resultReferrerId = inbound?.referrerId ?? member.referredById ?? null;

    if (inbound && inbound.status === "REWARDED") {
      outcome = "ALREADY_REWARDED";
    } else if (inbound) {
      const referrerId = inbound.referrerId;

      // Persist the completion inputs on the canonical referral row.
      await tx.referral.update({
        where: { id: inbound.id },
        data: {
          travelCompletedAt: inbound.travelCompletedAt ?? new Date(),
          bookingValue,
          tripMargin,
          rewardEligible: true,
        },
      });

      if (bookingValue === null) {
        outcome = "NEEDS_DATA";
        await tx.referral.update({ where: { id: inbound.id }, data: { status: "NEEDS_DATA" } });
      } else if (bookingValue < MIN_WELCOME_BOOKING) {
        outcome = "BELOW_FLOOR"; // travelled, but the booking is too small to earn a welcome
      } else {
        // ── Friend's welcome — one per person, ever ──
        const alreadyWelcomed =
          (await tx.creditEntry.count({ where: { memberId: member.id, reason: "WELCOME_BONUS" } })) > 0;
        if (!alreadyWelcomed) {
          await tx.creditEntry.create({
            data: {
              memberId: member.id,
              amount: WELCOME_BONUS,
              reason: "WELCOME_BONUS",
              note: "Referred-friend welcome",
              approvedBy: "SYSTEM_AUTO",
            },
          });
          await tx.member.update({
            where: { id: member.id },
            data: { creditBalance: { increment: WELCOME_BONUS }, lastActivityAt: new Date() },
          });
          welcomePaid = WELCOME_BONUS;
        }
        outcome = "WELCOME_PAID";
        await tx.referral.update({ where: { id: inbound.id }, data: { status: "WELCOME_PAID" } });

        // ── Referrer reward — ₹25k floor + margin guard (WI-14a auto-decision) ──
        if (bookingValue >= MIN_QUALIFYING_BOOKING) {
          if (tripMargin === null || tripMargin <= 0) {
            outcome = "NEEDS_DATA";
            await tx.referral.update({ where: { id: inbound.id }, data: { status: "NEEDS_DATA" } });
          } else {
            const referrer = await tx.member.findUnique({
              where: { id: referrerId },
              select: { id: true, tier: true, completedTrips: true },
            });
            const reward = referrerRewardForTier(referrer?.tier ?? "EXPLORER");
            const guardCap = (MARGIN_GUARD_PCT / 100) * tripMargin;
            if (reward <= guardCap) {
              await tx.creditEntry.create({
                data: {
                  memberId: referrerId,
                  amount: reward,
                  reason: "REFERRAL_REWARD",
                  note: `${member.name} completed their trip`,
                  approvedBy: "SYSTEM_AUTO",
                },
              });
              await tx.member.update({
                where: { id: referrerId },
                data: { creditBalance: { increment: reward }, lastActivityAt: new Date() },
              });
              await tx.referral.update({
                where: { id: inbound.id },
                data: { status: "REWARDED", rewardAmount: reward },
              });
              referrerReward = reward;
              outcome = "REWARDED";
              // This referral now counts toward the referrer's tier.
              const referrerRewarded = await tx.referral.count({
                where: { referrerId, status: "REWARDED" },
              });
              await tx.member.update({
                where: { id: referrerId },
                data: {
                  tier: maxTier(
                    referrer?.tier ?? "EXPLORER",
                    tierForMember(referrerRewarded, referrer?.completedTrips ?? 0)
                  ),
                },
              });
            } else {
              outcome = "REJECTED_MARGIN";
              await tx.referral.update({ where: { id: inbound.id }, data: { status: "REJECTED_MARGIN" } });
            }
          }
        }
      }
    }

    // Re-evaluate the member's OWN tier (their completed-trip count may have grown).
    const ownRewarded = await tx.referral.count({ where: { referrerId: member.id, status: "REWARDED" } });
    const newOwnTier = maxTier(member.tier, tierForMember(ownRewarded, newTrips));
    if (newOwnTier !== member.tier) {
      await tx.member.update({ where: { id: member.id }, data: { tier: newOwnTier } });
    }

    return { outcome, welcomePaid, referrerReward, referrerId: resultReferrerId };
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
 * referral. Best-effort attribution used by the enquiry API (ENQUIRED), signup
 * (PENDING + refereeMemberId → "Joined") and the admin "mark booked" step (BOOKED);
 * the money-moving REWARDED transition happens in completeMemberTrip's transaction.
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
