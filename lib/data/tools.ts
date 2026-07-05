// ─────────────────────────────────────────────────────────────────────────────
// Travel Tools registry — the single source of truth for the /tools hub.
// Adding a new tool = add one entry here + build its page at /tools/<slug>.
// The hub renders `status: "live"` tools as cards and lists "soon" ones as a
// roadmap strip, so the page never looks empty while the set grows.
// ─────────────────────────────────────────────────────────────────────────────

export type ToolStatus = "live" | "soon";

export type ToolIcon =
  | "split"
  | "currency"
  | "tip"
  | "calendar"
  | "budget"
  | "compare"
  | "passport"
  | "packing"
  | "weather"
  | "sparkles";

export interface Tool {
  slug: string;
  title: string;
  /** One-line hub-card blurb — plain, benefit-led. */
  blurb: string;
  icon: ToolIcon;
  status: ToolStatus;
  /** Small trust badge on the card, e.g. "100% Free". */
  badge?: string;
}

export const TOOLS: Tool[] = [
  {
    slug: "group-expense-splitter",
    title: "Group Trip Expense Splitter",
    blurb:
      "Track who paid for what on a group trip and see exactly who owes whom — settled with the fewest payments.",
    icon: "split",
    status: "live",
    badge: "No sign-up",
  },
  {
    slug: "long-weekend-optimizer",
    title: "India Long-Weekend Optimizer",
    blurb:
      "See every long-weekend window this year and the trips that fit each one — plan your leave around the calendar.",
    icon: "calendar",
    status: "soon",
  },
  {
    slug: "currency-converter",
    title: "Currency Converter",
    blurb: "Convert Indian Rupees to any destination currency at the latest rates.",
    icon: "currency",
    status: "soon",
  },
  {
    slug: "trip-budget-estimator",
    title: "Trip Budget Estimator",
    blurb: "Get a realistic cost range for your trip by destination, days, group size and style.",
    icon: "budget",
    status: "soon",
  },
  {
    slug: "tip-calculator",
    title: "International Tip Calculator",
    blurb: "Know the right amount to tip in the countries VMF travellers actually visit.",
    icon: "tip",
    status: "soon",
  },
  {
    slug: "diy-vs-us",
    title: "DIY vs. Us Calculator",
    blurb: "Compare booking flights, hotels and activities separately against a VMF package price.",
    icon: "compare",
    status: "soon",
  },
  {
    slug: "visa-checker",
    title: "Visa & eVisa Checker",
    blurb: "Check visa requirements on an Indian passport for the destinations we sell.",
    icon: "passport",
    status: "soon",
  },
  {
    slug: "packing-checklist",
    title: "Packing Checklist Generator",
    blurb: "Build a packing list tailored to your trip type — honeymoon, family, adventure and more.",
    icon: "packing",
    status: "soon",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export const LIVE_TOOLS = TOOLS.filter((t) => t.status === "live");
export const SOON_TOOLS = TOOLS.filter((t) => t.status === "soon");
