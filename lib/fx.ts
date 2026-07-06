import { FALLBACK_RATES, FX_FALLBACK_DATE } from "./data/currencies";

// Live foreign-exchange rates for the currency-converter tool. Fetched server-side
// (base INR) and cached for an hour; on ANY failure (network, timeout, bad payload)
// we fall back to a bundled snapshot, so the page always renders and the build
// never breaks. No API key, no client-side fetch — nothing that can harm the site.
export interface FxRates {
  /** Units of each currency per 1 INR. */
  rates: Record<string, number>;
  /** When the source last published these rates (IST), or the snapshot date. */
  updated: string | null;
  /** When our server fetched them (IST). */
  fetchedAt: string;
  /** True when the rates came from the live source. */
  live: boolean;
}

function fmtIST(d: Date): string {
  return (
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(d) + " IST"
  );
}

export async function getFxRates(): Promise<FxRates> {
  const fetchedAt = fmtIST(new Date());
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`fx http ${res.status}`);
    const data = (await res.json()) as {
      result?: string;
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };
    if (data.result !== "success" || !data.rates || typeof data.rates.INR !== "number") {
      throw new Error("fx payload");
    }
    const src = data.time_last_update_utc ? new Date(data.time_last_update_utc) : null;
    return {
      rates: data.rates,
      updated: src && !isNaN(src.getTime()) ? fmtIST(src) : null,
      fetchedAt,
      live: true,
    };
  } catch {
    return { rates: FALLBACK_RATES, updated: `${FX_FALLBACK_DATE} (snapshot)`, fetchedAt, live: false };
  }
}
