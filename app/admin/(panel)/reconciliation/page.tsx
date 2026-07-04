import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { creditsToRupees, tierLabel } from "@/lib/referral";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Reconciliation" };
export const dynamic = "force-dynamic";

// Outstanding-credit report + top-20 standing balances (§2 #9 / WI-18B).
export default async function ReconciliationPage() {
  await requirePermission("members:manage");

  const [outstanding, issued, spent, topBalances, pendingReferrals, pendingRedemptions] = await Promise.all([
    db.member.aggregate({ _sum: { creditBalance: true } }),
    db.creditEntry.aggregate({ _sum: { amount: true }, where: { amount: { gt: 0 } } }),
    db.creditEntry.aggregate({ _sum: { amount: true }, where: { amount: { lt: 0 } } }),
    db.member.findMany({
      orderBy: { creditBalance: "desc" },
      take: 20,
      select: { id: true, name: true, tier: true, creditBalance: true },
    }),
    db.referral.count({ where: { status: { in: ["PENDING", "ENQUIRED", "BOOKED"] } } }),
    db.redemptionRequest.count({ where: { status: "PENDING" } }),
  ]);

  const totalOutstanding = outstanding._sum.creditBalance ?? 0;
  const totalIssued = issued._sum.amount ?? 0;
  const totalSpent = Math.abs(spent._sum.amount ?? 0);

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <h1 className={shared.pageTitle}>Reconciliation</h1>
          <p className={shared.pageSub}>
            Outstanding VMF credit liability and the members carrying the largest balances, so nothing becomes
            a surprise (§2 #9).
          </p>
        </div>
      </div>

      <div className={shared.statGrid}>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{creditsToRupees(totalOutstanding)}</div>
          <div className={shared.statLabel}>Outstanding credit</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{creditsToRupees(totalIssued)}</div>
          <div className={shared.statLabel}>Total ever issued</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{creditsToRupees(totalSpent)}</div>
          <div className={shared.statLabel}>Redeemed / expired</div>
        </div>
      </div>

      <div className={shared.statGrid} style={{ marginTop: 12 }}>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{pendingReferrals}</div>
          <div className={shared.statLabel}>Pending referrals</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{pendingRedemptions}</div>
          <div className={shared.statLabel}>Redemptions to review</div>
        </div>
      </div>

      <div className={shared.card} style={{ marginTop: 16 }}>
        <h3 className={shared.cardTitle}>Top 20 standing balances</h3>
        {topBalances.length === 0 ? (
          <p className={shared.cardSub}>No members yet.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr><th>Member</th><th>Tier</th><th>Balance</th></tr>
            </thead>
            <tbody>
              {topBalances.map((m) => (
                <tr key={m.id}>
                  <td><Link href={`/admin/members/${m.id}`} className={shared.rowLink}>{m.name}</Link></td>
                  <td>{tierLabel(m.tier)}</td>
                  <td>{creditsToRupees(m.creditBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
