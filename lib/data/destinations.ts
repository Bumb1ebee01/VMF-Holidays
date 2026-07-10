import type { Destination } from "@/lib/types";

export const destinations: Destination[] = [
  // ── DOMESTIC ─────────────────────────────────────────────────────────────────
  {
    slug: "goa",
    name: "Goa",
    country: "India",
    state: "Goa",
    region: "domestic",
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/goa.jpg",
    fromPrice: 10500,
    blurb: "Sun-soaked beaches, Portuguese churches, buzzing nightlife and fresh seafood — India's favourite escape.",
    tags: ["Beaches", "Nightlife", "Heritage", "Water Sports"],
    guideIntro:
      "Goa is India's favourite beach escape — over 100 kilometres of Arabian Sea coastline where Portuguese-era churches, buzzing beach shacks and a spice-scented hinterland all meet. The lively north (Baga, Calangute, Anjuna) suits first-timers and party-goers, while the quieter south (Palolem, Agonda, Colva) is made for couples and families who want white sand without the crowds.",
    guideBestTime:
      "The best time to visit Goa is November to February, when the weather is dry, warm (21–32°C) and perfect for the beach — this is peak season, busiest around Christmas and New Year. March to May is hot but cheaper and quieter, and the June–September monsoon turns Goa lush and green with the lowest prices of the year.",
    guideThingsToDo: [
      "Beach-hop the north — Baga, Calangute, Anjuna and Vagator",
      "Escape to the calm south — Palolem, Agonda and Colva",
      "Wander the Latin Quarter of Fontainhas in Panaji",
      "See the UNESCO churches of Old Goa, including the Basilica of Bom Jesus",
      "Try water sports — parasailing, jet-ski and dolphin-spotting boat rides",
      "Cruise the Mandovi River at sunset",
      "Feast on Goan seafood — prawn balchão, fish curry rice and bebinca",
    ],
    guideSections: [
      {
        heading: "North Goa vs South Goa",
        body: "North Goa is the lively half — nightlife, beach clubs, flea markets and water sports around Baga, Calangute and Anjuna. South Goa is calmer and more scenic, with cleaner, emptier beaches like Palolem and Agonda and a slower, more luxurious pace. Many of our itineraries combine a few nights in each so you get both the buzz and the quiet.",
      },
      {
        heading: "Getting around Goa",
        body: "The beaches are spread far apart, so most travellers get around by hired scooter, taxi or a private car with driver — which we include in our packages so you can move between north and south without the hassle.",
      },
    ],
    guideTip:
      "Base yourself in the south for space and sunsets, but spend a night or two in the north if markets and nightlife are on your list — the two halves feel like different holidays.",
  },
  {
    slug: "kerala",
    name: "Kerala",
    country: "India",
    state: "Kerala",
    region: "domestic",
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/kerala.jpg",
    fromPrice: 32000,
    blurb: "Glide through emerald backwaters, walk spice-scented forests and unwind on pristine Malabar Coast beaches.",
    tags: ["Backwaters", "Ayurveda", "Beaches", "Wildlife"],
    guideIntro:
      "Kerala — 'God's Own Country' — strings together palm-fringed backwaters, misty tea-covered hills, spice plantations and Arabian Sea beaches down India's tropical southwest. A houseboat night on the Alleppey backwaters, an Ayurvedic massage and a morning in Munnar's tea gardens make it one of India's most restorative escapes.",
    guideBestTime:
      "September to March is the best time to visit Kerala, with pleasant, dry weather ideal for the backwaters, hills and beaches. The monsoon (June–August) is lush and green and the traditional season for authentic Ayurveda treatments; April–May is hot and humid on the coast but still cool up in Munnar.",
    guideThingsToDo: [
      "Cruise the Alleppey backwaters on an overnight houseboat",
      "Wake up in the tea gardens of Munnar",
      "Spot elephants and bison at Periyar Wildlife Sanctuary, Thekkady",
      "Unwind with a genuine Ayurvedic massage",
      "Explore Fort Kochi's colonial lanes and Chinese fishing nets",
      "Relax on Kovalam or Varkala beach",
      "Walk a spice plantation in the Western Ghats",
    ],
    guideSections: [
      {
        heading: "The backwaters — houseboat or resort?",
        body: "An overnight houseboat (kettuvallam) is the classic Kerala experience — you drift past paddy fields and village life with meals cooked on board. If you'd rather stay put, a backwater resort gives you the same views with a pool and spa. We can do a night of each.",
      },
      {
        heading: "A typical Kerala route",
        body: "Most trips run Kochi → Munnar (tea hills) → Thekkady (wildlife) → Alleppey (backwaters) → a beach at Kovalam or Varkala — an easy loop that packs in hills, jungle, water and coast.",
      },
    ],
    guideTip:
      "Do the hills (Munnar and Thekkady) first and the backwaters and beach last — you'll finish the trip fully unwound rather than starting with the busy sightseeing.",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    country: "India",
    state: "Jammu & Kashmir",
    region: "domestic",
    heroImage: "/images/destinations/kashmir.jpg",
    fromPrice: 39000,
    blurb: "Snow-capped peaks, Dal Lake houseboats, saffron meadows and the warmth of Kashmiri hospitality.",
    tags: ["Mountains", "Houseboats", "Snow", "Heritage"],
    guideIntro:
      "Kashmir is the Himalayas at their most romantic — Dal Lake's carved-cedar houseboats, shikara rides past floating gardens, Mughal terraces and meadows that turn from wildflowers to deep snow with the seasons. Srinagar, Gulmarg, Pahalgam and Sonamarg together make one of India's most scenic circuits.",
    guideBestTime:
      "March to October is the best all-round time to visit Kashmir — tulips in spring, green meadows and cool air in summer, and golden chinar leaves in autumn. December to February brings heavy snow and is the season for skiing and a snow-covered Gulmarg, though some high passes close.",
    guideThingsToDo: [
      "Stay overnight on a Dal Lake houseboat and take a dawn shikara ride",
      "Ride the Gulmarg Gondola, one of the world's highest cable cars",
      "Picnic in the meadows of Pahalgam and the Betaab Valley",
      "See the Mughal gardens — Nishat, Shalimar and Chashme Shahi",
      "Drive to Sonamarg, the 'meadow of gold'",
      "Shop for pashmina, saffron and walnut woodcraft in Srinagar",
      "Ski or play in the snow at Gulmarg in winter",
    ],
    guideSections: [
      {
        heading: "When the passes are open",
        body: "The high-altitude drives to Sonamarg and Gulmarg are seasonal — spectacular from spring to autumn, but snow can close them in deep winter. If a specific valley is on your list, tell us your dates and we'll plan the route around what's accessible.",
      },
      {
        heading: "Houseboat vs hotel",
        body: "A night on a Dal Lake houseboat is unmissable for the atmosphere; the rest of the trip is usually spent in comfortable hotels in Srinagar, Gulmarg and Pahalgam. We mix the two so you get the experience without roughing it.",
      },
    ],
    guideTip:
      "Book a houseboat on the quieter Nigeen Lake rather than the busiest stretch of Dal for the same charm with far more calm.",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    country: "India",
    state: "Rajasthan",
    region: "domestic",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
    fromPrice: 24999,
    blurb: "Majestic forts, golden deserts, vibrant bazaars and royal palaces — the Land of Kings never stops dazzling.",
    tags: ["Heritage", "Desert", "Palaces", "Culture"],
    guideIntro:
      "Rajasthan, the Land of Kings, is India's most theatrical state — hilltop forts, mirror-worked palaces, blue and pink old towns and camel trails into the Thar Desert. Jaipur, Jodhpur, Udaipur and Jaisalmer chain together forts, lake palaces and bazaars into one unforgettable royal circuit.",
    guideBestTime:
      "October to March is the best time to visit Rajasthan, with pleasant days and cool desert nights ideal for sightseeing and camel safaris. April to June is very hot (often 40°C+), while the July–September monsoon is brief and turns the countryside surprisingly green.",
    guideThingsToDo: [
      "Explore Jaipur's Amber Fort, City Palace and Hawa Mahal",
      "Take a camel safari and sleep in a desert camp near Jaisalmer",
      "Ride the boat on Lake Pichola beneath Udaipur's palaces",
      "See the blue city and mighty Mehrangarh Fort in Jodhpur",
      "Visit the marble Jain temples of Ranakpur",
      "Shop the bazaars for textiles, jootis and blue pottery",
      "Catch a folk music and dance evening under the stars",
    ],
    guideSections: [
      {
        heading: "The Golden Triangle and beyond",
        body: "Short on time? Delhi–Agra–Jaipur (the Golden Triangle) covers the highlights in under a week. With more days we add Jodhpur, Udaipur and the desert at Jaisalmer for the full royal loop.",
      },
      {
        heading: "Heritage stays",
        body: "Rajasthan is famous for its heritage hotels — converted forts, havelis and palaces where you can actually stay. We can build a trip around one or two standout ones for a genuinely royal night.",
      },
    ],
    guideTip:
      "Save Udaipur for last — after the desert and forts, the lake city's palaces and sunsets are the perfect romantic finish.",
  },
  {
    slug: "manali",
    name: "Manali",
    country: "India",
    state: "Himachal Pradesh",
    region: "domestic",
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/manali.jpg",
    fromPrice: 15999,
    blurb: "Snow-capped Himalayan peaks, pine forests, river rafting and paragliding in the adventure capital of North India.",
    tags: ["Mountains", "Adventure", "Snow", "Trekking"],
    guideIntro:
      "Manali is North India's favourite mountain getaway — pine forests and apple orchards along the Beas River, snow points reached through the Atal Tunnel, and enough paragliding, rafting and trekking to earn its 'adventure capital' name. It's an easy, scenic escape that works for couples, families and thrill-seekers alike.",
    guideBestTime:
      "October to June is the best time to visit Manali — spring and summer (March–June) bring pleasant days perfect for sightseeing and adventure sports, while a winter visit (December–February) means snow in the town and around Solang. The July–September monsoon can trigger landslides on the ghat roads.",
    guideThingsToDo: [
      "Try paragliding, zorbing and the ropeway at Solang Valley",
      "Cross the Atal Tunnel to the snow and waterfalls of Sissu in Lahaul",
      "Raft the Beas River rapids",
      "Visit the ancient Hadimba Temple and Manu Temple",
      "Soak in the hot springs at Vashisht",
      "Stroll and café-hop around Old Manali and Mall Road",
      "See Rahalla Falls and, seasonally, Rohtang Pass",
    ],
    guideSections: [
      {
        heading: "Chasing the snow",
        body: "For guaranteed snow, the Atal Tunnel to Sissu is open most of the year, while Rohtang Pass is seasonal and needs a permit. Solang Valley is the hub for adventure sports and winter snow play. Tell us your dates and we'll aim for the best snow you can reach.",
      },
      {
        heading: "Manali with Shimla or Kasol",
        body: "Many travellers pair Manali with Shimla for a classic Himachal loop, or with the laid-back riverside village of Kasol. We can extend the trip either way.",
      },
    ],
    guideTip:
      "Stay in Old Manali rather than the main town for leafier, quieter surroundings and the best cafés — the sights are still a short hop away.",
  },
  {
    slug: "andaman",
    name: "Andaman & Nicobar",
    country: "India",
    state: "Andaman & Nicobar Islands",
    region: "domestic",
    heroImage: "https://images.unsplash.com/photo-1704314315344-cd10b9779ce6?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 45000,
    blurb: "Turquoise lagoons, living coral reefs and powder-white sand across a remote island chain — India's tropical scuba and honeymoon frontier.",
    tags: ["Beaches", "Islands", "Scuba Diving", "Nature"],
    guideIntro:
      "The Andaman Islands are India's tropical frontier — powder-white beaches, glassy turquoise lagoons and some of the country's best coral reefs, scattered across the Bay of Bengal. Radhanagar Beach on Havelock regularly ranks among Asia's finest, and the diving and snorkelling here are world-class.",
    guideBestTime:
      "October to May is the best time to visit the Andamans, with calm seas, clear water and sunny skies ideal for beaches and diving. The monsoon (June–September) brings rougher seas and more rain, though it's greener and quieter.",
    guideThingsToDo: [
      "Relax on Radhanagar Beach, Havelock — regularly rated Asia's best",
      "Scuba dive or snorkel over living coral reefs",
      "Take the glass-bottom boat and sea walk at North Bay",
      "Learn the poignant history at the Cellular Jail, Port Blair",
      "Snorkel and sunbathe at Elephant Beach",
      "Island-hop to Neil (Shaheed Dweep) for a slower pace",
      "Catch the light-and-sound show at the Cellular Jail",
    ],
    guideSections: [
      {
        heading: "Getting between the islands",
        body: "You'll fly into Port Blair, then take a ferry to Havelock (Swaraj Dweep) and Neil (Shaheed Dweep) — the two most beautiful islands. We pre-book the faster private ferries so you don't lose a day to logistics.",
      },
      {
        heading: "Diving for beginners",
        body: "You don't need a licence to try scuba here — introductory 'discover scuba' dives let first-timers experience the reef with an instructor. Certified divers get access to some superb deeper sites.",
      },
    ],
    guideTip:
      "Book Havelock's ferries and top resorts well ahead — the island is small and the best stays sell out fast in peak season.",
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    country: "India",
    state: "Ladakh",
    region: "domestic",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 42000,
    blurb: "High-desert moonscapes, centuries-old Buddhist monasteries and the world's most dramatic mountain passes — a road-tripper's dream.",
    tags: ["Mountains", "Adventure", "Monasteries", "Road Trips"],
    guideIntro:
      "Ladakh is a high-altitude desert like nowhere else in India — moonscape valleys above 3,000 metres, whitewashed Buddhist monasteries clinging to cliffs, prayer flags snapping in the wind and the surreal blue of Pangong Lake. It's the ultimate road-trip and adventure destination.",
    guideBestTime:
      "May to September is the best (and really the only comfortable) time to visit Ladakh — the roads and high passes are open, days are sunny and the lakes are their bluest. Winters are spectacular but brutally cold, mainly for the hardy Chadar trek and snow-leopard spotters.",
    guideThingsToDo: [
      "Camp beside the colour-shifting Pangong Tso lake",
      "Cross Khardung La, one of the world's highest motorable passes",
      "Visit the hilltop monasteries — Thiksey, Hemis and Diskit",
      "Ride a Bactrian camel over the Nubra Valley dunes",
      "See where the Indus and Zanskar rivers meet",
      "Explore Leh's old town, palace and bustling market",
      "Try river rafting on the Zanskar",
    ],
    guideSections: [
      {
        heading: "Acclimatising to the altitude",
        body: "Leh sits at 3,500m, so the first day is for rest — pushing straight to Pangong or Nubra can cause altitude sickness. We build in an acclimatisation day and pace the itinerary so you enjoy it safely.",
      },
      {
        heading: "Fly in or drive the Manali–Leh highway",
        body: "Most travellers fly into Leh to save time and acclimatise. Adventurers can instead take the epic two-day Manali–Leh road trip over some of the planet's highest passes — we can arrange either.",
      },
    ],
    guideTip:
      "Give yourself a full rest day in Leh before heading higher — it makes the difference between loving Ladakh and battling a headache.",
  },
  {
    slug: "lakshadweep",
    name: "Lakshadweep",
    country: "India",
    state: "Lakshadweep",
    region: "domestic",
    heroImage: "https://images.unsplash.com/photo-1572431447238-425af66a273b?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 40000,
    blurb: "Untouched coral atolls, glassy lagoons and barefoot island calm — India's best-kept tropical secret.",
    tags: ["Islands", "Lagoons", "Diving", "Beaches"],
    guideIntro:
      "Lakshadweep is India's best-kept tropical secret — a scattering of coral atolls off the Kerala coast ringed by impossibly clear lagoons and untouched white sand. With permit-only access and just a handful of resorts, it's barefoot island calm with reefs to rival the Maldives, at a fraction of the crowds.",
    guideBestTime:
      "October to mid-May is the best time to visit Lakshadweep, with calm lagoons and clear water perfect for snorkelling, diving and kayaking. The monsoon (June–September) closes much of the island access as the sea turns rough.",
    guideThingsToDo: [
      "Snorkel and dive the pristine coral reefs of Agatti and Bangaram",
      "Kayak and paddleboard across glassy lagoons",
      "Watch the sunset from a deserted white-sand spit",
      "Try scuba diving over reefs teeming with fish",
      "Take a glass-bottom boat over the coral gardens",
      "Learn about island life on Kavaratti",
      "Simply switch off on a near-empty beach",
    ],
    guideSections: [
      {
        heading: "Permits and access",
        body: "Lakshadweep requires an entry permit for all visitors, which we arrange as part of your package. You'll reach the islands by flight to Agatti (from Kochi) or by ship — we handle the paperwork and logistics so you don't have to.",
      },
      {
        heading: "Which island?",
        body: "Agatti and Bangaram are the main options for tourists, with the clearest lagoons and best diving. We match the island and resort to whether you're after diving, honeymoon calm or a family beach break.",
      },
    ],
    guideTip:
      "Pack everything you need — the islands are remote and shops are minimal, so bring reef-safe sunscreen, medicines and anything specific in advance.",
  },
  {
    slug: "madhya-pradesh",
    name: "Madhya Pradesh",
    country: "India",
    state: "Madhya Pradesh",
    region: "domestic",
    heroImage: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 22000,
    blurb: "Tiger reserves, the medieval temple art of Khajuraho and sacred riverside cities — the wild, historic heart of India.",
    tags: ["Wildlife", "Heritage", "Temples", "Nature"],
    guideIntro:
      "Madhya Pradesh is the wild, historic heart of India — the tiger reserves that inspired The Jungle Book, the astonishing medieval temple carvings of Khajuraho, and sacred riverside cities along the Narmada. It's one of the country's best safari destinations and a treasure-house of heritage.",
    guideBestTime:
      "October to March is the best time to visit Madhya Pradesh, with pleasant weather for both sightseeing and safaris. Wildlife spotting actually peaks in the hotter months of April–June when animals gather at waterholes, though the parks close during the monsoon.",
    guideThingsToDo: [
      "Track tigers on safari at Bandhavgarh and Kanha National Parks",
      "Marvel at the temple art of Khajuraho, a UNESCO site",
      "Explore the hilltop fort and palaces of Orchha",
      "See the Buddhist stupas of Sanchi",
      "Visit the sacred ghats of Maheshwar and Omkareshwar",
      "Discover the caves and rock art of Bhimbetka",
      "Wander Gwalior's grand hilltop fort",
    ],
    guideSections: [
      {
        heading: "Which tiger reserve?",
        body: "Bandhavgarh has one of the highest tiger densities in India and the best odds of a sighting; Kanha is larger, greener and the classic Jungle Book landscape. Many wildlife trips combine both. Safaris need permits we book in advance.",
      },
      {
        heading: "Heritage add-ons",
        body: "Pair the parks with Khajuraho's temples and the fairy-tale fort town of Orchha for a trip that balances wildlife with world-class history.",
      },
    ],
    guideTip:
      "Book your safari zones and permits early — the best gates at Bandhavgarh and Kanha are capped and go quickly in season.",
  },
  {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    country: "India",
    state: "Tamil Nadu",
    region: "domestic",
    heroImage: "https://images.unsplash.com/photo-1566915682737-3e97a7eed93b?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 20000,
    blurb: "Towering gopuram temples, misty Nilgiri hills and the colonial charm of the deep south — timeless Dravidian India.",
    tags: ["Temples", "Heritage", "Hill Stations", "Culture"],
    guideIntro:
      "Tamil Nadu is timeless Dravidian India — towering, sculpture-covered gopuram temples, misty Nilgiri hill stations, colonial-era towns and a coastline of ancient ports. From Madurai's Meenakshi Temple to the tea slopes of Ooty, it's the cultural heart of the south.",
    guideBestTime:
      "November to March is the best time to visit Tamil Nadu, with cooler, pleasant weather for temple towns and the coast. The hill stations of Ooty and Kodaikanal are lovely from April to June when the plains are hot; the northeast monsoon brings rain around October–November.",
    guideThingsToDo: [
      "Witness the ritual and colour of Madurai's Meenakshi Amman Temple",
      "Ride the toy train to the tea-clad hills of Ooty",
      "See the shore temples and stone carvings of Mahabalipuram",
      "Explore colonial Pondicherry's French Quarter nearby",
      "Visit the living Chola temples of Thanjavur",
      "Cool off in the hill station of Kodaikanal",
      "Experience the temple town of Rameswaram",
    ],
    guideSections: [
      {
        heading: "Temples and hills together",
        body: "A classic Tamil Nadu route pairs the great temple towns — Madurai, Thanjavur, Trichy — with a few days up in Ooty or Kodaikanal to escape the heat, giving you both the culture and the cool green hills.",
      },
      {
        heading: "Temple etiquette",
        body: "The temples are living places of worship — modest dress (covered shoulders and knees) is expected and shoes come off at the entrance. We brief you on the simple do's and don'ts so you're comfortable.",
      },
    ],
    guideTip:
      "Start temple visits early morning — you'll beat both the heat and the crowds, and catch the atmospheric dawn rituals.",
  },

  // ── INTERNATIONAL ─────────────────────────────────────────────────────────────
  {
    slug: "dubai",
    name: "Dubai",
    country: "UAE",
    region: "international",
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/dubai.jpg",
    fromPrice: 57000,
    blurb: "Futuristic skyline, desert safaris, world-record attractions and the best duty-free shopping on the planet.",
    tags: ["Luxury", "Shopping", "Desert", "City Break"],
    guideIntro:
      "Dubai is the Gulf's showpiece — a futuristic skyline crowned by the Burj Khalifa, record-breaking malls and attractions, golden desert on the doorstep and some of the world's best shopping and dining. It's a slick, family-friendly city break that's an easy short-haul hop from India.",
    guideBestTime:
      "November to March is the best time to visit Dubai, with warm, sunny days perfect for the beach, desert and outdoor attractions. Summer (June–September) is extremely hot (40°C+), though hotel deals are cheapest and everything indoors is air-conditioned.",
    guideThingsToDo: [
      "Ride to the top of the Burj Khalifa, the world's tallest building",
      "Go dune-bashing and dine under the stars on a desert safari",
      "Shop and skate at the Dubai Mall and see the Dubai Fountain",
      "Visit Palm Jumeirah and Atlantis Aquaventure",
      "Explore the historic Al Fahidi quarter and gold souk",
      "Take in the view from Ain Dubai and the Dubai Frame",
      "Day-trip to Abu Dhabi's Sheikh Zayed Grand Mosque",
    ],
    guideSections: [
      {
        heading: "Dubai for families vs couples",
        body: "Families love the theme parks, aquariums and beaches; couples go for the fine dining, rooftop bars and desert dinners. Dubai does both effortlessly, and we tailor the mix of attractions to your group.",
      },
      {
        heading: "Add Abu Dhabi",
        body: "The stunning Sheikh Zayed Grand Mosque and Ferrari World are an easy day trip or overnight from Dubai — a popular add-on we can build in.",
      },
    ],
    guideTip:
      "Buy attraction tickets and combos in advance — it's cheaper than at the gate and skips the queues at the busiest sights.",
  },
  {
    slug: "thailand",
    name: "Thailand",
    country: "Thailand",
    region: "international",
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/thailand.jpg",
    fromPrice: 42500,
    blurb: "Ornate temples, legendary street food, tropical islands and warm Thai hospitality — value meets splendour.",
    tags: ["Culture", "Beaches", "Street Food", "Islands"],
    guideIntro:
      "Thailand blends ornate temples, legendary street food, tropical islands and famously warm hospitality — all at superb value. Bangkok's buzz, Chiang Mai's temples and the beaches of Phuket, Krabi and the islands make it one of the most rewarding first international trips for Indian travellers.",
    guideBestTime:
      "November to March is the best time to visit Thailand — dry, sunny and ideal for the islands and beaches. April is very hot (and Songkran water-festival season), while the June–October monsoon is greener, cheaper and still fine on the Gulf coast around Koh Samui.",
    guideThingsToDo: [
      "Temple-hop Bangkok — the Grand Palace and Wat Arun",
      "Island-hop around Phuket, Phi Phi and Krabi",
      "Feast on street food and shop the floating markets",
      "See the Phang Nga Bay limestone karsts by longtail boat",
      "Visit an ethical elephant sanctuary near Chiang Mai",
      "Catch a cabaret or Muay Thai night",
      "Relax on Koh Samui or Koh Phangan",
    ],
    guideSections: [
      {
        heading: "Bangkok plus which beach?",
        body: "Most trips start in Bangkok, then head south to the Andaman coast (Phuket, Krabi — best Nov–Apr) or the Gulf (Koh Samui — good even in the western monsoon). We match the beach to your travel dates for the best weather.",
      },
      {
        heading: "Great for first-timers",
        body: "English is widely spoken in tourist areas, flights from India are short, and it's easy on the budget — which is why Thailand is such a popular first overseas holiday. We handle visa-on-arrival guidance and transfers.",
      },
    ],
    guideTip:
      "Split your time between one city and one island rather than rushing several — you'll actually relax, and the internal flights are cheap and quick.",
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    country: "Vietnam",
    region: "international",
    heroImage: "/images/destinations/vietnam.jpg",
    fromPrice: 24500,
    blurb: "Ha Long Bay limestone karsts, Hoi An lantern-lit streets, Sapa rice terraces — SE Asia's most diverse destination.",
    tags: ["Heritage", "Nature", "Street Food", "Beaches"],
    guideIntro:
      "Vietnam is Southeast Asia's most diverse country — the emerald limestone karsts of Ha Long Bay, Hoi An's lantern-lit old town, Sapa's rice terraces and a coastline of great-value beaches, threaded together by some of the best street food on earth. It offers remarkable variety for the money.",
    guideBestTime:
      "Vietnam is long, so the best time varies: overall, March–April and September–November bring the most pleasant weather countrywide. The north (Hanoi, Ha Long, Sapa) is best autumn–spring; the central coast (Hoi An, Da Nang) is driest February–August.",
    guideThingsToDo: [
      "Cruise overnight among the karsts of Ha Long Bay",
      "Wander Hoi An's lantern-lit ancient town",
      "Ride the Ba Na Hills cable car to the Golden Bridge, Da Nang",
      "Explore Hanoi's Old Quarter and street-food scene",
      "Trek the rice terraces around Sapa",
      "Relax on the beaches of Da Nang and Phu Quoc",
      "Take a boat through the Mekong Delta",
    ],
    guideSections: [
      {
        heading: "North, central or south?",
        body: "With limited time, pick a region: the north for Hanoi and Ha Long Bay, the centre for Hoi An and Da Nang's beaches, the south for Ho Chi Minh City and the Mekong. Longer trips string them together by short internal flights, which we arrange.",
      },
      {
        heading: "The overnight cruise",
        body: "A night on a Ha Long Bay cruise — kayaking, caves and sunrise on deck — is the trip's highlight. We book reputable boats so the experience matches the setting.",
      },
    ],
    guideTip:
      "Get clothes or shoes tailor-made in Hoi An — skilled tailors turn around beautiful custom pieces in a day or two for a fraction of home prices.",
  },
  {
    slug: "georgia",
    name: "Georgia",
    country: "Georgia",
    region: "international",
    heroImage: "/images/destinations/georgia.jpg",
    fromPrice: 38000,
    blurb: "Ancient Silk Road cities, Caucasus mountain drama, world-class wine and snow-kissed ski resorts — Europe's best-kept secret.",
    tags: ["Mountains", "Culture", "Wine", "Adventure"],
    guideIntro:
      "Georgia is Europe's best-value discovery — ancient Silk Road cities, the drama of the Greater Caucasus, 8,000 years of winemaking and snow-capped ski resorts, all wrapped in famously generous hospitality. Tbilisi's old town, cave cities and mountain villages pack a lot into a short, affordable trip.",
    guideBestTime:
      "May to October is the best time to visit Georgia — warm days, open mountain roads and the September–October grape harvest. December to March is ski season in Gudauri and Bakuriani, when the Caucasus is buried in snow.",
    guideThingsToDo: [
      "Wander Tbilisi's old town, sulphur baths and cable car",
      "Drive the Georgian Military Highway to Kazbegi's cliff-top church",
      "Taste wine in the Kakheti valleys, the cradle of winemaking",
      "Explore the cave cities of Uplistsikhe and Vardzia",
      "Ski or hike the slopes of Gudauri",
      "See the towers of medieval Mtskheta, an old capital",
      "Ride to Ananuri fortress above its turquoise reservoir",
    ],
    guideSections: [
      {
        heading: "City, mountains and wine",
        body: "A great week combines Tbilisi's culture, a day up to Kazbegi in the high Caucasus, and the Kakheti wine region — a mix of city, mountains and vineyards that's easy to cover with a driver.",
      },
      {
        heading: "Why Indians love Georgia",
        body: "E-visa ease, short flights, dramatic scenery and very good value have made Georgia a fast-rising favourite, and vegetarian food is easy to find. We handle the visa guidance and door-to-door driving.",
      },
    ],
    guideTip:
      "Say yes to a 'supra' (traditional feast) if you're invited — the toasts, food and hospitality are the real heart of a Georgian trip.",
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "international",
    heroImage: "/images/destinations/singapore.jpg",
    fromPrice: 83500,
    blurb: "Glittering Gardens by the Bay, Universal Studios, Night Safari and the world's most efficient city-state.",
    tags: ["Family", "Luxury", "Shopping", "Theme Parks"],
    guideIntro:
      "Singapore is the world's most effortless city-state — spotless, safe and endlessly fun, from the futuristic Gardens by the Bay to Universal Studios, Marina Bay Sands and a food scene that spans hawker stalls to Michelin stars. It's the ultimate family and first-timer city break.",
    guideBestTime:
      "Singapore is warm and tropical year-round, so any time works — February to April is usually the driest. Time a visit around events like the F1 Night Race (September) or the year-end light-ups, and expect short tropical showers in any month.",
    guideThingsToDo: [
      "Explore Gardens by the Bay and the Cloud Forest dome",
      "Spend a day at Universal Studios on Sentosa",
      "Take in the SkyPark view atop Marina Bay Sands",
      "Ride the Singapore Flyer and see the Merlion",
      "Discover the Night Safari and River Wonders",
      "Eat your way through a hawker centre and Chinatown",
      "Shop Orchard Road and Bugis Street",
    ],
    guideSections: [
      {
        heading: "Perfect with Malaysia or Bali",
        body: "Singapore's compact size makes it easy to pair — many travellers combine it with Malaysia (a short hop away) or a Bali beach extension for a two-centre holiday. We can build the combo.",
      },
      {
        heading: "Family-friendly by design",
        body: "Clean, safe, English-speaking and packed with attractions, Singapore is arguably Asia's easiest family destination. We plan the theme parks and downtime so the days don't overwhelm younger kids.",
      },
    ],
    guideTip:
      "Buy a combined attractions pass and eat at hawker centres — it keeps a famously pricey city surprisingly affordable without missing the highlights.",
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "international",
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/maldives.jpg",
    fromPrice: 54999,
    blurb: "Overwater bungalows, crystal-clear lagoons and world-class diving — the definitive honeymoon paradise.",
    tags: ["Luxury", "Beaches", "Diving", "Honeymoon"],
    guideIntro:
      "The Maldives is the definitive honeymoon paradise — a thousand coral islands scattered across the Indian Ocean, each resort on its own private isle with overwater villas, house reefs and blindingly white sand. It's barefoot luxury, world-class diving and total seclusion, a short flight from India.",
    guideBestTime:
      "November to April is the best time to visit the Maldives — the dry season, with sunny skies, calm seas and superb visibility for diving and snorkelling. May to October is the greener, cheaper wet season, with occasional storms but plenty of sunshine between them.",
    guideThingsToDo: [
      "Stay in an overwater villa above a turquoise lagoon",
      "Snorkel or dive the house reef among rays and reef sharks",
      "Cruise at sunset to spot dolphins",
      "Enjoy a couples' spa treatment over the water",
      "Picnic on a private sandbank",
      "Try the water sports — kayaking, paddleboarding, jet-ski",
      "Dine under the stars on the beach",
    ],
    guideSections: [
      {
        heading: "Choosing your resort island",
        body: "Every Maldives resort is its own island, so the choice is everything — house-reef quality, villa type, board basis and transfer (speedboat vs seaplane) all matter. We match the resort to your budget and whether it's a honeymoon or a family trip.",
      },
      {
        heading: "Seaplane or speedboat?",
        body: "Nearer resorts use a speedboat transfer; farther, more exclusive ones use a scenic seaplane (daylight only). We factor transfers into the plan so you're not caught out by timings or extra cost.",
      },
    ],
    guideTip:
      "Confirm whether your resort has a good house reef — snorkelling straight off your villa is one of the Maldives' greatest and most underrated pleasures.",
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "international",
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/bali.jpg",
    fromPrice: 31999,
    blurb: "Terraced rice fields, ancient temples, surf breaks and spiritual wellness on the Island of the Gods.",
    tags: ["Culture", "Wellness", "Beaches", "Surfing"],
    guideIntro:
      "Bali, the Island of the Gods, blends emerald rice terraces, clifftop sea temples, surf breaks and a deep spiritual, wellness culture. Ubud's jungle and yoga, Seminyak's beach clubs and the wild islands of Nusa Penida give it something for honeymooners, families and free spirits alike.",
    guideBestTime:
      "April to October is the best time to visit Bali — the dry season, with sunny days ideal for the beaches, temples and island trips. The November–March wet season is lush and quieter, with warm rain that usually clears quickly.",
    guideThingsToDo: [
      "Watch sunset at the Tanah Lot and Uluwatu sea temples",
      "Wander the Tegalalang rice terraces around Ubud",
      "Day-trip to Nusa Penida's Kelingking Beach",
      "Chase waterfalls like Tegenungan and Sekumpul",
      "Surf or beach-club it in Seminyak and Canggu",
      "Take a Balinese cooking class or spa day",
      "See a Kecak fire dance at sunset",
    ],
    guideSections: [
      {
        heading: "Ubud and the beach",
        body: "The classic Bali split is a few nights inland in Ubud — rice fields, temples, yoga and waterfalls — then the beaches of the south (Seminyak, Nusa Dua or Uluwatu). We balance culture and coast to suit your pace.",
      },
      {
        heading: "Island add-ons",
        body: "The Nusa islands (Penida, Lembongan) and the Gilis are easy fast-boat add-ons for snorkelling and quieter beaches — great for honeymooners wanting extra seclusion.",
      },
    ],
    guideTip:
      "Base in Ubud first while you're full of energy for temples and hikes, then unwind at the beach — and start island day-trips early to beat the crowds at spots like Kelingking.",
  },
  {
    slug: "sri-lanka",
    name: "Sri Lanka",
    country: "Sri Lanka",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 38000,
    blurb: "Golden beaches, misty tea country, ancient rock fortresses and elephant-dotted jungles — an island of astonishing variety.",
    tags: ["Beaches", "Culture", "Tea Country", "Wildlife"],
    guideIntro:
      "Sri Lanka packs astonishing variety into one compact island — golden southern beaches, misty tea-covered hills, ancient rock fortresses and jungles full of elephants and leopards. A scenic train through the highlands and a safari at Yala make it one of the most rewarding short-haul trips.",
    guideBestTime:
      "Sri Lanka has two monsoons, so somewhere is always in season: December to March is best for the west and south coast and hill country, while May to September suits the east coast (Trincomalee, Arugam Bay). The cultural triangle is good most of the year.",
    guideThingsToDo: [
      "Climb the Sigiriya rock fortress at dawn",
      "Ride the scenic hill train from Kandy to Ella",
      "Tour a tea estate in Nuwara Eliya",
      "Safari for leopards and elephants at Yala or Udawalawe",
      "Explore the colonial fort at Galle",
      "Relax on the southern beaches of Mirissa and Unawatuna",
      "Visit the sacred Temple of the Tooth in Kandy",
    ],
    guideSections: [
      {
        heading: "The classic loop",
        body: "A great Sri Lanka route runs the cultural triangle (Sigiriya, Dambulla) → Kandy → tea country (Ella) → a southern beach, with a safari worked in — hills, history, wildlife and coast in one easy circuit.",
      },
      {
        heading: "That famous train ride",
        body: "The Kandy–Ella hill train, winding through tea plantations and waterfalls, is one of the world's most beautiful rail journeys. We reserve seats so you get the views without the scramble.",
      },
    ],
    guideTip:
      "Book the hill-country train's reserved seats in advance — they sell out, and the Nanu Oya–Ella leg has the very best scenery.",
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    country: "Malaysia",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 44000,
    blurb: "Twin-tower skylines, rainforest islands and a street-food culture like nowhere else — Asia's most effortless family holiday.",
    tags: ["City", "Islands", "Family", "Nature"],
    guideIntro:
      "Malaysia is Asia's most effortless family holiday — Kuala Lumpur's Twin Towers and theme parks, the rainforest and beaches of Langkawi, cool highland retreats and a street-food culture like nowhere else. It's diverse, easy and excellent value, with plenty for kids and grown-ups.",
    guideBestTime:
      "December to April is generally the best time to visit peninsular Malaysia and Langkawi, with drier, sunny weather. Kuala Lumpur is fine year-round (with short tropical showers), while Borneo and the east coast follow their own seasonal patterns.",
    guideThingsToDo: [
      "Ride to the KL Petronas Twin Towers skybridge",
      "Take the Langkawi cable car and island-hop the Andaman Sea",
      "Cool off in the Cameron Highlands tea estates",
      "Enjoy the theme parks — Sunway Lagoon and Genting",
      "Explore the heritage streets and food of Penang",
      "Spot wildlife in a rainforest reserve",
      "Feast at KL's night markets and hawker stalls",
    ],
    guideSections: [
      {
        heading: "City plus island combo",
        body: "The winning Malaysia formula is a couple of days in Kuala Lumpur for the sights and shopping, then the beaches and rainforest of Langkawi or Penang. We link them with a quick internal flight.",
      },
      {
        heading: "Easy for families",
        body: "Duty-free Langkawi, theme parks, safe cities and familiar food make Malaysia very family-friendly — and it pairs beautifully with Singapore next door.",
      },
    ],
    guideTip:
      "Langkawi is duty-free — a great place to relax and pick up chocolates, perfumes and gadgets at a discount before you fly home.",
  },
  {
    slug: "nepal",
    name: "Nepal",
    country: "Nepal",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 30000,
    blurb: "Himalayan giants, Kathmandu's temple-lined alleys and lakeside calm in Pokhara — spirituality and adventure at altitude.",
    tags: ["Mountains", "Temples", "Adventure", "Culture"],
    guideIntro:
      "Nepal is where the Himalayas meet deep spirituality — Kathmandu's temple-lined alleys and stupas, lakeside calm in Pokhara beneath the Annapurnas, and treks and adventures at the roof of the world. It offers awe-inspiring mountain scenery and rich culture at gentle prices.",
    guideBestTime:
      "October–November and March–April are the best times to visit Nepal — clear skies, the sharpest mountain views and prime trekking weather. Winter is cold but crisp at lower altitudes; the June–September monsoon brings cloud and rain to the hills.",
    guideThingsToDo: [
      "See the Himalayas at sunrise from Nagarkot or Sarangkot",
      "Explore Kathmandu's Durbar Square and Boudhanath Stupa",
      "Boat on Pokhara's Phewa Lake beneath the Annapurnas",
      "Take a scenic Everest mountain flight",
      "Trek to Poon Hill or the Annapurna foothills",
      "Spot rhinos on safari in Chitwan National Park",
      "Visit the sacred temples of Pashupatinath and Lumbini",
    ],
    guideSections: [
      {
        heading: "Sightseeing or trekking?",
        body: "You don't have to trek to enjoy Nepal — Kathmandu, Pokhara, a mountain flight and a Chitwan safari make a wonderful non-trekking trip. If you do want to walk, short routes like Poon Hill deliver huge Himalayan views without extreme altitude.",
      },
      {
        heading: "Kathmandu and Pokhara",
        body: "Almost every trip pairs cultural Kathmandu with laid-back, lakeside Pokhara — the two are linked by a short flight or a scenic drive, which we arrange.",
      },
    ],
    guideTip:
      "Add a dawn viewpoint (Nagarkot or Sarangkot) to your itinerary — the sunrise over the Himalayan peaks is the moment most travellers remember most.",
  },
  {
    slug: "egypt",
    name: "Egypt",
    country: "Egypt",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1600520611035-84157ad4084d?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 78000,
    blurb: "Pyramids, pharaonic tombs and a Nile cruise through five thousand years of history — the original bucket-list journey.",
    tags: ["Heritage", "History", "Nile Cruise", "Desert"],
    guideIntro:
      "Egypt is the original bucket-list journey — the Pyramids of Giza, pharaonic tombs in the Valley of the Kings, and a Nile cruise gliding past five thousand years of history. Cairo's chaos, Luxor's temples and the Red Sea's reefs make it one of the world's great cultural adventures.",
    guideBestTime:
      "October to April is the best time to visit Egypt, with comfortable temperatures for the pyramids, temples and Nile cruise. Summer (June–August) is intensely hot in Luxor and Aswan, though the Red Sea resorts stay pleasant and cheaper.",
    guideThingsToDo: [
      "Stand before the Pyramids of Giza and the Sphinx",
      "Cruise the Nile between Luxor and Aswan",
      "Explore the Valley of the Kings and Karnak Temple",
      "See the treasures at the Grand Egyptian Museum",
      "Visit the temples of Abu Simbel",
      "Wander Cairo's Khan el-Khalili bazaar",
      "Snorkel or dive the Red Sea reefs at Hurghada",
    ],
    guideSections: [
      {
        heading: "The Nile cruise",
        body: "A 3–4 night cruise between Luxor and Aswan is the classic way to see Egypt's greatest temples — you unpack once and the sights come to you. We pick well-run boats and pair the cruise with Cairo and the pyramids.",
      },
      {
        heading: "How much time?",
        body: "A week covers Cairo, Luxor, Aswan and a cruise comfortably. Add the Red Sea for beach time or Abu Simbel for the most dramatic temples of all — we tailor the length to your interests.",
      },
    ],
    guideTip:
      "Do the temples early morning or late afternoon — you'll dodge both the midday heat and the tour-bus crowds at Karnak and the Valley of the Kings.",
  },
  {
    slug: "azerbaijan",
    name: "Azerbaijan",
    country: "Azerbaijan",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1596306499398-8d88944a5ec4?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 52000,
    blurb: "Flame-lit modern towers beside a walled medieval old town, framed by the Caspian and the Caucasus — Europe's offbeat crossroads.",
    tags: ["City", "Culture", "Mountains", "Offbeat"],
    guideIntro:
      "Azerbaijan is Europe's offbeat crossroads — flame-shaped glass towers rising over a walled medieval old town, framed by the Caspian Sea and the Caucasus mountains. Baku's contrasts, mud volcanoes and mountain villages make it a fresh, great-value alternative to the usual city breaks.",
    guideBestTime:
      "April to June and September to October are the best times to visit Azerbaijan — mild, pleasant weather for Baku and the mountains. Summers are hot on the Caspian coast, while winter brings snow to the highland villages and ski slopes.",
    guideThingsToDo: [
      "Wander Baku's walled old town (Icherisheher) and Maiden Tower",
      "See the Flame Towers light up the skyline at night",
      "Visit the ancient rock art of Gobustan and the mud volcanoes",
      "Escape to the mountain villages of Quba or Gabala",
      "See the burning hillside of Yanardag and the fire temple",
      "Stroll the Caspian seafront boulevard",
      "Take in the Heydar Aliyev Center's flowing architecture",
    ],
    guideSections: [
      {
        heading: "City and mountains",
        body: "Baku's futuristic-meets-medieval mix is the star, but a day or two up in the green Caucasus foothills (Gabala, Quba) adds a completely different, cooler landscape. Easy to combine with a driver.",
      },
      {
        heading: "Easy and offbeat",
        body: "E-visa access, short flights, halal-friendly food and low prices have put Azerbaijan on the radar for Indian travellers wanting somewhere new. We handle the e-visa guidance and transfers.",
      },
    ],
    guideTip:
      "Do a day trip to Gobustan's mud volcanoes and petroglyphs — it's one of Azerbaijan's most unusual and memorable half-days, just outside Baku.",
  },
  {
    slug: "seychelles",
    name: "Seychelles",
    country: "Seychelles",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1553829176-61484f865ac3?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 95000,
    blurb: "Granite-boulder coves, rare island wildlife and impossibly blue water — a barefoot-luxury honeymoon archipelago.",
    tags: ["Luxury", "Beaches", "Honeymoon", "Islands"],
    guideIntro:
      "Seychelles is a barefoot-luxury honeymoon archipelago — dramatic granite boulders framing powder-soft beaches, rare island wildlife and impossibly blue water, scattered across the Indian Ocean. Beaches like Anse Source d'Argent are among the most photographed on earth.",
    guideBestTime:
      "Seychelles is a year-round destination, but April–May and October–November offer the calmest seas and best all-round conditions. The cooler, windier season (May–September) suits sailing and hiking; the warmer months (December–March) are lush with occasional short showers.",
    guideThingsToDo: [
      "Laze on Anse Source d'Argent and Anse Lazio, world-famous beaches",
      "Island-hop between Mahé, Praslin and La Digue",
      "Wander the Vallée de Mai palm forest, a UNESCO site",
      "Snorkel and dive granite-fringed reefs",
      "Cycle car-free La Digue",
      "Meet giant tortoises on Curieuse Island",
      "Take a sunset catamaran cruise",
    ],
    guideSections: [
      {
        heading: "Three islands, three moods",
        body: "Mahé has the capital and the widest choice of hotels; Praslin is lush and central for island trips; tiny La Digue is the postcard — bikes, ox-carts and dreamy beaches. Many honeymooners split their stay across two or three.",
      },
      {
        heading: "Luxury or laid-back",
        body: "Seychelles spans world-class private-island resorts and lovely, better-value guesthouses. We build the trip to your budget, whether it's all-out honeymoon luxury or a relaxed island-hop.",
      },
    ],
    guideTip:
      "Give yourself a night or two on La Digue — the slow, car-free pace and its beaches are what people fall in love with most.",
  },
  {
    slug: "south-africa",
    name: "South Africa",
    country: "South Africa",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 110000,
    blurb: "Big-five safaris, the drama of the Cape and winelands rolling down to the sea — a whole continent's highlights in one country.",
    tags: ["Wildlife", "Safari", "Adventure", "Nature"],
    guideIntro:
      "South Africa is a whole continent's highlights in one country — big-five safaris in Kruger, the drama of Cape Town and Table Mountain, and winelands rolling down to the sea. Add penguins, whales and the Garden Route, and it's one of the world's most complete adventure destinations.",
    guideBestTime:
      "May to September (the dry winter) is the best time for safari, when sparse bush and thirsty waterholes make wildlife easy to spot. Cape Town and the coast are loveliest in the summer months of November to March — so the best time depends on your priorities.",
    guideThingsToDo: [
      "Safari for the big five in Kruger or a private game reserve",
      "Ride the cable car up Table Mountain in Cape Town",
      "Drive the scenic Cape Peninsula to the Cape of Good Hope",
      "Taste wine in Stellenbosch and Franschhoek",
      "Meet the penguins at Boulders Beach",
      "Explore the Garden Route's forests and coast",
      "Go whale-watching at Hermanus (seasonal)",
    ],
    guideSections: [
      {
        heading: "Safari plus Cape Town",
        body: "The classic trip pairs a Kruger-area safari with Cape Town and the winelands — bush and city, wildlife and coast. A domestic flight links the two, and we can add the Garden Route in between.",
      },
      {
        heading: "Private reserve vs national park",
        body: "Kruger National Park is vast and great value; adjoining private reserves offer off-road drives, expert guides and higher big-cat odds at a premium. We match the reserve to your budget and how serious you are about sightings.",
      },
    ],
    guideTip:
      "For the best game viewing, choose the dry winter months and do at least two nights on safari — early-morning and evening drives are when the big cats are most active.",
  },
  {
    slug: "spain",
    name: "Spain",
    country: "Spain",
    region: "international",
    heroImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2000&auto=format&fit=crop",
    fromPrice: 125000,
    blurb: "Gaudí's Barcelona, flamenco nights, tapas trails and a sun-baked Mediterranean coast — Europe at its most spirited.",
    tags: ["Heritage", "Culture", "Cities", "Food"],
    guideIntro:
      "Spain is Europe at its most spirited — Gaudí's Barcelona, flamenco and Moorish palaces in Andalusia, world-class tapas trails and a sun-baked Mediterranean coast. Great food, warm evenings and a wealth of art and architecture make it one of Europe's most joyful trips.",
    guideBestTime:
      "April to June and September to October are the best times to visit Spain — warm, comfortable weather and thinner crowds. July–August is hot and busy (great for the beaches but sweltering inland in Seville and Madrid); winters are mild on the coast.",
    guideThingsToDo: [
      "Marvel at Gaudí's Sagrada Família and Park Güell in Barcelona",
      "Explore the Alhambra palace in Granada",
      "Wander Seville's cathedral, Alcázar and flamenco bars",
      "See the art of Madrid's Prado and the Royal Palace",
      "Eat pintxos and tapas across the cities",
      "Relax on the Costa del Sol or Costa Brava",
      "Day-trip to Toledo or Córdoba's Mezquita",
    ],
    guideSections: [
      {
        heading: "Which cities?",
        body: "A first trip usually links Barcelona and Madrid, with Andalusia (Seville, Granada, Córdoba) for the Moorish south. Fast trains connect them in a few hours, so it's easy to see several without long drives — we sort the rail and transfers.",
      },
      {
        heading: "Schengen and timing",
        body: "Spain is in the Schengen zone, so it pairs neatly with other European countries on one visa. We guide you through the Schengen visa process and build a realistic, well-paced route.",
      },
    ],
    guideTip:
      "Book the Alhambra and Sagrada Família tickets well in advance — they're timed-entry and sell out days ahead, especially in peak season.",
  },
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
