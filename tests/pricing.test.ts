import { describe, it, expect } from "vitest";
import {
  lineTotal,
  landCost,
  buildQuote,
  quoteFromTotal,
  toPaise,
  toRupees,
  GST_RATE_PCT,
  TCS_RATE_PCT,
  COST_CATEGORIES,
  COST_CATEGORY_LABELS,
  COST_BASIS_LABELS,
  type CostLine,
} from "@/lib/pricing";

// ── The real worksheet, as a fixture ─────────────────────────────────────────
// VMF Holidays itinerary pricing worksheet, 2 pax, international.
// If any of these numbers change, the pricing maths has drifted from the sheet
// the business actually quotes from — which is the point of pinning them here.
const WORKSHEET = {
  pax: 2,
  lines: [
    // DMC land package: USD 560.00 per pax at ₹97.00 → ₹54,320 each.
    {
      category: "DMC_LAND" as const,
      basis: "PER_PAX" as const,
      currency: "USD",
      unitCostMinor: 56_000, // 560.00 USD in cents
      fxRate: 97,
    },
    // Transaction / forex / bank fee: ₹8,000 once for the group.
    {
      category: "BANK_FEE" as const,
      basis: "GROUP" as const,
      currency: "INR",
      unitCostMinor: toPaise(8_000),
      fxRate: 1,
    },
  ] satisfies CostLine[],
  expected: {
    landCost: toPaise(116_640),
    markup: toPaise(27_993.6),
    gst: toPaise(5_038.85),
    subtotal: toPaise(149_672.45),
    tcs: toPaise(2_993.45),
    total: toPaise(152_665.9),
    perPax: toPaise(76_332.95),
    markupPct: 24,
  },
};

describe("lineTotal", () => {
  it("multiplies a per-pax line by the head count", () => {
    // ₹54,320 × 2 = ₹108,640
    expect(lineTotal(WORKSHEET.lines[0], 2)).toBe(toPaise(108_640));
  });

  it("charges a group line once, however many travellers", () => {
    const fee = WORKSHEET.lines[1];
    expect(lineTotal(fee, 2)).toBe(toPaise(8_000));
    expect(lineTotal(fee, 9)).toBe(toPaise(8_000));
  });

  it("converts foreign currency via the line's own stored rate", () => {
    // Minor units convert directly: 56,000 cents × 97 = 5,432,000 paise.
    expect(lineTotal({ ...WORKSHEET.lines[0], basis: "GROUP" }, 1)).toBe(toPaise(54_320));
  });

  it("ignores the fx rate for INR lines", () => {
    const line: CostLine = { ...WORKSHEET.lines[1], fxRate: 999 };
    expect(lineTotal(line, 1)).toBe(toPaise(8_000));
  });

  it("treats an empty line as zero rather than NaN", () => {
    expect(lineTotal({ ...WORKSHEET.lines[1], unitCostMinor: 0 }, 2)).toBe(0);
  });

  it("does not go negative on a zero head count", () => {
    expect(lineTotal(WORKSHEET.lines[0], 0)).toBe(0);
  });
});

describe("landCost", () => {
  it("matches the worksheet total", () => {
    expect(landCost(WORKSHEET.lines, WORKSHEET.pax)).toBe(WORKSHEET.expected.landCost);
  });

  it("is zero with no lines", () => {
    expect(landCost([], 2)).toBe(0);
  });
});

describe("buildQuote — against the real worksheet", () => {
  const quote = buildQuote(WORKSHEET.expected.landCost, {
    markupPct: 24,
    pax: WORKSHEET.pax,
    tcsApplicable: true,
  });

  it("reproduces every figure to the paisa", () => {
    expect(quote.markup).toBe(WORKSHEET.expected.markup);
    expect(quote.gst).toBe(WORKSHEET.expected.gst);
    expect(quote.subtotal).toBe(WORKSHEET.expected.subtotal);
    expect(quote.tcs).toBe(WORKSHEET.expected.tcs);
    expect(quote.total).toBe(WORKSHEET.expected.total);
    expect(quote.perPax).toBe(WORKSHEET.expected.perPax);
  });

  it("charges GST on the markup only, never the whole package", () => {
    // ₹5,038.85 is 18% of the ₹27,993.60 markup — not of the ₹116,640 cost.
    expect(quote.gst).toBe(Math.round((quote.markup * GST_RATE_PCT) / 100));
    expect(quote.gst).toBeLessThan(Math.round((quote.landCost * GST_RATE_PCT) / 100));
  });

  it("charges TCS on the subtotal, after GST", () => {
    expect(quote.tcs).toBe(Math.round((quote.subtotal * TCS_RATE_PCT) / 100));
  });

  it("reports markup on cost and margin on price as different numbers", () => {
    // Same ₹27,993.60. 24% of cost, but only ~18.3% of the price — confusing
    // the two overstates profitability.
    expect(quote.markupPctOnCost).toBeCloseTo(24, 1);
    expect(quote.marginPctOnPrice).toBeCloseTo(18.3, 1);
    expect(quote.marginPctOnPrice).toBeLessThan(quote.markupPctOnCost);
  });

  it("always adds up: cost + markup + gst + tcs = total", () => {
    expect(quote.landCost + quote.markup + quote.gst + quote.tcs).toBe(quote.total);
  });
});

describe("buildQuote — domestic and edge cases", () => {
  it("charges no TCS on a domestic package", () => {
    const q = buildQuote(toPaise(100_000), { markupPct: 20, pax: 2 });
    expect(q.tcs).toBe(0);
    expect(q.total).toBe(q.subtotal);
  });

  it("can switch GST off entirely", () => {
    const q = buildQuote(toPaise(100_000), { markupPct: 20, pax: 2, gstApplicable: false });
    expect(q.gst).toBe(0);
    expect(q.total).toBe(toPaise(120_000));
  });

  it("supports GST on the full package when the base is TOTAL", () => {
    const q = buildQuote(toPaise(100_000), { markupPct: 20, pax: 1, gstBase: "TOTAL" });
    expect(q.gst).toBe(Math.round((toPaise(120_000) * GST_RATE_PCT) / 100));
  });

  it("honours an overridden rate", () => {
    const q = buildQuote(toPaise(100_000), { markupPct: 10, pax: 1, gstRatePct: 5 });
    expect(q.gst).toBe(Math.round((q.markup * 5) / 100));
  });

  it("handles zero markup without breaking", () => {
    const q = buildQuote(toPaise(50_000), { markupPct: 0, pax: 2 });
    expect(q.markup).toBe(0);
    expect(q.total).toBe(toPaise(50_000));
    expect(q.marginPctOnPrice).toBe(0);
  });

  it("does not divide by zero on zero pax", () => {
    expect(buildQuote(toPaise(50_000), { markupPct: 10, pax: 0 }).perPax).toBe(0);
  });

  it("splits the total evenly across travellers", () => {
    const q = buildQuote(toPaise(90_000), { markupPct: 0, pax: 3 });
    expect(q.perPax).toBe(toPaise(30_000));
  });
});

describe("quoteFromTotal — recovering margin from an all-inclusive price", () => {
  it("recovers the worksheet's markup from its final price alone", () => {
    // The website quotes one final figure, so margin has to be derived.
    const q = quoteFromTotal(WORKSHEET.expected.landCost, WORKSHEET.expected.total, {
      pax: WORKSHEET.pax,
      tcsApplicable: true,
    });
    expect(q).not.toBeNull();
    expect(q!.markupPctOnCost).toBeCloseTo(24, 1);
    expect(q!.markup).toBe(WORKSHEET.expected.markup);
    expect(q!.gst).toBe(WORKSHEET.expected.gst);
    expect(q!.tcs).toBe(WORKSHEET.expected.tcs);
  });

  it("round-trips: build a quote, feed the total back, get the same quote", () => {
    for (const markupPct of [10, 18, 24, 35]) {
      for (const tcsApplicable of [true, false]) {
        const forward = buildQuote(toPaise(80_000), { markupPct, pax: 2, tcsApplicable });
        const back = quoteFromTotal(toPaise(80_000), forward.total, { pax: 2, tcsApplicable });
        expect(back, `${markupPct}% tcs=${tcsApplicable}`).not.toBeNull();
        expect(back!.markupPctOnCost).toBeCloseTo(markupPct, 1);
        expect(back!.total).toBe(forward.total);
      }
    }
  });

  it("round-trips with GST off, and with GST on the full package", () => {
    const a = buildQuote(toPaise(80_000), { markupPct: 22, pax: 2, gstApplicable: false });
    expect(quoteFromTotal(toPaise(80_000), a.total, { pax: 2, gstApplicable: false })!
      .markupPctOnCost).toBeCloseTo(22, 1);

    const b = buildQuote(toPaise(80_000), { markupPct: 22, pax: 2, gstBase: "TOTAL" });
    expect(quoteFromTotal(toPaise(80_000), b.total, { pax: 2, gstBase: "TOTAL" })!
      .markupPctOnCost).toBeCloseTo(22, 1);
  });

  it("returns null when the price cannot cover the cost", () => {
    // A loss-making booking must not be reported as a quote with negative markup.
    expect(quoteFromTotal(toPaise(100_000), toPaise(80_000), { pax: 2 })).toBeNull();
  });

  it("reports zero markup when the price exactly equals the cost", () => {
    const q = quoteFromTotal(toPaise(100_000), toPaise(100_000), { pax: 2 });
    expect(q!.markup).toBe(0);
  });
});

describe("catalogue and units", () => {
  it("labels every cost category and basis", () => {
    for (const c of COST_CATEGORIES) {
      expect(COST_CATEGORY_LABELS[c]?.length, c).toBeGreaterThan(0);
    }
    expect(COST_BASIS_LABELS.PER_PAX.length).toBeGreaterThan(0);
    expect(COST_BASIS_LABELS.GROUP.length).toBeGreaterThan(0);
  });

  it("converts rupees and paise without drift", () => {
    expect(toPaise(5_038.85)).toBe(503_885);
    expect(toRupees(503_885)).toBe(5_038.85);
    expect(toPaise(0.1 + 0.2)).toBe(30); // the classic float trap
  });
});
