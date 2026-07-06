import { FALLBACK_RATES, FX_FALLBACK_DATE } from "./data/currencies";

// Live foreign-exchange rates for the currency-converter tool. Fetched server-side
// (base INR) and cached for an hour; on any failure we fall back to a bundled
// snapshot so the page always renders and the build never breaks.
export interface FxRates {
  /** Units of each currency per 1 INR. */
  rates: Record<string, number>;
  /** Human-readable date the rates were published. */
  updated: string | null;
  /** True when the rates came from the live source. */
  live: boolean;
}

export async function getFxRates(): Promise<FxRates> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 3600 },
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
    return { rates: data.rates, updated: data.time_last_update_utc ?? null, live: true };
  } catch {
    return { rates: FALLBACK_RATES, updated: FX_FALLBACK_DATE, live: false };
  }
}
