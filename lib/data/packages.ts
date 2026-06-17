import type { Package } from "@/lib/types";

export const packages: Package[] = [
  // ── DOMESTIC ────────────────────────────────────────────────────────────────

  {
    slug: "short-escape-to-goa",
    title: "Short Escape to Goa",
    destination: "Goa",
    destinationSlug: "goa",
    category: "family",
    duration: "2N / 3D",
    nights: 2,
    heroImage: "/images/destinations/goa.jpg",
    gallery: ["/images/destinations/goa.jpg"],
    fromPrice: 10500,
    badge: "Weekend Getaway",
    featured: false,
    highlights: [
      "North Goa beach tour — Baga, Calangute & Anjuna",
      "Fort Aguada & Chapora Fort sightseeing",
      "Old Goa heritage churches walk",
      "Water sports at Candolim Beach",
    ],
    inclusions: [
      "2 nights beach resort stay",
      "Daily breakfast",
      "Airport / station transfers",
      "Half-day sightseeing by AC vehicle",
    ],
    exclusions: [
      "Flights (land package)",
      "Lunch & dinner",
      "Water sports charges",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive & Settle In",
        description:
          "Check into your beach resort in Calangute. Spend the evening exploring Baga Beach and the lively Tito's Lane market strip.",
      },
      {
        day: 2,
        title: "North Goa Sightseeing",
        description:
          "Fort Aguada lighthouse views, Chapora Fort panorama, Anjuna flea market. Afternoon water sports at Candolim — jet ski, parasailing, banana boat.",
      },
      {
        day: 3,
        title: "South Goa & Departure",
        description:
          "Morning visit to Old Goa's Basilica of Bom Jesus and Se Cathedral. Leisurely checkout and transfer to airport or railway station.",
      },
    ],
  },

  {
    slug: "wonders-of-kerala",
    title: "Wonders of Kerala",
    destination: "Kerala",
    destinationSlug: "kerala",
    category: "honeymoon",
    duration: "7N / 8D",
    nights: 7,
    heroImage: "/images/destinations/kerala.jpg",
    gallery: ["/images/destinations/kerala.jpg"],
    fromPrice: 32000,
    badge: "Bestseller",
    featured: true,
    highlights: [
      "Houseboat cruise on Alleppey backwaters",
      "Kathakali cultural show in Kochi",
      "Tea estate & spice plantation, Munnar",
      "Wildlife safari, Thekkady",
      "Sunset at Kovalam beach",
    ],
    inclusions: [
      "Return flights from Goa",
      "7 nights accommodation (hotel + houseboat)",
      "Daily breakfast & dinner",
      "AC vehicle throughout",
      "English-speaking guide",
    ],
    exclusions: [
      "Lunch & personal expenses",
      "Travel insurance",
      "Tips & gratuities",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Kochi",
        description:
          "Airport pickup, check-in. Evening Kathakali performance at Kerala Kalamandalam.",
      },
      {
        day: 2,
        title: "Kochi Sightseeing",
        description:
          "Fort Kochi, Chinese fishing nets, Mattancherry Palace, Jew Town spice market, Santa Cruz Basilica.",
      },
      {
        day: 3,
        title: "Munnar Hill Station",
        description:
          "Scenic drive up to Munnar, tea estate tour, Mattupetty Dam, Echo Point, Top Station viewpoint.",
      },
      {
        day: 4,
        title: "Munnar to Thekkady",
        description:
          "Spice plantation walk, drive to Thekkady. Evening Periyar wildlife boat safari.",
      },
      {
        day: 5,
        title: "Thekkady to Alleppey",
        description:
          "Morning spice market visit. Drive to Alleppey. Board your private luxury houseboat.",
      },
      {
        day: 6,
        title: "Backwaters at Leisure",
        description:
          "Full day cruising the emerald backwaters. Village walks, sunset on the deck, fresh seafood dinner aboard.",
      },
      {
        day: 7,
        title: "Alleppey to Kovalam",
        description:
          "Disembark houseboat, drive to Kovalam. Beach relaxation, lighthouse viewpoint, Ayurvedic massage.",
      },
      {
        day: 8,
        title: "Departure",
        description:
          "Transfer to Trivandrum airport for return flight.",
      },
    ],
  },

  {
    slug: "kashmir-valley-tour",
    title: "Kashmir Valley Tour",
    destination: "Kashmir",
    destinationSlug: "kashmir",
    category: "adventure",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "/images/destinations/kashmir.jpg",
    gallery: ["/images/destinations/kashmir.jpg"],
    fromPrice: 39000,
    badge: "Most Popular",
    featured: true,
    highlights: [
      "Shikara ride on Dal Lake, Srinagar",
      "Meadows of Pahalgam & Betaab Valley",
      "Gulmarg Gondola — Asia's highest cable car",
      "Mughal Gardens — Shalimar, Nishat, Chashme Shahi",
    ],
    inclusions: [
      "Return flights from Goa",
      "5 nights (houseboat on Dal Lake + hotel)",
      "Daily breakfast & dinner",
      "AC vehicle with driver",
      "Shikara ride included",
    ],
    exclusions: [
      "Gondola cable car charges",
      "Pony rides",
      "Lunch & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Srinagar",
        description:
          "Airport pickup, check-in to houseboat on Dal Lake. Evening shikara ride through the floating market.",
      },
      {
        day: 2,
        title: "Srinagar Sightseeing",
        description:
          "Mughal Gardens — Shalimar Bagh, Nishat Bagh, Chashme Shahi. Old City bazaars and Jama Masjid.",
      },
      {
        day: 3,
        title: "Pahalgam",
        description:
          "Drive to the 'Valley of Shepherds'. Betaab Valley, Aru Valley, Chandanwari meadows. Horse riding optional.",
      },
      {
        day: 4,
        title: "Gulmarg",
        description:
          "Drive to Gulmarg. Gondola Phase I & II to Apharwat Peak (seasonal). Snow activities, golf course, meadow walks.",
      },
      {
        day: 5,
        title: "Sonamarg",
        description:
          "Day excursion to the 'Meadow of Gold'. Thajiwas Glacier, Sindh River, mountain views.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Morning free for local shopping — saffron, Pashmina shawls, Kashmiri dry fruits. Transfer to airport.",
      },
    ],
  },

  // ── INTERNATIONAL ────────────────────────────────────────────────────────────

  {
    slug: "escape-to-da-nang-hoi-an",
    title: "Escape to Da Nang & Hoi An",
    destination: "Vietnam",
    destinationSlug: "vietnam",
    category: "family",
    duration: "3N / 4D",
    nights: 3,
    heroImage: "/images/destinations/vietnam.jpg",
    gallery: ["/images/destinations/vietnam.jpg"],
    fromPrice: 24500,
    badge: "Budget Pick",
    featured: false,
    highlights: [
      "Marble Mountains cave temples, Da Nang",
      "Lantern-lit Ancient Town of Hoi An",
      "My Son Sanctuary — Cham ruins UNESCO site",
      "Cooking class with local chef, Hoi An",
    ],
    inclusions: [
      "Return flights from Goa",
      "3 nights hotel",
      "Daily breakfast",
      "Airport transfers",
      "Hoi An Ancient Town boat ride",
    ],
    exclusions: [
      "Vietnam e-visa (₹1,500 approx)",
      "Lunch & dinner",
      "Travel insurance",
      "Optional cooking class",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Da Nang",
        description:
          "Flight arrival, hotel check-in. Evening stroll along My Khe Beach — one of the most beautiful beaches in Southeast Asia.",
      },
      {
        day: 2,
        title: "Da Nang to Hoi An",
        description:
          "Marble Mountains cave pagodas, Lady Buddha at Linh Ung Pagoda. Afternoon in Hoi An — Ancient Town, Japanese Covered Bridge, colourful lantern market.",
      },
      {
        day: 3,
        title: "My Son Sanctuary & Hoi An",
        description:
          "Morning at My Son Cham ruins (UNESCO). Afternoon cooking class or bicycle through rice fields. Boat lantern release on Thu Bon River at night.",
      },
      {
        day: 4,
        title: "Departure",
        description:
          "Leisurely breakfast, beach time or local café, transfer to Da Nang airport.",
      },
    ],
  },

  {
    slug: "explore-phu-quoc",
    title: "Explore Phu Quoc",
    destination: "Vietnam",
    destinationSlug: "vietnam",
    category: "honeymoon",
    duration: "4N / 5D",
    nights: 4,
    heroImage: "/images/destinations/vietnam.jpg",
    gallery: ["/images/destinations/vietnam.jpg"],
    fromPrice: 36500,
    badge: "Island Escape",
    featured: false,
    highlights: [
      "Pristine beaches — Bai Sao & Long Beach",
      "Sunset at Phu Quoc Night Market",
      "Snorkelling in An Thoi Archipelago",
      "Pepper farm & fish sauce factory tour",
    ],
    inclusions: [
      "Return flights from Goa",
      "4 nights beach resort",
      "Daily breakfast",
      "Airport & island transfers",
      "Snorkelling day trip",
    ],
    exclusions: [
      "Vietnam e-visa",
      "Lunch & dinner",
      "Travel insurance",
      "Personal expenses",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Phu Quoc",
        description:
          "Flight arrival, resort check-in. Sunset drinks at Long Beach. Phu Quoc Night Market for fresh seafood dinner.",
      },
      {
        day: 2,
        title: "Island Exploration",
        description:
          "Pepper plantation, fish sauce factory, Dinh Cau Rock Shrine. Afternoon at Bai Sao — one of Vietnam's top-rated beaches.",
      },
      {
        day: 3,
        title: "Snorkelling Day Trip",
        description:
          "Full-day boat to An Thoi Islands — snorkelling, fishing, coral reef swim. Fresh seafood lunch on the boat.",
      },
      {
        day: 4,
        title: "Leisure & Spa",
        description:
          "Morning kayaking or beach walk. Afternoon couples spa. Farewell dinner at a beachfront restaurant.",
      },
      {
        day: 5,
        title: "Departure",
        description:
          "Breakfast, last beach swim, transfer to Phu Quoc International Airport.",
      },
    ],
  },

  {
    slug: "enchanting-georgia-escape",
    title: "Enchanting Georgia Escape",
    destination: "Georgia",
    destinationSlug: "georgia",
    category: "adventure",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "/images/destinations/georgia.jpg",
    gallery: ["/images/destinations/georgia.jpg"],
    fromPrice: 38000,
    badge: "Trending",
    featured: false,
    highlights: [
      "Old Tbilisi — sulphur baths, Narikala Fortress",
      "Gudauri skiing & snowboarding",
      "Kazbegi — Gergeti Trinity Church at 2,170m",
      "Wine tasting in Kakheti wine region",
    ],
    inclusions: [
      "Return flights from Goa",
      "5 nights hotel",
      "Daily breakfast",
      "AC vehicle with English-speaking driver",
      "Tbilisi city tour",
    ],
    exclusions: [
      "Ski equipment & lift passes",
      "Lunch & dinner",
      "Travel insurance",
      "Georgia e-visa (free for Indians)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Tbilisi",
        description:
          "Airport pickup, check-in. Evening walk through Old Tbilisi — colourful balconied houses, Abanotubani sulphur bath district.",
      },
      {
        day: 2,
        title: "Tbilisi Sightseeing",
        description:
          "Narikala Fortress cable car, Jvari Monastery, Mtskheta (UNESCO), Svetitskhoveli Cathedral, Georgian National Museum.",
      },
      {
        day: 3,
        title: "Gudauri Ski Resort",
        description:
          "Drive to Gudauri at 2,196m. Skiing, snowboarding or sledging. Panoramic views of the Greater Caucasus Range.",
      },
      {
        day: 4,
        title: "Kazbegi",
        description:
          "Dramatic drive through Dariali Gorge and the Georgian Military Highway. 4x4 to Gergeti Trinity Church overlooking Mt. Kazbek.",
      },
      {
        day: 5,
        title: "Kakheti Wine Region",
        description:
          "Day trip to Sighnaghi — 'City of Love'. Winery tour with wine and chacha tasting. Traditional Georgian dinner (supra).",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Morning free in Tbilisi — Rustaveli Avenue, souvenir shopping. Transfer to airport.",
      },
    ],
  },

  {
    slug: "thailand-phuket",
    title: "Thailand — Phuket",
    destination: "Thailand",
    destinationSlug: "thailand",
    category: "family",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "/images/destinations/thailand.jpg",
    gallery: ["/images/destinations/thailand.jpg"],
    fromPrice: 42500,
    badge: "Most Popular",
    featured: true,
    highlights: [
      "Phi Phi Island speedboat day trip & Maya Bay",
      "James Bond Island — Phang Nga Bay sea canoe",
      "Big Buddha & Wat Chalong Temple, Phuket",
      "Patong Beach nightlife & street food",
    ],
    inclusions: [
      "Return flights from Goa",
      "5 nights 4-star hotel in Phuket",
      "Daily breakfast",
      "Airport transfers",
      "Phi Phi Island tour",
    ],
    exclusions: [
      "Visa on arrival (₹3,500 approx)",
      "Lunch & dinner",
      "Travel insurance",
      "Optional activities",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Phuket",
        description:
          "Airport transfer to hotel. Evening at Patong Beach and Bangla Road night market.",
      },
      {
        day: 2,
        title: "Phi Phi Islands",
        description:
          "Full-day speedboat — Phi Phi Don, Phi Phi Leh, Maya Bay, Viking Cave, monkey beach, snorkelling at coral reefs.",
      },
      {
        day: 3,
        title: "James Bond Island",
        description:
          "Phang Nga Bay by longtail boat — James Bond Island, sea kayaking through limestone caves, floating Muslim village.",
      },
      {
        day: 4,
        title: "Phuket Highlights",
        description:
          "Big Buddha viewpoint, Wat Chalong, Phuket Old Town Sino-Portuguese streets, Promthep Cape sunset.",
      },
      {
        day: 5,
        title: "Beach & Leisure",
        description:
          "Kata Noi beach morning. Elephant sanctuary ethical visit. Evening Tiger Kingdom or cooking class.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Breakfast, last minute shopping at Jungceylon mall, transfer to Phuket International Airport.",
      },
    ],
  },

  {
    slug: "hanoi-sapa-tour",
    title: "The Best of Hanoi & Sapa",
    destination: "Vietnam",
    destinationSlug: "vietnam",
    category: "adventure",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "/images/destinations/vietnam.jpg",
    gallery: ["/images/destinations/vietnam.jpg"],
    fromPrice: 53500,
    badge: "Cultural Journey",
    featured: false,
    highlights: [
      "Hoan Kiem Lake & Ngoc Son Temple, Hanoi",
      "Fansipan Peak — 'Roof of Indochina' (3,143m)",
      "Trek through Muong Hoa Valley rice terraces",
      "Homestay with Hmong village family",
    ],
    inclusions: [
      "Return flights from Goa",
      "5 nights (Hanoi hotel + Sapa resort)",
      "Daily breakfast",
      "Overnight train Hanoi–Lao Cai (AC sleeper)",
      "English-speaking guide",
    ],
    exclusions: [
      "Vietnam e-visa",
      "Fansipan cable car (optional)",
      "Lunch & dinner",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Hanoi",
        description:
          "Airport pickup, hotel check-in. Evening walk around Hoan Kiem Lake, Ngoc Son Temple, Hanoi Old Quarter street food tour.",
      },
      {
        day: 2,
        title: "Hanoi City Tour",
        description:
          "Ho Chi Minh Mausoleum, One Pillar Pagoda, Temple of Literature, Vietnam Museum of Ethnology. Evening water puppet show.",
      },
      {
        day: 3,
        title: "Overnight Train to Sapa",
        description:
          "Free morning in Hanoi. Board the overnight AC sleeper train to Lao Cai. Transfer to Sapa.",
      },
      {
        day: 4,
        title: "Sapa Trekking",
        description:
          "Trek through Muong Hoa Valley — terraced rice fields, Black Hmong and Red Dao villages. Fansipan cable car optional.",
      },
      {
        day: 5,
        title: "Sapa to Hanoi",
        description:
          "Bac Ha market (if Sunday). Afternoon return to Hanoi. Evening at leisure — bia hoi corner, local pho.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Transfer to Noi Bai International Airport for return flight.",
      },
    ],
  },

  {
    slug: "dubai-prestige",
    title: "Dubai Prestige Package",
    destination: "Dubai",
    destinationSlug: "dubai",
    category: "family",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "/images/destinations/dubai.jpg",
    gallery: ["/images/destinations/dubai.jpg"],
    fromPrice: 57000,
    badge: "International",
    featured: false,
    highlights: [
      "Burj Khalifa observation deck (124th & 148th floor)",
      "Desert safari with BBQ dinner under the stars",
      "Dubai Frame, Gold Souk & Miracle Garden",
      "Dhow cruise on Dubai Creek",
    ],
    inclusions: [
      "Return flights from Goa",
      "5 nights 4-star hotel",
      "Daily breakfast",
      "Airport & attraction transfers",
      "Desert safari with BBQ dinner",
      "UAE tourist visa",
    ],
    exclusions: [
      "Lunch & dinner (except safari BBQ)",
      "Travel insurance",
      "Theme park tickets",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Dubai",
        description:
          "Airport pickup, hotel check-in. Evening Dhow Cruise on Dubai Creek with dinner.",
      },
      {
        day: 2,
        title: "Modern Dubai",
        description:
          "Burj Khalifa (At the Top), Dubai Mall, Dubai Fountain show, JBR Walk at dusk.",
      },
      {
        day: 3,
        title: "Desert Safari",
        description:
          "Morning free. Afternoon dune bashing in a 4x4, camel ride, sandboarding, henna, BBQ dinner with belly dance show.",
      },
      {
        day: 4,
        title: "Old Dubai & Miracle Garden",
        description:
          "Dubai Frame, Gold Souk, Spice Souk, Al Fahidi historical neighbourhood, Miracle Garden (Oct–Apr).",
      },
      {
        day: 5,
        title: "Leisure & Shopping",
        description:
          "Global Village or IMG Worlds of Adventure. Evening Mall of Emirates — Ski Dubai.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Breakfast, last-minute duty-free shopping, transfer to Dubai International Airport.",
      },
    ],
  },

  {
    slug: "vietnam-exploration-tour",
    title: "Vietnam Exploration Tour",
    destination: "Vietnam",
    destinationSlug: "vietnam",
    category: "adventure",
    duration: "6N / 7D",
    nights: 6,
    heroImage: "/images/destinations/vietnam.jpg",
    gallery: ["/images/destinations/vietnam.jpg"],
    fromPrice: 62000,
    badge: "Full Country",
    featured: false,
    highlights: [
      "Ha Long Bay overnight cruise — UNESCO World Heritage",
      "Hoi An Ancient Town by bicycle",
      "Cu Chi Tunnels, Ho Chi Minh City",
      "Street food tour of Hanoi Old Quarter",
    ],
    inclusions: [
      "Return flights from Goa",
      "6 nights accommodation (hotels + Ha Long cruise)",
      "Daily breakfast",
      "Domestic flights (Hanoi–Da Nang–Ho Chi Minh)",
      "Ha Long Bay 2D/1N cruise",
      "English-speaking guide",
    ],
    exclusions: [
      "Vietnam e-visa",
      "Lunch & dinner (except cruise meals)",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Hanoi",
        description:
          "Airport pickup, hotel check-in. Evening Old Quarter walk, bia hoi junction, street food.",
      },
      {
        day: 2,
        title: "Ha Long Bay",
        description:
          "Drive to Ha Long, board luxury junk boat. Cruise through limestone karsts, kayak into Luon Cave, cooking demo.",
      },
      {
        day: 3,
        title: "Ha Long Bay to Hanoi",
        description:
          "Morning kayak, Tai Chi on deck. Return to Hanoi. Fly to Da Nang evening.",
      },
      {
        day: 4,
        title: "Hoi An",
        description:
          "Explore the Ancient Town by bicycle — Japanese Bridge, tailor shops, lantern market. My Son Cham ruins.",
      },
      {
        day: 5,
        title: "Da Nang to Ho Chi Minh",
        description:
          "Marble Mountains morning. Fly to Ho Chi Minh City. Ben Thanh Market, Pham Ngu Lao street.",
      },
      {
        day: 6,
        title: "Ho Chi Minh City",
        description:
          "Cu Chi Tunnels, War Remnants Museum, Reunification Palace, Saigon street food evening.",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "Mekong Delta morning day trip optional. Transfer to Tan Son Nhat Airport.",
      },
    ],
  },

  {
    slug: "glitters-of-singapore",
    title: "Glitters of Singapore",
    destination: "Singapore",
    destinationSlug: "singapore",
    category: "family",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "/images/destinations/singapore.jpg",
    gallery: ["/images/destinations/singapore.jpg"],
    fromPrice: 83500,
    badge: "Premium",
    featured: false,
    highlights: [
      "Gardens by the Bay — Supertree Grove & Cloud Forest",
      "Universal Studios Singapore, Sentosa",
      "Night Safari — world's first nocturnal zoo",
      "Merlion Park & Marina Bay Sands SkyPark",
    ],
    inclusions: [
      "Return flights from Goa",
      "5 nights 4-star hotel",
      "Daily breakfast",
      "Airport transfers",
      "Singapore tourist visa",
      "Gardens by the Bay entry",
    ],
    exclusions: [
      "Universal Studios tickets",
      "Lunch & dinner",
      "Travel insurance",
      "Optional cruise or cable car",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Singapore",
        description:
          "Changi Airport (voted world's best), hotel check-in. Evening at Clarke Quay — riverside bars and dinner.",
      },
      {
        day: 2,
        title: "Marina Bay & Garden City",
        description:
          "Merlion Park, Marina Bay Sands SkyPark, Gardens by the Bay — Cloud Forest, Flower Dome, Supertree light show at night.",
      },
      {
        day: 3,
        title: "Sentosa Island",
        description:
          "Full day at Sentosa — Universal Studios Singapore, S.E.A. Aquarium, Siloso Beach, Wings of Time show.",
      },
      {
        day: 4,
        title: "Cultural Quarters",
        description:
          "Chinatown, Little India, Arab Street (Kampong Glam), Sri Mariamman Temple, Bugis Street shopping.",
      },
      {
        day: 5,
        title: "Night Safari & Orchard",
        description:
          "Orchard Road shopping by day. Evening — Singapore Night Safari, tram ride through nocturnal wildlife zones.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Changi Jewel (indoor waterfall & gardens), duty-free, transfer to airport.",
      },
    ],
  },

  {
    slug: "dubai-abu-dhabi-elite",
    title: "Dubai & Abu Dhabi Elite Experience",
    destination: "Dubai",
    destinationSlug: "dubai",
    category: "family",
    duration: "6N / 7D",
    nights: 6,
    heroImage: "/images/destinations/dubai.jpg",
    gallery: ["/images/destinations/dubai.jpg"],
    fromPrice: 89000,
    badge: "Luxury",
    featured: false,
    highlights: [
      "Sheikh Zayed Grand Mosque, Abu Dhabi",
      "Ferrari World — fastest roller coaster on Earth",
      "Burj Khalifa + desert safari combo",
      "Louvre Abu Dhabi & Yas Island",
    ],
    inclusions: [
      "Return flights from Goa",
      "6 nights 5-star hotel (Dubai + Abu Dhabi)",
      "Daily breakfast",
      "All transfers including Dubai–Abu Dhabi",
      "Desert safari with dinner",
      "UAE tourist visa",
    ],
    exclusions: [
      "Ferrari World & theme park tickets",
      "Lunch & dinner",
      "Travel insurance",
      "Personal shopping",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Dubai",
        description:
          "Airport pickup, 5-star hotel check-in. Evening Dubai Marina Walk and dinner cruise.",
      },
      {
        day: 2,
        title: "Modern Dubai",
        description:
          "Burj Khalifa (148th floor Sky Views), Dubai Mall, Dubai Fountain. Afternoon Palm Jumeirah & Atlantis viewpoint.",
      },
      {
        day: 3,
        title: "Desert Safari",
        description:
          "Morning at leisure. Afternoon desert dune bashing, camel trek, falconry demo, BBQ dinner with live entertainment.",
      },
      {
        day: 4,
        title: "Abu Dhabi — Grand Mosque",
        description:
          "Drive to Abu Dhabi. Sheikh Zayed Grand Mosque (one of the world's largest), Emirates Palace, Corniche waterfront.",
      },
      {
        day: 5,
        title: "Yas Island",
        description:
          "Ferrari World Abu Dhabi, Yas Marina Circuit, Warner Bros. World. Louvre Abu Dhabi art gallery.",
      },
      {
        day: 6,
        title: "Old Dubai & Shopping",
        description:
          "Gold Souk, Spice Souk, Al Fahidi Fort, Dubai Frame. Afternoon Global Village or Ibn Battuta Mall.",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "Breakfast, last-minute duty-free, transfer to Dubai International Airport.",
      },
    ],
  },
];

export function getPackageBySlug(slug: string) {
  return packages.find((p) => p.slug === slug);
}

export function getFeaturedPackages() {
  return packages.filter((p) => p.featured);
}

export function getPackagesByDestination(destinationSlug: string) {
  return packages.filter((p) => p.destinationSlug === destinationSlug);
}

export function getPackagesByCategory(category: string) {
  return packages.filter((p) => p.category === category);
}
