// Shared lead field metadata — sources, labels and the option lists used by the
// manual lead form + edit form. Single source so the form, the actions and the
// list/detail labels never drift.

export const LEAD_SOURCES = [
  "CONTACT_FORM",
  "TRIP_WIZARD",
  "PACKAGE_PAGE",
  "ASK_QUESTION",
  "PDF_DOWNLOAD",
  "OTHER",
] as const;

export type LeadSourceValue = (typeof LEAD_SOURCES)[number];

export const SOURCE_LABELS: Record<string, string> = {
  CONTACT_FORM: "Contact Form",
  TRIP_WIZARD: "Trip Builder",
  PACKAGE_PAGE: "Package Page",
  ASK_QUESTION: "Question",
  PDF_DOWNLOAD: "PDF Download",
  OTHER: "Other / Walk-in",
};

// Drives urgency routing on the public form; keep the first two in sync with
// URGENT_TIMEFRAMES in app/api/enquiry/route.ts.
export const TIMEFRAMES = [
  "Within 2 weeks",
  "This month",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Just exploring",
] as const;

export const CONTACT_MODES = ["WhatsApp", "Phone call", "Email"] as const;

export const HOTEL_CATEGORIES = ["3 Star", "4 Star", "5 Star", "Budget", "Luxury"] as const;

export const MEAL_PLANS = ["Breakfast only", "Half board", "Full board", "All inclusive"] as const;
