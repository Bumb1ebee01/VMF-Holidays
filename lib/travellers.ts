// Group manifest helpers — the per-traveller list handed to hotels and airlines.
// Pure functions only (no DB imports), so they run on both server and client and
// stay unit-testable.

export const TRAVELLER_TYPES = ["ADULT", "CHILD", "INFANT"] as const;
export type TravellerTypeValue = (typeof TRAVELLER_TYPES)[number];

export const TRAVELLER_TYPE_LABELS: Record<TravellerTypeValue, string> = {
  ADULT: "Adult",
  CHILD: "Child",
  INFANT: "Infant",
};

/** The shape the manifest helpers need — a subset of the Traveller model. */
export interface ManifestTraveller {
  fullName: string;
  type: string;
  dateOfBirth?: Date | null;
  gender?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  isLead?: boolean;
  notes?: string | null;
}

/**
 * Age in whole years on a given date (defaults to today). Uses the trip's start
 * date at the call site, because airlines and hotels price on age at travel, not
 * age today — an infant who turns two mid-trip is a child to them.
 */
export function ageOn(dateOfBirth: Date | null | undefined, on: Date = new Date()): number | null {
  if (!dateOfBirth) return null;
  // Read both dates in UTC. Birth dates are stored anchored to UTC midnight, and
  // every surface renders them via toISOString — using local getters here would
  // make the age disagree with the date shown next to it for servers west or
  // far east of UTC.
  let age = on.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const monthDiff = on.getUTCMonth() - dateOfBirth.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && on.getUTCDate() < dateOfBirth.getUTCDate())) age -= 1;
  return age >= 0 ? age : null;
}

/** Head count by traveller type. */
export function countByType(travellers: ManifestTraveller[]): {
  adults: number;
  children: number;
  infants: number;
  total: number;
} {
  let adults = 0;
  let children = 0;
  let infants = 0;
  for (const t of travellers) {
    if (t.type === "CHILD") children += 1;
    else if (t.type === "INFANT") infants += 1;
    else adults += 1; // unknown/missing type counts as an adult rather than vanishing
  }
  return { adults, children, infants, total: travellers.length };
}

/**
 * "2 adults, 1 child, 1 infant · 4 pax" — the same shape the booking form already
 * produces, so the stored summary reads identically whether it came from the
 * headcount fields or from a full manifest.
 */
export function paxSummary(adults: number, children: number, infants: number): string {
  const parts = [`${adults} adult${adults === 1 ? "" : "s"}`];
  if (children > 0) parts.push(`${children} ${children === 1 ? "child" : "children"}`);
  if (infants > 0) parts.push(`${infants} infant${infants === 1 ? "" : "s"}`);
  return `${parts.join(", ")} · ${adults + children + infants} pax`;
}

/** Pax summary derived from the manifest, or null when it's empty. */
export function paxSummaryFromTravellers(travellers: ManifestTraveller[]): string | null {
  if (travellers.length === 0) return null;
  const { adults, children, infants } = countByType(travellers);
  return paxSummary(adults, children, infants);
}

/** Lead passenger first, then adults, children, infants; alphabetical within each. */
export function sortTravellers<T extends ManifestTraveller>(travellers: T[]): T[] {
  const rank = (t: ManifestTraveller) =>
    t.type === "CHILD" ? 1 : t.type === "INFANT" ? 2 : 0;
  return [...travellers].sort(
    (a, b) =>
      Number(Boolean(b.isLead)) - Number(Boolean(a.isLead)) ||
      rank(a) - rank(b) ||
      a.fullName.localeCompare(b.fullName)
  );
}

const CSV_COLUMNS = [
  "#",
  "Full name",
  "Type",
  "Date of birth",
  "Age at travel",
  "Gender",
  "Nationality",
  "Phone",
  "Email",
  "Lead passenger",
  "Notes",
] as const;

/**
 * Escape one CSV cell. Values are wrapped in quotes and internal quotes doubled.
 * A leading =, +, - or @ is prefixed with a single quote: spreadsheets would
 * otherwise treat the cell as a formula, which is a real injection risk when the
 * text came from a customer.
 */
export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

const isoDate = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");

/** The manifest as CSV — what hotels and airlines actually ask for. */
export function manifestToCsv(travellers: ManifestTraveller[], travelStart?: Date | null): string {
  const rows = sortTravellers(travellers).map((t, i) =>
    [
      i + 1,
      t.fullName,
      TRAVELLER_TYPE_LABELS[t.type as TravellerTypeValue] ?? t.type,
      isoDate(t.dateOfBirth),
      ageOn(t.dateOfBirth, travelStart ?? undefined) ?? "",
      t.gender ?? "",
      t.nationality ?? "",
      t.phone ?? "",
      t.email ?? "",
      t.isLead ? "Yes" : "",
      t.notes ?? "",
    ]
      .map(csvCell)
      .join(",")
  );
  return [CSV_COLUMNS.map(csvCell).join(","), ...rows].join("\r\n");
}

/** Filename for a manifest download, e.g. "VMF-OZ9ZIT-manifest.csv". */
export function manifestFilename(bookingRef: string): string {
  return `${bookingRef}-manifest.csv`;
}
