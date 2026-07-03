import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/member";
import { APP_URL } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  creditsToRupees,
  tierLabel,
  tierProgress,
  referralLink,
  MIN_REDEMPTION,
  CAP_DOMESTIC_PCT,
  CAP_INTERNATIONAL_PCT,
  REFERRAL_REWARD,
  WELCOME_BONUS,
} from "@/lib/referral";
import ReferralShare from "@/components/club/ReferralShare";
import RedemptionForm from "@/components/club/RedemptionForm";
import { logoutMember } from "../actions";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Your Travellers Club Dashboard",
  alternates: { canonical: "/travellers-club/dashboard" },
  robots: { index: false },
};

const REASON_LABEL: Record<string, string> = {
  JOIN_BONUS: "Join bonus",
  REFERRAL_REWARD: "Referral reward",
  WELCOME_BONUS: "Welcome bonus",
  ENGAGEMENT: "Engagement",
  REDEMPTION: "Redeemed on booking",
  ADJUSTMENT: "Adjustment",
  EXPIRY: "Expired",
};

const REFERRAL_STATUS_LABEL: Record<string, string> = {
  PENDING: "Joined",
  ENQUIRED: "Enquired",
  BOOKED: "Booked",
  WELCOME_PAID: "Travelled",
  REWARDED: "Rewarded",
  REJECTED_MARGIN: "Travelled",
  NEEDS_DATA: "In review",
  EXPIRED: "Expired",
  REJECTED: "Closed",
};

const REDEMPTION_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  APPLIED: "Applied",
  REJECTED: "Rejected",
  REVERSED: "Reversed",
};

export default async function ClubDashboardPage() {
  const member = await requireMember();

  const [referred, ledger, referrals, redemptions] = await Promise.all([
    db.member.findMany({
      where: { referredById: member.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    }),
    db.creditEntry.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, amount: true, reason: true, note: true, createdAt: true },
    }),
    db.referral.findMany({
      where: { referrerId: member.id },
      select: { refereeMemberId: true, status: true },
    }),
    db.redemptionRequest.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, amount: true, packageNote: true, status: true, createdAt: true },
    }),
  ]);

  const link = referralLink(APP_URL, member.referralCode);
  const statusByReferee = new Map(
    referrals.filter((r) => r.refereeMemberId).map((r) => [r.refereeMemberId as string, r.status])
  );
  const successful = referrals.filter((r) => r.status === "REWARDED").length;
  const tier = tierProgress(successful, member.completedTrips);
  const canRedeem = member.creditBalance >= MIN_REDEMPTION;
  const toRedeem = Math.max(MIN_REDEMPTION - member.creditBalance, 0);
  const communityUrl = process.env.WHATSAPP_COMMUNITY_URL;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <header className={styles.header}>
          <div>
            <span className="eyebrow">Travellers Club</span>
            <h1 className={styles.hello}>Hi, {member.name.split(" ")[0]}</h1>
            <span className={styles.tierBadge}>{tierLabel(member.tier)} member</span>
          </div>
          <form action={logoutMember}>
            <button type="submit" className={`btn btn-outline ${styles.logoutBtn}`}>Log out</button>
          </form>
        </header>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statPrimary}`}>
            <span className={styles.statLabel}>VMF Credit balance</span>
            <span className={styles.statValue}>{creditsToRupees(member.creditBalance)}</span>
            <span className={styles.statHint}>
              {canRedeem
                ? "Ready to redeem on your next booking"
                : `Earn ${creditsToRupees(toRedeem)} more to start redeeming`}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Friends referred</span>
            <span className={styles.statValue}>{referred.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Rewarded referrals</span>
            <span className={styles.statValue}>{successful}</span>
          </div>
        </div>

        <section className={styles.sectionCard}>
          <div className={styles.tierHead}>
            <div>
              <h2 className={styles.sectionTitle}>Your tier</h2>
              <span className={styles.tierNow}>{tier.current.label}</span>
            </div>
            <span className={styles.tierReward}>{creditsToRupees(tier.current.referrerReward)} per referral</span>
          </div>
          {tier.next ? (
            <>
              <div
                className={styles.tierBar}
                role="progressbar"
                aria-valuenow={Math.round(tier.fraction * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress to ${tier.next.label}`}
              >
                <span className={styles.tierBarFill} style={{ width: `${Math.round(tier.fraction * 100)}%` }} />
              </div>
              <p className={styles.tierHint}>{tier.hint}</p>
            </>
          ) : (
            <p className={styles.tierHint}>You&apos;ve reached our top tier — thank you for being a VMF Ambassador.</p>
          )}
          <ul className={styles.perks}>
            {tier.current.perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Redeem your credit</h2>
          {canRedeem ? (
            <>
              <p className={styles.sectionSub}>
                Apply your VMF credit to a trip — up to {CAP_DOMESTIC_PCT}% of a domestic trip or{" "}
                {CAP_INTERNATIONAL_PCT}% of an international one. Clean requests apply straight away; the rest
                our team confirms with your booking.
              </p>
              <RedemptionForm balance={member.creditBalance} />
            </>
          ) : (
            <p className={styles.sectionSub}>
              Redeeming starts at {creditsToRupees(MIN_REDEMPTION)}. Earn {creditsToRupees(toRedeem)} more to
              unlock it.
            </p>
          )}
          {redemptions.length > 0 && (
            <div className={styles.list} style={{ marginTop: 8 }}>
              {redemptions.map((r) => (
                <div key={r.id} className={styles.listRow}>
                  <div>
                    <span className={styles.rowName}>
                      {creditsToRupees(r.amount)}
                      {r.packageNote ? ` · ${r.packageNote}` : ""}
                    </span>
                    <span className={styles.rowMeta}>{formatDate(r.createdAt)}</span>
                  </div>
                  <span className={styles.status}>{REDEMPTION_STATUS_LABEL[r.status] ?? r.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Your referral link</h2>
          <p className={styles.sectionSub}>
            Share this link. When a friend joins and books, you earn{" "}
            <strong>{creditsToRupees(REFERRAL_REWARD)}</strong> and they get{" "}
            <strong>{creditsToRupees(WELCOME_BONUS)}</strong> off their first trip.
          </p>
          <ReferralShare link={link} />
          <p className={styles.codeLine}>
            Your code: <strong>{member.referralCode}</strong>
          </p>
        </section>

        {communityUrl && (
          <a href={communityUrl} target="_blank" rel="noopener noreferrer" className={styles.community}>
            <strong>Join the WhatsApp Travellers Club →</strong>
            <span>Exclusive deals, early access and trip inspiration for members.</span>
          </a>
        )}

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Friends you&apos;ve referred</h2>
          {referred.length === 0 ? (
            <p className={styles.empty}>No referrals yet — share your link above to get started.</p>
          ) : (
            <div className={styles.list}>
              {referred.map((r) => (
                <div key={r.id} className={styles.listRow}>
                  <div>
                    <span className={styles.rowName}>{r.name}</span>
                    <span className={styles.rowMeta}>Joined {formatDate(r.createdAt)}</span>
                  </div>
                  <span
                    className={`${styles.status} ${statusByReferee.get(r.id) === "REWARDED" ? styles.statusBooked : styles.statusPending}`}
                  >
                    {REFERRAL_STATUS_LABEL[statusByReferee.get(r.id) ?? "PENDING"] ?? "Joined"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Credit history</h2>
          {ledger.length === 0 ? (
            <p className={styles.empty}>No credit yet. Refer a friend or book a trip to start earning.</p>
          ) : (
            <div className={styles.list}>
              {ledger.map((e) => (
                <div key={e.id} className={styles.listRow}>
                  <div>
                    <span className={styles.rowName}>{REASON_LABEL[e.reason] ?? e.reason}</span>
                    <span className={styles.rowMeta}>
                      {formatDate(e.createdAt)}
                      {e.note ? ` · ${e.note}` : ""}
                    </span>
                  </div>
                  <span className={`${styles.amount} ${e.amount < 0 ? styles.neg : styles.pos}`}>
                    {e.amount < 0 ? "−" : "+"}
                    {creditsToRupees(Math.abs(e.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className={styles.fineprint}>
          Credit is redeemable from {creditsToRupees(MIN_REDEMPTION)} against any VMF Holidays package, applied by
          our team when you book. Rewards are confirmed once a referred friend completes a paid booking.
        </p>
      </div>
    </div>
  );
}
