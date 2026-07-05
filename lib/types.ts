export interface GuideSection {
  heading: string;
  body: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  /** State this destination rolls up into on the domestic tiles (India only). */
  state?: string;
  region: "domestic" | "international";
  heroImage: string;
  fromPrice: number;
  blurb: string;
  tags: string[];
  // Travel-guide content (all optional; the guide page falls back to blurb/tags).
  guideIntro?: string;
  guideBestTime?: string;
  guideThingsToDo?: string[];
  guideTip?: string;
  guideGallery?: string[];
  guideSections?: GuideSection[];
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
  priceOnRequest?: boolean;
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

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string[];
  publishedAt: Date | null;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  image: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  badge: string | null;
  endsAt: Date | null;
}

export interface GalleryPhoto {
  id: string;
  image: string;
  caption: string | null;
  location: string | null;
}

export interface EnquiryPayload {
  name: string;
  phone: string;
  email: string;
  destination?: string;
  dates?: string;
  travelers?: string;
  budget?: string;
  tripLength?: string;
  contactMode?: string;
  contactTime?: string;
  interests?: string[];
  message?: string;
  packageTitle?: string;
}
