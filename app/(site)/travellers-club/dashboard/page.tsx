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
  maskReferee,
  MIN_REDEMPTION,
  CAP_DOMESTIC_PCT,
  CAP_INTERNATIONAL_PCT,
  REFERRAL_REWARD,
  WELCOME_BONUS,
  JOIN_BONUS,
  MIN_QUALIFYING_BOOKING,
  CREDIT_VALIDITY_MONTHS,
  BADGES,
  FOUNDING_MEMBER_UNTIL,
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

const REDEMPTION_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  APPLIED: "Applied",
  REJECTED: "Rejected",
  REVERSED: "Reversed",
};

type ReferralRow = {
  status: string;
  refereeMemberId: string | null;
  travelCompletedAt: Date | null;
  rewardAmount: number | null;
};

// The stage pill shown for a referral (WI-16 ladder), derived from its status.
function referralPill(r: ReferralRow): string {
  if (r.status === "REWARDED") return "Rewarded";
  if (r.travelCompletedAt || r.status === "WELCOME_PAID" || r.status === "REJECTED_MARGIN") return "Travelled";
  if (r.status === "BOOKED") return "Booked";
  if (r.refereeMemberId) return "Joined";
  if (r.status === "ENQUIRED") return "Enquired";
  if (r.status === "EXPIRED") return "Expired";
  return "Invited";
}

// A plain-language "what's next" line for each referral.
function referralNext(r: ReferralRow): string {
  switch (r.status) {
    case "REWARDED":
      return `You earned ${creditsToRupees(r.rewardAmount ?? REFERRAL_REWARD)}.`;
    case "WELCOME_PAID":
      return `They travelled and got their welcome — this trip didn't reach ${creditsToRupees(MIN_QUALIFYING_BOOKING)}, so no reward this time.`;
    case "REJECTED_MARGIN":
      return "They travelled and got their welcome.";
    case "BOOKED":
      return `You'll earn ${creditsToRupees(REFERRAL_REWARD)} when they complete their trip.`;
    case "ENQUIRED":
      return "They've enquired — a friendly nudge might help them book.";
    case "EXPIRED":
      return "This referral lapsed without a trip.";
    case "NEEDS_DATA":
      return "We're confirming this reward.";
    default:
      return r.refereeMemberId
        ? `They've joined — you'll earn ${creditsToRupees(REFERRAL_REWARD)} when they travel.`
        : "Waiting for them to get started.";
  }
}

export default async function ClubDashboardPage() {
  const member = await requireMember();

  const [ledger, referrals, redemptions] = await Promise.all([
    db.creditEntry.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, amount: true, reason: true, note: true, createdAt: true },
    }),
    db.referral.findMany({
      where: { referrerId: member.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        refereeName: true,
        refereeMemberId: true,
        status: true,
        createdAt: true,
        rewardAmount: true,
        travelCompletedAt: true,
      },
    }),
    db.redemptionRequest.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, amount: true, packageNote: true, status: true, createdAt: true },
    }),
  ]);

  const link = referralLink(APP_URL, member.referralCode);
  const successful = referrals.filter((r) => r.status === "REWARDED").length;
  const joinedCount = referrals.filter((r) => r.refereeMemberId).length;
  const travelledCount = referrals.filter(
    (r) => r.travelCompletedAt || r.status === "WELCOME_PAID" || r.status === "REWARDED" || r.status === "REJECTED_MARGIN"
  ).length;
  const creditsEarned = referrals.reduce((sum, r) => sum + (r.status === "REWARDED" ? r.rewardAmount ?? 0 : 0), 0);
  const tier = tierProgress(successful, member.completedTrips);
  const canRedeem = member.creditBalance >= MIN_REDEMPTION;
  const toRedeem = Math.max(MIN_REDEMPTION - member.creditBalance, 0);
  const communityUrl = process.env.WHATSAPP_COMMUNITY_URL;

  // WI-8 badges — derived from the member's activity for display.
  const earned = new Set<string>();
  if (joinedCount >= 1) earned.add("FIRST_REFERRAL");
  if (successful >= 1) earned.add("FIRST_BOOKING_EARNED");
  if (member.completedTrips >= 1) earned.add("TRIP_ONE");
  if (member.completedTrips >= 3) earned.add("FREQUENT_TRAVELLER");
  if (successful >= 5) earned.add("SUPER_REFERRER");
  if (member.createdAt < FOUNDING_MEMBER_UNTIL) earned.add("FOUNDING_MEMBER");

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
            <span className={styles.statValue}>{referrals.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Rewarded referrals</span>
            <span className={styles.statValue}>{successful}</span>
          </div>
        </div>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Your referral link</h2>
          <p className={styles.sectionSub}>
            Share this link. When a friend joins and travels, you earn{" "}
            <strong>{creditsToRupees(REFERRAL_REWARD)}</strong> and they get{" "}
            <strong>{creditsToRupees(WELCOME_BONUS)}</strong> off their first trip.
          </p>
          <ReferralShare link={link} />
          <p className={styles.codeLine}>
            Your code: <strong>{member.referralCode}</strong>
          </p>
        </section>

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
          <h2 className={styles.sectionTitle}>Your referrals</h2>
          <div className={styles.trackerCounts}>
            <div className={styles.trackerStat}>
              <span className={styles.trackerNum}>{referrals.length}</span>
              <span className={styles.trackerLabel}>Referred</span>
            </div>
            <div className={styles.trackerStat}>
              <span className={styles.trackerNum}>{joinedCount}</span>
              <span className={styles.trackerLabel}>Joined</span>
            </div>
            <div className={styles.trackerStat}>
              <span className={styles.trackerNum}>{travelledCount}</span>
              <span className={styles.trackerLabel}>Travelled</span>
            </div>
            <div className={styles.trackerStat}>
              <span className={styles.trackerNum}>{creditsToRupees(creditsEarned)}</span>
              <span className={styles.trackerLabel}>Credits earned</span>
            </div>
          </div>
          {referrals.length === 0 ? (
            <div className={styles.empty}>
              <p>No referrals yet — share your link to get started.</p>
              <div style={{ marginTop: 12 }}>
                <ReferralShare link={link} />
              </div>
            </div>
          ) : (
            <div className={styles.list}>
              {referrals.map((r) => (
                <div key={r.id} className={styles.listRow}>
                  <div>
                    <span className={styles.rowName}>{maskReferee(r.refereeName)}</span>
                    <span className={styles.rowMeta}>{referralNext(r)}</span>
                  </div>
                  <span className={`${styles.status} ${r.status === "REWARDED" ? styles.statusBooked : styles.statusPending}`}>
                    {referralPill(r)}
                  </span>
                </div>
              ))}
            </div>
          )}
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
          <h2 className={styles.sectionTitle}>How your VMF Credit works</h2>
          <div className={styles.steps3}>
            <div className={styles.step3}>
              <span className={styles.stepNum}>1</span>
              <strong>Join</strong>
              <span>Start with {creditsToRupees(JOIN_BONUS)} credit, free.</span>
            </div>
            <div className={styles.step3}>
              <span className={styles.stepNum}>2</span>
              <strong>Share</strong>
              <span>Send your link to friends who love to travel.</span>
            </div>
            <div className={styles.step3}>
              <span className={styles.stepNum}>3</span>
              <strong>Earn</strong>
              <span>
                {creditsToRupees(REFERRAL_REWARD)} when a friend travels — they get {creditsToRupees(WELCOME_BONUS)} off.
              </span>
            </div>
          </div>
          <details className={styles.details}>
            <summary>See the details</summary>
            <p className={styles.detailsText}>
              1 Credit = ₹1. Redeem from {creditsToRupees(MIN_REDEMPTION)} against any standard holiday package —
              up to {CAP_DOMESTIC_PCT}% of a domestic trip or {CAP_INTERNATIONAL_PCT}% of an international one,
              applied by our team at booking. Credit is valid for {CREDIT_VALIDITY_MONTHS} months from your last
              activity. You earn {creditsToRupees(REFERRAL_REWARD)} each time a friend you referred completes
              their first qualifying trip of {creditsToRupees(MIN_QUALIFYING_BOOKING)} or more, and they get{" "}
              {creditsToRupees(WELCOME_BONUS)} off their first trip.
            </p>
          </details>
        </section>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Your badges</h2>
          <div className={styles.badges}>
            {BADGES.map((b) => {
              const got = earned.has(b.key);
              return (
                <div key={b.key} className={`${styles.badge} ${got ? styles.badgeOn : styles.badgeOff}`}>
                  <span className={styles.badgeIcon} aria-hidden="true">{got ? "★" : "☆"}</span>
                  <span className={styles.badgeName}>{b.label}</span>
                  <span className={styles.badgeCriteria}>{got ? "Earned" : b.criteria}</span>
                </div>
              );
            })}
          </div>
        </section>

        {communityUrl && (
          <a href={communityUrl} target="_blank" rel="noopener noreferrer" className={styles.community}>
            <strong>Join the WhatsApp Travellers Club →</strong>
            <span>Exclusive deals, early access and trip inspiration for members.</span>
          </a>
        )}

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
          our team when you book. Referral rewards are confirmed once a referred friend completes their trip.
        </p>
      </div>
    </div>
  );
}
