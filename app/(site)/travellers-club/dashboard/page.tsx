import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/member";
import { APP_URL } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  creditsToRupees,
  tierLabel,
  tierProgress,
  tierRank,
  referralLink,
  referrerLabel,
  TIERS,
  BADGES,
  MIN_REDEMPTION,
  REFERRAL_REWARD,
  WELCOME_BONUS,
  CAP_DOMESTIC_PCT,
  CAP_INTERNATIONAL_PCT,
} from "@/lib/referral";
import ReferralShare from "@/components/club/ReferralShare";
import { logoutMember } from "../actions";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Your Travellers Club Dashboard",
  alternates: { canonical: "/travellers-club/dashboard" },
  robots: { index: false },
};

const REASON_LABEL: Record<string, string> = {
  REFERRAL_REWARD: "Referral reward",
  WELCOME_BONUS: "Welcome bonus",
  JOIN_BONUS: "Join bonus",
  REDEMPTION: "Redeemed on booking",
  ADJUSTMENT: "Adjustment",
  EXPIRY: "Expired",
};

function initials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase() || "•";
}

export default async function ClubDashboardPage() {
  const member = await requireMember();

  const [referred, ledger, earnedAgg] = await Promise.all([
    db.member.findMany({
      where: { referredById: member.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true, firstBookingAt: true },
    }),
    db.creditEntry.findMany({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, amount: true, reason: true, note: true, createdAt: true },
    }),
    db.creditEntry.aggregate({
      where: { memberId: member.id, reason: "REFERRAL_REWARD" },
      _sum: { amount: true },
    }),
  ]);

  const link = referralLink(APP_URL, member.referralCode);
  const successful = referred.filter((r) => r.firstBookingAt).length;
  const creditsEarned = earnedAgg._sum.amount ?? 0;
  const tier = tierProgress(successful, member.completedTrips);
  const canRedeem = member.creditBalance >= MIN_REDEMPTION;
  const toRedeem = Math.max(MIN_REDEMPTION - member.creditBalance, 0);
  const communityUrl = process.env.WHATSAPP_COMMUNITY_URL;

  const currentIdx = tierRank(member.tier);
  const seg = 100 / (TIERS.length - 1);
  const fillPct = Math.min(100, currentIdx * seg + (tier.next ? tier.fraction * seg : 0));

  const redeemHref = `https://wa.me/917499322412?text=${encodeURIComponent(
    `Hi VMF! I'd like to redeem my Travellers Club credit (balance ${creditsToRupees(
      member.creditBalance,
    )}, code ${member.referralCode}).`,
  )}`;

  const earned: Record<string, boolean> = {
    FIRST_REFERRAL: referred.length >= 1,
    FIRST_BOOKING_EARNED: successful >= 1,
    TRIP_ONE: member.completedTrips >= 1,
    FREQUENT_TRAVELLER: member.completedTrips >= 3,
    SUPER_REFERRER: successful >= 5,
    FOUNDING_MEMBER: true,
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <span className="eyebrow">Travellers Club</span>
            <h1 className={styles.hello}>Welcome back, {member.name.split(" ")[0]}.</h1>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.tierPill}>{tierLabel(member.tier)}</span>
            <form action={logoutMember}>
              <button type="submit" className={styles.logoutBtn}>Log out</button>
            </form>
          </div>
        </header>

        {/* Row 1 — share + balance */}
        <div className={styles.topGrid}>
          <section className={styles.shareCard}>
            <p className={styles.shareEyebrow}>Your referral link</p>
            <p className={styles.shareLead}>
              Share it anywhere. Friends get <strong>{creditsToRupees(WELCOME_BONUS)} off</strong> their first trip —
              you earn <strong>{creditsToRupees(REFERRAL_REWARD)}</strong> in travel credit when they book.
            </p>
            <ReferralShare link={link} />
            <p className={styles.codeTag}>
              Your code: <strong>{member.referralCode}</strong> · friends can also type it at signup
            </p>
          </section>

          <section className={styles.balCard}>
            <p className={styles.cardLabel}>Your VMF Credit</p>
            <p className={styles.balAmt}>{creditsToRupees(member.creditBalance)}</p>
            <span className={styles.balHint}>
              {canRedeem
                ? "Ready to redeem on your next booking"
                : `Earn ${creditsToRupees(toRedeem)} more to start redeeming`}
            </span>
            <p className={styles.balNote}>
              Redeemable from {creditsToRupees(MIN_REDEMPTION)} · up to {CAP_DOMESTIC_PCT}% of a domestic trip /{" "}
              {CAP_INTERNATIONAL_PCT}% international.
            </p>
            <div className={styles.divider} />
            {canRedeem ? (
              <a href={redeemHref} target="_blank" rel="noopener noreferrer" className={styles.redeemBtn}>
                Request redemption
              </a>
            ) : (
              <button type="button" className={styles.redeemBtn} disabled>
                Redeem from {creditsToRupees(MIN_REDEMPTION)}
              </button>
            )}
          </section>
        </div>

        {/* Row 2 — tier track */}
        <section className={styles.tierCard}>
          <div className={styles.tierHead}>
            <p className={styles.cardLabel}>Your tier</p>
            <span className={styles.tierMeta}>
              {member.completedTrips} trip{member.completedTrips === 1 ? "" : "s"} · {successful} booked referral
              {successful === 1 ? "" : "s"}
            </span>
          </div>
          <div className={styles.track}>
            <div className={styles.trackLine} />
            <div className={styles.trackFill} style={{ width: `${fillPct}%` }} />
            <div className={styles.nodes}>
              {TIERS.map((t, i) => (
                <div key={t.tier} className={`${styles.node} ${i <= currentIdx ? styles.nodeOn : ""}`}>
                  <span className={styles.nodeDot} />
                  <span className={styles.nodeLabel}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className={styles.nudge}>
            {tier.hint ? `Just ${tier.hint} — keep sharing your link.` : "You've reached our top tier — thank you for being a VMF Ambassador."}
          </p>
        </section>

        {/* Row 3 — referrals */}
        <section className={styles.refCard}>
          <p className={styles.cardLabel}>Your referrals</p>
          <div className={styles.counters}>
            <div className={styles.counter}>
              <span className={styles.counterN}>{referred.length}</span>
              <span className={styles.counterL}>Friends joined</span>
            </div>
            <div className={styles.counter}>
              <span className={styles.counterN}>{successful}</span>
              <span className={styles.counterL}>Booked</span>
            </div>
            <div className={styles.counter}>
              <span className={styles.counterN}>{creditsToRupees(creditsEarned)}</span>
              <span className={styles.counterL}>Credits earned</span>
            </div>
          </div>

          {referred.length === 0 ? (
            <p className={styles.empty}>No referrals yet — share your link above to get started.</p>
          ) : (
            <ul className={styles.refList}>
              {referred.map((r) => (
                <li key={r.id} className={styles.refRow}>
                  <span className={styles.refAvatar}>{initials(r.name)}</span>
                  <div className={styles.refInfo}>
                    <span className={styles.refName}>{referrerLabel(r.name)}</span>
                    <span className={styles.refNext}>
                      {r.firstBookingAt
                        ? "They've booked — your reward is on the way."
                        : `You'll earn ${creditsToRupees(REFERRAL_REWARD)} when they complete their first trip.`}
                    </span>
                  </div>
                  <div className={styles.refRight}>
                    <span className={`${styles.pill} ${r.firstBookingAt ? styles.pillBooked : styles.pillJoined}`}>
                      {r.firstBookingAt ? "Booked" : "Joined"}
                    </span>
                    <span className={styles.refDate}>{formatDate(r.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.privacy}>
            We only ever show a masked name — never a friend&apos;s phone, email, or full name.
          </p>
        </section>

        {/* Row 4 — how it works + badges */}
        <div className={styles.dualGrid}>
          <section className={styles.howCard}>
            <p className={styles.cardLabel}>How your VMF Credit works</p>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <span className={styles.stepNum}>1</span>
                <div>
                  <p className={styles.stepTitle}>Join</p>
                  <p className={styles.stepDesc}>Start with {creditsToRupees(250)} credit — a head start on your first reward.</p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>2</span>
                <div>
                  <p className={styles.stepTitle}>Share</p>
                  <p className={styles.stepDesc}>Send your link. Friends get {creditsToRupees(WELCOME_BONUS)} off their first trip.</p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>3</span>
                <div>
                  <p className={styles.stepTitle}>Earn</p>
                  <p className={styles.stepDesc}>
                    You get {creditsToRupees(REFERRAL_REWARD)} credit when a referred friend completes a qualifying trip.
                  </p>
                </div>
              </li>
            </ol>
            <details className={styles.more}>
              <summary>See the details</summary>
              <p className={styles.fine}>
                1 credit = ₹1. Redeem from {creditsToRupees(MIN_REDEMPTION)} against our standard holiday packages: up
                to {CAP_DOMESTIC_PCT}% of a domestic trip or {CAP_INTERNATIONAL_PCT}% of an international one, applied
                by our team when they confirm your booking. Credit is valid for 24 months from your last activity.
              </p>
            </details>
          </section>

          <section className={styles.badgeCard}>
            <p className={styles.cardLabel}>Achievements</p>
            <div className={styles.badges}>
              {BADGES.map((b) => {
                const isEarned = earned[b.key];
                return (
                  <div key={b.key} className={`${styles.badge} ${isEarned ? styles.badgeEarned : styles.badgeLocked}`}>
                    <span className={styles.badgeMark}>{isEarned ? "✓" : "•"}</span>
                    <p className={styles.badgeName}>{b.label}</p>
                    <p className={styles.badgeCriteria}>{isEarned ? "Earned" : b.criteria}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {communityUrl && (
          <a href={communityUrl} target="_blank" rel="noopener noreferrer" className={styles.community}>
            <strong>Join the WhatsApp Travellers Club →</strong>
            <span>Exclusive deals, early access and trip inspiration for members.</span>
          </a>
        )}

        {/* Credit history */}
        <section className={styles.ledgerCard}>
          <p className={styles.cardLabel}>Credit history</p>
          {ledger.length === 0 ? (
            <p className={styles.empty}>No credit yet. Refer a friend or book a trip to start earning.</p>
          ) : (
            ledger.map((e) => (
              <div key={e.id} className={styles.ledgerRow}>
                <div>
                  <span className={styles.ledgerName}>{REASON_LABEL[e.reason] ?? e.reason}</span>
                  <span className={styles.ledgerMeta}>
                    {formatDate(e.createdAt)}
                    {e.note ? ` · ${e.note}` : ""}
                  </span>
                </div>
                <span className={`${styles.amount} ${e.amount < 0 ? styles.neg : styles.pos}`}>
                  {e.amount < 0 ? "−" : "+"}
                  {creditsToRupees(Math.abs(e.amount))}
                </span>
              </div>
            ))
          )}
        </section>

        <p className={styles.fineprint}>
          Credit is redeemable from {creditsToRupees(MIN_REDEMPTION)} against any VMF Holidays package, applied by our
          team when you book. Rewards are confirmed once a referred friend completes a paid booking.
        </p>
      </div>
    </div>
  );
}
