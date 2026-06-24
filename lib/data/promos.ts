// Starter offers + gallery photos seeded on first run so the /offers and
// /gallery pages are never empty at launch. The team replaces these with real
// flyers and trip photos in the admin panel. Images reuse existing destination
// photos as placeholders.

const C = (name: string) =>
  `https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/${name}.jpg`;

// Rajasthan has no Cloudinary file — its destination image is the Hawa Mahal on Wikimedia.
const RAJASTHAN =
  "https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg";

export interface SeedOffer {
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  badge: string | null;
  sortOrder: number;
}

export const seedOffers: SeedOffer[] = [
  {
    title: "Monsoon Magic — Kerala 6N from ₹24,999",
    description: "Backwaters, hill stations and a houseboat night, all in at one green-season price.",
    image: C("kerala"),
    ctaLabel: "Enquire now",
    ctaHref: "/packages?destination=kerala",
    badge: "Limited time",
    sortOrder: 1,
  },
  {
    title: "Maldives Honeymoon — 4N Overwater from ₹89,999",
    description: "Private villa, candlelit dinner and seaplane transfers for two.",
    image: C("maldives"),
    ctaLabel: "Enquire now",
    ctaHref: "/packages?destination=maldives",
    badge: "Couples",
    sortOrder: 2,
  },
  {
    title: "Rajasthan Royal — 7N Heritage Trail",
    description: "Jaipur, Udaipur and Jodhpur palaces with early-bird savings.",
    image: RAJASTHAN,
    ctaLabel: "View deal",
    ctaHref: "/packages?destination=rajasthan",
    badge: "Early bird",
    sortOrder: 3,
  },
  {
    title: "Dubai Family Escape — 5N with Theme Parks",
    description: "Desert safari, Burj Khalifa and a full theme-park day for the kids.",
    image: C("dubai"),
    ctaLabel: "Enquire now",
    ctaHref: "/packages?destination=dubai",
    badge: "Family",
    sortOrder: 4,
  },
  {
    title: "Goa Long Weekend — 3N All-In",
    description: "Beachfront stay, sunset cruise and breakfast included.",
    image: C("goa"),
    ctaLabel: "Grab it",
    ctaHref: "/packages?destination=goa",
    badge: "Weekend",
    sortOrder: 5,
  },
  {
    title: "Thailand Twin-City — Bangkok + Phuket 6N",
    description: "City buzz and island calm in one easy itinerary.",
    image: C("thailand"),
    ctaLabel: "View deal",
    ctaHref: "/packages?destination=thailand",
    badge: "Bestseller",
    sortOrder: 6,
  },
];

export interface SeedGalleryPhoto {
  image: string;
  caption: string;
  location: string;
  sortOrder: number;
}

export const seedGallery: SeedGalleryPhoto[] = [
  { image: C("kerala"), caption: "Sunrise over the Alleppey backwaters", location: "Kerala, India", sortOrder: 1 },
  { image: C("maldives"), caption: "Overwater villa mornings", location: "Maldives", sortOrder: 2 },
  { image: RAJASTHAN, caption: "Palace courtyards of the Pink City", location: "Jaipur, Rajasthan", sortOrder: 3 },
  { image: C("goa"), caption: "Golden hour on the sands", location: "Goa, India", sortOrder: 4 },
  { image: C("dubai"), caption: "Skyline from the desert dunes", location: "Dubai, UAE", sortOrder: 5 },
  { image: C("thailand"), caption: "Longtail boats and limestone cliffs", location: "Phuket, Thailand", sortOrder: 6 },
  { image: C("bali"), caption: "Terraced rice fields", location: "Bali, Indonesia", sortOrder: 7 },
  { image: C("singapore"), caption: "Gardens by the Bay after dark", location: "Singapore", sortOrder: 8 },
];
