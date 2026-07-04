import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { creditsToRupees, tierLabel, TRAVEL_STYLES } from "@/lib/referral";
import { formatDate } from "@/lib/utils";
import MemberCreditForms from "@/components/admin/MemberCreditForms";
import shared from "@/components/admin/shared.module.css";
import styles from "./member.module.css";

export const dynamic = "force-dynamic";

const REASON_LABEL: Record<string, string> = {
  JOIN_BONUS: "Join bonus",
  REFERRAL_REWARD: "Referral reward",
  WELCOME_BONUS: "Welcome bonus",
  ENGAGEMENT: "Engagement",
  REDEMPTION: "Redeemed on booking",
  ADJUSTMENT: "Adjustment",
  EXPIRY: "Expired",
};

// Maps a Referral's lifecycle status to a plain label for the admin table.
const REF_STATUS_LABEL: Record<string, string> = {
  PENDING: "Joined",
  ENQUIRED: "Enquired",
  BOOKED: "Booked",
  WELCOME_PAID: "Travelled",
  REWARDED: "Rewarded",
  REJECTED_MARGIN: "Travelled",
  NEEDS_DATA: "Needs data",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
};

const STYLE_LABEL: Record<string, string> = Object.fromEntries(TRAVEL_STYLES.map((s) => [s.key, s.label]));

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requirePermission("members:view");
  const { id } = await params;

  const member = await db.member.findUnique({
    where: { id },
    include: {
      referredBy: { select: { id: true, name: true } },
      referredMembers: {
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, createdAt: true },
      },
      referrals: { select: { refereeMemberId: true, status: true } },
      credits: { orderBy: { createdAt: "desc" }, take: 25 },
    },
  });
  if (!member) notFound();

  const canManage = can(actor, "members:manage");
  const rewardedCount = member.referrals.filter((r) => r.status === "REWARDED").length;
  const statusByReferee = new Map(
    member.referrals
      .filter((r) => r.refereeMemberId)
      .map((r) => [r.refereeMemberId as string, r.status])
  );

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>
            <Link href="/admin/members" className={styles.back}>← Members</Link>
          </p>
          <h1 className={shared.pageTitle}>{member.name}</h1>
          <p className={shared.pageSub}>
            {tierLabel(member.tier)} · joined {formatDate(member.createdAt)}
          </p>
        </div>
      </div>

      <div className={shared.statGrid}>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{creditsToRupees(member.creditBalance)}</div>
          <div className={shared.statLabel}>Credit balance</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{member.referredMembers.length}</div>
          <div className={shared.statLabel}>Referred</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{rewardedCount}</div>
          <div className={shared.statLabel}>Rewarded referrals</div>
        </div>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}><span className={styles.metaLabel}>Email</span><span>{member.email}</span></div>
        <div className={styles.metaItem}><span className={styles.metaLabel}>Phone</span><span>{member.phone}</span></div>
        <div className={styles.metaItem}><span className={styles.metaLabel}>Referral code</span><span>{member.referralCode}</span></div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Referred by</span>
          <span>
            {member.referredBy ? (
              <Link href={`/admin/members/${member.referredBy.id}`} className={shared.rowLink}>{member.referredBy.name}</Link>
            ) : (
              "—"
            )}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Trips completed</span>
          <span>{member.completedTrips}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Travel styles</span>
          <span>
            {member.travelStyles.length
              ? member.travelStyles.map((k) => STYLE_LABEL[k] ?? k).join(", ")
              : "—"}
          </span>
        </div>
      </div>

      {canManage && (
        <div className={styles.section}>
          <MemberCreditForms memberId={member.id} />
        </div>
      )}

      <div className={`${shared.card} ${styles.section}`}>
        <h3 className={shared.cardTitle}>Referred friends</h3>
        {member.referredMembers.length === 0 ? (
          <p className={shared.cardSub}>No referrals yet.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr><th>Name</th><th>Joined</th><th>Status</th></tr>
            </thead>
            <tbody>
              {member.referredMembers.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/members/${r.id}`} className={shared.rowLink}>{r.name}</Link>
                  </td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>{REF_STATUS_LABEL[statusByReferee.get(r.id) ?? "PENDING"] ?? "Joined"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={`${shared.card} ${styles.section}`}>
        <h3 className={shared.cardTitle}>Credit history</h3>
        {member.credits.length === 0 ? (
          <p className={shared.cardSub}>No credit activity yet.</p>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr><th>Date</th><th>Reason</th><th>Note</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {member.credits.map((c) => (
                <tr key={c.id}>
                  <td>{formatDate(c.createdAt)}</td>
                  <td>{REASON_LABEL[c.reason] ?? c.reason}</td>
                  <td>{c.note ?? "—"}</td>
                  <td>{c.amount < 0 ? "−" : "+"}{creditsToRupees(Math.abs(c.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
