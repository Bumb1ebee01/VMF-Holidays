import { describe, it, expect } from "vitest";
import {
  matchTrips,
  customBudgetChoice,
  summariseAnswers,
  BUDGET_TIERS,
  type FinderDestination,
  type FinderPackage,
  type QuizAnswers,
} from "@/lib/trip-finder";

const dest = (
  slug: string,
  region: "domestic" | "international",
  tags: string[],
  fromPrice: number
): FinderDestination => ({ slug, name: slug, region, tags, fromPrice } as FinderDestination);

const pkg = (
  destinationSlug: string,
  overrides: Partial<FinderPackage> = {}
): FinderPackage =>
  ({
    slug: `${destinationSlug}-pkg`,
    destinationSlug,
    category: "leisure",
    fromPrice: 30000,
    featured: false,
    ...overrides,
  }) as FinderPackage;

const answers = (over: Partial<QuizAnswers> = {}): QuizAnswers => ({
  vibe: "beach",
  who: "couple",
  region: "any",
  budget: { min: 0, max: Infinity, label: "any" },
  ...over,
});

describe("matchTrips — the no-filler promise", () => {
  it("returns nothing rather than padding when no destination fits the vibe", () => {
    // Edwin's firm rule: never show a trip that doesn't genuinely match the
    // chosen vibe, even if that means showing zero results.
    const destinations = [dest("manali", "domestic", ["Mountains", "Snow"], 25000)];
    expect(matchTrips(answers({ vibe: "beach" }), destinations, [pkg("manali")])).toEqual([]);
  });

  it("only ever returns destinations that share at least one vibe tag", () => {
    const destinations = [
      dest("goa", "domestic", ["Beaches", "Nightlife"], 20000),
      dest("manali", "domestic", ["Mountains"], 25000),
      dest("maldives", "international", ["Beaches", "Islands"], 90000),
    ];
    const packages = [pkg("goa"), pkg("manali"), pkg("maldives")];
    const results = matchTrips(answers({ vibe: "beach" }), destinations, packages);

    expect(results.map((r) => r.destination.slug).sort()).toEqual(["goa", "maldives"]);
    expect(results.every((r) => r.destination.tags.some((t) => ["Beaches", "Islands"].includes(t)))).toBe(true);
  });

  it("returns at most three trips", () => {
    const destinations = ["a", "b", "c", "d", "e"].map((s) =>
      dest(s, "domestic", ["Beaches"], 20000)
    );
    const packages = destinations.map((d) => pkg(d.slug));
    expect(matchTrips(answers(), destinations, packages)).toHaveLength(3);
  });
});

describe("matchTrips — hard filters", () => {
  it("never sells a destination with no packages", () => {
    const destinations = [dest("goa", "domestic", ["Beaches"], 20000)];
    expect(matchTrips(answers(), destinations, [])).toEqual([]);
  });

  it("honours an explicit region choice", () => {
    const destinations = [
      dest("goa", "domestic", ["Beaches"], 20000),
      dest("maldives", "international", ["Beaches"], 90000),
    ];
    const packages = [pkg("goa"), pkg("maldives")];

    const domestic = matchTrips(answers({ region: "domestic" }), destinations, packages);
    expect(domestic.map((r) => r.destination.slug)).toEqual(["goa"]);

    const intl = matchTrips(answers({ region: "international" }), destinations, packages);
    expect(intl.map((r) => r.destination.slug)).toEqual(["maldives"]);
  });

  it("ignores region entirely on 'surprise me'", () => {
    const destinations = [
      dest("goa", "domestic", ["Beaches"], 20000),
      dest("maldives", "international", ["Beaches"], 90000),
    ];
    const results = matchTrips(answers({ region: "any" }), destinations, [pkg("goa"), pkg("maldives")]);
    expect(results).toHaveLength(2);
  });
});

describe("matchTrips — scoring", () => {
  it("ranks a stronger vibe match above a weaker one", () => {
    const destinations = [
      dest("weak", "domestic", ["Beaches"], 20000),
      dest("strong", "domestic", ["Beaches", "Islands", "Diving"], 20000),
    ];
    const results = matchTrips(answers(), destinations, [pkg("weak"), pkg("strong")]);
    expect(results[0].destination.slug).toBe("strong");
  });

  it("puts an in-budget trip ahead of an equally-matched over-budget one", () => {
    const destinations = [
      dest("pricey", "domestic", ["Beaches"], 90000),
      dest("affordable", "domestic", ["Beaches"], 30000),
    ];
    const budget = { min: 25000, max: 40000, label: "₹25–40k" };
    const results = matchTrips(answers({ budget }), destinations, [pkg("pricey"), pkg("affordable")]);
    expect(results[0].destination.slug).toBe("affordable");
  });

  it("still surfaces an over-budget trip when its vibe match is far stronger", () => {
    // Budget is a soft signal (−4), so three vibe hits (+15) can outweigh it.
    const destinations = [
      dest("perfect-pricey", "domestic", ["Beaches", "Islands", "Diving"], 90000),
      dest("weak-cheap", "domestic", ["Beaches"], 30000),
    ];
    const budget = { min: 25000, max: 40000, label: "₹25–40k" };
    const results = matchTrips(answers({ budget }), destinations, [
      pkg("perfect-pricey"),
      pkg("weak-cheap"),
    ]);
    expect(results[0].destination.slug).toBe("perfect-pricey");
  });

  it("breaks a tie on the lower price", () => {
    const destinations = [
      dest("dearer", "domestic", ["Beaches"], 50000),
      dest("cheaper", "domestic", ["Beaches"], 20000),
    ];
    const results = matchTrips(answers(), destinations, [pkg("dearer"), pkg("cheaper")]);
    expect(results[0].destination.slug).toBe("cheaper");
  });

  it("prefers a featured package, then the most accessible price", () => {
    const destinations = [dest("goa", "domestic", ["Beaches"], 20000)];
    const packages = [
      pkg("goa", { slug: "cheap", fromPrice: 15000 }),
      pkg("goa", { slug: "featured", fromPrice: 40000, featured: true }),
    ];
    expect(matchTrips(answers(), destinations, packages)[0].pkg.slug).toBe("featured");
  });
});

describe("matchTrips — result copy", () => {
  it("gives every result a pitch and at most three reasons", () => {
    const destinations = [dest("goa", "domestic", ["Beaches", "Nightlife"], 20000)];
    const results = matchTrips(answers({ region: "domestic" }), destinations, [pkg("goa")]);
    for (const r of results) {
      expect(r.pitch.length).toBeGreaterThan(0);
      expect(r.pitch).toContain(r.destination.name);
      expect(r.reasons.length).toBeLessThanOrEqual(3);
    }
  });
});

describe("budget helpers", () => {
  it("treats the top of the custom slider as open-ended", () => {
    const top = customBudgetChoice(200000);
    expect(top.max).toBe(Infinity);
    expect(top.label).toContain("2L+");
  });

  it("caps a mid-range choice at the chosen figure", () => {
    const mid = customBudgetChoice(40000);
    expect(mid.max).toBe(40000);
    expect(mid.label).toBe("Up to ₹40k");
  });

  it("offers budget tiers that ascend without gaps in the labels", () => {
    expect(BUDGET_TIERS.length).toBeGreaterThan(0);
    for (const tier of BUDGET_TIERS) {
      expect(tier.label.length).toBeGreaterThan(0);
      expect(tier.max).toBeGreaterThan(tier.min);
    }
  });
});

describe("summariseAnswers", () => {
  it("recaps the vibe and who in second person", () => {
    const line = summariseAnswers(answers({ vibe: "beach", who: "couple", region: "international" }));
    expect(line).toContain("beaches and downtime");
    expect(line).toContain("for the two of you");
    expect(line).toContain("somewhere abroad");
  });

  it("says nothing about region on 'surprise me'", () => {
    const line = summariseAnswers(answers({ region: "any" }));
    expect(line).not.toContain("India");
    expect(line).not.toContain("abroad");
  });
});
