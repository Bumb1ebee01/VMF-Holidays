// ─────────────────────────────────────────────────────────────────────────────
// Group expense settlement — pure, UI-free logic for the Expense Splitter tool.
// All money is handled in integer minor units (paise) to avoid floating-point
// drift, then formatted for display at the edges only.
// ─────────────────────────────────────────────────────────────────────────────

export interface Person {
  id: string;
  name: string;
}

export interface Currency {
  code: string;
  symbol: string;
  locale: string;
}

// Currencies scoped to where VMF travellers actually go (INR first).
export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", locale: "en-IN" },
  { code: "USD", symbol: "$", locale: "en-US" },
  { code: "EUR", symbol: "€", locale: "en-IE" },
  { code: "GBP", symbol: "£", locale: "en-GB" },
  { code: "AED", symbol: "AED ", locale: "en-AE" },
  { code: "THB", symbol: "฿", locale: "en-US" },
  { code: "SGD", symbol: "S$", locale: "en-SG" },
  { code: "IDR", symbol: "Rp ", locale: "en-US" },
  { code: "MVR", symbol: "Rf ", locale: "en-US" },
  { code: "MYR", symbol: "RM ", locale: "en-US" },
];

export function currencyByCode(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Format minor units (paise) as a currency string. */
export function formatMoney(minor: number, cur: Currency): string {
  const num = new Intl.NumberFormat(cur.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(minor) / 100);
  return `${cur.symbol}${num}`;
}

export interface Expense {
  id: string;
  label: string;
  /** Amount in minor units (paise). */
  amount: number;
  /** Person id who paid. */
  paidBy: string;
  /** Person ids who share this expense equally. */
  sharedBy: string[];
}

/** A named group of expense items (e.g. "Stay", "Food & Drink"). */
export interface Category {
  id: string;
  name: string;
  /** Emoji glyph shown on the category header. */
  icon: string;
  items: Expense[];
}

/** Flatten every item across all categories into a single list. */
export function allItems(categories: Category[]): Expense[] {
  return categories.flatMap((c) => c.items);
}

/** Sum of every item in a category, in minor units. */
export function categoryTotal(cat: Category): number {
  return cat.items.reduce((s, i) => s + i.amount, 0);
}

export interface Balance {
  personId: string;
  /** Positive = owed money (paid more than their share); negative = owes. */
  net: number;
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

/**
 * Split `amount` equally across `n` people, distributing the leftover paise to
 * the first few so the shares always sum back to exactly `amount`.
 */
export function splitEqually(amount: number, n: number): number[] {
  if (n <= 0) return [];
  const base = Math.floor(amount / n);
  let remainder = amount - base * n;
  return Array.from({ length: n }, () => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    return base + extra;
  });
}

/** Net balance per person: total paid minus total share of all expenses. */
export function computeBalances(people: Person[], expenses: Expense[]): Balance[] {
  const net = new Map<string, number>(people.map((p) => [p.id, 0]));

  for (const e of expenses) {
    if (e.amount <= 0 || e.sharedBy.length === 0) continue;
    // Payer fronted the whole amount.
    net.set(e.paidBy, (net.get(e.paidBy) ?? 0) + e.amount);
    // Each sharer owes their split.
    const shares = splitEqually(e.amount, e.sharedBy.length);
    e.sharedBy.forEach((pid, i) => {
      net.set(pid, (net.get(pid) ?? 0) - shares[i]);
    });
  }

  return people.map((p) => ({ personId: p.id, net: net.get(p.id) ?? 0 }));
}

export interface PersonLedger {
  personId: string;
  paid: number;
  share: number;
  net: number;
}

/** Per-person paid / fair-share / net, in minor units. */
export function computeLedger(people: Person[], expenses: Expense[]): PersonLedger[] {
  const paid = new Map<string, number>(people.map((p) => [p.id, 0]));
  const share = new Map<string, number>(people.map((p) => [p.id, 0]));

  for (const e of expenses) {
    if (e.amount <= 0 || e.sharedBy.length === 0) continue;
    paid.set(e.paidBy, (paid.get(e.paidBy) ?? 0) + e.amount);
    const shares = splitEqually(e.amount, e.sharedBy.length);
    e.sharedBy.forEach((pid, i) => {
      share.set(pid, (share.get(pid) ?? 0) + shares[i]);
    });
  }

  return people.map((p) => {
    const pd = paid.get(p.id) ?? 0;
    const sh = share.get(p.id) ?? 0;
    return { personId: p.id, paid: pd, share: sh, net: pd - sh };
  });
}

/**
 * Greedy minimum-cash-flow settlement: repeatedly settle the biggest debtor
 * against the biggest creditor. Produces at most (people − 1) transactions.
 */
export function settle(balances: Balance[]): Settlement[] {
  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ id: b.personId, amt: b.net }))
    .sort((a, b) => b.amt - a.amt);
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ id: b.personId, amt: -b.net }))
    .sort((a, b) => b.amt - a.amt);

  const settlements: Settlement[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const give = Math.min(creditors[ci].amt, debtors[di].amt);
    if (give > 0) {
      settlements.push({ fromId: debtors[di].id, toId: creditors[ci].id, amount: give });
    }
    creditors[ci].amt -= give;
    debtors[di].amt -= give;
    if (creditors[ci].amt === 0) ci += 1;
    if (debtors[di].amt === 0) di += 1;
  }

  return settlements;
}
