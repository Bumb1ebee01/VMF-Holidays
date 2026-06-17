export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: "domestic" | "international";
  heroImage: string;
  fromPrice: number;
  blurb: string;
  tags: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Package {
  slug: string;
  title: string;
  destination: string;
  destinationSlug: string;
  category: TripCategorySlug;
  duration: string;
  nights: number;
  heroImage: string;
  gallery: string[];
  hotel?: string;
  hotelImage?: string;
  fromPrice: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  featured: boolean;
  badge?: string;
}

export type TripCategorySlug =
  | "honeymoon"
  | "family"
  | "adventure"
  | "corporate"
  | "pilgrimage"
  | "college";

export interface TripCategory {
  slug: TripCategorySlug;
  label: string;
  icon: string;
  image: string;
  blurb: string;
}

export interface Testimonial {
  name: string;
  location: string;
  trip: string;
  rating: number;
  quote: string;
}

export interface EnquiryPayload {
  name: string;
  phone: string;
  email: string;
  destination?: string;
  dates?: string;
  travelers?: string;
  budget?: string;
  interests?: string[];
  message?: string;
  packageTitle?: string;
}
