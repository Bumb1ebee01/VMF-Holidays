// Departures & payment-due logic — the maths behind the "what's leaving soon and
// what's still owed" view. Pure and DB-free so it's shared by the page and the
// dashboard widget and can be unit-tested. There is no explicit payment-due-date
// column: the travel start IS the implicit deadline (a balance should be cleared
// before the customer travels), so urgency is measured against `travelStart`.

export type DepartureUrgency = "departed" | "today" | "imminent" | "soon" | "later";

/**
 * Whole days from today to a departure date (negative = already departed).
 * Both ends are floored to local midnight so a trip "today" reads as 0, not −1
 * because of the time of day.
 */
export function daysUntilDeparture(travelStart: Date | null | undefined, now: Date = new Date()): number | null {
  if (!travelStart) return null;
  const a = new Date(now);
  a.setHours(0, 0, 0, 0);
  const b = new Date(travelStart);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function departureUrgency(days: number | null): DepartureUrgency | null {
  if (days === null) return null;
  if (days < 0) return "departed";
  if (days === 0) return "today";
  if (days <= 7) return "imminent";
  if (days <= 30) return "soon";
  return "later";
}

/** Human label for the countdown: "Today", "Tomorrow", "in 6 days", "3 days ago". */
export function departureLabel(days: number | null): string {
  if (days === null) return "No date";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days < 0) return `${-days} days ago`;
  return `in ${days} days`;
}

/**
 * A booking needs chasing when money is still owed and the trip is within a week
 * or has already departed — the balance should have been collected before travel.
 */
export function balanceAtRisk(balance: number, days: number | null): boolean {
  return balance > 0 && days !== null && days <= 7;
}
