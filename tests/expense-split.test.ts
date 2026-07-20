import { describe, it, expect } from "vitest";
import {
  splitEqually,
  splitByWeights,
  itemShares,
  computeBalances,
  computeLedger,
  settle,
  type Expense,
  type Person,
} from "@/lib/expense-split";

const people: Person[] = [
  { id: "a", name: "Asha" },
  { id: "b", name: "Ben" },
  { id: "c", name: "Cara" },
];

const sum = (ns: number[]) => ns.reduce((x, y) => x + y, 0);

describe("splitEqually", () => {
  it("splits cleanly when it divides", () => {
    expect(splitEqually(900, 3)).toEqual([300, 300, 300]);
  });

  it("hands leftover paise to the earliest shares so nothing is lost", () => {
    // 1000/3 = 333.33 — the stray paise must land somewhere, not vanish.
    expect(splitEqually(1000, 3)).toEqual([334, 333, 333]);
    expect(sum(splitEqually(1000, 3))).toBe(1000);
  });

  it("returns nothing for a non-positive headcount", () => {
    expect(splitEqually(1000, 0)).toEqual([]);
  });

  it("always sums back to the original amount", () => {
    for (let amount = 0; amount < 200; amount += 7) {
      for (let n = 1; n <= 9; n += 1) {
        expect(sum(splitEqually(amount, n)), `${amount}/${n}`).toBe(amount);
      }
    }
  });
});

describe("splitByWeights", () => {
  it("splits proportionally", () => {
    expect(splitByWeights(1000, [50, 50])).toEqual([500, 500]);
    expect(splitByWeights(1000, [75, 25])).toEqual([750, 250]);
  });

  it("gives leftover units to the largest fractional parts", () => {
    const shares = splitByWeights(1000, [33, 33, 34]);
    expect(sum(shares)).toBe(1000);
  });

  it("returns zeroes when the weights are all zero, instead of dividing by zero", () => {
    expect(splitByWeights(1000, [0, 0])).toEqual([0, 0]);
  });

  it("always sums back to the original amount", () => {
    for (const weights of [[1, 2, 3], [7, 11], [1, 1, 1, 1, 1, 1, 1], [99, 1]]) {
      for (let amount = 0; amount < 500; amount += 37) {
        expect(sum(splitByWeights(amount, weights)), `${amount} / ${weights}`).toBe(amount);
      }
    }
  });
});

describe("itemShares", () => {
  const base = { id: "i1", label: "Dinner", amount: 3000, paidBy: "a" };

  it("splits evenly by default when no mode is set", () => {
    expect(itemShares({ ...base, sharedBy: ["a", "b", "c"] })).toEqual([
      { personId: "a", amount: 1000 },
      { personId: "b", amount: 1000 },
      { personId: "c", amount: 1000 },
    ]);
  });

  it("honours exact amounts", () => {
    const shares = itemShares({
      ...base,
      sharedBy: ["a", "b"],
      splitMode: "exact",
      exact: { a: 2000, b: 1000 },
    });
    expect(shares).toEqual([
      { personId: "a", amount: 2000 },
      { personId: "b", amount: 1000 },
    ]);
  });

  it("treats a participant with no exact entry as owing nothing", () => {
    const shares = itemShares({
      ...base,
      sharedBy: ["a", "b"],
      splitMode: "exact",
      exact: { a: 3000 },
    });
    expect(shares).toEqual([
      { personId: "a", amount: 3000 },
      { personId: "b", amount: 0 },
    ]);
  });

  it("gives an under-allocated remainder to whoever paid", () => {
    // 3,000 spent but only 2,500 assigned — the stray 500 belongs to the payer,
    // otherwise it silently vanishes from the group's books.
    const shares = itemShares({
      ...base,
      paidBy: "a",
      sharedBy: ["a", "b"],
      splitMode: "exact",
      exact: { a: 1000, b: 1500 },
    });
    expect(shares).toEqual([
      { personId: "a", amount: 1500 },
      { personId: "b", amount: 1500 },
    ]);
    expect(sum(shares.map((s) => s.amount))).toBe(3000);
  });

  it("takes an over-allocation back off the payer", () => {
    const shares = itemShares({
      ...base,
      paidBy: "a",
      sharedBy: ["a", "b"],
      splitMode: "exact",
      exact: { a: 2000, b: 2000 },
    });
    expect(shares).toEqual([
      { personId: "a", amount: 1000 },
      { personId: "b", amount: 2000 },
    ]);
    expect(sum(shares.map((s) => s.amount))).toBe(3000);
  });

  it("adds the payer in when they weren't sharing but money is unallocated", () => {
    const shares = itemShares({
      ...base,
      paidBy: "c",
      sharedBy: ["a", "b"],
      splitMode: "exact",
      exact: { a: 1000, b: 1000 },
    });
    expect(shares).toContainEqual({ personId: "c", amount: 1000 });
    expect(sum(shares.map((s) => s.amount))).toBe(3000);
  });

  it("leaves well-formed exact splits completely untouched", () => {
    // The normal path through the app: the form derives the total from the
    // entries, so there is never a remainder and nothing is adjusted.
    const shares = itemShares({
      ...base,
      paidBy: "a",
      sharedBy: ["a", "b"],
      splitMode: "exact",
      exact: { a: 2000, b: 1000 },
    });
    expect(shares).toEqual([
      { personId: "a", amount: 2000 },
      { personId: "b", amount: 1000 },
    ]);
  });

  it("converts percentages into amounts that sum to the total", () => {
    const shares = itemShares({
      ...base,
      sharedBy: ["a", "b", "c"],
      splitMode: "percent",
      percent: { a: 50, b: 30, c: 20 },
    });
    expect(shares.map((s) => s.amount)).toEqual([1500, 900, 600]);
    expect(sum(shares.map((s) => s.amount))).toBe(3000);
  });

  it("falls back to an even split if the mode is set but its data is missing", () => {
    const shares = itemShares({ ...base, sharedBy: ["a", "b"], splitMode: "percent" });
    expect(shares.map((s) => s.amount)).toEqual([1500, 1500]);
  });
});

describe("computeBalances", () => {
  it("credits the payer and debits each sharer", () => {
    const expenses: Expense[] = [
      { id: "1", label: "Hotel", amount: 3000, paidBy: "a", sharedBy: ["a", "b", "c"] },
    ];
    expect(computeBalances(people, expenses)).toEqual([
      { personId: "a", net: 2000 },
      { personId: "b", net: -1000 },
      { personId: "c", net: -1000 },
    ]);
  });

  it("ignores zero-value items and items nobody shares", () => {
    const expenses: Expense[] = [
      { id: "1", label: "Free walking tour", amount: 0, paidBy: "a", sharedBy: ["a", "b"] },
      { id: "2", label: "Orphan", amount: 5000, paidBy: "a", sharedBy: [] },
    ];
    expect(computeBalances(people, expenses).every((b) => b.net === 0)).toBe(true);
  });

  it("nets to zero across the group — money is never created or destroyed", () => {
    // The core money-safety property of the whole tool.
    const expenses: Expense[] = [
      { id: "1", label: "Hotel", amount: 10000, paidBy: "a", sharedBy: ["a", "b", "c"] },
      { id: "2", label: "Taxi", amount: 733, paidBy: "b", sharedBy: ["a", "b", "c"] },
      {
        id: "3",
        label: "Dinner",
        amount: 4500,
        paidBy: "c",
        sharedBy: ["a", "b"],
        splitMode: "percent",
        percent: { a: 60, b: 40 },
      },
      {
        id: "4",
        label: "Tickets",
        amount: 2500,
        paidBy: "a",
        sharedBy: ["b", "c"],
        splitMode: "exact",
        exact: { b: 1500, c: 1000 },
      },
    ];
    expect(sum(computeBalances(people, expenses).map((b) => b.net))).toBe(0);
  });

  it("still nets to zero when exact amounts don't add up to the item total", () => {
    // The regression this fix exists for: malformed exact data used to create or
    // destroy money, because the payer was credited the full amount while the
    // shares summed to something else.
    const expenses: Expense[] = [
      {
        id: "1",
        label: "Under-allocated",
        amount: 5000,
        paidBy: "a",
        sharedBy: ["b", "c"],
        splitMode: "exact",
        exact: { b: 1000, c: 1000 },
      },
      {
        id: "2",
        label: "Over-allocated",
        amount: 2000,
        paidBy: "b",
        sharedBy: ["a", "b"],
        splitMode: "exact",
        exact: { a: 2000, b: 2000 },
      },
    ];
    expect(sum(computeBalances(people, expenses).map((b) => b.net))).toBe(0);
  });
});

describe("computeLedger", () => {
  it("reports paid, fair share and the difference between them", () => {
    const expenses: Expense[] = [
      { id: "1", label: "Hotel", amount: 3000, paidBy: "a", sharedBy: ["a", "b", "c"] },
    ];
    const ledger = computeLedger(people, expenses);
    expect(ledger).toEqual([
      { personId: "a", paid: 3000, share: 1000, net: 2000 },
      { personId: "b", paid: 0, share: 1000, net: -1000 },
      { personId: "c", paid: 0, share: 1000, net: -1000 },
    ]);
  });

  it("has total paid equal to total shared", () => {
    const expenses: Expense[] = [
      { id: "1", label: "Hotel", amount: 10000, paidBy: "a", sharedBy: ["a", "b", "c"] },
      { id: "2", label: "Taxi", amount: 731, paidBy: "b", sharedBy: ["b", "c"] },
    ];
    const ledger = computeLedger(people, expenses);
    expect(sum(ledger.map((l) => l.paid))).toBe(sum(ledger.map((l) => l.share)));
  });
});

describe("settle", () => {
  it("moves exactly what is owed, and no more", () => {
    const balances = [
      { personId: "a", net: 2000 },
      { personId: "b", net: -1000 },
      { personId: "c", net: -1000 },
    ];
    const settlements = settle(balances);
    expect(sum(settlements.map((s) => s.amount))).toBe(2000);
    expect(settlements.every((s) => s.amount > 0)).toBe(true);
  });

  it("clears everyone's balance once the settlements are applied", () => {
    const balances = [
      { personId: "a", net: 5000 },
      { personId: "b", net: -1200 },
      { personId: "c", net: -3800 },
    ];
    const after = new Map(balances.map((b) => [b.personId, b.net]));
    for (const s of settle(balances)) {
      after.set(s.fromId, (after.get(s.fromId) ?? 0) + s.amount);
      after.set(s.toId, (after.get(s.toId) ?? 0) - s.amount);
    }
    expect([...after.values()].every((v) => v === 0)).toBe(true);
  });

  it("needs at most one fewer transaction than there are people", () => {
    const balances = [
      { personId: "a", net: 3000 },
      { personId: "b", net: 1000 },
      { personId: "c", net: -2500 },
      { personId: "d", net: -1500 },
    ];
    expect(settle(balances).length).toBeLessThanOrEqual(balances.length - 1);
  });

  it("produces nothing when everyone is already square", () => {
    expect(settle([{ personId: "a", net: 0 }, { personId: "b", net: 0 }])).toEqual([]);
  });
});
