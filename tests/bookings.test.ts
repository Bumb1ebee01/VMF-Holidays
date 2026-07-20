import { describe, it, expect } from "vitest";
import { bookingRef, collectedTotal, balanceDue } from "@/lib/bookings";

const pay = (amount: number, type = "ADVANCE") => ({ amount, type });

describe("bookingRef", () => {
  it("takes the last six characters, uppercased", () => {
    expect(bookingRef("cmqrzz4j6000ua0ujzwoz9zit")).toBe("VMF-OZ9ZIT");
  });

  it("doesn't pad or break on an id shorter than six characters", () => {
    expect(bookingRef("ab1")).toBe("VMF-AB1");
  });
});

describe("collectedTotal", () => {
  it("is zero when nothing has been paid", () => {
    expect(collectedTotal([])).toBe(0);
  });

  it("adds up every non-refund payment", () => {
    expect(collectedTotal([pay(25000), pay(30000, "PART_PAYMENT"), pay(45000, "BALANCE")])).toBe(100000);
  });

  it("subtracts refunds rather than adding them", () => {
    expect(collectedTotal([pay(50000), pay(20000, "REFUND")])).toBe(30000);
  });

  it("can go negative when refunds exceed payments", () => {
    // Not clamped here on purpose — only balanceDue floors at zero. A negative
    // collected total is a real signal that the ledger is out of step.
    expect(collectedTotal([pay(10000), pay(15000, "REFUND")])).toBe(-5000);
  });
});

describe("balanceDue", () => {
  it("is the trip value minus what's been collected", () => {
    expect(balanceDue(100000, [pay(40000)])).toBe(60000);
  });

  it("is zero once the trip is fully paid", () => {
    expect(balanceDue(100000, [pay(100000)])).toBe(0);
  });

  it("never reports a negative balance on overpayment", () => {
    expect(balanceDue(100000, [pay(120000)])).toBe(0);
  });

  it("goes back up when money is refunded", () => {
    expect(balanceDue(100000, [pay(100000), pay(25000, "REFUND")])).toBe(25000);
  });
});
