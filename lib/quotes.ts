// Quote helpers — enquiry references, versioning and status. Pure functions, so
// they run on both server and client and stay unit-testable.

import crypto from "crypto";

export const QUOTE_STATUSES = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "DECLINED",
  "SUPERSEDED",
] as const;
export type QuoteStatusValue = (typeof QUOTE_STATUSES)[number];

export const QUOTE_STATUS_LABELS: Record<QuoteStatusValue, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  SUPERSEDED: "Superseded",
};

/** Statuses that still count as live pipeline. */
export const OPEN_QUOTE_STATUSES: QuoteStatusValue[] = ["DRAFT", "SENT"];

// ── Enquiry reference ─────────────────────────────────────────────────────────
// One code follows a customer from first enquiry through every quote revision to
// the final booking, so "what's happening with VMF-K7P2QD" always has an answer.

const REF_PREFIX = "VMF-";
/** No O/0/I/1/L — these get misread down a phone line. */
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const REF_LENGTH = 6;

/** A new enquiry reference. Callers must confirm uniqueness against the database. */
export function generateRef(): string {
  const bytes = crypto.randomBytes(REF_LENGTH);
  let out = "";
  for (let i = 0; i < REF_LENGTH; i += 1) {
    out += REF_ALPHABET[bytes[i]! % REF_ALPHABET.length];
  }
  return `${REF_PREFIX}${out}`;
}

/** True if a string looks like one of our references. */
export function isRef(value: string): boolean {
  return new RegExp(`^${REF_PREFIX}[${REF_ALPHABET}]{${REF_LENGTH}}$`).test(
    value.trim().toUpperCase()
  );
}

/** Canonical stored form — uppercase, trimmed, prefix added if missing. */
export function normalizeRef(value: string): string {
  const raw = value.trim().toUpperCase().replace(/\s+/g, "");
  return raw.startsWith(REF_PREFIX) ? raw : `${REF_PREFIX}${raw}`;
}

// ── Versions and options ──────────────────────────────────────────────────────

export interface QuoteIdentity {
  ref: string;
  version: number;
  optionLabel?: string | null;
}

/** "VMF-K7P2QD v2 · Option A" — how a quote is referred to in conversation. */
export function quoteLabel(q: QuoteIdentity): string {
  const parts = [`${q.ref} v${q.version}`];
  if (q.optionLabel) parts.push(q.optionLabel);
  return parts.join(" · ");
}

/**
 * The next version number for a new revision.
 *
 * Revisions are counted within an option, so "Option A v2" and "Option B v1" can
 * coexist under one reference — parallel choices and sequential revisions are
 * different axes and must not share a counter.
 */
export function nextVersion(
  existing: QuoteIdentity[],
  optionLabel?: string | null
): number {
  const sameOption = existing.filter(
    (q) => (q.optionLabel ?? null) === (optionLabel ?? null)
  );
  if (sameOption.length === 0) return 1;
  return Math.max(...sameOption.map((q) => q.version)) + 1;
}

/** The live quote for each option — the highest version that isn't superseded. */
export function currentQuotes<T extends QuoteIdentity & { status: string }>(
  quotes: T[]
): T[] {
  const byOption = new Map<string, T>();
  for (const q of quotes) {
    if (q.status === "SUPERSEDED") continue;
    const key = q.optionLabel ?? "";
    const held = byOption.get(key);
    if (!held || q.version > held.version) byOption.set(key, q);
  }
  return [...byOption.values()].sort((a, b) =>
    (a.optionLabel ?? "").localeCompare(b.optionLabel ?? "")
  );
}
