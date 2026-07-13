// ─────────────────────────────────────────────────────────────────────────────
// Departure-city landing pages (/packages-from/[city]). VMF arranges trips from
// any city, so these pages reframe the same packages for high-intent "holiday
// packages from <city>" searches — a page per metro, generated from this list.
// ─────────────────────────────────────────────────────────────────────────────

export interface DepartureCity {
  slug: string;
  name: string;
  /** Home airport — named in the copy so the page reads as genuinely local. */
  airport: string;
  /** Destinations that are especially popular ex-this-city (for the intro copy). */
  popular: string;
}

export const DEPARTURE_CITIES: DepartureCity[] = [
  { slug: "mumbai", name: "Mumbai", airport: "Chhatrapati Shivaji Maharaj International Airport (BOM)", popular: "Goa, the Maldives, Dubai and Thailand" },
  { slug: "bangalore", name: "Bangalore", airport: "Kempegowda International Airport (BLR)", popular: "Kerala, Bali, the Maldives and Singapore" },
  { slug: "delhi", name: "Delhi", airport: "Indira Gandhi International Airport (DEL)", popular: "Kashmir, Rajasthan, Dubai and Thailand" },
  { slug: "pune", name: "Pune", airport: "Pune Airport (PNQ)", popular: "Goa, Kerala, Dubai and Bali" },
  { slug: "hyderabad", name: "Hyderabad", airport: "Rajiv Gandhi International Airport (HYD)", popular: "Goa, the Maldives, Thailand and Singapore" },
  { slug: "chennai", name: "Chennai", airport: "Chennai International Airport (MAA)", popular: "Kerala, the Maldives, Sri Lanka and Singapore" },
  { slug: "kolkata", name: "Kolkata", airport: "Netaji Subhas Chandra Bose International Airport (CCU)", popular: "the Andamans, Thailand, Vietnam and Bali" },
  { slug: "ahmedabad", name: "Ahmedabad", airport: "Sardar Vallabhbhai Patel International Airport (AMD)", popular: "Goa, Dubai, Thailand and the Maldives" },
];

export function getDepartureCity(slug: string): DepartureCity | undefined {
  return DEPARTURE_CITIES.find((c) => c.slug === slug);
}
