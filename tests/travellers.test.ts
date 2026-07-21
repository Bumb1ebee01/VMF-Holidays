import { describe, it, expect } from "vitest";
import {
  ageOn,
  countByType,
  paxSummary,
  paxSummaryFromTravellers,
  sortTravellers,
  csvCell,
  manifestToCsv,
  manifestFilename,
  TRAVELLER_TYPE_LABELS,
  type ManifestTraveller,
} from "@/lib/travellers";

const t = (over: Partial<ManifestTraveller> = {}): ManifestTraveller => ({
  fullName: "Asha Rao",
  type: "ADULT",
  ...over,
});

describe("ageOn", () => {
  it("returns null without a date of birth", () => {
    expect(ageOn(null)).toBeNull();
    expect(ageOn(undefined)).toBeNull();
  });

  it("counts whole years only", () => {
    expect(ageOn(new Date("2000-01-01"), new Date("2026-01-01"))).toBe(26);
  });

  it("does not count a birthday that hasn't happened yet this year", () => {
    // The off-by-one that would misprice a child as an adult.
    expect(ageOn(new Date("2000-12-31"), new Date("2026-01-01"))).toBe(25);
  });

  it("counts the birthday itself", () => {
    expect(ageOn(new Date("2000-06-15"), new Date("2026-06-15"))).toBe(26);
  });

  it("does not count the day before the birthday", () => {
    expect(ageOn(new Date("2000-06-15"), new Date("2026-06-14"))).toBe(25);
  });

  it("returns 0 for an infant under one", () => {
    expect(ageOn(new Date("2026-01-01"), new Date("2026-06-01"))).toBe(0);
  });

  it("returns null rather than a negative age for a future date of birth", () => {
    expect(ageOn(new Date("2027-01-01"), new Date("2026-01-01"))).toBeNull();
  });

  it("reads the date in UTC, so the age can't disagree with the date shown beside it", () => {
    // Regression: birth dates are stored at UTC midnight and rendered via
    // toISOString. Reading them with local getters made the age shift by a year
    // around a birthday for any server not on UTC.
    const dob = new Date("2000-06-15T00:00:00.000Z");
    expect(ageOn(dob, new Date("2026-06-15T00:00:00.000Z"))).toBe(26);
    expect(ageOn(dob, new Date("2026-06-14T23:59:59.000Z"))).toBe(25);
  });
});

describe("date round-trip", () => {
  it("survives storage and redisplay without shifting a day", () => {
    // What the form submits → what we store → what the edit form renders back.
    const typed = "1994-03-12";
    const stored = new Date(`${typed}T00:00:00.000Z`);
    expect(stored.toISOString().slice(0, 10)).toBe(typed);
  });
});

describe("countByType", () => {
  it("counts an empty manifest as all zeroes", () => {
    expect(countByType([])).toEqual({ adults: 0, children: 0, infants: 0, total: 0 });
  });

  it("counts each type", () => {
    const list = [t(), t(), t({ type: "CHILD" }), t({ type: "INFANT" })];
    expect(countByType(list)).toEqual({ adults: 2, children: 1, infants: 1, total: 4 });
  });

  it("counts an unrecognised type as an adult rather than dropping the person", () => {
    // Losing someone from a head count is worse than mis-labelling them.
    expect(countByType([t({ type: "SENIOR" })])).toEqual({
      adults: 1,
      children: 0,
      infants: 0,
      total: 1,
    });
  });

  it("always has the parts add up to the total", () => {
    const list = [t(), t({ type: "CHILD" }), t({ type: "INFANT" }), t({ type: "" })];
    const c = countByType(list);
    expect(c.adults + c.children + c.infants).toBe(c.total);
  });
});

describe("paxSummary", () => {
  it("pluralises adults", () => {
    expect(paxSummary(1, 0, 0)).toBe("1 adult · 1 pax");
    expect(paxSummary(2, 0, 0)).toBe("2 adults · 2 pax");
  });

  it("uses 'child' and 'children' correctly", () => {
    expect(paxSummary(2, 1, 0)).toBe("2 adults, 1 child · 3 pax");
    expect(paxSummary(2, 2, 0)).toBe("2 adults, 2 children · 4 pax");
  });

  it("hides zero counts", () => {
    expect(paxSummary(2, 0, 0)).not.toContain("child");
    expect(paxSummary(2, 0, 0)).not.toContain("infant");
  });

  it("includes infants when present", () => {
    expect(paxSummary(2, 1, 1)).toBe("2 adults, 1 child, 1 infant · 4 pax");
  });
});

describe("paxSummaryFromTravellers", () => {
  it("is null for an empty manifest, so the booking keeps its own summary", () => {
    expect(paxSummaryFromTravellers([])).toBeNull();
  });

  it("matches the summary the booking form would have produced", () => {
    const list = [t(), t(), t({ type: "CHILD" }), t({ type: "INFANT" })];
    expect(paxSummaryFromTravellers(list)).toBe(paxSummary(2, 1, 1));
  });
});

describe("sortTravellers", () => {
  it("puts the lead passenger first, whatever their name", () => {
    const list = [t({ fullName: "Asha" }), t({ fullName: "Zara", isLead: true })];
    expect(sortTravellers(list).map((x) => x.fullName)).toEqual(["Zara", "Asha"]);
  });

  it("orders adults, then children, then infants", () => {
    const list = [
      t({ fullName: "Baby", type: "INFANT" }),
      t({ fullName: "Kid", type: "CHILD" }),
      t({ fullName: "Grown", type: "ADULT" }),
    ];
    expect(sortTravellers(list).map((x) => x.fullName)).toEqual(["Grown", "Kid", "Baby"]);
  });

  it("sorts alphabetically within a type", () => {
    const list = [t({ fullName: "Cara" }), t({ fullName: "Asha" }), t({ fullName: "Ben" })];
    expect(sortTravellers(list).map((x) => x.fullName)).toEqual(["Asha", "Ben", "Cara"]);
  });

  it("does not mutate the array it was given", () => {
    const list = [t({ fullName: "Cara" }), t({ fullName: "Asha" })];
    const before = list.map((x) => x.fullName);
    sortTravellers(list);
    expect(list.map((x) => x.fullName)).toEqual(before);
  });
});

describe("csvCell", () => {
  it("quotes every value", () => {
    expect(csvCell("Asha")).toBe('"Asha"');
  });

  it("doubles internal quotes so the row can't break out", () => {
    expect(csvCell('Asha "AJ" Rao')).toBe('"Asha ""AJ"" Rao"');
  });

  it("keeps commas and newlines inside the cell", () => {
    expect(csvCell("Rao, Asha")).toBe('"Rao, Asha"');
    expect(csvCell("line one\nline two")).toBe('"line one\nline two"');
  });

  it("renders null and undefined as empty", () => {
    expect(csvCell(null)).toBe('""');
    expect(csvCell(undefined)).toBe('""');
  });

  it("defuses spreadsheet formula injection from customer-supplied text", () => {
    // A name or note beginning =, +, - or @ would otherwise execute in Excel.
    expect(csvCell("=1+1")).toBe(`"'=1+1"`);
    expect(csvCell("+44 7700 900000")).toBe(`"'+44 7700 900000"`);
    expect(csvCell("-2")).toBe(`"'-2"`);
    expect(csvCell("@handle")).toBe(`"'@handle"`);
  });
});

describe("manifestToCsv", () => {
  const list = [
    t({ fullName: "Zara Rao", isLead: true, phone: "+919999999999", nationality: "Indian" }),
    t({ fullName: "Asha Rao", dateOfBirth: new Date("2000-06-15") }),
    t({ fullName: "Baby Rao", type: "INFANT", dateOfBirth: new Date("2025-01-01") }),
  ];

  it("has a header row plus one row per traveller", () => {
    const lines = manifestToCsv(list).split("\r\n");
    expect(lines).toHaveLength(4);
    expect(lines[0]).toContain('"Full name"');
  });

  it("lists the lead passenger first and numbers the rows", () => {
    const lines = manifestToCsv(list).split("\r\n");
    expect(lines[1]).toContain('"Zara Rao"');
    expect(lines[1].startsWith('"1"')).toBe(true);
  });

  it("uses CRLF line endings, which Excel expects", () => {
    expect(manifestToCsv(list)).toContain("\r\n");
  });

  it("writes ages as at the travel date, not today", () => {
    // Someone born mid-2000 is 25 on a trip departing in early 2026, even if the
    // manifest is exported later.
    const csv = manifestToCsv([list[1]], new Date("2026-03-01"));
    expect(csv).toContain('"25"');
  });

  it("leaves age blank when there's no date of birth", () => {
    const csv = manifestToCsv([t({ fullName: "No DOB" })], new Date("2026-03-01"));
    expect(csv.split("\r\n")[1]).toContain('"No DOB"');
  });

  it("produces just a header for an empty manifest", () => {
    expect(manifestToCsv([]).split("\r\n")).toHaveLength(1);
  });

  it("labels traveller types in words", () => {
    expect(manifestToCsv(list)).toContain(`"${TRAVELLER_TYPE_LABELS.INFANT}"`);
  });
});

describe("manifestFilename", () => {
  it("is built from the booking reference", () => {
    expect(manifestFilename("VMF-OZ9ZIT")).toBe("VMF-OZ9ZIT-manifest.csv");
  });
});
