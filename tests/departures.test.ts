import { describe, it, expect } from "vitest";
import {
  daysUntilDeparture,
  departureUrgency,
  departureLabel,
  balanceAtRisk,
} from "@/lib/departures";

const NOW = new Date("2026-07-24T15:30:00"); // mid-afternoon, to prove time-of-day is ignored
const at = (iso: string) => new Date(`${iso}T00:00:00`);

describe("daysUntilDeparture", () => {
  it("is 0 for today regardless of the time of day", () => {
    expect(daysUntilDeparture(at("2026-07-24"), NOW)).toBe(0);
  });
  it("counts whole days forward and backward", () => {
    expect(daysUntilDeparture(at("2026-07-31"), NOW)).toBe(7);
    expect(daysUntilDeparture(at("2026-07-25"), NOW)).toBe(1);
    expect(daysUntilDeparture(at("2026-07-21"), NOW)).toBe(-3);
  });
  it("returns null with no date", () => {
    expect(daysUntilDeparture(null, NOW)).toBeNull();
  });
});

describe("departureUrgency", () => {
  it("bands the countdown", () => {
    expect(departureUrgency(-1)).toBe("departed");
    expect(departureUrgency(0)).toBe("today");
    expect(departureUrgency(7)).toBe("imminent");
    expect(departureUrgency(8)).toBe("soon");
    expect(departureUrgency(30)).toBe("soon");
    expect(departureUrgency(31)).toBe("later");
    expect(departureUrgency(null)).toBeNull();
  });
});

describe("departureLabel", () => {
  it("reads naturally", () => {
    expect(departureLabel(0)).toBe("Today");
    expect(departureLabel(1)).toBe("Tomorrow");
    expect(departureLabel(6)).toBe("in 6 days");
    expect(departureLabel(-1)).toBe("Yesterday");
    expect(departureLabel(-3)).toBe("3 days ago");
    expect(departureLabel(null)).toBe("No date");
  });
});

describe("balanceAtRisk", () => {
  it("flags owed money within a week or already departed", () => {
    expect(balanceAtRisk(5000, 7)).toBe(true); // owed, imminent
    expect(balanceAtRisk(5000, -2)).toBe(true); // owed, already gone
    expect(balanceAtRisk(0, 2)).toBe(false); // fully paid
    expect(balanceAtRisk(5000, 20)).toBe(false); // owed but far off
    expect(balanceAtRisk(5000, null)).toBe(false); // no date
  });
});
