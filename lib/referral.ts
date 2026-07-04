// ─────────────────────────────────────────────────────────────────────────────
// VMF Holidays Travellers Club — configuration + pure helpers.
// SINGLE SOURCE OF TRUTH for the locked economics (see the Travellers Club dev
// spec §1/§4/§7). 1 credit = ₹1 (CREDIT_TO_INR). Never hardcode any of these
// amounts in components or server actions — always import them from here.
// ─────────────────────────────────────────────────────────────────────────────

/** Rupee value of one credit. */
export const CREDIT_TO_INR = 1;

// ── Locked economics (§1) ─────────────────────────────────────────────────────
/** Credits granted on signup (below the redemption floor, so not cashable alone). */
export const JOIN_BONUS = 250;
/** Referred friend's first-trip welcome credit. */
export const WELCOME_BONUS = 1000;
/** A booking must be at least this value for the friend's welcome to qualify. */
export const MIN_WELCOME_BOOKING = 5000;
/** A booking must be at least this value for the referrer reward to qualify. */
export const MIN_QUALIFYING_BOOKING = 25000;
/** Referrer reward must be ≤ this percentage of the trip's margin (margin guard). */
export const MARGIN_GUARD_PCT = 20;
/** Minimum credit balance a member must hold before any redemption is allowed. */
export const MIN_REDEMPTION = 1000;
/** Credit can cover at most this percentage of a single DOMESTIC trip's value. */
export const CAP_DOMESTIC_PCT = 5;
/** Credit can cover at most this percentage of a single INTERNATIONAL trip's value. */
export const CAP_INTERNATIONAL_PCT = 10;
/** Credit expires this many months after a member's last activity. */
export const CREDIT_VALIDITY_MONTHS = 24;
/** A pending (never-rewarded) referral is swept to EXPIRED after this many months. */
export const PENDING_REFERRAL_EXPIRY_MONTHS = 18;
/** Lifetime cap on engagement credit a single member can earn (WI-13). */
export const ENGAGEMENT_LIFETIME_CAP = 500;

/**
 * Hoarding safety valve (§4) — off by default. If set to a positive number,
 * referrer rewards beyond that lifetime total stop accruing (the referral still
 * completes and the friend still gets their welcome).
 */
export const MAX_LIFETIME_REFERRER_REWARD: number | null = null;

/**
 * Back-compat alias for older callers that imported a single redemption cap.
 * Defaults to the international cap; prefer CAP_DOMESTIC_PCT / CAP_INTERNATIONAL_PCT.
 */
export const MAX_REDEMPTION_PCT = CAP_INTERNATIONAL_PCT;

/** First-touch referral attribution cookie, set by proxy.ts (WI-1). */
export const REF_COOKIE = "vmf_ref";
/** How long the first-touch referral cookie persists, in days. */
export const REF_COOKIE_DAYS = 60;

// ── Tiers (§4) — one data-driven table is the single source of truth ──────────
// Each row carries everything about a tier: its unlock thresholds, HOW those
// thresholds combine (`mode`), the referrer reward earned at that tier, and its
// perks. The reward map and the Ambassador rule below are *derived* from this
// table so they can never drift out of sync.
//
//   mode "either" → unlock on completed trips OR successful referrals. This is
//                   what lets a loyal traveller and an active referrer both climb
//                   without doing the other.
//   mode "both"   → unlock needs BOTH thresholds (Ambassador only) — it can never
//                   be reached on one metric alone.
export type MemberTierValue = "EXPLORER" | "VOYAGER" | "NAVIGATOR" | "AMBASSADOR";
export type TierMode = "either" | "both";

export type TierRow = {
  tier: MemberTierValue;
  label: string;
  minReferrals: number; // successful (REWARDED) referrals threshold
  minTrips: number; // completed trips threshold
  mode: TierMode;
  referrerReward: number; // INR paid to a referrer who is at this tier
  perks: string[];
};

export const TIERS: TierRow[] = [
  {
    tier: "EXPLORER",
    label: "Explorer",
    minReferrals: 0,
    minTrips: 0,
    mode: "either",
    referrerReward: 2000,
    perks: ["Members' WhatsApp community", "Your referral link + rewards", "₹250 join credit"],
  },
  {
    tier: "VOYAGER",
    label: "Voyager",
    minReferrals: 3,
    minTrips: 1,
    mode: "either",
    referrerReward: 2000,
    perks: ["Voyager status"],
  },
  {
    tier: "NAVIGATOR",
    label: "Navigator",
    minReferrals: 5,
    minTrips: 3,
    mode: "either",
    referrerReward: 2500,
    perks: ["Early access to new deals"],
  },
  {
    tier: "AMBASSADOR",
    label: "Ambassador",
    minReferrals: 10,
    minTrips: 5,
    mode: "both",
    referrerReward: 3000,
    perks: ["Earliest access to deals", "Featured as a VMF Ambassador (with consent)"],
  },
];

/** Referrer reward by tier, derived from the tier table (§4). */
export const REFERRER_REWARD_BY_TIER = Object.fromEntries(
  TIERS.map((t) => [t.tier, t.referrerReward])
) as Record<MemberTierValue, number>;

/** Base/headline referrer reward (Explorer tier) — used for marketing copy. */
export const REFERRAL_REWARD = REFERRER_REWARD_BY_TIER.EXPLORER;

/** Ambassador AND-thresholds, derived from the tier table (§7 named config). */
export const AMBASSADOR_RULE = (() => {
  const a = TIERS.find((t) => t.tier === "AMBASSADOR")!;
  return { minTrips: a.minTrips, minReferrals: a.minReferrals };
})();

/** Whether a member with these totals qualifies for a given tier row. */
function meetsTier(t: TierRow, successfulReferrals: number, completedTrips: number): boolean {
  const hasReferrals = successfulReferrals >= t.minReferrals;
  const hasTrips = completedTrips >= t.minTrips;
  return t.mode === "both" ? hasReferrals && hasTrips : hasReferrals || hasTrips;
}

/**
 * The tier a member has earned — the highest tier whose rule they satisfy.
 * Evaluated highest-first, so the result is correct regardless of how the
 * thresholds are tuned. Tiers never downgrade: callers should persist
 * maxTier(currentTier, tierForMember(...)).
 */
export function tierForMember(successfulReferrals: number, completedTrips: number): MemberTierValue {
  for (let i = TIERS.length - 1; i >= 0; i -= 1) {
    if (meetsTier(TIERS[i], successfulReferrals, completedTrips)) return TIERS[i].tier;
  }
  return "EXPLORER";
}

/** Back-compat wrapper (referrals only). Prefer tierForMember(referrals, trips). */
export function tierForReferrals(successfulReferrals: number): MemberTierValue {
  return tierForMember(successfulReferrals, 0);
}

/** Ordinal rank of a tier (0 = Explorer). Unknown tiers rank as Explorer. */
export function tierRank(tier: string): number {
  const i = TIERS.findIndex((t) => t.tier === tier);
  return i < 0 ? 0 : i;
}

/** The higher of two tiers — used to enforce the never-downgrade rule. */
export function maxTier(a: string, b: string): MemberTierValue {
  return (tierRank(a) >= tierRank(b) ? a : b) as MemberTierValue;
}

/** The row for a stored tier value (falls back to Explorer). */
export function tierRow(tier: string): TierRow {
  return TIERS.find((t) => t.tier === tier) ?? TIERS[0];
}

/** The next tier up from `current`, or null if already at the top. */
export function nextTier(current: string): TierRow | null {
  const i = TIERS.findIndex((t) => t.tier === current);
  return i >= 0 && i < TIERS.length - 1 ? TIERS[i + 1] : null;
}

/** Human label for a stored tier value. */
export function tierLabel(tier: string): string {
  return tierRow(tier).label;
}

/** Referrer reward for a given tier value (falls back to the base reward). */
export function referrerRewardForTier(tier: string): number {
  return REFERRER_REWARD_BY_TIER[tier as MemberTierValue] ?? REFERRAL_REWARD;
}

export type TierProgress = {
  current: TierRow;
  next: TierRow | null;
  /** How many more of each metric are needed for the next tier (0 if already met). */
  remaining: { referrals: number; trips: number };
  /** Progress toward the next tier, 0..1 (1 when already at the top tier). */
  fraction: number;
  /** Ready-to-render nudge, e.g. "1 more trip or 3 more referrals to Voyager". */
  hint: string | null;
};

/**
 * Everything the dashboard needs to render tier progress (WI-4): the current tier,
 * the next one, what's left, a bar fraction, and a plain-language nudge. For an
 * "either" next tier the bar tracks the CLOSEST metric (you only need one); for a
 * "both" tier it tracks the LAGGING metric (both must land).
 */
export function tierProgress(successfulReferrals: number, completedTrips: number): TierProgress {
  const current = tierRow(tierForMember(successfulReferrals, completedTrips));
  const next = nextTier(current.tier);
  if (!next) {
    return { current, next: null, remaining: { referrals: 0, trips: 0 }, fraction: 1, hint: null };
  }

  const remaining = {
    referrals: Math.max(0, next.minReferrals - successfulReferrals),
    trips: Math.max(0, next.minTrips - completedTrips),
  };
  const refFrac = next.minReferrals > 0 ? Math.min(1, successfulReferrals / next.minReferrals) : 1;
  const tripFrac = next.minTrips > 0 ? Math.min(1, completedTrips / next.minTrips) : 1;
  const fraction = next.mode === "both" ? Math.min(refFrac, tripFrac) : Math.max(refFrac, tripFrac);

  const parts: string[] = [];
  if (remaining.trips > 0) parts.push(`${remaining.trips} more ${remaining.trips === 1 ? "trip" : "trips"}`);
  if (remaining.referrals > 0) {
    parts.push(`${remaining.referrals} more ${remaining.referrals === 1 ? "referral" : "referrals"}`);
  }
  const hint = parts.length
    ? `${parts.join(next.mode === "both" ? " and " : " or ")} to ${next.label}`
    : null;

  return { current, next, remaining, fraction, hint };
}

/** Just the "X to next tier" nudge string (null at the top tier). */
export function nextTierHint(successfulReferrals: number, completedTrips: number): string | null {
  return tierProgress(successfulReferrals, completedTrips).hint;
}

/**
 * Credit actually usable on one trip: min(balance, cap% of trip value), where the
 * cap is 5% (domestic) / 10% (international). Returns 0 while the balance is below
 * the MIN_REDEMPTION floor. This resolves the floor-vs-cap deadlock and powers the
 * "usable on this trip" surface (WI-3 / WI-18C).
 */
export function redeemableForTrip(balance: number, tripValue: number, international: boolean): number {
  if (balance < MIN_REDEMPTION) return 0;
  const pct = international ? CAP_INTERNATIONAL_PCT : CAP_DOMESTIC_PCT;
  const cap = Math.floor((pct / 100) * Math.max(0, tripValue));
  return Math.max(0, Math.min(balance, cap));
}

// ── Engagement tasks (WI-13, config-driven) ───────────────────────────────────
export type EngagementVerify = "auto" | "manual";
// `url`, when present, is the official place the member goes to do the task (e.g.
// our Instagram). The dashboard opens it when they claim; and because a follow/tag
// can't be verified programmatically, those tasks are `manual` so an admin confirms
// (or rejects with a reason) before the credit lands.
export type EngagementTask = { key: string; label: string; credit: number; verify: EngagementVerify; url?: string };

const INSTAGRAM_URL = "https://www.instagram.com/vmfholidays/";

/** One-time light actions that earn small credit. Total capped at ENGAGEMENT_LIFETIME_CAP. */
export const ENGAGEMENT_TASKS: EngagementTask[] = [
  { key: "PROFILE_STYLES", label: "Complete profile + pick travel styles", credit: 50, verify: "auto" },
  { key: "WHATSAPP_VERIFY", label: "Verify WhatsApp & join the community", credit: 100, verify: "auto" },
  { key: "BIRTHDAY", label: "Add birthday / anniversary", credit: 50, verify: "auto" },
  { key: "TRIP_TESTIMONIAL", label: "Submit post-trip testimonial + photos", credit: 250, verify: "manual" },
  { key: "FOLLOW_SOCIAL", label: "Follow us on Instagram", credit: 100, verify: "manual", url: INSTAGRAM_URL },
  { key: "TRIP_UGC", label: "Tag VMF in a trip post", credit: 100, verify: "manual", url: INSTAGRAM_URL },
];

// ── Travel styles (WI-7) — keys align to the WhatsApp community categories ─────
export const TRAVEL_STYLES = [
  { key: "FAMILY_CIRCLE", label: "Family Circle" },
  { key: "COUPLES_CLUB", label: "Couples Club" },
  { key: "SOLO_SQUAD", label: "Solo Squad" },
  { key: "YOUNG_EXPLORERS", label: "Young Explorers" },
  { key: "ADVENTURE_TRIBE", label: "Adventure Tribe" },
  { key: "CULTURE_FAITH", label: "Culture & Faith" },
] as const;

// ── Achievement badges (WI-8) ─────────────────────────────────────────────────
/** Members who joined before this date count as "Founding Members" (WI-8). */
export const FOUNDING_MEMBER_UNTIL = new Date("2026-10-02T00:00:00Z");

export const BADGES = [
  { key: "FIRST_REFERRAL", label: "First Referral", criteria: "A friend joins via your link" },
  { key: "FIRST_BOOKING_EARNED", label: "First Booking Earned", criteria: "A referred friend completes a qualifying trip" },
  { key: "TRIP_ONE", label: "Trip One", criteria: "Complete your first VMF trip" },
  { key: "FREQUENT_TRAVELLER", label: "Frequent Traveller", criteria: "Complete 3 trips" },
  { key: "SUPER_REFERRER", label: "Super Referrer", criteria: "5 qualifying referrals" },
  { key: "FOUNDING_MEMBER", label: "Founding Member", criteria: "Joined in the first 90 days" },
] as const;

// ── Pure helpers ──────────────────────────────────────────────────────────────
/** Canonical stored form of a referral code (trimmed, uppercased, capped). */
export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().slice(0, 32);
}

/**
 * A referrer's public label shown to the friend they invited: first name + last
 * initial (e.g. "Aarav S."). Never exposes a full surname.
 */
export function referrerLabel(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "a friend";
  const first = parts[0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0]!.toUpperCase() : "";
  return lastInitial ? `${first} ${lastInitial}.` : first;
}

/**
 * A referred friend's masked label shown to their referrer: first initial + last
 * name (e.g. "Aarav Sharma" → "A. Sharma"). Never exposes their first name or any
 * contact detail (WI-16 privacy rule). Falls back to a generic label with no name.
 */
export function maskReferee(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Friend via link";
  const firstInitial = parts[0][0]!.toUpperCase();
  return parts.length === 1 ? `${firstInitial}.` : `${firstInitial}. ${parts[parts.length - 1]}`;
}

/** Format a credit amount as rupees (e.g. 2000 -> "₹2,000"). */
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
