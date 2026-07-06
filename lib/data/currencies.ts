// ─────────────────────────────────────────────────────────────────────────────
// Currencies for the /tools/currency-converter page. Live rates are fetched from
// exchangerate-api's free open endpoint (base INR) at request time; FALLBACK_RATES
// is a snapshot used only if that fetch fails, so the tool always works.
// Rates are indicative/reference only — banks, cards and forex counters differ.
// ─────────────────────────────────────────────────────────────────────────────

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  /** Currencies usually quoted without decimals. */
  noDecimals?: boolean;
}

// Curated to Indian travellers' destinations + major world currencies. The live
// API covers 160+ codes; the converter only offers these for a clean picker.
export const CURRENCIES: Currency[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", noDecimals: true },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", noDecimals: true },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "रू", flag: "🇳🇵" },
  { code: "MVR", name: "Maldivian Rufiyaa", symbol: "Rf", flag: "🇲🇻" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", flag: "🇶🇦" },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", flag: "🇸🇦" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾", flag: "🇬🇪" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼", flag: "🇦🇿" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", flag: "🇰🇿", noDecimals: true },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", flag: "🇲🇺" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "₨", flag: "🇸🇨" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", noDecimals: true },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", noDecimals: true },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
];

// Popular "INR → destination currency" quick picks shown as chips.
export const POPULAR_TARGETS = ["USD", "AED", "THB", "EUR", "GBP", "SGD"];

export const FX_FALLBACK_DATE = "5 July 2026";

// Units of each currency per 1 INR (snapshot; live fetch overrides this).
export const FALLBACK_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.010492,
  EUR: 0.009173,
  GBP: 0.007859,
  AED: 0.038531,
  THB: 0.348134,
  SGD: 0.013553,
  MYR: 0.042742,
  IDR: 188.571288,
  VND: 274.104889,
  LKR: 3.521604,
  NPR: 1.6,
  MVR: 0.162486,
  QAR: 0.03819,
  SAR: 0.039345,
  TRY: 0.49177,
  GEL: 0.027741,
  AZN: 0.017857,
  KZT: 4.972134,
  KES: 1.356059,
  EGP: 0.51515,
  MUR: 0.502831,
  SCR: 0.155494,
  AUD: 0.015126,
  CAD: 0.014899,
  JPY: 1.692255,
  KRW: 16.071709,
  CHF: 0.008431,
  CNY: 0.071153,
  HKD: 0.082322,
};
