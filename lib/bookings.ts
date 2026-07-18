// Shared booking helpers — usable on both server and client (no imports that
// pull in the DB), so the reference + payment maths never drift between the
// list, the detail page and the actions.

/** Human-facing booking reference, derived from the id (no separate column). */
export function bookingRef(id: string): string {
  return `VMF-${id.slice(-6).toUpperCase()}`;
}

/** Net amount collected = payments in, minus refunds. */
export function collectedTotal(payments: { amount: number; type: string }[]): number {
  return payments.reduce((sum, p) => sum + (p.type === "REFUND" ? -p.amount : p.amount), 0);
}

/** Outstanding balance (never negative for display). */
export function balanceDue(totalValue: number, payments: { amount: number; type: string }[]): number {
  return Math.max(0, totalValue - collectedTotal(payments));
}

export const BOOKING_STATUSES = ["CONFIRMED", "TRAVELLING", "COMPLETED", "CANCELLED"] as const;
export type BookingStatusValue = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABELS: Record<BookingStatusValue, string> = {
  CONFIRMED: "Confirmed",
  TRAVELLING: "Travelling",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const PAYMENT_TYPES = ["ADVANCE", "PART_PAYMENT", "BALANCE", "REFUND", "OTHER"] as const;
export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  ADVANCE: "Advance",
  PART_PAYMENT: "Part payment",
  BALANCE: "Balance",
  REFUND: "Refund",
  OTHER: "Other",
};

export const PAYMENT_MODES = ["CASH", "BANK_TRANSFER", "UPI", "CARD", "OTHER"] as const;
export const PAYMENT_MODE_LABELS: Record<string, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank transfer",
  UPI: "UPI",
  CARD: "Card",
  OTHER: "Other",
};
