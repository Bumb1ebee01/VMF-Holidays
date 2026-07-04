import { db } from "@/lib/db";
import { CREDIT_VALIDITY_MONTHS, PENDING_REFERRAL_EXPIRY_MONTHS } from "@/lib/referral";

// Scheduled liability sweeps for the Travellers Club (WI-12). Both are idempotent,
// so re-running is harmless.

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

/**
 * Expire credit for members inactive for CREDIT_VALIDITY_MONTHS. Writes a negative
 * EXPIRY ledger entry equal to the remaining balance and zeroes it. Members with no
 * recorded activity (null lastActivityAt) are left alone.
 */
export async function expireCredits(): Promise<{ members: number; total: number }> {
  const cutoff = monthsAgo(CREDIT_VALIDITY_MONTHS);
  const stale = await db.member.findMany({
    where: { creditBalance: { gt: 0 }, lastActivityAt: { not: null, lt: cutoff } },
    select: { id: true },
  });

  let members = 0;
  let total = 0;
  for (const m of stale) {
    const expired = await db.$transaction(async (tx) => {
      // Re-read inside the tx so a concurrent earn/redeem can't be clobbered.
      const fresh = await tx.member.findUnique({ where: { id: m.id }, select: { creditBalance: true } });
      if (!fresh || fresh.creditBalance <= 0) return 0;
      await tx.creditEntry.create({
        data: {
          memberId: m.id,
          amount: -fresh.creditBalance,
          reason: "EXPIRY",
          note: `Credit expired after ${CREDIT_VALIDITY_MONTHS} months of inactivity`,
          approvedBy: "SYSTEM_AUTO",
        },
      });
      await tx.member.update({ where: { id: m.id }, data: { creditBalance: 0 } });
      return fresh.creditBalance;
    });
    if (expired > 0) {
      members += 1;
      total += expired;
    }
  }
  return { members, total };
}

/**
 * Expire pending (never-rewarded) referrals older than PENDING_REFERRAL_EXPIRY_MONTHS
 * with no completed travel — clears the referrer's dangling reward liability. No
 * credit is issued or reversed. WELCOME_PAID is excluded (the friend already
 * travelled and got their welcome).
 */
export async function expirePendingReferrals(): Promise<{ expired: number }> {
  const cutoff = monthsAgo(PENDING_REFERRAL_EXPIRY_MONTHS);
  const res = await db.referral.updateMany({
    where: {
      status: { in: ["PENDING", "ENQUIRED", "BOOKED"] },
      travelCompletedAt: null,
      createdAt: { lt: cutoff },
    },
    data: { status: "EXPIRED" },
  });
  return { expired: res.count };
}
