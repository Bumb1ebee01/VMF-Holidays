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
    blurb:
      "Convert Indian Rupees to your destination's currency — and back — at live reference rates, updated hourly.",
    icon: "currency",
    status: "live",
    badge: "Live rates",
  },
  {
    slug: "visa-checker",
    title: "Visa & eVisa Checker",
    blurb:
      "See at a glance whether a destination is visa-free, visa on arrival, eVisa or needs a visa on an Indian passport — with each country's official source.",
    icon: "passport",
    status: "live",
    badge: "Indian passports",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export const LIVE_TOOLS = TOOLS.filter((t) => t.status === "live");
export const SOON_TOOLS = TOOLS.filter((t) => t.status === "soon");
