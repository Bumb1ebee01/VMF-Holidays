import { describe, it, expect } from "vitest";
import {
  getTerms,
  DOMESTIC_CANCELLATION,
  INTL_CANCELLATION,
  PRICE_NOTES,
  type TourRegion,
} from "@/lib/itinerary-terms";

/** Leading "N% ..." / "N–M days" figures out of a slab line. */
const feePct = (point: string) => Number(point.match(/(\d+)%/)?.[1] ?? NaN);
const firstDayNumber = (point: string) => Number(point.match(/(\d+)/)?.[1] ?? NaN);

describe("cancellation policy is single-sourced", () => {
  // The whole point of the reconciliation: the public /terms page and the
  // quotation PDF must render the SAME slab. A public policy that is softer
  // than the one we enforce is unenforceable against the customer.
  it("serves the domestic quotation the exact object the public page imports", () => {
    expect(getTerms("domestic").sections).toContain(DOMESTIC_CANCELLATION);
  });

  it("serves the international quotation the international slab", () => {
    expect(getTerms("international").sections).toContain(INTL_CANCELLATION);
  });

  it("never puts the domestic slab in an international quotation, or vice versa", () => {
    expect(getTerms("international").sections).not.toContain(DOMESTIC_CANCELLATION);
    expect(getTerms("domestic").sections).not.toContain(INTL_CANCELLATION);
  });
});

describe("the approved slab", () => {
  it("charges 25 / 50 / 75 / 90 / 100% as departure gets closer (domestic)", () => {
    expect(DOMESTIC_CANCELLATION.points.slice(0, 5).map(feePct)).toEqual([25, 50, 75, 90, 100]);
  });

  it("charges 25 / 50 / 75 / 90 / 100% as departure gets closer (international)", () => {
    expect(INTL_CANCELLATION.points.slice(0, 5).map(feePct)).toEqual([25, 50, 75, 90, 100]);
  });

  it("never lets the fee go down as the trip gets nearer", () => {
    for (const slab of [DOMESTIC_CANCELLATION, INTL_CANCELLATION]) {
      const fees = slab.points.slice(0, 5).map(feePct);
      for (let i = 1; i < fees.length; i += 1) {
        expect(fees[i]).toBeGreaterThan(fees[i - 1]);
      }
    }
  });

  it("is stricter internationally — charges start from a longer notice period", () => {
    // Overseas suppliers lock money in earlier, so the top band opens sooner:
    // 60 days international vs 45 domestic.
    expect(firstDayNumber(INTL_CANCELLATION.points[0])).toBeGreaterThan(
      firstDayNumber(DOMESTIC_CANCELLATION.points[0])
    );
  });

  it("spells out that a No Show is charged in full", () => {
    for (const slab of [DOMESTIC_CANCELLATION, INTL_CANCELLATION]) {
      expect(slab.points.some((p) => /no show/i.test(p) && /100%/.test(p))).toBe(true);
    }
  });

  it("says charges apply to the full package cost, not just what's been paid", () => {
    for (const slab of [DOMESTIC_CANCELLATION, INTL_CANCELLATION]) {
      expect(slab.points.some((p) => /regardless of the amount paid/i.test(p))).toBe(true);
    }
  });

  it("commits to a refund turnaround", () => {
    for (const slab of [DOMESTIC_CANCELLATION, INTL_CANCELLATION]) {
      expect(slab.points.some((p) => /working days/i.test(p))).toBe(true);
    }
  });
});

describe("terms document shape", () => {
  const regions: TourRegion[] = ["domestic", "international"];

  it("gives both regions a title and a non-empty section list", () => {
    for (const region of regions) {
      const { title, sections } = getTerms(region);
      expect(title.length, region).toBeGreaterThan(0);
      expect(sections.length, region).toBeGreaterThan(0);
    }
  });

  it("gives every section a heading and at least one point", () => {
    for (const region of regions) {
      for (const section of getTerms(region).sections) {
        expect(section.heading.length, `${region}/${section.heading}`).toBeGreaterThan(0);
        expect(section.points.length, `${region}/${section.heading}`).toBeGreaterThan(0);
        expect(section.points.every((p) => p.trim().length > 0)).toBe(true);
      }
    }
  });

  it("has no duplicate section headings within a region", () => {
    for (const region of regions) {
      const headings = getTerms(region).sections.map((s) => s.heading);
      expect(new Set(headings).size, region).toBe(headings.length);
    }
  });

  it("keeps the transparent-pricing note, which the share tool relies on", () => {
    expect(PRICE_NOTES.length).toBeGreaterThan(0);
    expect(PRICE_NOTES.every((n) => n.trim().length > 0)).toBe(true);
  });
});
