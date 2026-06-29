// ─────────────────────────────────────────────────────────────────────────────
// VMF Holidays Travellers Club — configuration + pure helpers.
// Amounts are in "VMF Credits", where 1 credit = ₹1 (CREDIT_TO_INR). Credits are
// redeemable against a future booking. Tune these as the program matures (later
// these can move to an admin-editable settings row).
// ─────────────────────────────────────────────────────────────────────────────

/** Credits given to the REFERRER when a person they referred completes a booking. */
export const REFERRAL_REWARD = 2500;
/** Credits given to the REFEREE on their own first booking (welcome bonus). */
export const WELCOME_BONUS = 1500;
/** Minimum credit balance a member must hold before any redemption is allowed. */
export const MIN_REDEMPTION = 1000;
/** Credit can cover at most this percentage of a single trip's value. */
export const MAX_REDEMPTION_PCT = 10;
/** Rupee value of one credit. */
export const CREDIT_TO_INR = 1;

export type MemberTierValue = "EXPLORER" | "VOYAGER" | "GLOBETROTTER" | "AMBASSADOR";

export const TIERS: { tier: MemberTierValue; label: string; minReferrals: number }[] = [
  { tier: "EXPLORER", label: "Explorer", minReferrals: 0 },
  { tier: "VOYAGER", label: "Voyager", minReferrals: 1 },
  { tier: "GLOBETROTTER", label: "Globetrotter", minReferrals: 3 },
  { tier: "AMBASSADOR", label: "Ambassador", minReferrals: 5 },
];

/** The tier earned for a given number of successful (booked) referrals. */
export function tierForReferrals(successfulReferrals: number): MemberTierValue {
  let earned: MemberTierValue = "EXPLORER";
  for (const t of TIERS) {
    if (successfulReferrals >= t.minReferrals) earned = t.tier;
  }
  return earned;
}

/** Human label for a stored tier value. */
export function tierLabel(tier: string): string {
  return TIERS.find((t) => t.tier === tier)?.label ?? "Explorer";
}

/** Format a credit amount as rupees (e.g. 2500 -> "₹2,500"). */
export function creditsToRupees(credits: number): string {
  return `₹${(credits * CREDIT_TO_INR).toLocaleString("en-IN")}`;
}

/**
 * Build a short, unambiguous referral code from a name (no easily-confused
 * characters). The caller must ensure uniqueness against the database.
 */
export function generateReferralCode(name: string): string {
  const base = (name.replace(/[^a-zA-Z]/g, "").slice(0, 4) || "VMF").toUpperCase();
  const rand = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()
    .replace(/[O0I1L]/g, "X");
  return `${base}${rand}`;
}

/** Absolute share link for a referral code. */
export function referralLink(siteUrl: string, code: string): string {
  return `${siteUrl}/travellers-club?ref=${encodeURIComponent(code)}`;
}
