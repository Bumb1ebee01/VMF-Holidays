// Itinerary pricing — the maths behind the quoting worksheet.
//
// Costs are itemised, marked up by a percentage, then taxed:
//
//   land cost   = Σ cost lines (per-pax lines × pax, group lines once)
//   markup      = land cost × markup%          ← this is VMF's revenue
//   GST         = markup × 18%                 ← on the markup ONLY, not the package
//   subtotal    = land cost + markup + GST
//   TCS         = subtotal × 2%                ← international only, on the subtotal
//   quote price = subtotal + TCS
//
// GST and TCS are collected on behalf of the government and remitted — they are
// never revenue and must never be counted as margin.
//
// Runs in both directions: forwards to build a quote from costs, and backwards to
// recover the margin hidden inside an already-agreed all-inclusive price (the
// website quotes one final figure, so margin has to be derived, not added up).
//
// All money is in PAISE (integer) so totals never drift on floating point.

// ── Rates ─────────────────────────────────────────────────────────────────────
// Single-sourced so a Budget change is a one-line edit. Confirm with the CA
// before relying on these — TCS in particular has moved repeatedly.

/** GST on the service component. */
export const GST_RATE_PCT = 18;

/** TCS on overseas tour packages: flat 2%, no threshold, from 1 Apr 2026
 *  (Budget 2026; the section formerly known as 206C(1G), now 394(1)). */
export const TCS_RATE_PCT = 2;

/** What GST is charged on. VMF charges it on the markup only. */
export type GstBase = "MARKUP_ONLY" | "TOTAL";

// ── Margin guardrails ─────────────────────────────────────────────────────────
// Advisory, never enforced: margins are sometimes cut deliberately to win a
// booking, so the quote builder stays fully editable and only flags the number.
// Both are measured as markup on COST — the "Effective Margin %" of the
// worksheet — not as a share of the price.

/** Below this, the booking is barely worth doing. Flag it loudly. */
export const MARGIN_FLOOR_PCT = 10;

/** What every booking should be aiming for. More is better. */
export const MARGIN_TARGET_PCT = 20;

export type MarginHealth = "below-floor" | "below-target" | "on-target";

export function marginHealth(markupPctOnCost: number): MarginHealth {
  if (markupPctOnCost < MARGIN_FLOOR_PCT) return "below-floor";
  if (markupPctOnCost < MARGIN_TARGET_PCT) return "below-target";
  return "on-target";
}

export const MARGIN_HEALTH_LABELS: Record<MarginHealth, string> = {
  "below-floor": `Below the ${MARGIN_FLOOR_PCT}% floor`,
  "below-target": `Under the ${MARGIN_TARGET_PCT}% target`,
  "on-target": `On target (${MARGIN_TARGET_PCT}%+)`,
};

// ── Cost lines ────────────────────────────────────────────────────────────────

export const COST_CATEGORIES = [
  "DMC_LAND",
  "HOTEL",
  "TRANSFERS",
  "FLIGHTS",
  "VISA",
  "ACTIVITIES",
  "INSURANCE",
  "BANK_FEE",
  "OTHER",
] as const;
export type CostCategory = (typeof COST_CATEGORIES)[number];

export const COST_CATEGORY_LABELS: Record<CostCategory, string> = {
  DMC_LAND: "DMC land package",
  HOTEL: "Hotel accommodation (extra/upgrade)",
  TRANSFERS: "Transfers / transportation",
  FLIGHTS: "Flights / train tickets",
  VISA: "Visa fees",
  ACTIVITIES: "Guide / entry fees / activities",
  INSURANCE: "Travel insurance",
  BANK_FEE: "Transaction / forex / bank fee",
  OTHER: "Other / miscellaneous",
};

/** Whether a cost is charged for each traveller or once for the whole group. */
export type CostBasis = "PER_PAX" | "GROUP";

export const COST_BASIS_LABELS: Record<CostBasis, string> = {
  PER_PAX: "Per pax",
  GROUP: "Fixed (group)",
};

export interface CostLine {
  category: CostCategory;
  basis: CostBasis;
  /** ISO code of the currency the supplier bills in, e.g. "INR", "USD". */
  currency: string;
  /** Unit cost in that currency's MINOR units (paise, cents). */
  unitCostMinor: number;
  /**
   * INR per 1 major unit of `currency` (so 1 for INR, ~97 for USD). Stored per
   * line rather than looked up at read time: a quote must reproduce the same
   * numbers months later, whatever the rate has done since.
   */
  fxRate: number;
  /** Nullable rather than optional: this is what Prisma hands back. */
  label?: string | null;
}

/**
 * A line's contribution to the land cost, in paise.
 *
 * Minor units convert directly: cents × (INR per USD) = paise, because both are
 * hundredths of their major unit. 56000 cents × 97 = 5,432,000 paise = ₹54,320.
 */
export function lineTotal(line: CostLine, pax: number): number {
  if (line.unitCostMinor <= 0) return 0;
  const units = line.basis === "GROUP" ? 1 : Math.max(0, pax);
  const rate = line.currency === "INR" ? 1 : line.fxRate;
  return Math.round(line.unitCostMinor * rate) * units;
}

/** Total supplier cost for the trip, in paise. */
export function landCost(lines: CostLine[], pax: number): number {
  return lines.reduce((sum, l) => sum + lineTotal(l, pax), 0);
}

// ── Quote ─────────────────────────────────────────────────────────────────────

export interface QuoteOptions {
  markupPct: number;
  pax: number;
  gstApplicable?: boolean;
  gstRatePct?: number;
  gstBase?: GstBase;
  /** Overseas package — TCS applies. */
  tcsApplicable?: boolean;
  tcsRatePct?: number;
}

export interface Quote {
  landCost: number;
  markup: number;
  gst: number;
  subtotal: number;
  tcs: number;
  total: number;
  perPax: number;
  /** Markup as a share of COST — "24% markup". What the worksheet calls effective margin. */
  markupPctOnCost: number;
  /** Markup as a share of PRICE — the same money, smaller number. Never mix the two up. */
  marginPctOnPrice: number;
}

const pct = (amount: number, rate: number) => Math.round((amount * rate) / 100);

/** Build a quote forwards: costs + markup% → the price the customer pays. */
export function buildQuote(cost: number, opts: QuoteOptions): Quote {
  const {
    markupPct,
    pax,
    gstApplicable = true,
    gstRatePct = GST_RATE_PCT,
    gstBase = "MARKUP_ONLY",
    tcsApplicable = false,
    tcsRatePct = TCS_RATE_PCT,
  } = opts;

  const markup = pct(cost, markupPct);
  const gstOn = gstBase === "TOTAL" ? cost + markup : markup;
  const gst = gstApplicable ? pct(gstOn, gstRatePct) : 0;
  const subtotal = cost + markup + gst;
  const tcs = tcsApplicable ? pct(subtotal, tcsRatePct) : 0;
  const total = subtotal + tcs;

  return {
    landCost: cost,
    markup,
    gst,
    subtotal,
    tcs,
    total,
    perPax: pax > 0 ? Math.round(total / pax) : 0,
    markupPctOnCost: cost > 0 ? (markup / cost) * 100 : 0,
    marginPctOnPrice: total > 0 ? (markup / total) * 100 : 0,
  };
}

/**
 * Recover the quote backwards from an agreed all-inclusive price.
 *
 * The website advertises one final figure, so the markup is buried inside it:
 *   subtotal = total ÷ (1 + tcs%)
 *   markup   = (subtotal − cost) ÷ (1 + gst%)      [GST on markup only]
 *
 * Returns null when the price cannot cover the cost, rather than reporting a
 * negative markup as if it were a real quote.
 */
export function quoteFromTotal(
  cost: number,
  total: number,
  opts: Omit<QuoteOptions, "markupPct">
): Quote | null {
  // `pax` is not needed here — it rides along in `opts` to buildQuote below.
  const {
    gstApplicable = true,
    gstRatePct = GST_RATE_PCT,
    gstBase = "MARKUP_ONLY",
    tcsApplicable = false,
    tcsRatePct = TCS_RATE_PCT,
  } = opts;

  const subtotal = tcsApplicable ? total / (1 + tcsRatePct / 100) : total;

  let markup: number;
  if (!gstApplicable) {
    markup = subtotal - cost;
  } else if (gstBase === "TOTAL") {
    // subtotal = (cost + markup) × (1 + gst%)
    markup = subtotal / (1 + gstRatePct / 100) - cost;
  } else {
    // subtotal = cost + markup × (1 + gst%)
    markup = (subtotal - cost) / (1 + gstRatePct / 100);
  }

  if (markup < 0) return null;

  const markupPct = cost > 0 ? (markup / cost) * 100 : 0;
  return buildQuote(cost, { ...opts, markupPct });
}

/** The pricing fields a booking carries, as stored. */
export interface BookingPricing {
  paxCount: number;
  markupPct: number | null;
  /** A manually agreed final price in paise. Wins over markupPct. */
  priceOverride: number | null;
  gstApplicable: boolean;
  gstRatePct: number;
  gstBase: string;
  tcsApplicable: boolean;
  tcsRatePct: number;
  costLines: CostLine[];
}

/**
 * The quote for a booking as stored.
 *
 * A manually agreed price wins: the team sometimes cuts the margin to close a
 * deal, so when `priceOverride` is set the markup is derived backwards from it
 * rather than the price being recomputed from a markup the booking no longer
 * honours. Returns null until there's enough to quote from.
 */
export function quoteForBooking(b: BookingPricing): Quote | null {
  const cost = landCost(b.costLines, b.paxCount);
  const opts = {
    pax: b.paxCount,
    gstApplicable: b.gstApplicable,
    gstRatePct: b.gstRatePct,
    gstBase: (b.gstBase === "TOTAL" ? "TOTAL" : "MARKUP_ONLY") as GstBase,
    tcsApplicable: b.tcsApplicable,
    tcsRatePct: b.tcsRatePct,
  };

  if (b.priceOverride !== null && b.priceOverride > 0) {
    return quoteFromTotal(cost, b.priceOverride, opts);
  }
  if (b.markupPct !== null) {
    return buildQuote(cost, { ...opts, markupPct: b.markupPct });
  }
  return null;
}

/** Rupees (major units) from paise, for display. */
export const toRupees = (paise: number): number => paise / 100;

/** Paise from a rupee figure typed by a human. */
export const toPaise = (rupees: number): number => Math.round(rupees * 100);
