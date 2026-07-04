import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { creditsToRupees, ENGAGEMENT_TASKS } from "@/lib/referral";
import { formatDate } from "@/lib/utils";
import EngagementActions from "@/components/admin/EngagementActions";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Engagement" };
export const dynamic = "force-dynamic";

const TASK_LABEL: Record<string, string> = Object.fromEntries(ENGAGEMENT_TASKS.map((t) => [t.key, t.label]));
const STATUS_LABEL: Record<string, string> = { PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected" };

export default async function EngagementPage() {
  await requirePermission("members:manage");

  const claims = await db.engagementClaim.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { member: { select: { id: true, name: true } } },
  });
  const queue = claims.filter((c) => c.status === "PENDING");
  const history = claims.filter((c) => c.status !== "PENDING");

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <h1 className={shared.pageTitle}>Engagement</h1>
          <p className={shared.pageSub}>
            Manual engagement claims (testimonials, trip posts, social follows) awaiting review. Auto tasks
            credit on their own; the ₹500 lifetime cap is enforced at approval.
          </p>
        </div>
      </div>

      <div className={shared.card}>
        <h3 className={shared.cardTitle}>Needs review ({queue.length})</h3>
        {queue.length === 0 ? (
          <p className={shared.cardSub}>Nothing to review.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr><th>Member</th><th>Task</th><th>Credit</th><th>Submitted</th><th style={{ textAlign: "right" }}>Action</th></tr>
            </thead>
            <tbody>
              {queue.map((c) => (
                <tr key={c.id}>
                  <td><Link href={`/admin/members/${c.member.id}`} className={shared.rowLink}>{c.member.name}</Link></td>
                  <td>{TASK_LABEL[c.taskKey] ?? c.taskKey}</td>
                  <td>{creditsToRupees(c.credit)}</td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td style={{ textAlign: "right" }}><EngagementActions id={c.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={shared.card} style={{ marginTop: 16 }}>
        <h3 className={shared.cardTitle}>History</h3>
        {history.length === 0 ? (
          <p className={shared.cardSub}>No resolved claims yet.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr><th>Member</th><th>Task</th><th>Credit</th><th>Status</th><th>Resolved</th></tr>
            </thead>
            <tbody>
              {history.map((c) => (
                <tr key={c.id}>
                  <td><Link href={`/admin/members/${c.member.id}`} className={shared.rowLink}>{c.member.name}</Link></td>
                  <td>{TASK_LABEL[c.taskKey] ?? c.taskKey}</td>
                  <td>{creditsToRupees(c.credit)}</td>
                  <td>{STATUS_LABEL[c.status] ?? c.status}</td>
                  <td>{c.approvedAt ? formatDate(c.approvedAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
