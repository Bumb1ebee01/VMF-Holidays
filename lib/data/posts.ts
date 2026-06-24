// Starter blog posts seeded on first run. The team can edit or delete these in
// the admin panel — they exist so /blog is never empty at launch.

export interface SeedPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
}

const C = (name: string) =>
  `https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/${name}.jpg`;

export const posts: SeedPost[] = [
  {
    slug: "best-time-to-visit-goa",
    title: "Best Time to Visit Goa: A Month-by-Month Guide",
    excerpt:
      "Sun-soaked beaches, the monsoon's green hush, or peak-season parties — here's exactly when to plan your Goa trip depending on what you're after.",
    coverImage: C("goa"),
    author: "VMF Holidays",
    tags: ["Goa", "Travel Tips", "When to Go"],
    content: `Goa is a year-round destination, but the experience changes completely depending on when you arrive. Here's how to pick your window.

# Peak Season: November to February
This is Goa at its most famous — clear skies, warm days around 28–32°C, and cool evenings perfect for beach shacks and night markets. Christmas and New Year are spectacular but book early; hotels fill up months ahead and prices climb steeply.

- Best for: first-time visitors, beach lovers, nightlife and festivals
- Watch out for: higher prices and crowded north Goa beaches

# Shoulder Season: March to May
The crowds thin out and rates drop, but the heat builds — expect humid days above 35°C by May. Mornings and evenings are still lovely, and you'll have the sands almost to yourself.

- Best for: budget travellers and couples wanting quiet beaches

# Monsoon: June to September
Most people skip the monsoon, which is exactly why we love recommending it. Goa turns a brilliant green, waterfalls like Dudhsagar roar to life, and boutique stays offer their lowest rates of the year. Pack a light raincoat and embrace the slower pace.

- Best for: photographers, monsoon lovers, and serious value

# Our take
For the classic Goa holiday, target November to early February. For romance and savings, March or a monsoon escape is a hidden gem. Tell us your dates and we'll match you to the right stretch of coast.`,
  },
  {
    slug: "kerala-6-day-itinerary",
    title: "Kerala in 6 Days: The Perfect First-Timer's Itinerary",
    excerpt:
      "Cochin's old harbour, Munnar's tea hills, a Thekkady spice trail and a night on the Alleppey backwaters — a balanced route through God's Own Country.",
    coverImage: C("kerala"),
    author: "VMF Holidays",
    tags: ["Kerala", "Itinerary", "India"],
    content: `Kerala packs hills, wildlife, backwaters and beaches into one compact, easy-to-travel state. This six-day route is the one we book most often for first-timers.

# Day 1–2: Kochi
Land in Kochi and ease in with a walk through Fort Kochi — the Chinese fishing nets at sunset, colonial streets, and a Kathakali performance in the evening.

# Day 3: Munnar
Drive up into the Western Ghats to Munnar, where tea estates roll out in every direction. Stop at a tea museum and the Eravikulam National Park.

# Day 4: Thekkady
Head to Thekkady for the Periyar wildlife reserve. A spice-plantation tour here is a highlight — cardamom, pepper and vanilla growing wild.

# Day 5: Alleppey Backwaters
The trip's centrepiece: a private houseboat on the Alleppey backwaters. Glide past paddy fields and village life, with a chef cooking fresh Keralan meals on board.

# Day 6: Departure
A relaxed morning before transferring back to Kochi for your flight home.

This route works in either direction and is easy to extend with a couple of beach days in Kovalam or Varkala. We handle the car, driver, houseboat and stays end to end.`,
  },
  {
    slug: "maldives-honeymoon-on-a-budget",
    title: "Honeymoon in the Maldives on a Budget: 7 Insider Tips",
    excerpt:
      "Overwater villas have a reputation for being out of reach. Here's how couples actually do the Maldives without the eye-watering bill.",
    coverImage: C("maldives"),
    author: "VMF Holidays",
    tags: ["Maldives", "Honeymoon", "Budget Travel"],
    content: `The Maldives doesn't have to mean a five-figure bill. With a little planning, a dream honeymoon here is far more attainable than the brochures suggest.

# 1. Travel in the shoulder months
May and September sit just outside peak season. You'll trade the occasional shower for dramatically lower resort rates.

# 2. Consider a guesthouse island
Local islands like Maafushi offer beautiful beaches and excursions at a fraction of resort prices — with the option of a day trip to a luxury resort.

# 3. Book a half-board plan
Full-board adds up fast. Half-board covers breakfast and dinner, leaving lunch flexible and cheaper.

# 4. Pick one overwater night
Splurge on a single night in an overwater villa for the photos and the moment, then move to a beach villa for the rest.

# 5. Bundle flights and transfers
Seaplane and speedboat transfers are a hidden cost. Booking them with your stay as a package is almost always cheaper.

# 6. Skip the peak-holiday weeks
Avoid Christmas, New Year and Easter and the same villa can cost half as much.

# 7. Let us negotiate
We hold rates with Maldivian resorts that rarely appear online. Tell us your budget and we'll build the trip around it — not the other way round.`,
  },
];
