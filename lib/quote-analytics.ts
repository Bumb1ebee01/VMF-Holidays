// Quote analytics — pure aggregation over priced quotes, so the reporting maths
// is unit-testable and never buried in a page component.

import {
  quoteForBooking,
  MARGIN_FLOOR_PCT,
  type BookingPricing,
} from "@/lib/pricing";

export interface AnalyticsQuote extends BookingPricing {
  status: string;
  destination?: string | null;
}

export interface QuoteSummary {
  /** Quotes with enough information to price. */
  costedCount: number;
  costTotal: number;
  marginTotal: number;
  avgMarginOnCost: number;
  belowFloor: number;
  openValue: number;
  openCount: number;
  acceptedValue: number;
  acceptedMargin: number;
  /** Accepted ÷ decided. Draft and sent are excluded — they haven't been decided. */
  conversionPct: number;
  decidedCount: number;
  acceptedCount: number;
  byDestination: { destination: string; revenue: number; margin: number }[];
}

const isOpen = (status: string) => status === "DRAFT" || status === "SENT";
/** A quote only counts toward win rate once the customer has actually decided. */
const isDecided = (status: string) => status === "ACCEPTED" || status === "DECLINED";

export function summariseQuotes(quotes: AnalyticsQuote[]): QuoteSummary {
  let costedCount = 0;
  let costTotal = 0;
  let marginTotal = 0;
  let belowFloor = 0;
  let openValue = 0;
  let openCount = 0;
  let acceptedValue = 0;
  let acceptedMargin = 0;
  let decidedCount = 0;
  let acceptedCount = 0;
  const dest = new Map<string, { revenue: number; margin: number }>();

  for (const q of quotes) {
    if (isDecided(q.status)) {
      decidedCount += 1;
      if (q.status === "ACCEPTED") acceptedCount += 1;
    }

    const priced = quoteForBooking(q);
    // Uncosted quotes would drag every average toward zero, so they're skipped
    // rather than counted as zero-margin work.
    if (!priced || priced.landCost === 0) continue;

    costedCount += 1;
    costTotal += priced.landCost;
    marginTotal += priced.markup;
    if (priced.markupPctOnCost < MARGIN_FLOOR_PCT) belowFloor += 1;

    if (isOpen(q.status)) {
      openValue += priced.total;
      openCount += 1;
    }
    if (q.status === "ACCEPTED") {
      acceptedValue += priced.total;
      acceptedMargin += priced.markup;
      const key = q.destination?.trim() || "Unspecified";
      const e = dest.get(key) ?? { revenue: 0, margin: 0 };
      e.revenue += priced.total;
      e.margin += priced.markup;
      dest.set(key, e);
    }
  }

  return {
    costedCount,
    costTotal,
    marginTotal,
    avgMarginOnCost: costTotal > 0 ? (marginTotal / costTotal) * 100 : 0,
    belowFloor,
    openValue,
    openCount,
    acceptedValue,
    acceptedMargin,
    decidedCount,
    acceptedCount,
    conversionPct: decidedCount > 0 ? (acceptedCount / decidedCount) * 100 : 0,
    byDestination: [...dest.entries()]
      .map(([destination, v]) => ({ destination, ...v }))
      .sort((a, b) => b.margin - a.margin),
  };
}

// ── Win rate by margin band ───────────────────────────────────────────────────
// The question most agencies price on instinct: does asking for 30% actually
// lose work that 18% would have won? Only decided quotes count, because a draft
// nobody has answered says nothing about whether the price was acceptable.

export const MARGIN_BANDS = [
  { label: "Under 10%", min: -Infinity, max: 10 },
  { label: "10–15%", min: 10, max: 15 },
  { label: "15–20%", min: 15, max: 20 },
  { label: "20–25%", min: 20, max: 25 },
  { label: "25–30%", min: 25, max: 30 },
  { label: "30%+", min: 30, max: Infinity },
] as const;

export interface MarginBand {
  label: string;
  won: number;
  decided: number;
  winRatePct: number;
}

export function marginBands(quotes: AnalyticsQuote[]): MarginBand[] {
  const counts = MARGIN_BANDS.map((b) => ({ label: b.label, won: 0, decided: 0 }));

  for (const q of quotes) {
    if (!isDecided(q.status)) continue;
    const priced = quoteForBooking(q);
    if (!priced || priced.landCost === 0) continue;

    const pct = priced.markupPctOnCost;
    const i = MARGIN_BANDS.findIndex((b) => pct >= b.min && pct < b.max);
    if (i === -1) continue;
    counts[i]!.decided += 1;
    if (q.status === "ACCEPTED") counts[i]!.won += 1;
  }

  return counts.map((c) => ({
    ...c,
    winRatePct: c.decided > 0 ? (c.won / c.decided) * 100 : 0,
  }));
}
