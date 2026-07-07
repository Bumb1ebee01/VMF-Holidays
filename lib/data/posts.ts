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
  {
    slug: "vietnam-package-from-india",
    title: "Vietnam Package from India: Cost, Visa & 6-Day Plan",
    excerpt:
      "What a Vietnam trip really costs from India — the e-visa, a 6-day Hanoi to Hoi An plan, and package prices from ₹24,500. Get a free custom quote.",
    coverImage: "/images/destinations/vietnam.jpg",
    author: "VMF Holidays",
    tags: ["Vietnam", "Vietnam package from India", "Visa", "Itinerary", "International"],
    content: `Vietnam has quietly become one of the best-value international trips from India — long beaches, limestone bays, lantern-lit old towns and food you'll think about for years, often for less than a domestic Himalayan holiday. Here's what it costs, how the visa works, and a route we book again and again.

# What a Vietnam trip costs from India
Our Vietnam packages start from around ₹24,500 per person on a land-only, twin-sharing basis, with international flights on top depending on your city and season. A typical six-day trip falls into three brackets:

- Smart value: 3-star stays, group transfers and the key sightseeing
- Comfort: 4-star central hotels, a private cab and a Ha Long Bay cruise
- Premium: 5-star resorts, a private guide and business-class flight options

# Do Indians need a visa for Vietnam?
Yes — most Indian travellers use the Vietnam e-visa, applied for online before you fly. It's straightforward, but the portal and document rules change often. We handle the application, the photo spec and the timing as part of your package, so it's one less thing to get wrong.

# A 6-day Vietnam itinerary
- Day 1–2: Hanoi — the Old Quarter, Hoan Kiem Lake and a street-food walk
- Day 3: Ha Long Bay — an overnight cruise among the limestone karsts
- Day 4: Fly to Da Nang — My Khe beach and the Marble Mountains
- Day 5: Hoi An — the lantern-lit ancient town and a tailor visit
- Day 6: Departure, or extend with Ho Chi Minh City and the Mekong Delta

# What's included in a VMF Vietnam package
- Accommodation, daily breakfast and the listed meals
- Airport and intercity transfers, plus a Ha Long Bay cruise
- e-visa assistance and responsive on-trip support
- A planner who tailors the route to you

# Best time to visit
Vietnam is long, so the weather varies from north to south. February to April and August to October are the safest all-country windows. Tell us your dates and we'll route around the rain.

# Plan your customised Vietnam trip
Every itinerary we sell is built around you — your dates, your pace, your budget. Start with our [trip builder](/trip-builder), [browse destinations](/destinations), or [talk to our team](/contact) for a free quote.`,
  },
  {
    slug: "travel-agency-in-goa",
    title: "Travel Agency in Goa: Why Plan With a Local Expert",
    excerpt:
      "A Goa-based travel agency planning honeymoons, family, group and corporate trips across India and abroad — transparent pricing and personal service.",
    coverImage: C("goa"),
    author: "VMF Holidays",
    tags: ["Goa", "Travel Agency", "Customised Packages", "About VMF"],
    content: `Booking through a faceless website is easy — until a flight shifts, a hotel disappoints, or you want to change plans mid-trip. That's where a local travel agency earns its keep. VMF Holidays is based in Goa and plans trips for travellers across India and beyond.

# Why use a local Goa travel agency
- A real, dedicated human plans your trip and stays reachable before, during and after it
- Transparent pricing with a full cost breakdown — no hidden charges and no fake deals
- Supplier relationships that unlock rates and rooms you won't find online
- On-ground know-how for both Goa and the destinations we send you to

# What we plan
We don't do one-size-fits-all. We design:

- [Honeymoon packages](/honeymoon) — romantic escapes built for two
- [Family tour packages](/family) — paced for kids and grandparents alike
- [Adventure tours](/adventure) — trek, raft, paraglide and dive
- [Corporate & MICE travel](/corporate) — offsites, incentives and conferences
- [Pilgrimage tours](/pilgrimage) and [college group trips](/college)

# How we build your trip
Tell us where you want to go, when, and your budget — then we tailor the route, stays, transfers and experiences to match. The fastest way to start is our [trip builder](/trip-builder), where you pick destinations and dates and we take it from there.

# Transparent pricing, no booking fees
Every quote is itemised so you can see exactly what you're paying for — no surprise markups and no pressure to commit.

# Our offices
- Goa (head office): Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516
- Mangalore (branch): Bendoorwell, Mangaluru, Karnataka

# Talk to us
Ready to plan something? [Contact our team](/contact) or message us on WhatsApp — we usually reply within a few hours.`,
  },
  {
    slug: "bali-honeymoon-package-cost-from-india",
    title: "Bali Honeymoon Package Cost from India (2026 Guide)",
    excerpt:
      "What a Bali honeymoon really costs from India in 2026 — villas, a romantic 6-night plan and package prices from ₹31,999. Get a free custom quote.",
    coverImage: C("bali"),
    author: "VMF Holidays",
    tags: ["Bali", "Honeymoon", "Bali honeymoon package", "International"],
    content: `Bali is the rare honeymoon that's genuinely romantic and genuinely good value. Private-pool villas, rice-terrace mornings and clifftop sunsets cost far less here than in most overwater destinations. Here's what to budget and how we'd plan it.

# What a Bali honeymoon costs from India
Our Bali honeymoon packages start from around ₹31,999 per person on a land-only, twin-sharing basis, with flights on top. Roughly:

- Smart value: 3 to 4-star stays, shared transfers and the key sights
- Comfort: a private-pool villa split between Ubud and the beach
- Premium: luxury clifftop resorts in Uluwatu with a private guide

# A romantic 6-night plan
- Nights 1–2: Seminyak or Canggu — beach clubs and sunset dinners
- Nights 3–4: Ubud — rice terraces, a couples' spa and waterfalls
- Nights 5–6: Uluwatu — clifftop villas and the Kecak fire dance

# Where to stay
- Ubud for greenery, spas and that classic jungle-villa view
- Seminyak for beaches, dining and shopping
- Uluwatu and Nusa Dua for dramatic cliffs and calm beaches

# What's included
- Villa and hotel stays with daily breakfast
- Private transfers and a honeymoon candlelight dinner
- Curated experiences, plus visa-on-arrival guidance
- Personal support from your trip planner

# Best time for a Bali honeymoon
April to October is the dry season and the safest bet. May, June and September hit the sweet spot of good weather and softer rates.

# Plan your customised Bali honeymoon
We tailor every honeymoon to the couple. See our [honeymoon packages](/honeymoon), start a [custom trip](/trip-builder), or [get a free quote](/contact).`,
  },
];
