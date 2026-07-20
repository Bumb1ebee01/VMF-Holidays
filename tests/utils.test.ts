import { describe, it, expect } from "vitest";
import {
  formatINR,
  packagePriceLabel,
  PRICE_ON_REQUEST_LABEL,
  slugify,
  truncate,
  cn,
  formatDate,
  formatDateTime,
} from "@/lib/utils";

describe("formatINR", () => {
  it("uses Indian digit grouping, not thousands", () => {
    // ₹20,00,000 — not ₹2,000,000. Getting this wrong looks foreign to customers.
    expect(formatINR(2000000)).toContain("20,00,000");
    expect(formatINR(100000)).toContain("1,00,000");
  });

  it("prefixes the rupee sign", () => {
    expect(formatINR(5000).startsWith("₹")).toBe(true);
  });

  it("shows whole rupees with no paise", () => {
    expect(formatINR(2499.6)).not.toContain(".");
  });

  it("handles zero", () => {
    expect(formatINR(0)).toContain("0");
  });
});

describe("packagePriceLabel", () => {
  it("shows the price when it's public", () => {
    expect(packagePriceLabel({ fromPrice: 45000 })).toContain("45,000");
  });

  it("hides the price when it's on request", () => {
    expect(packagePriceLabel({ fromPrice: 45000, priceOnRequest: true })).toBe(PRICE_ON_REQUEST_LABEL);
  });

  it("never leaks the figure behind an on-request price", () => {
    expect(packagePriceLabel({ fromPrice: 45000, priceOnRequest: true })).not.toContain("45");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Golden Triangle Tour")).toBe("golden-triangle-tour");
  });

  it("strips punctuation", () => {
    expect(slugify("Kerala: God's Own Country!")).toBe("kerala-gods-own-country");
  });

  it("collapses repeated spaces and hyphens", () => {
    expect(slugify("Goa   Beach -- Break")).toBe("goa-beach-break");
  });

  it("drops characters outside the a–z0–9 range", () => {
    expect(slugify("Café México 2026")).toBe("caf-mxico-2026");
  });
});

describe("truncate", () => {
  it("leaves a short string alone", () => {
    expect(truncate("Goa", 10)).toBe("Goa");
  });

  it("leaves a string of exactly the limit alone", () => {
    expect(truncate("1234567890", 10)).toBe("1234567890");
  });

  it("adds an ellipsis when it cuts, staying within the limit", () => {
    const out = truncate("A long package description", 10);
    expect(out).toBe("A long pa…");
    expect(out).toHaveLength(10);
  });
});

describe("cn", () => {
  it("joins the truthy class names", () => {
    expect(cn("btn", "btn-primary")).toBe("btn btn-primary");
  });

  it("drops falsy values from conditional classes", () => {
    expect(cn("btn", false, undefined, null, "active")).toBe("btn active");
  });

  it("returns an empty string when nothing applies", () => {
    expect(cn(false, undefined)).toBe("");
  });
});

describe("date formatting", () => {
  it("formats in India Standard Time, not the server's timezone", () => {
    // 20:00 UTC on 20 July is already 01:30 IST on 21 July. A server running in
    // UTC must still show the Indian date to an Indian audience.
    expect(formatDate(new Date("2026-07-20T20:00:00Z"))).toBe("21 July 2026");
  });

  it("formats a plain date as day month year", () => {
    expect(formatDate(new Date("2026-07-20T06:00:00Z"))).toBe("20 July 2026");
  });

  it("includes a time in the datetime variant, still in IST", () => {
    const out = formatDateTime(new Date("2026-07-20T20:00:00Z"));
    expect(out).toContain("21 Jul 2026");
    expect(out).toMatch(/1:30/);
  });
});
