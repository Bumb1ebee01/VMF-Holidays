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

  {
    slug: "visa-requirements-for-indian-passport-holders-2026",
    title: "Visa Requirements for Indian Passport Holders (2026)",
    excerpt:
      "Visa-free, visa-on-arrival or apply-ahead? A clear country-by-country rundown for Indian travellers — plus a free tool to check your destination in seconds.",
    coverImage: C("dubai"),
    author: "VMF Holidays",
    tags: ["Visa", "Travel Tips", "International"],
    content: `Planning an international trip from India? The first question is always the same: do I need a visa, and how do I get it? The rules change often, so we built a free [Visa & eVisa Checker](/tools/visa-checker) that gives you the current answer for 28 destinations in seconds. Here's the lay of the land for 2026.

# Visa-free & visa-on-arrival for Indians
A growing list of countries let Indian passport holders in without a prior visa — either fully visa-free or with a stamp on arrival. Popular examples include Thailand, Malaysia, Indonesia (Bali), Sri Lanka, the Maldives and Nepal. These are the easiest trips to plan: book, pack, go.

# eVisa destinations
Many places now issue a quick online eVisa — you apply on a government portal, upload a photo and passport scan, and receive approval by email. Vietnam, Egypt, Azerbaijan and Georgia all fall in this bracket, usually approved within a few working days.

# Apply-ahead (embassy) visas
Some destinations still need a visa applied for before you travel — Schengen Europe (for Spain and most of the continent), the UK and the US among them. These take longer and need appointments, so start early.

# A few things travellers forget
- Passport validity: most countries require at least 6 months beyond your travel dates.
- Blank pages: keep at least two free.
- Return tickets and hotel proof: often required at immigration or for the visa itself.
- Rules change: always confirm close to travel — which is exactly what our checker is for.

# Check your destination now
Don't guess. Our [Visa & eVisa Checker](/tools/visa-checker) shows the requirement, typical processing time and official source for each country. And if you'd rather we handle the paperwork, every VMF package includes visa guidance — just [tell us where you're headed](/contact).`,
  },

  {
    slug: "how-to-split-group-trip-costs-fairly",
    title: "How to Split Group Trip Costs Fairly (Free Calculator)",
    excerpt:
      "Who paid for what, and who owes whom? A simple guide to splitting a group holiday without the awkward maths — with a free tool that does the settling for you.",
    coverImage: C("goa"),
    author: "VMF Holidays",
    tags: ["Group Travel", "Travel Tips", "Budgeting"],
    content: `Group trips are the best kind of holiday — and the trickiest to settle up. One person books the villa, another covers the cab, someone floats the whole dinner. By day three nobody remembers who paid for what. Here's how to keep it fair (and friendly), and a free tool that does the arithmetic for you.

# Agree the ground rules first
Before you go, decide as a group:
- Shared vs. personal — stays and transport are usually split; souvenirs and drinks often aren't.
- How you split — evenly, or by who actually took part (not everyone does every activity).
- One tracker — pick a single place to log expenses so nothing slips through.

# Split evenly, by amount, or by percentage
Not every cost should be divided the same way. A villa is naturally even. A scuba trip only three of five people did should be split between those three. Our [Group Expense Splitter](/tools/group-expense-splitter) lets you choose evenly, an exact amount, or by percentage — per item — so it's genuinely fair, not just "divide by five."

# Let the tool do the settling
The hardest part is the final "who pays whom." Instead of a web of small transfers, our splitter works out the minimum set of payments to square everyone up — and you can share the summary or a PDF straight to your group's WhatsApp.

# Plan the trip, not the spreadsheet
Sort the money side in minutes with the [Group Expense Splitter](/tools/group-expense-splitter). And if you're still deciding where to go, we plan [group and college tours](/college) end to end — [tell us your group size and dates](/contact) and we'll take it from there.`,
  },

  {
    slug: "how-much-cash-to-carry-abroad",
    title: "How Much Cash Should You Carry Abroad? A Traveller's Currency Guide",
    excerpt:
      "Forex card, cash or UPI abroad? How much to carry, where to exchange and how to avoid dud rates — a practical currency guide for Indian travellers.",
    coverImage: C("thailand"),
    author: "VMF Holidays",
    tags: ["Currency", "Travel Tips", "Budgeting"],
    content: `Currency is the least glamorous part of trip planning and the easiest to get wrong. Carry too little and you're stuck; too much and you're exchanging back at a loss. Here's a practical approach for Indian travellers — with a free [Currency Converter](/tools/currency-converter) and live rates to plan by.

# Cash vs forex card vs UPI
- Forex/travel card — the workhorse. Lock in a rate, spend like a debit card, top up online. Best for most spending.
- Some local cash — always carry a little for taxis, tips, street food and places that don't take cards.
- UPI abroad — increasingly accepted (UAE, Singapore, Sri Lanka, Nepal and more), but don't rely on it as your only option yet.

# How much cash, roughly
It depends where you're going, but a useful rule is enough local cash for two to three days of small spends, with the rest on a card. Our [Currency Converter](/tools/currency-converter) covers 30 travel currencies with live INR rates, so you can size it in your own money.

# Getting the best rate
- Exchange a little at home, the rest at your destination — airport counters usually have the worst rates.
- Tell your bank you're travelling so cards don't get blocked.
- Check the live mid-market rate first (that's what our tool shows) so you know a fair number before you swap.

# Budget the whole trip
Convert your daily budget in seconds with the [Currency Converter](/tools/currency-converter). And remember every VMF package lists exactly what's included, so there are no hidden on-ground costs — [ask us for a full breakdown](/contact) on any trip.`,
  },

  {
    slug: "find-your-perfect-trip-quiz",
    title: "Not Sure Where to Go? Find Your Perfect Trip in 60 Seconds",
    excerpt:
      "Beaches or mountains, budget or blow-out, just the two of you or the whole gang? Answer four quick questions and we'll match you to a destination that fits.",
    coverImage: C("kerala"),
    author: "VMF Holidays",
    tags: ["Trip Planning", "Inspiration"],
    content: `Sometimes the hardest part of a holiday is choosing where to go. Too many options, too many opinions in the group chat, and a dozen browser tabs open. If that's you, skip the overwhelm — our free [Trip Finder](/tools/trip-finder) matches you to a destination in about a minute.

# How it works
Four quick questions, no sign-up:
- Your vibe — beaches and downtime, mountains and adventure, culture and cities, or something in between.
- Who's going — a couple, a family, a group of friends, or solo.
- Your budget — pick a range, or set your own with a slider.
- Near or far — a domestic getaway or somewhere abroad.

# Real matches, not filler
We built the quiz to be honest: it only suggests destinations that genuinely fit your vibe and budget — so you might get one perfect match or three, never a padded list. Each result comes with a short "why this fits you" and a starting price.

# From idea to itinerary
Once something catches your eye, go deeper: browse the [full destination list](/destinations), build a route in the [Trip Builder](/trip-builder), or just [tell us your answers](/contact) and we'll plan it around you.

Give the [Trip Finder](/tools/trip-finder) a go — your next holiday might be a minute away.`,
  },

  {
    slug: "introducing-vmf-travellers-club",
    title: "Introducing the VMF Travellers Club — Earn Travel Credit on Every Trip",
    excerpt:
      "A simple loyalty programme with no points-maths and no pressure: earn real travel credit you can spend on your next holiday. Here's how it works.",
    coverImage: C("maldives"),
    author: "VMF Holidays",
    tags: ["Travellers Club", "VMF Holidays"],
    content: `We wanted a loyalty programme that actually feels good to be part of — no confusing points, no "use it or lose it" panic, just real travel credit toward your next trip. That's the VMF Travellers Club. Here's the plain-English version.

# It's free, and you start ahead
Joining is free and takes a minute. The moment you sign up you get ₹250 credit as a head start — 1 credit is simply ₹1, so there's no maths to decode.

# Earn credit as you travel
Members build credit through the trips they take and the friends they bring along. Your balance is real money off a future holiday, not points you have to convert.

# Spend it your way
- Redeem from ₹1,000 upwards against a package.
- Credit stays valid for 24 months from your last activity, so it doesn't quietly vanish.
- A sensible cap per booking keeps the programme fair and sustainable for everyone.

# No pressure, no FOMO
There are no "your points expire tonight" emails here. The Club is meant to reward people who genuinely love to travel with us — at your pace, on your terms.

# Join the Club
Sign up in a minute and grab your ₹250 head start on the [Travellers Club page](/travellers-club). Already a member? Bringing a friend is the fastest way to grow your balance — here's [how the referral programme works](/blog/refer-a-friend-earn-travel-credit).`,
  },

  {
    slug: "refer-a-friend-earn-travel-credit",
    title: "Refer a Friend, Earn ₹2,000 Travel Credit — How It Works",
    excerpt:
      "Share the trips you love and you both win: your friend gets ₹1,000 off their first holiday, and you earn ₹2,000 credit when they travel. Here's the simple version.",
    coverImage: C("singapore"),
    author: "VMF Holidays",
    tags: ["Travellers Club", "Referral", "VMF Holidays"],
    content: `The best travel recommendations come from friends. So we made it rewarding: when you introduce someone to VMF Holidays, you both get real travel credit. No gimmicks — here's exactly how it works.

# Everyone wins
- Your friend gets ₹1,000 off their first VMF holiday (on a booking of ₹25,000 or more).
- You earn ₹2,000 in travel credit — and it lands when your friend actually travels, not just when they book.

That "when they travel" part matters: it keeps things genuine and means the credit reflects a real trip.

# How to refer someone
1. Join the [Travellers Club](/travellers-club) — it's free, and you start with ₹250 credit.
2. Share your personal referral link with a friend.
3. They book a trip of ₹25,000+ and travel — your ₹2,000 credit is added.

# The good-to-know bits
- 1 credit = ₹1, so your balance is easy to read.
- Redeem from ₹1,000 against any eligible package.
- Credit is valid for 24 months from your last activity.
- Refer as many friends as you like — and as you bring more travellers along, your rewards can grow.

# Start sharing
It costs nothing to join and nothing to refer — just good trips passed on to people you like. [Join the Travellers Club](/travellers-club) and grab your referral link, or read more about [the Club and your credit](/blog/introducing-vmf-travellers-club).`,
  },

  {
    slug: "cheapest-international-trips-from-india-under-40000",
    title: "Cheapest International Trips from India Under ₹40,000",
    excerpt:
      "Your first passport stamp doesn't need a big budget. Five international destinations you can do well from India for under ₹40,000 per person.",
    coverImage: C("vietnam"),
    author: "VMF Holidays",
    tags: ["Budget Travel", "International", "Inspiration"],
    content: `An international holiday feels like it should cost a fortune. It doesn't. With smart timing and the right package, several visa-easy destinations come in under ₹40,000 per person from India. Here are our favourites.

# 1. Vietnam
Lantern-lit Hoi An, Ha Long Bay's karsts and some of Asia's best street food — Vietnam is outstanding value. Our [Vietnam packages](/destinations/international/vietnam) start around ₹24,500, and the eVisa is quick and cheap.

# 2. Sri Lanka
Beaches, tea country and ancient forts, all a short hop away with visa-on-arrival ease. [Sri Lanka](/destinations/international/sri-lanka) packs a lot of variety into a small, affordable island.

# 3. Thailand
The classic first-international for good reason: temples, islands and nightlife that stretch your rupee. [Thailand packages](/destinations/international/thailand) are easy to tailor short and sweet.

# 4. Nepal
Himalayan drama, Kathmandu's temples and lakeside calm in Pokhara — and no visa hassle for Indians. [Nepal](/destinations/international/nepal) is one of the most affordable trips abroad you can take.

# 5. Malaysia
Kuala Lumpur's skyline plus the beaches of Langkawi make [Malaysia](/destinations/international/malaysia) a great-value mix of city and island.

# How to keep it under budget
- Travel in the shoulder season for lower fares and hotel rates.
- Keep it to one country and 4–6 nights.
- Book land and stay as a package so there are no surprise costs.

Not sure which fits? Try our [Trip Finder](/tools/trip-finder), or [tell us your budget](/contact) and we'll build the best trip that fits it.`,
  },

  {
    slug: "bali-vs-thailand-honeymoon",
    title: "Bali vs Thailand: Which Is Better for Your Honeymoon?",
    excerpt:
      "Two of the most-booked honeymoons from India, compared honestly — vibe, beaches, budget and romance — so you can pick the one that's really you.",
    coverImage: C("bali"),
    author: "VMF Holidays",
    tags: ["Honeymoon", "Bali", "Thailand", "Comparison"],
    content: `Bali or Thailand? It's the honeymoon question we're asked most. Both are beautiful, romantic and great value from India — but they suit different couples. Here's an honest comparison.

# The vibe
- Bali leans spiritual and scenic — rice terraces, clifftop temples, wellness and villa living. It feels intimate and slow.
- Thailand is more varied and lively — buzzing Bangkok, island-hopping in the south, and everything from luxury resorts to beach bars.

# Beaches
Thailand wins on sheer variety — the Phi Phi islands, Krabi and Phuket are postcard-perfect. Bali's beaches are lovely, but the island's real magic is inland; many couples split time between Ubud and the coast.

# Romance factor
Bali is hard to beat for honeymoon mood: private-pool villas, candlelit dinners and floating breakfasts are its speciality. Thailand offers this too, especially on islands like Koh Samui, alongside more to *do*.

# Budget
Both are affordable from India. A [Bali honeymoon](/destinations/international/bali) starts around ₹31,999, and [Thailand](/destinations/international/thailand) from around ₹42,500 — though it varies with islands and season.

# Our verdict
- Choose Bali for a slow, romantic, wellness-led escape.
- Choose Thailand for beaches, variety and a little more energy.

Still torn? That's what we're here for. [Tell us what you both love](/contact) and we'll match you to the right one — or try our [Trip Finder](/tools/trip-finder) for a quick nudge.`,
  },
];
