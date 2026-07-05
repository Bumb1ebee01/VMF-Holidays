// ─────────────────────────────────────────────────────────────────────────────
// Visa data for the /tools/visa-checker page — for ORDINARY INDIAN PASSPORT
// holders travelling for TOURISM. Each entry links the destination's OFFICIAL
// government immigration / e-visa portal so travellers can verify current rules.
//
// ⚠️ Visa rules change frequently. This is a compiled at-a-glance guide, not legal
// advice — always confirm on the official link (and with the embassy) before you
// book. Last reviewed on the date below.
// ─────────────────────────────────────────────────────────────────────────────

export const VISA_REVIEWED = "July 2026";

export type VisaCategory = "visa-free" | "visa-on-arrival" | "evisa" | "visa-required";

export interface VisaCategoryMeta {
  key: VisaCategory;
  label: string;
  /** Short plain-language meaning shown under the filter / on the legend. */
  meaning: string;
}

export const VISA_CATEGORIES: VisaCategoryMeta[] = [
  { key: "visa-free", label: "Visa-free", meaning: "Enter without a visa (a free travel card or permit may still be required)." },
  { key: "visa-on-arrival", label: "Visa on arrival", meaning: "Get your visa at the airport on arrival — you can often pre-apply online." },
  { key: "evisa", label: "eVisa / eTA", meaning: "Apply online before you fly — approved by email, no embassy visit." },
  { key: "visa-required", label: "Visa required", meaning: "Apply at the embassy / consulate / visa centre before you travel." },
];

export interface VisaEntry {
  country: string;
  flag: string;
  region: string;
  category: VisaCategory;
  /** Permitted tourist stay, e.g. "30 days". */
  stay: string;
  /** One-line summary of the requirement. */
  summary: string;
  /** Extra detail — conditions, recent changes, mandatory arrival cards, fees. */
  note?: string;
  /** Official government source URL. */
  officialUrl: string;
  /** Human-readable domain of the official source. */
  officialLabel: string;
}

// Ordered visa-free → on-arrival → eVisa → visa-required, then by region within.
export const VISAS: VisaEntry[] = [
  // ── Visa-free ───────────────────────────────────────────────────────────────
  {
    country: "Nepal",
    flag: "🇳🇵",
    region: "South Asia",
    category: "visa-free",
    stay: "No limit",
    summary: "No visa needed — Indians enter freely under the 1950 India–Nepal treaty.",
    note: "Carry a valid passport or Voter ID (Aadhaar is not accepted). No time limit on stay.",
    officialUrl: "https://immigration.gov.np/",
    officialLabel: "immigration.gov.np",
  },
  {
    country: "Bhutan",
    flag: "🇧🇹",
    region: "South Asia",
    category: "visa-free",
    stay: "Per permit",
    summary: "No visa, but an Entry Permit + Sustainable Development Fee (SDF) is required.",
    note: "Indians pay a reduced SDF of ₹1,200 per person per night. Book through a Bhutan-licensed operator.",
    officialUrl: "https://bhutan.travel/",
    officialLabel: "bhutan.travel",
  },
  {
    country: "Maldives",
    flag: "🇲🇻",
    region: "Indian Ocean",
    category: "visa-free",
    stay: "30 days",
    summary: "Free visa on arrival for Indians — no fee, no application.",
    note: "Complete the free IMUGA online declaration within 96 hours before arrival and departure.",
    officialUrl: "https://imuga.immigration.gov.mv/",
    officialLabel: "imuga.immigration.gov.mv",
  },
  {
    country: "Thailand",
    flag: "🇹🇭",
    region: "Southeast Asia",
    category: "visa-free",
    stay: "15 days",
    summary: "Visa exemption for tourism — no visa for short stays.",
    note: "Reduced from 60 to 15 days from 19 May 2026. Complete the Thailand Digital Arrival Card (TDAC) within 72 hours before travel.",
    officialUrl: "https://www.thaievisa.go.th/",
    officialLabel: "thaievisa.go.th",
  },
  {
    country: "Malaysia",
    flag: "🇲🇾",
    region: "Southeast Asia",
    category: "visa-free",
    stay: "30 days",
    summary: "Visa-free entry for Indian tourists — a temporary waiver.",
    note: "Currently extended until 31 December 2026. Complete the Malaysia Digital Arrival Card (MDAC) before arrival.",
    officialUrl: "https://www.imi.gov.my/index.php/en/main-services/visa/visa-requirement-by-country/",
    officialLabel: "imi.gov.my",
  },
  {
    country: "Qatar",
    flag: "🇶🇦",
    region: "Middle East",
    category: "visa-free",
    stay: "30 days",
    summary: "Free visa waiver on arrival (also via the Hayya platform).",
    note: "Requires a confirmed return ticket and, for most Indians, a hotel booking through the official Discover Qatar platform.",
    officialUrl: "https://visitqatar.com/intl-en/plan-your-trip/visas",
    officialLabel: "visitqatar.com",
  },
  {
    country: "Kazakhstan",
    flag: "🇰🇿",
    region: "Central Asia",
    category: "visa-free",
    stay: "14 days",
    summary: "Visa-free for up to 14 days per visit for Indian citizens.",
    note: "Capped at 42 days within any 180-day period. For longer stays, apply for an eVisa.",
    officialUrl: "https://www.vmp.gov.kz/en/",
    officialLabel: "vmp.gov.kz",
  },
  {
    country: "Mauritius",
    flag: "🇲🇺",
    region: "Indian Ocean",
    category: "visa-free",
    stay: "60 days",
    summary: "Free entry on arrival for Indian tourists — no visa fee.",
    note: "Complete the free Mauritius All-in-One Travel digital form before check-in. Carry proof of stay, return ticket and funds.",
    officialUrl: "https://passport.govmu.org/",
    officialLabel: "passport.govmu.org",
  },
  {
    country: "Seychelles",
    flag: "🇸🇨",
    region: "Indian Ocean",
    category: "visa-free",
    stay: "Up to 3 months",
    summary: "Visa-free — a free Visitor's Permit is issued on arrival.",
    note: "A Seychelles Travel Authorisation (digital) must be approved before you fly. It is not a visa.",
    officialUrl: "https://seychelles.govtas.com/",
    officialLabel: "seychelles.govtas.com",
  },

  // ── Visa on arrival ───────────────────────────────────────────────────────────
  {
    country: "Indonesia (Bali)",
    flag: "🇮🇩",
    region: "Southeast Asia",
    category: "visa-on-arrival",
    stay: "30 days",
    summary: "Visa on Arrival (or e-VoA) for tourism — a paid visa.",
    note: "Extendable once by 30 more days. Apply for the e-VoA online at the official portal before you fly to save time.",
    officialUrl: "https://evisa.imigrasi.go.id/",
    officialLabel: "evisa.imigrasi.go.id",
  },

  // ── eVisa / eTA ───────────────────────────────────────────────────────────────
  {
    country: "Sri Lanka",
    flag: "🇱🇰",
    region: "South Asia",
    category: "evisa",
    stay: "30 days",
    summary: "Free tourist ETA for Indians (double entry).",
    note: "The ETA is free but still mandatory — apply only on the official government site before travel.",
    officialUrl: "https://eta.gov.lk/",
    officialLabel: "eta.gov.lk",
  },
  {
    country: "Vietnam",
    flag: "🇻🇳",
    region: "Southeast Asia",
    category: "evisa",
    stay: "Up to 90 days",
    summary: "eVisa for all purposes — single or multiple entry.",
    note: "Apply on the national e-visa portal (approx. US$25 single / US$50 multiple). Processing ~3–5 working days.",
    officialUrl: "https://evisa.gov.vn/",
    officialLabel: "evisa.gov.vn",
  },
  {
    country: "Cambodia",
    flag: "🇰🇭",
    region: "Southeast Asia",
    category: "evisa",
    stay: "30 days",
    summary: "eVisa for tourism (single entry).",
    note: "Apply on the official portal (~US$30). A separate e-Arrival card is also required before arrival.",
    officialUrl: "https://www.evisa.gov.kh/",
    officialLabel: "evisa.gov.kh",
  },
  {
    country: "United Arab Emirates (Dubai)",
    flag: "🇦🇪",
    region: "Middle East",
    category: "evisa",
    stay: "30 / 60 days",
    summary: "Pre-arranged tourist eVisa (usually via your airline, hotel or agent).",
    note: "Visa on arrival is available for Indians holding a valid US / UK / EU / GCC visa or residence. VMF arranges the UAE visa for our Dubai packages.",
    officialUrl: "https://icp.gov.ae/en/",
    officialLabel: "icp.gov.ae",
  },
  {
    country: "Saudi Arabia",
    flag: "🇸🇦",
    region: "Middle East",
    category: "evisa",
    stay: "Up to 90 days",
    summary: "Tourist eVisa applied for online.",
    note: "Multiple-entry, valid one year, with mandatory health insurance. Umrah is permitted outside the Hajj season.",
    officialUrl: "https://www.visitsaudi.com/en/plan-your-trip/visa-regulations",
    officialLabel: "visitsaudi.com",
  },
  {
    country: "Georgia",
    flag: "🇬🇪",
    region: "Caucasus",
    category: "evisa",
    stay: "30 days",
    summary: "eVisa online — or visa-free if you hold a valid US/UK/Schengen visa.",
    note: "From 1 Jan 2026 all tourists must carry travel & medical insurance (min. ~₹9–11 lakh cover).",
    officialUrl: "https://www.evisa.gov.ge/",
    officialLabel: "evisa.gov.ge",
  },
  {
    country: "Azerbaijan",
    flag: "🇦🇿",
    region: "Caucasus",
    category: "evisa",
    stay: "30 days",
    summary: "ASAN eVisa applied for online (single entry).",
    note: "~US$23, processed in ~3 working days. Carry a printed copy at the border.",
    officialUrl: "https://evisa.gov.az/en/",
    officialLabel: "evisa.gov.az",
  },
  {
    country: "Egypt",
    flag: "🇪🇬",
    region: "Africa",
    category: "evisa",
    stay: "30 days",
    summary: "Tourist eVisa applied for online (single or multiple entry).",
    note: "~US$25 single entry, valid 3 months from issue. Use only the official government portal.",
    officialUrl: "https://www.visa2egypt.gov.eg/",
    officialLabel: "visa2egypt.gov.eg",
  },
  {
    country: "Kenya",
    flag: "🇰🇪",
    region: "Africa",
    category: "evisa",
    stay: "90 days",
    summary: "Electronic Travel Authorisation (eTA) required before arrival.",
    note: "~US$30 on the official eTA portal; processed in ~3 working days. Replaces the old visa system.",
    officialUrl: "https://etakenya.go.ke/",
    officialLabel: "etakenya.go.ke",
  },

  // ── Visa required (embassy / visa centre) ────────────────────────────────────
  {
    country: "Singapore",
    flag: "🇸🇬",
    region: "Southeast Asia",
    category: "visa-required",
    stay: "Per visa",
    summary: "Visa required — applied for online through an authorised agent / ICA.",
    note: "A 96-hour Visa-Free Transit Facility may apply if you're transiting to a third country. A valid visa doesn't guarantee entry.",
    officialUrl: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
    officialLabel: "ica.gov.sg",
  },
  {
    country: "Turkey (Türkiye)",
    flag: "🇹🇷",
    region: "Middle East",
    category: "visa-required",
    stay: "Per visa",
    summary: "Visa required — sticker visa from the consulate.",
    note: "An eVisa is available ONLY if you hold a valid US, UK, Ireland or Schengen visa/residence permit. There is no visa on arrival.",
    officialUrl: "https://www.evisa.gov.tr/en/",
    officialLabel: "evisa.gov.tr",
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    region: "East Asia",
    category: "visa-required",
    stay: "Up to 90 days",
    summary: "Visa required — an eVisa is available for residents of India.",
    note: "Since Sept 2025, India residents can get a single-entry tourist eVisa via a MOFA-accredited agency (no VFS visit).",
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    officialLabel: "mofa.go.jp",
  },
  {
    country: "South Korea",
    flag: "🇰🇷",
    region: "East Asia",
    category: "visa-required",
    stay: "Per visa",
    summary: "Visa required — Indians are not eligible for K-ETA.",
    note: "Apply for a sticker visa at the Korean embassy / visa centre. Also complete the e-Arrival Card before arrival.",
    officialUrl: "https://www.visa.go.kr/",
    officialLabel: "visa.go.kr",
  },
  {
    country: "Schengen Area (Europe)",
    flag: "🇪🇺",
    region: "Europe",
    category: "visa-required",
    stay: "90 / 180 days",
    summary: "Schengen visa required for 29 European countries (Type C short-stay).",
    note: "Apply via the consulate/VFS of your main destination, ~15 days ahead. Requires travel insurance of at least €30,000. Fee ~€90.",
    officialUrl: "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy/applying-schengen-visa_en",
    officialLabel: "home-affairs.ec.europa.eu",
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    category: "visa-required",
    stay: "Per visa",
    summary: "Standard Visitor visa required — applied for online before travel.",
    note: "Apply on GOV.UK and attend a visa centre for biometrics.",
    officialUrl: "https://www.gov.uk/standard-visitor",
    officialLabel: "gov.uk",
  },
  {
    country: "United States",
    flag: "🇺🇸",
    region: "Americas",
    category: "visa-required",
    stay: "Per visa",
    summary: "B-2 visitor (tourist) visa required — applied for at the US embassy/consulate.",
    note: "Complete form DS-160, pay the fee and attend an interview. Plan well ahead for appointment wait times.",
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
    officialLabel: "travel.state.gov",
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    region: "Oceania",
    category: "visa-required",
    stay: "Per visa",
    summary: "Visitor visa (subclass 600) required — applied for online.",
    note: "Indians apply online through the Department of Home Affairs (ImmiAccount).",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
    officialLabel: "immi.homeaffairs.gov.au",
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    region: "Americas",
    category: "visa-required",
    stay: "Per visa",
    summary: "Visitor visa (Temporary Resident Visa) required for Indian tourists.",
    note: "An eTA applies only if you fly and already hold a valid Canadian visa (or a valid US visa in some cases). Apply on IRCC.",
    officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
    officialLabel: "canada.ca",
  },
];
