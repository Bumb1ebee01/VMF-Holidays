// ─────────────────────────────────────────────────────────────────────────────
// VMF Holidays — Tour Terms & Conditions (for itinerary/quotation PDFs).
//
// The DOMESTIC set is transcribed verbatim from VMF's live domestic itinerary
// template. The INTERNATIONAL set reuses the shared clauses and adds the extra
// editions international travel needs (passport/visa, forex, international air,
// insurance/health). Sections are numbered at render time, so reordering or
// inserting a clause never requires renumbering here.
//
// Kept as data (not baked into the PDF component) so it can later be surfaced /
// edited in the admin CMS without touching the renderer.
// ─────────────────────────────────────────────────────────────────────────────

export interface TermsSection {
  heading: string;
  points: string[];
}

export type TourRegion = "domestic" | "international";

// ---- Shared clauses (identical for both) ---------------------------------------

// Domestic and international run different notice windows — international
// suppliers (airlines, overseas hotels, visas) lock in money much earlier.
// Exported so the public /terms page renders the same slab the quotation
// enforces; the two must never diverge.
export const DOMESTIC_CANCELLATION: TermsSection = {
  heading: "Cancellation Policy",
  points: [
    "45 days or more before departure: 25% of the total package cost is charged as a cancellation fee.",
    "30–44 days before departure: 50% of the package cost is charged.",
    "15–29 days before departure: 75% of the package cost is charged.",
    "8–14 days before departure: 90% of the package cost is charged.",
    "7 days or less before departure, or No Show: 100% of the package cost is charged.",
    "Cancellation charges apply to the full package cost regardless of the amount paid to date; any shortfall between the amount paid and the charge due is payable by the traveller.",
    "Non-refundable costs — air and rail tickets, visa fees, and pre-booked or peak-season hotel nights — are charged in full at actuals, over and above the applicable cancellation fee.",
    "Refunds, where applicable, are processed within 10–15 working days of a written cancellation request.",
  ],
};

export const INTL_CANCELLATION: TermsSection = {
  heading: "Cancellation Policy",
  points: [
    "60 days or more before departure: 25% of the total land-package cost is charged as a cancellation fee.",
    "45–59 days before departure: 50% of the package cost is charged.",
    "30–44 days before departure: 75% of the package cost is charged.",
    "15–29 days before departure: 90% of the package cost is charged.",
    "14 days or less before departure, or No Show: 100% of the package cost is charged.",
    "Air tickets, visa fees, and non-refundable hotels are non-refundable once booked and are charged in full at actuals in every case, over and above the applicable cancellation fee.",
    "Cancellation charges apply to the full package cost regardless of the amount paid to date; any shortfall is payable by the traveller.",
    "Refunds, where applicable, are processed within 10–15 working days of a written cancellation request.",
  ],
};

const HOTELS: TermsSection = {
  heading: "Hotels & Accommodation",
  points: [
    "Check-in: 14:00 hrs onwards | Check-out: 11:00 hrs.",
    "Early check-in / late check-out is subject to hotel policy and availability, and may incur extra charges.",
    "Rooms are allotted on twin / double / triple sharing basis as per the chosen package.",
    "In case of non-availability of the listed hotel, an equivalent category hotel will be arranged.",
  ],
};

const TRANSPORT: TermsSection = {
  heading: "Transportation & Sightseeing",
  points: [
    "Air-conditioned vehicles will be provided as per the itinerary for transfers and sightseeing.",
    "The vehicle operates strictly as per the itinerary and not on a disposal basis.",
    "Vehicle timings and routes are subject to local regulations, traffic, and weather conditions.",
    "The sequence of sightseeing may be rearranged by the tour manager / driver to ensure smooth operation, but all inclusions will be covered.",
  ],
};

const MEALS: TermsSection = {
  heading: "Meals & Inclusions",
  points: [
    "Meals and inclusions are provided as per the final confirmed itinerary.",
    "Meals will be fixed-menu or buffet, depending on the hotel or restaurant arrangement.",
    "Personal expenses, meals not mentioned, laundry, shopping, tips, room service, beverages, and any optional activities not specified are excluded.",
  ],
};

const FORCE_MAJEURE: TermsSection = {
  heading: "Force Majeure & Unforeseen Events",
  points: [
    "VMF Holidays shall not be liable for any delay, curtailment, change in itinerary, or additional cost arising from circumstances beyond our control — natural calamities, weather, strikes, political unrest, pandemics or health advisories, flight / train cancellations, or accidents.",
    "In such events the applicable cancellation charges and any non-recoverable supplier costs still apply, and any additional expense is borne by the traveller directly.",
    "Where feasible, VMF Holidays may at its sole discretion offer a future-travel credit for the recoverable portion; this is a goodwill measure and does not constitute an entitlement to a refund.",
  ],
};

const CONDUCT: TermsSection = {
  heading: "Conduct & Responsibility",
  points: [
    "Travellers are expected to maintain discipline, punctuality, and respectful behaviour throughout the tour.",
    "VMF Holidays will not be responsible for loss of valuables, documents, or personal belongings during the trip.",
    "Any misbehaviour or misconduct causing inconvenience to others may result in immediate expulsion from the tour without any refund.",
  ],
};

const LIABILITY: TermsSection = {
  heading: "Liability Disclaimer",
  points: [
    "VMF Holidays acts as an intermediary between hotels, airlines, transport providers, and other service suppliers.",
    "While we ensure reliable service, we are not responsible for any injury, damage, delay, or loss caused by third-party operations or negligence.",
    "All arrangements are made in good faith; VMF Holidays' liability is limited to the total cost of the tour package paid.",
  ],
};

const JURISDICTION: TermsSection = {
  heading: "Jurisdiction",
  points: ["All disputes shall be subject to the exclusive jurisdiction of the courts in Goa, India."],
};

const AMENDMENTS: TermsSection = {
  heading: "Amendments & Changes",
  points: [
    "Requests for date change, itinerary modification, or name change must be made at least 21 days prior to departure.",
    "Any amendment is subject to availability and may attract additional cost, including any supplier re-booking charge or fare / tariff difference.",
    "No refund will be made for unused services, missed sightseeing, or early departure during the tour.",
  ],
};

// ---- Domestic-specific ---------------------------------------------------------

const DOMESTIC_BOOKING: TermsSection = {
  heading: "Booking & Payment Policy",
  points: [
    "To confirm your booking, a non-refundable advance of 50% of the total package cost is required at the time of booking.",
    "The balance must be paid at least 21 days prior to the departure date.",
    "For bookings made within 21 days of departure, 100% payment is required at the time of confirmation.",
    "Quoted rates hold for 7 days from the date of quotation and until full payment is received; rates may be revised for changes in applicable taxes, transport / fuel costs, or hotel tariffs before full payment.",
    "Payments can be made via bank transfer, UPI, cheque, or other modes communicated by VMF Holidays.",
    "The booking stands confirmed only after receipt of payment and written acknowledgment from VMF Holidays.",
  ],
};

const DOMESTIC_DOCUMENTS: TermsSection = {
  heading: "Identification & Travel Documents",
  points: [
    "All travellers must carry valid government-issued photo ID (Aadhaar Card, Voter ID, Passport, or Driving Licence).",
    "For children, a school ID or birth certificate must be presented at check-in.",
    "VMF Holidays will not be responsible for denied boarding / check-in due to lack of valid ID documents.",
  ],
};

// ---- International-specific (the extra editions) --------------------------------

const INTL_BOOKING: TermsSection = {
  heading: "Booking & Payment Policy",
  points: [
    "To confirm your booking, a non-refundable advance of at least 50% of the total package cost is required at the time of booking; a higher advance may apply and is confirmed on your quotation.",
    "As international airline tickets and certain hotels / services are non-refundable once issued, full or higher payment may be required earlier than for domestic tours.",
    "The balance must be paid at least 45 days prior to departure, and in all cases before travel-document / visa processing; for bookings within 45 days, full payment is required at confirmation.",
    "Payments can be made via bank transfer, UPI, cheque, or other modes communicated by VMF Holidays.",
    "The booking stands confirmed only after receipt of payment and written acknowledgment from VMF Holidays.",
  ],
};

const INTL_PASSPORT_VISA: TermsSection = {
  heading: "Passport, Visa & Travel Documents",
  points: [
    "Every traveller must hold a passport valid for at least six (6) months beyond the tour return date, with sufficient blank pages for visa stamping.",
    "Obtaining the correct visa is the traveller's responsibility; VMF Holidays assists with documentation but does not guarantee visa approval.",
    "Visa fees and charges for biometrics, appointments, or additional documents are not included unless expressly stated.",
    "Visa rejection or delay by the concerned embassy / consulate does not entitle the traveller to a refund of the package cost or visa fees — standard cancellation charges apply.",
    "Denied boarding or entry by any airline or immigration authority is beyond VMF Holidays' control and carries no refund.",
  ],
};

const INTL_FOREX: TermsSection = {
  heading: "Foreign Exchange & Pricing",
  points: [
    "International package rates are based on the foreign-exchange rate, airfare, and taxes prevailing on the date of quotation.",
    "Rates may be revised in case of significant currency fluctuation, or a change in airfare or taxes, before full payment is received.",
    "Personal foreign-exchange / spending money is to be arranged by the traveller and is not included.",
  ],
};

const INTL_FLIGHTS: TermsSection = {
  heading: "International Flights & Baggage",
  points: [
    "Airfare, airline taxes, and baggage allowance are governed by the respective airline's policy; excess-baggage charges are payable directly by the traveller.",
    "VMF Holidays is not responsible for flight delays, cancellations, rescheduling, or schedule changes by the airline.",
    "Missed connections or unused services arising from flight changes are not the responsibility of VMF Holidays.",
  ],
};

const INTL_INSURANCE_HEALTH: TermsSection = {
  heading: "Travel Insurance & Health",
  points: [
    "Overseas travel and medical insurance is strongly recommended, and is mandatory for certain destinations; it is the traveller's responsibility unless included in writing.",
    "Vaccinations, health certificates, and fitness requirements as per the destination country's regulations are the traveller's responsibility.",
  ],
};

// ---- Assembled sets ------------------------------------------------------------

const DOMESTIC_TERMS: TermsSection[] = [
  DOMESTIC_BOOKING,
  DOMESTIC_CANCELLATION,
  AMENDMENTS,
  DOMESTIC_DOCUMENTS,
  HOTELS,
  TRANSPORT,
  MEALS,
  FORCE_MAJEURE,
  CONDUCT,
  LIABILITY,
  JURISDICTION,
];

const INTERNATIONAL_TERMS: TermsSection[] = [
  INTL_BOOKING,
  INTL_CANCELLATION,
  AMENDMENTS,
  INTL_PASSPORT_VISA,
  INTL_FOREX,
  INTL_FLIGHTS,
  INTL_INSURANCE_HEALTH,
  HOTELS,
  TRANSPORT,
  MEALS,
  FORCE_MAJEURE,
  CONDUCT,
  LIABILITY,
  JURISDICTION,
];

export function getTerms(region: TourRegion): { title: string; sections: TermsSection[] } {
  return region === "international"
    ? { title: "International Tour — Terms & Conditions", sections: INTERNATIONAL_TERMS }
    : { title: "Domestic Tour — Terms & Conditions", sections: DOMESTIC_TERMS };
}

/** Short print notes shown near the price, mirroring VMF's live quotation footer. */
export const PRICE_NOTES = [
  "Price is inclusive of all applicable taxes (GST).",
  "Rates are valid for 7 days from the date of quotation.",
  "100% transparent pricing — no hidden charges.",
];
