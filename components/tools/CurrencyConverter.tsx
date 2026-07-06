"use client";

import { useState, useMemo } from "react";
import { CURRENCIES, POPULAR_TARGETS, type Currency } from "@/lib/data/currencies";
import type { FxRates } from "@/lib/fx";
import styles from "./CurrencyConverter.module.css";

const BY_CODE: Record<string, Currency> = Object.fromEntries(CURRENCIES.map((c) => [c.code, c]));

function fmt(value: number, decimals: number): string {
  return value.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Rate needs variable precision: big numbers → few decimals, tiny → more.
function fmtRate(v: number): string {
  if (!isFinite(v) || v === 0) return "0";
  const d = v >= 100 ? 2 : v >= 1 ? 3 : v >= 0.01 ? 4 : 6;
  return v.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: d });
}

export default function CurrencyConverter({ fx }: { fx: FxRates }) {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");

  const { rates, updated, fetchedAt, live } = fx;
  const amt = Number(amount) || 0;

  const rate = useMemo(() => {
    const rf = rates[from];
    const rt = rates[to];
    if (!rf || !rt) return 0;
    return rt / rf; // units of `to` per 1 `from`
  }, [rates, from, to]);

  const converted = amt * rate;
  const toCur = BY_CODE[to];
  const fromCur = BY_CODE[from];
  const toDecimals = toCur?.noDecimals ? 0 : 2;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const options = CURRENCIES.map((c) => (
    <option key={c.code} value={c.code}>
      {c.flag} {c.code} — {c.name}
    </option>
  ));

  return (
    <div className={styles.tool}>
      <div className={styles.card}>
        <div className={styles.amountField}>
          <label htmlFor="cc-amount" className={styles.label}>Amount</label>
          <div className={styles.amountWrap}>
            <span className={styles.prefix}>{fromCur?.symbol}</span>
            <input
              id="cc-amount"
              type="number"
              inputMode="decimal"
              min="0"
              className={styles.amount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="Amount to convert"
            />
          </div>
        </div>

        <div className={styles.pairRow}>
          <div className={styles.field}>
            <label htmlFor="cc-from" className={styles.label}>From</label>
            <select id="cc-from" className={styles.select} value={from} onChange={(e) => setFrom(e.target.value)}>
              {options}
            </select>
          </div>

          <button type="button" className={styles.swap} onClick={swap} aria-label="Swap currencies" title="Swap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 10 4 7l3-3M4 7h13M17 14l3 3-3 3M20 17H7" />
            </svg>
          </button>

          <div className={styles.field}>
            <label htmlFor="cc-to" className={styles.label}>To</label>
            <select id="cc-to" className={styles.select} value={to} onChange={(e) => setTo(e.target.value)}>
              {options}
            </select>
          </div>
        </div>

        <div className={styles.result}>
          <span className={styles.resultLabel}>
            {fromCur?.symbol}{fmt(amt, amt % 1 === 0 ? 0 : 2)} {from} =
          </span>
          <div className={styles.resultValue}>
            <span className={styles.resultSymbol}>{toCur?.symbol}</span>
            {fmt(converted, toDecimals)}
            <span className={styles.resultCode}>{to}</span>
          </div>
          <p className={styles.rateLine}>
            1 {from} = {fmtRate(rate)} {to}
            <span aria-hidden="true"> · </span>
            1 {to} = {fmtRate(rate ? 1 / rate : 0)} {from}
          </p>
        </div>
      </div>

      <div className={styles.popular}>
        <span className={styles.popularLabel}>Popular from ₹:</span>
        {POPULAR_TARGETS.map((code) => (
          <button
            key={code}
            type="button"
            className={`${styles.chip} ${from === "INR" && to === code ? styles.chipActive : ""}`}
            onClick={() => { setFrom("INR"); setTo(code); }}
          >
            {BY_CODE[code]?.flag} INR → {code}
          </button>
        ))}
      </div>

      <div className={styles.updated}>
        <p className={styles.status}>
          <span className={`${styles.dot} ${live ? styles.dotLive : ""}`} aria-hidden="true" />
          {live ? "Live reference rates" : "Indicative rates (live source temporarily unavailable)"}
        </p>
        <p className={styles.stamp}>
          Rates fetched {fetchedAt}
          {updated ? ` · source updated ${updated}` : ""}
        </p>
      </div>
    </div>
  );
}
