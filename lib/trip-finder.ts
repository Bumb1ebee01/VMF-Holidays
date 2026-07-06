// ─────────────────────────────────────────────────────────────────────────────
// Trip Finder — pure matching logic for the "Not sure where to go?" mood quiz.
// Kept framework-free and side-effect-free so the scoring can be reasoned about
// (and unit-tested) in isolation from the React quiz UI.
//
// It scores the destinations that actually have at least one package against the
// visitor's four answers, then returns the top three — each paired with the most
// fitting package so every result ends on a concrete, enquirable trip.
// ─────────────────────────────────────────────────────────────────────────────

export type VibeId = "beach" | "mountains" | "culture" | "adventure" | "city";
export type WhoId = "couple" | "family" | "friends" | "group" | "solo";
export type RegionId = "domestic" | "international" | "any";

/** A resolved budget window (per person). Preset tiers and the custom slider both
 *  collapse to this shape so the matcher never cares which the visitor used. */
export interface BudgetChoice {
  min: number;
  max: number;
  label: string;
}

export interface QuizAnswers {
  vibe: VibeId;
  who: WhoId;
  budget: BudgetChoice;
  region: RegionId;
}

export interface FinderDestination {
  slug: string;
  name: string;
  country: string;
  region: "domestic" | "international";
  heroImage: string;
  fromPrice: number;
  blurb: string;
  tags: string[];
}

export interface FinderPackage {
  slug: string;
  title: string;
  destinationSlug: string;
  category: string;
  duration: string;
  fromPrice: number;
  priceOnRequest: boolean;
  heroImage: string;
  featured: boolean;
}

export interface FinderResult {
  destination: FinderDestination;
  pkg: FinderPackage;
  reasons: string[];
  /** A tailored one-liner explaining why this trip was matched to their answers. */
  pitch: string;
  score: number;
}

// Each vibe maps to the destination tag vocabulary already used in the data, so
// the quiz needs no new fields on Destination — it reads the existing `tags`.
const VIBE_TAGS: Record<VibeId, string[]> = {
  beach: ["Beaches", "Backwaters", "Islands", "Surfing", "Diving", "Water Sports"],
  mountains: ["Mountains", "Snow", "Trekking", "Nature", "Wildlife", "Houseboats"],
  culture: ["Heritage", "Culture", "Palaces", "Ayurveda", "Wine", "Street Food", "Wellness"],
  adventure: ["Adventure", "Water Sports", "Trekking", "Diving", "Surfing", "Desert"],
  city: ["City Break", "Shopping", "Luxury", "Nightlife", "Theme Parks"],
};

const WHO_TAGS: Record<WhoId, string[]> = {
  couple: ["Honeymoon", "Wellness"],
  family: ["Family", "Theme Parks"],
  friends: ["Nightlife", "Adventure"],
  group: ["Nightlife", "Adventure"],
  solo: [],
};

// Preferred package category for the "top package" pick — falls back to any of the
// destination's packages when the destination has none in that category.
const WHO_CATEGORY: Record<WhoId, string | null> = {
  couple: "honeymoon",
  family: "family",
  friends: "adventure",
  group: null,
  solo: null,
};

export interface BudgetTier extends BudgetChoice {
  icon: string;
}

// Preset tap tiers, cut to how Indian travellers actually shop (per person).
export const BUDGET_TIERS: BudgetTier[] = [
  { min: 15000, max: 25000, label: "₹15k – ₹25k", icon: "💸" },
  { min: 25000, max: 40000, label: "₹25k – ₹40k", icon: "💰" },
  { min: 40000, max: 75000, label: "₹40k – ₹75k", icon: "🌟" },
  { min: 75000, max: Infinity, label: "₹75k+", icon: "✨" },
];

// Bounds for the "set my own budget" slider (per person, ₹).
export const CUSTOM_BUDGET = { min: 15000, max: 200000, step: 5000, default: 40000 };

/** Turn a slider max into a matcher-ready budget window (a ceiling, so anything at
 *  or below the chosen amount fits). */
export function customBudgetChoice(max: number): BudgetChoice {
  const capped = max >= CUSTOM_BUDGET.max;
  return {
    min: 0,
    max: capped ? Infinity : max,
    label: capped ? "₹2L+ per person" : `Up to ₹${Math.round(max / 1000)}k`,
  };
}

const REGION_LABEL: Record<"domestic" | "international", string> = {
  domestic: "Right here in India",
  international: "An international escape",
};

// Human phrasing for the tailored "why this matched" line.
const VIBE_PHRASE: Record<VibeId, string> = {
  beach: "beaches and downtime",
  mountains: "mountains and the outdoors",
  culture: "culture and heritage",
  adventure: "adventure",
  city: "city buzz and shopping",
};

const WHO_PHRASE: Record<WhoId, string> = {
  couple: "for the two of you",
  family: "for the family",
  friends: "with your friends",
  group: "for your group",
  solo: "on a solo escape",
};

function buildPitch(
  d: FinderDestination,
  vibeHits: string[],
  inBudget: boolean,
  underBudget: boolean
): string {
  const hook = vibeHits.slice(0, 2).join(" and ").toLowerCase();
  const budgetClause = inBudget
    ? ", and it sits right in your budget"
    : underBudget
      ? ", and it comes in under your budget"
      : ", and we can shape the trip around your budget";
  return `${d.name} is loved for its ${hook}${budgetClause}.`;
}

/** One-line, second-person recap of what the visitor asked for — shown once above
 *  the results so the matches feel heard without repeating on every card. */
export function summariseAnswers(answers: QuizAnswers): string {
  const region =
    answers.region === "any"
      ? ""
      : answers.region === "domestic"
        ? ", here in India"
        : ", somewhere abroad";
  return `${VIBE_PHRASE[answers.vibe]} ${WHO_PHRASE[answers.who]}${region}`;
}

function pickTopPackage(pkgs: FinderPackage[], preferredCat: string | null): FinderPackage {
  const inCategory = preferredCat ? pkgs.filter((p) => p.category === preferredCat) : [];
  const pool = inCategory.length ? inCategory : pkgs;
  // Featured first, then the most accessible price so the headline trip feels within reach.
  return [...pool].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.fromPrice - b.fromPrice
  )[0];
}

export function matchTrips(
  answers: QuizAnswers,
  destinations: FinderDestination[],
  packages: FinderPackage[]
): FinderResult[] {
  const vibeTags = VIBE_TAGS[answers.vibe];
  const whoTags = WHO_TAGS[answers.who];
  const { min: budgetMin, max: budgetMax } = answers.budget;
  const preferredCat = WHO_CATEGORY[answers.who];

  const scored = destinations
    .map((d) => ({ d, pkgs: packages.filter((p) => p.destinationSlug === d.slug) }))
    .filter((x) => x.pkgs.length > 0) // only destinations we can actually sell
    // Region is an explicit choice, so honour it as a hard filter (unless "surprise me").
    .filter((x) => answers.region === "any" || x.d.region === answers.region)
    .map(({ d, pkgs }) => {
      const vibeHits = d.tags.filter((t) => vibeTags.includes(t));
      const whoHits = d.tags.filter((t) => whoTags.includes(t));
      const inBudget = d.fromPrice >= budgetMin && d.fromPrice <= budgetMax;
      const underBudget = d.fromPrice < budgetMin;

      const reasons: string[] = [];
      if (vibeHits.length) reasons.push(vibeHits.slice(0, 2).join(" & "));
      if (inBudget) reasons.push("Fits your budget");
      else if (underBudget) reasons.push("Comfortably under budget");
      if (answers.region !== "any") reasons.push(REGION_LABEL[d.region]);

      // Vibe leads (it's the emotional core), but budget is a real signal: an
      // in-budget trip is boosted and an over-budget one is pushed down, so a
      // clearly stronger vibe match can still surface a slightly pricier trip
      // while budget-fit breaks ties between similar matches.
      const budgetScore = inBudget ? 4 : underBudget ? 1 : -4;
      const score = vibeHits.length * 5 + whoHits.length * 2 + budgetScore;

      return {
        result: {
          destination: d,
          pkg: pickTopPackage(pkgs, preferredCat),
          reasons: reasons.slice(0, 3),
          pitch: buildPitch(d, vibeHits, inBudget, underBudget),
          score,
        } as FinderResult,
        vibeHits: vibeHits.length,
      };
    })
    // The core promise: every result genuinely matches the chosen vibe. If fewer
    // than three qualify we return fewer — never pad with trips that don't fit.
    .filter((x) => x.vibeHits > 0);

  scored.sort(
    (a, b) => b.result.score - a.result.score || a.result.destination.fromPrice - b.result.destination.fromPrice
  );
  return scored.slice(0, 3).map((x) => x.result);
}
