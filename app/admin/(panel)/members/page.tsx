import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { creditsToRupees, tierLabel } from "@/lib/referral";
import { formatDate } from "@/lib/utils";
import { IconInbox } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Members" };
export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("members:view");
  const { q } = await searchParams;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { referralCode: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const members = await db.member.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 300,
    select: {
      id: true,
      name: true,
      email: true,
      referralCode: true,
      tier: true,
      creditBalance: true,
      createdAt: true,
      _count: { select: { referredMembers: true } },
    },
  });

  const totalCredit = members.reduce((sum, m) => sum + m.creditBalance, 0);

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Travellers Club</p>
          <h1 className={shared.pageTitle}>Members</h1>
          <p className={shared.pageSub}>
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
      </div>

      <div className={shared.statGrid}>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{members.length}</div>
          <div className={shared.statLabel}>Members</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{creditsToRupees(totalCredit)}</div>
          <div className={shared.statLabel}>Credit outstanding</div>
        </div>
      </div>

      <div className={shared.panel}>
        {members.length === 0 ? (
          <div className={shared.emptyState}>
            <IconInbox size={28} />
            <p>No members yet. They appear here once people join the Travellers Club.</p>
          </div>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Code</th>
                <th>Tier</th>
                <th>Referred</th>
                <th>Credit</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Link href={`/admin/members/${m.id}`} className={shared.rowLink}>
                      {m.name}
                    </Link>
                  </td>
                  <td>{m.email}</td>
                  <td>{m.referralCode}</td>
                  <td>{tierLabel(m.tier)}</td>
                  <td>{m._count.referredMembers}</td>
                  <td>{creditsToRupees(m.creditBalance)}</td>
                  <td>{formatDate(m.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
