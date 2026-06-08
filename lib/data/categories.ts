import type { TripCategory } from "@/lib/types";

export const categories: TripCategory[] = [
  {
    slug: "honeymoon",
    label: "Honeymoon",
    icon: "💑",
    image: "/images/categories/honeymoon.jpg",
    blurb: "Romantic escapes crafted for two — private villas, candlelit dinners and memories for a lifetime.",
  },
  {
    slug: "family",
    label: "Family Tours",
    icon: "👨‍👩‍👧‍👦",
    image: "/images/categories/family.jpg",
    blurb: "Kid-friendly itineraries with the perfect mix of fun, culture and relaxation for all ages.",
  },
  {
    slug: "adventure",
    label: "Adventure",
    icon: "🧗",
    image: "/images/categories/adventure.jpg",
    blurb: "Trek, raft, paraglide and dive — curated adventure holidays for thrill-seekers.",
  },
  {
    slug: "corporate",
    label: "Corporate / MICE",
    icon: "💼",
    image: "/images/categories/corporate.jpg",
    blurb: "End-to-end MICE solutions — conferences, incentive trips, team outings and corporate retreats.",
  },
  {
    slug: "pilgrimage",
    label: "Pilgrimage",
    icon: "🙏",
    image: "/images/categories/pilgrimage.jpg",
    blurb: "Sacred journeys to India's holiest sites — Char Dham, Vaishno Devi, Tirupati and more.",
  },
  {
    slug: "college",
    label: "College Tours",
    icon: "🎓",
    image: "/images/categories/college.jpg",
    blurb: "Budget-friendly group tours for students — educational, adventurous and unforgettable.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
