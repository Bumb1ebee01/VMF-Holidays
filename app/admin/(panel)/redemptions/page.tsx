import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { creditsToRupees } from "@/lib/referral";
import { formatDate } from "@/lib/utils";
import RedemptionActions from "@/components/admin/RedemptionActions";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Redemptions" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  APPLIED: "Applied",
  REJECTED: "Rejected",
  REVERSED: "Reversed",
};

export default async function RedemptionsPage() {
  await requirePermission("members:manage");

  const requests = await db.redemptionRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { member: { select: { id: true, name: true, creditBalance: true } } },
  });
  const queue = requests.filter((r) => r.status === "PENDING" || r.status === "APPROVED");
  const history = requests.filter((r) => r.status !== "PENDING" && r.status !== "APPROVED");

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <h1 className={shared.pageTitle}>Redemptions</h1>
          <p className={shared.pageSub}>
            Members redeeming VMF credit against a trip. Clean, in-cap requests apply automatically; the
            rest wait here for a decision.
          </p>
        </div>
      </div>

      <div className={shared.card}>
        <h3 className={shared.cardTitle}>Needs action ({queue.length})</h3>
        {queue.length === 0 ? (
          <p className={shared.cardSub}>Nothing waiting — clean requests apply on their own.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr><th>Member</th><th>Amount</th><th>Trip</th><th>Type</th><th>Requested</th><th style={{ textAlign: "right" }}>Action</th></tr>
            </thead>
            <tbody>
              {queue.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/members/${r.member.id}`} className={shared.rowLink}>{r.member.name}</Link>
                    <div className={shared.cardSub}>balance {creditsToRupees(r.member.creditBalance)}</div>
                  </td>
                  <td>{creditsToRupees(r.amount)}</td>
                  <td>{r.packageNote ?? "—"}</td>
                  <td>{r.tripType ?? "—"}</td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td style={{ textAlign: "right" }}><RedemptionActions id={r.id} status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={shared.card} style={{ marginTop: 16 }}>
        <h3 className={shared.cardTitle}>History</h3>
        {history.length === 0 ? (
          <p className={shared.cardSub}>No resolved redemptions yet.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr><th>Member</th><th>Amount</th><th>Trip</th><th>Status</th><th>Resolved</th><th style={{ textAlign: "right" }}>Action</th></tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.id}>
                  <td><Link href={`/admin/members/${r.member.id}`} className={shared.rowLink}>{r.member.name}</Link></td>
                  <td>{creditsToRupees(r.amount)}</td>
                  <td>{r.packageNote ?? "—"}</td>
                  <td>{STATUS_LABEL[r.status] ?? r.status}</td>
                  <td>{r.resolvedAt ? formatDate(r.resolvedAt) : "—"}</td>
                  <td style={{ textAlign: "right" }}><RedemptionActions id={r.id} status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
