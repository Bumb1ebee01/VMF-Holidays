import { describe, it, expect } from "vitest";
import { summariseQuotes, marginBands, type AnalyticsQuote } from "@/lib/quote-analytics";
import { toPaise, type CostLine } from "@/lib/pricing";

const costLine = (rupees: number): CostLine => ({
  category: "DMC_LAND",
  basis: "GROUP",
  currency: "INR",
  unitCostMinor: toPaise(rupees),
  fxRate: 1,
});

/** A quote costing `cost` with `markupPct` markup, in the given status. */
const q = (
  status: string,
  cost: number,
  markupPct: number | null,
  destination: string | null = "Goa"
): AnalyticsQuote => ({
  status,
  destination,
  paxCount: 1,
  markupPct,
  priceOverride: null,
  gstApplicable: false,
  gstRatePct: 18,
  gstBase: "MARKUP_ONLY",
  tcsApplicable: false,
  tcsRatePct: 2,
  costLines: cost > 0 ? [costLine(cost)] : [],
});

describe("summariseQuotes", () => {
  it("is all zeroes with no quotes", () => {
    const s = summariseQuotes([]);
    expect(s.costedCount).toBe(0);
    expect(s.avgMarginOnCost).toBe(0);
    expect(s.conversionPct).toBe(0);
  });

  it("skips uncosted quotes rather than counting them as zero margin", () => {
    // Counting an unpriced quote as 0% would drag the average down and make the
    // business look less profitable than it is.
    const s = summariseQuotes([q("SENT", 100_000, 20), q("SENT", 0, null)]);
    expect(s.costedCount).toBe(1);
    expect(s.avgMarginOnCost).toBeCloseTo(20, 1);
  });

  it("counts only draft and sent as open pipeline", () => {
    const s = summariseQuotes([
      q("DRAFT", 100_000, 20),
      q("SENT", 100_000, 20),
      q("ACCEPTED", 100_000, 20),
      q("DECLINED", 100_000, 20),
      q("SUPERSEDED", 100_000, 20),
    ]);
    expect(s.openCount).toBe(2);
  });

  it("counts margin and revenue only from accepted quotes", () => {
    const s = summariseQuotes([q("ACCEPTED", 100_000, 20), q("DECLINED", 100_000, 50)]);
    expect(s.acceptedMargin).toBe(toPaise(20_000));
    expect(s.acceptedValue).toBe(toPaise(120_000));
  });

  it("bases win rate on decided quotes only", () => {
    // Drafts and sent quotes haven't been answered; superseded ones were
    // replaced. Including them would understate the win rate.
    const s = summariseQuotes([
      q("ACCEPTED", 100_000, 20),
      q("DECLINED", 100_000, 20),
      q("DRAFT", 100_000, 20),
      q("SENT", 100_000, 20),
      q("SUPERSEDED", 100_000, 20),
    ]);
    expect(s.decidedCount).toBe(2);
    expect(s.acceptedCount).toBe(1);
    expect(s.conversionPct).toBeCloseTo(50, 1);
  });

  it("flags quotes under the margin floor", () => {
    const s = summariseQuotes([q("SENT", 100_000, 5), q("SENT", 100_000, 25)]);
    expect(s.belowFloor).toBe(1);
  });

  it("groups accepted revenue and margin by destination, richest first", () => {
    const s = summariseQuotes([
      q("ACCEPTED", 100_000, 20, "Maldives"),
      q("ACCEPTED", 50_000, 20, "Goa"),
      q("ACCEPTED", 50_000, 20, "Goa"),
    ]);
    expect(s.byDestination[0]!.destination).toBe("Maldives");
    expect(s.byDestination.find((d) => d.destination === "Goa")!.margin).toBe(toPaise(20_000));
  });

  it("labels a missing destination rather than dropping the money", () => {
    const s = summariseQuotes([q("ACCEPTED", 100_000, 20, null)]);
    expect(s.byDestination[0]!.destination).toBe("Unspecified");
  });
});

describe("marginBands", () => {
  it("returns every band even with no data", () => {
    const bands = marginBands([]);
    expect(bands).toHaveLength(6);
    expect(bands.every((b) => b.decided === 0 && b.winRatePct === 0)).toBe(true);
  });

  it("places a quote in the right band", () => {
    const bands = marginBands([q("ACCEPTED", 100_000, 22)]);
    expect(bands.find((b) => b.label === "20–25%")!.decided).toBe(1);
  });

  it("puts a boundary value in the higher band", () => {
    // Exactly 20% belongs to "20–25%", not "15–20%".
    const bands = marginBands([q("ACCEPTED", 100_000, 20)]);
    expect(bands.find((b) => b.label === "15–20%")!.decided).toBe(0);
    expect(bands.find((b) => b.label === "20–25%")!.decided).toBe(1);
  });

  it("computes win rate within a band", () => {
    const bands = marginBands([
      q("ACCEPTED", 100_000, 22),
      q("DECLINED", 100_000, 23),
      q("DECLINED", 100_000, 24),
    ]);
    const band = bands.find((b) => b.label === "20–25%")!;
    expect(band.won).toBe(1);
    expect(band.decided).toBe(3);
    expect(band.winRatePct).toBeCloseTo(33.3, 1);
  });

  it("ignores undecided and superseded quotes entirely", () => {
    const bands = marginBands([
      q("DRAFT", 100_000, 22),
      q("SENT", 100_000, 22),
      q("SUPERSEDED", 100_000, 22),
    ]);
    expect(bands.every((b) => b.decided === 0)).toBe(true);
  });

  it("shows the pattern it exists to reveal — high margin losing more often", () => {
    const bands = marginBands([
      q("ACCEPTED", 100_000, 16),
      q("ACCEPTED", 100_000, 17),
      q("DECLINED", 100_000, 32),
      q("DECLINED", 100_000, 34),
      q("ACCEPTED", 100_000, 31),
    ]);
    const low = bands.find((b) => b.label === "15–20%")!;
    const high = bands.find((b) => b.label === "30%+")!;
    expect(low.winRatePct).toBe(100);
    expect(high.winRatePct).toBeCloseTo(33.3, 1);
    expect(high.winRatePct).toBeLessThan(low.winRatePct);
  });
});
