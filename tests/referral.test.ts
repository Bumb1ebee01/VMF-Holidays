import { describe, it, expect } from "vitest";
import {
  TIERS,
  MIN_REDEMPTION,
  CAP_DOMESTIC_PCT,
  CAP_INTERNATIONAL_PCT,
  tierForMember,
  tierRank,
  maxTier,
  tierRow,
  nextTier,
  referrerRewardForTier,
  balanceCapForTier,
  grantableCredit,
  redeemableForTrip,
  normalizeCode,
  referrerLabel,
  maskReferee,
  creditsToRupees,
  generateReferralCode,
  referralLink,
} from "@/lib/referral";

describe("tier qualification", () => {
  it("starts everyone at Explorer", () => {
    expect(tierForMember(0, 0)).toBe("EXPLORER");
  });

  it("requires BOTH referrals and trips — referrals alone are not enough", () => {
    // Every tier uses mode "both". A member with plenty of referrals but no
    // completed trips must not climb; this is the guardrail against paying out
    // on referrals that never turned into travel.
    expect(tierForMember(10, 0)).toBe("EXPLORER");
    expect(tierForMember(100, 0)).toBe("EXPLORER");
  });

  it("requires BOTH — trips alone are not enough either", () => {
    expect(tierForMember(0, 10)).toBe("EXPLORER");
  });

  it("promotes exactly at the threshold, not before", () => {
    expect(tierForMember(2, 1)).toBe("EXPLORER");
    expect(tierForMember(3, 1)).toBe("VOYAGER");
    expect(tierForMember(5, 3)).toBe("NAVIGATOR");
    expect(tierForMember(10, 5)).toBe("AMBASSADOR");
  });

  it("awards the highest tier the member qualifies for", () => {
    expect(tierForMember(50, 50)).toBe("AMBASSADOR");
  });

  it("holds a member at the lower tier when only one side of the rule is met", () => {
    expect(tierForMember(10, 4)).toBe("NAVIGATOR");
    expect(tierForMember(9, 5)).toBe("NAVIGATOR");
  });
});

describe("tier ordering and the never-downgrade rule", () => {
  it("ranks tiers in ascending order", () => {
    expect(tierRank("EXPLORER")).toBe(0);
    expect(tierRank("AMBASSADOR")).toBe(TIERS.length - 1);
  });

  it("treats an unknown stored tier as Explorer rather than throwing", () => {
    expect(tierRank("PLATINUM")).toBe(0);
    expect(tierRow("PLATINUM").tier).toBe("EXPLORER");
    expect(balanceCapForTier("PLATINUM")).toBe(TIERS[0].maxBalance);
  });

  it("keeps the higher of two tiers, so a member never drops", () => {
    expect(maxTier("NAVIGATOR", "EXPLORER")).toBe("NAVIGATOR");
    expect(maxTier("EXPLORER", "NAVIGATOR")).toBe("NAVIGATOR");
    expect(maxTier("AMBASSADOR", "AMBASSADOR")).toBe("AMBASSADOR");
  });

  it("has no next tier above Ambassador", () => {
    expect(nextTier("AMBASSADOR")).toBeNull();
    expect(nextTier("EXPLORER")?.tier).toBe("VOYAGER");
  });
});

describe("tier table integrity", () => {
  it("never lowers a threshold, reward or cap as tiers climb", () => {
    // A mis-edit here would quietly let a lower tier out-earn a higher one.
    for (let i = 1; i < TIERS.length; i += 1) {
      const prev = TIERS[i - 1];
      const cur = TIERS[i];
      expect(cur.minReferrals, `${cur.tier} referrals`).toBeGreaterThanOrEqual(prev.minReferrals);
      expect(cur.minTrips, `${cur.tier} trips`).toBeGreaterThanOrEqual(prev.minTrips);
      expect(cur.referrerReward, `${cur.tier} reward`).toBeGreaterThanOrEqual(prev.referrerReward);
      expect(cur.maxBalance, `${cur.tier} cap`).toBeGreaterThanOrEqual(prev.maxBalance);
    }
  });

  it("falls back to the base reward for an unknown tier", () => {
    expect(referrerRewardForTier("PLATINUM")).toBe(TIERS[0].referrerReward);
    expect(referrerRewardForTier("AMBASSADOR")).toBe(3000);
  });
});

describe("grantableCredit — the balance cap", () => {
  it("grants the full amount when there's room", () => {
    expect(grantableCredit(0, 2000, "EXPLORER")).toBe(2000);
  });

  it("grants only the headroom when the award would breach the cap", () => {
    // Explorer caps at 10,000: a 2,000 award on a 9,000 balance yields 1,000.
    expect(grantableCredit(9000, 2000, "EXPLORER")).toBe(1000);
  });

  it("grants nothing once the member is at the cap", () => {
    expect(grantableCredit(10000, 2000, "EXPLORER")).toBe(0);
  });

  it("never returns a negative grant if the balance is somehow over the cap", () => {
    expect(grantableCredit(12000, 2000, "EXPLORER")).toBe(0);
  });

  it("gives a higher tier more room for the same award", () => {
    expect(grantableCredit(10000, 5000, "AMBASSADOR")).toBeGreaterThan(
      grantableCredit(10000, 5000, "EXPLORER")
    );
  });
});

describe("redeemableForTrip — the floor and the per-trip cap", () => {
  it("returns nothing below the minimum redemption floor", () => {
    expect(redeemableForTrip(MIN_REDEMPTION - 1, 100000, false)).toBe(0);
  });

  it("allows redemption exactly at the floor", () => {
    expect(redeemableForTrip(MIN_REDEMPTION, 100000, false)).toBeGreaterThan(0);
  });

  it("caps domestic trips at the domestic percentage", () => {
    // 5% of ₹100,000 = ₹5,000, even though the member holds more.
    expect(redeemableForTrip(20000, 100000, false)).toBe((CAP_DOMESTIC_PCT / 100) * 100000);
  });

  it("caps international trips at the higher international percentage", () => {
    expect(redeemableForTrip(20000, 100000, true)).toBe((CAP_INTERNATIONAL_PCT / 100) * 100000);
  });

  it("never offers more than the member actually holds", () => {
    // 10% of ₹100,000 would be ₹10,000, but they only have ₹3,000.
    expect(redeemableForTrip(3000, 100000, true)).toBe(3000);
  });

  it("returns a whole number of rupees, never a fraction", () => {
    expect(Number.isInteger(redeemableForTrip(20000, 33333, false))).toBe(true);
  });

  it("handles a zero or negative trip value without going negative", () => {
    expect(redeemableForTrip(20000, 0, false)).toBe(0);
    expect(redeemableForTrip(20000, -5000, false)).toBe(0);
  });
});

describe("privacy helpers", () => {
  it("shows a referrer as first name + last initial, never the full surname", () => {
    expect(referrerLabel("Aarav Sharma")).toBe("Aarav S.");
    expect(referrerLabel("Aarav Sharma")).not.toContain("Sharma");
  });

  it("handles a single name and an empty name", () => {
    expect(referrerLabel("Aarav")).toBe("Aarav");
    expect(referrerLabel("   ")).toBe("a friend");
  });

  it("masks a referee as initial + surname, never revealing their first name", () => {
    expect(maskReferee("Aarav Sharma")).toBe("A. Sharma");
    expect(maskReferee("Aarav Sharma")).not.toContain("Aarav");
  });

  it("falls back to a generic label when the referee has no name", () => {
    expect(maskReferee(null)).toBe("Friend via link");
    expect(maskReferee(undefined)).toBe("Friend via link");
    expect(maskReferee("")).toBe("Friend via link");
  });

  it("reveals nothing but an initial for a single-name referee", () => {
    expect(maskReferee("Aarav")).toBe("A.");
  });
});

describe("referral codes and links", () => {
  it("normalises a code to trimmed uppercase", () => {
    expect(normalizeCode("  aarav12  ")).toBe("AARAV12");
  });

  it("caps a code at 32 characters", () => {
    expect(normalizeCode("x".repeat(50))).toHaveLength(32);
  });

  it("generates a code with no easily-confused characters in the random part", () => {
    for (let i = 0; i < 200; i += 1) {
      const code = generateReferralCode("Aarav Sharma");
      expect(code.startsWith("AARA")).toBe(true);
      // O/0/I/1/L are substituted out of the random suffix to avoid misreads.
      expect(code.slice(4)).not.toMatch(/[O0I1L]/);
    }
  });

  it("falls back to a VMF prefix when a name has no letters", () => {
    expect(generateReferralCode("12345").startsWith("VMF")).toBe(true);
  });

  it("url-encodes the code in a share link", () => {
    expect(referralLink("https://vmfholidays.com", "AARA X1")).toBe(
      "https://vmfholidays.com/travellers-club?ref=AARA%20X1"
    );
  });

  it("formats credits in Indian digit grouping", () => {
    expect(creditsToRupees(2000)).toBe("₹2,000");
    expect(creditsToRupees(100000)).toBe("₹1,00,000");
  });
});
