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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/goa.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/goa.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/kerala.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/kerala.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/kashmir.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/kashmir.jpg"],
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

  {
    slug: "andaman-islands-escape",
    title: "Andaman Islands Escape",
    destination: "Andaman & Nicobar",
    destinationSlug: "andaman",
    category: "honeymoon",
    duration: "6N / 7D",
    nights: 6,
    heroImage: "https://images.unsplash.com/photo-1586359716568-3e1907e4cf9f?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1586359716568-3e1907e4cf9f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1704314315344-cd10b9779ce6?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586053226626-febc8817962f?q=80&w=2000&auto=format&fit=crop",
    ],
    fromPrice: 45000,
    badge: "Island Escape",
    featured: true,
    highlights: [
      "Radhanagar Beach, Havelock — Asia's finest white sand",
      "Cellular Jail light-and-sound show, Port Blair",
      "Scuba & snorkelling over living coral reefs",
      "Ross & North Bay Islands by boat",
    ],
    inclusions: [
      "6 nights hotels (Port Blair, Havelock & Neil)",
      "Daily buffet breakfast",
      "All transfers & sightseeing by AC vehicle",
      "Inter-island ferry tickets & entry permits",
      "Arrival & departure assistance",
    ],
    exclusions: [
      "Airfare to Port Blair",
      "Scuba diving & water-sport charges",
      "Lunch, dinner & personal expenses",
      "Camera fees & travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Port Blair",
        description:
          "Airport pickup and hotel check-in. Evening at the Cellular Jail for the moving light-and-sound show retracing India's freedom struggle.",
      },
      {
        day: 2,
        title: "Ross & North Bay Islands",
        description:
          "Harbour cruise to Ross Island's colonial-era ruins, then North Bay for coral viewing, glass-bottom boats and water sports.",
      },
      {
        day: 3,
        title: "Port Blair to Havelock",
        description:
          "Morning ferry to Havelock (Swaraj Dweep). Unwind at Radhanagar Beach for a golden sunset over the Bay of Bengal.",
      },
      {
        day: 4,
        title: "Havelock — Elephant Beach",
        description:
          "Snorkelling or a first scuba dive over the coral gardens at Elephant Beach, with leisure time on Havelock's quiet shores.",
      },
      {
        day: 5,
        title: "Havelock to Neil",
        description:
          "Ferry to Neil (Shaheed Dweep) for the Natural Bridge, Laxmanpur and Bharatpur beaches, and a glass-bottom boat over the reef.",
      },
      {
        day: 6,
        title: "Neil to Port Blair",
        description:
          "Return ferry to Port Blair. Free afternoon for Corbyn's Cove or last-minute island shopping.",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "Transfer to the airport for your onward flight home.",
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/georgia.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/georgia.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/thailand.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/thailand.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/dubai.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/dubai.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/vietnam.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/singapore.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/singapore.jpg"],
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
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/dubai.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/dubai.jpg"],
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

  {
    slug: "lakshadweep-lagoon-escape",
    title: "Lakshadweep Lagoon Escape",
    destination: "Lakshadweep",
    destinationSlug: "lakshadweep",
    category: "honeymoon",
    duration: "4N / 5D",
    nights: 4,
    heroImage: "https://images.unsplash.com/photo-1572431447238-425af66a273b?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1572431447238-425af66a273b?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 40000,
    badge: "Island Escape",
    featured: false,
    highlights: [
      "Barefoot calm on Agatti & Bangaram atolls",
      "Snorkelling & scuba over untouched coral reefs",
      "Glass-bottom boat rides across turquoise lagoons",
      "Kayaking, sunset sailing and quiet beach time",
    ],
    inclusions: [
      "4 nights island resort / cottage stay",
      "All meals (breakfast, lunch & dinner)",
      "Lakshadweep entry permit & inter-island transfers",
      "Snorkelling gear and lagoon activities",
    ],
    exclusions: [
      "Airfare to Agatti (via Kochi)",
      "Scuba certification charges",
      "Alcohol (dry destination) & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Agatti",
        description:
          "Fly in over a necklace of coral atolls, transfer to your island stay and ease into lagoon time with a sunset walk along the reef.",
      },
      {
        day: 2,
        title: "Reefs & Lagoons",
        description:
          "Snorkel or take a first scuba dive over living coral gardens, then drift across the lagoon by glass-bottom boat.",
      },
      {
        day: 3,
        title: "Bangaram & Thinnakara",
        description:
          "Boat to a neighbouring uninhabited islet for kayaking, swimming and a castaway-style beach picnic.",
      },
      {
        day: 4,
        title: "Leisure & Water Sports",
        description:
          "A free day for paddleboarding, sunset sailing or simply doing nothing on powder-soft sand.",
      },
      {
        day: 5,
        title: "Departure",
        description:
          "A last barefoot morning by the water before your transfer to Agatti airport.",
      },
    ],
  },

  {
    slug: "sri-lanka-highlights",
    title: "Sri Lanka Highlights",
    destination: "Sri Lanka",
    destinationSlug: "sri-lanka",
    category: "family",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 38000,
    badge: "Island Culture",
    featured: false,
    highlights: [
      "Temple of the Sacred Tooth Relic, Kandy",
      "Hill-country train ride to Nuwara Eliya",
      "Tea plantations & 'Little England' scenery",
      "Golden southern beaches at Bentota",
    ],
    inclusions: [
      "5 nights hotel (Kandy, Nuwara Eliya & Bentota)",
      "Daily breakfast & dinner",
      "Private AC vehicle with English-speaking driver",
      "Airport transfers",
    ],
    exclusions: [
      "Airfare & Sri Lanka ETA visa",
      "Entry tickets & safari charges",
      "Lunch & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Colombo → Kandy",
        description:
          "Airport pickup and drive to the hill capital of Kandy. Evening at the lakeside Temple of the Sacred Tooth Relic.",
      },
      {
        day: 2,
        title: "Kandy Sightseeing",
        description:
          "Peradeniya Royal Botanical Gardens, a spice garden and a Kandyan cultural dance show before an easy lakeside evening.",
      },
      {
        day: 3,
        title: "Kandy → Nuwara Eliya",
        description:
          "Ride the famous hill-country train through emerald tea plantations. Tour a tea factory and stroll colonial 'Little England'.",
      },
      {
        day: 4,
        title: "Nuwara Eliya → Bentota",
        description:
          "Descend to the south coast. Afternoon free on Bentota's golden sands or the calm river lagoon.",
      },
      {
        day: 5,
        title: "Bentota Beach & Leisure",
        description:
          "A full beach day — swim, laze, or add a boat safari on the Madu River through the mangroves.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Transfer to Colombo airport for your onward flight.",
      },
    ],
  },

  {
    slug: "kathmandu-pokhara-explorer",
    title: "Kathmandu & Pokhara Explorer",
    destination: "Nepal",
    destinationSlug: "nepal",
    category: "adventure",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 30000,
    badge: "Himalayan Escape",
    featured: false,
    highlights: [
      "Kathmandu Durbar Square & Swayambhunath stupa",
      "Sarangkot sunrise over the Annapurna range",
      "Boating on Pokhara's Phewa Lake",
      "Pashupatinath & Boudhanath temple visits",
    ],
    inclusions: [
      "5 nights hotel (Kathmandu & Pokhara)",
      "Daily breakfast",
      "Kathmandu–Pokhara transfers",
      "Sightseeing by private vehicle with guide",
    ],
    exclusions: [
      "Airfare to Kathmandu",
      "Monument entry fees",
      "Lunch, dinner & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Kathmandu",
        description:
          "Airport pickup and hotel check-in. Evening aarti at the sacred riverside temple of Pashupatinath.",
      },
      {
        day: 2,
        title: "Kathmandu Valley",
        description:
          "Kathmandu Durbar Square, the hilltop Swayambhunath (Monkey Temple) and the vast Boudhanath stupa.",
      },
      {
        day: 3,
        title: "Kathmandu → Pokhara",
        description:
          "Scenic drive (or short flight) to lakeside Pokhara. Evening boating on tranquil Phewa Lake.",
      },
      {
        day: 4,
        title: "Sarangkot Sunrise",
        description:
          "Early rise for a golden Himalayan sunrise over Annapurna and Machapuchare, then Davis Falls and the Gupteshwor cave.",
      },
      {
        day: 5,
        title: "Pokhara → Kathmandu",
        description:
          "Return to Kathmandu with time for the lively bazaars of Thamel and last-minute souvenir shopping.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Transfer to Kathmandu airport for your onward flight.",
      },
    ],
  },

  {
    slug: "kuala-lumpur-langkawi",
    title: "Kuala Lumpur & Langkawi",
    destination: "Malaysia",
    destinationSlug: "malaysia",
    category: "family",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 44000,
    badge: "City & Island",
    featured: false,
    highlights: [
      "Petronas Twin Towers & KL city tour",
      "Batu Caves' golden shrine and limestone steps",
      "Langkawi SkyCab and SkyBridge views",
      "Island-hopping and beaches on Langkawi",
    ],
    inclusions: [
      "5 nights hotel (Kuala Lumpur & Langkawi)",
      "Daily breakfast",
      "KL city tour + Langkawi island-hopping tour",
      "Inter-city flight & airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Cable car & attraction tickets",
      "Lunch, dinner & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Kuala Lumpur",
        description:
          "Airport pickup and hotel check-in. Evening at the glittering Petronas Twin Towers and the KLCC fountains.",
      },
      {
        day: 2,
        title: "KL City & Batu Caves",
        description:
          "City tour taking in the Batu Caves shrine, KL Tower, the National Mosque and Merdeka Square.",
      },
      {
        day: 3,
        title: "KL → Langkawi",
        description:
          "Fly to the island of Langkawi. Afternoon free on Pantai Cenang beach with its warm Andaman waters.",
      },
      {
        day: 4,
        title: "Langkawi Island Hopping",
        description:
          "Boat tour to the Pregnant Maiden Lake and eagle-feeding bay, then the SkyCab up Mount Mat Cincang for the SkyBridge.",
      },
      {
        day: 5,
        title: "Langkawi Leisure",
        description:
          "A free day for the mangrove geopark, duty-free shopping or simply the beach.",
      },
      {
        day: 6,
        title: "Departure",
        description:
          "Transfer to Langkawi airport for your onward flight home.",
      },
    ],
  },

  {
    slug: "temples-of-tamil-nadu",
    title: "Temples of Tamil Nadu",
    destination: "Tamil Nadu",
    destinationSlug: "tamil-nadu",
    category: "pilgrimage",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "https://images.unsplash.com/photo-1566915682737-3e97a7eed93b?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1566915682737-3e97a7eed93b?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 20000,
    badge: "Temple Circuit",
    featured: false,
    highlights: [
      "Meenakshi Amman Temple, Madurai",
      "Ramanathaswamy Temple & Pamban bridge, Rameswaram",
      "Vivekananda Rock Memorial, Kanyakumari",
      "Sunrise and sunset at India's southern tip",
    ],
    inclusions: [
      "5 nights hotel across the temple towns",
      "Daily breakfast & dinner",
      "Private AC vehicle with driver",
      "All transfers & sightseeing",
    ],
    exclusions: [
      "Airfare / train tickets",
      "Special darshan & camera fees",
      "Lunch & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Madurai", description: "Check in and join the evening aarti at the towering, thousand-pillared Meenakshi Amman Temple." },
      { day: 2, title: "Madurai to Rameswaram", description: "Thirumalai Nayakkar Palace en route, then across the sea on the Pamban bridge to the island temple town." },
      { day: 3, title: "Rameswaram", description: "The vast corridors and 22 sacred wells of Ramanathaswamy Temple, and the ghost-town shoreline of Dhanushkodi." },
      { day: 4, title: "Rameswaram to Kanyakumari", description: "Drive to India's southern tip where three seas meet; ferry across to the Vivekananda Rock Memorial." },
      { day: 5, title: "Kanyakumari", description: "Ocean sunrise, the Thiruvalluvar statue, Suchindram temple and the wooden Padmanabhapuram Palace." },
      { day: 6, title: "Departure", description: "Transfer to the airport or railway station for your onward journey." },
    ],
  },

  {
    slug: "khajuraho-bandhavgarh-safari",
    title: "Khajuraho & Bandhavgarh Safari",
    destination: "Madhya Pradesh",
    destinationSlug: "madhya-pradesh",
    category: "family",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1606298855672-3efb63017be8?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 22000,
    badge: "Wildlife & Heritage",
    featured: false,
    highlights: [
      "UNESCO temple art of Khajuraho",
      "Tiger safaris in Bandhavgarh National Park",
      "Khajuraho light-and-sound show",
      "Sal forests and rural Bundelkhand",
    ],
    inclusions: [
      "5 nights hotel / jungle lodge",
      "Daily breakfast & dinner",
      "2 shared jeep safaris",
      "All AC vehicle transfers",
    ],
    exclusions: [
      "Airfare / train tickets",
      "Safari permit & camera fees",
      "Lunch & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Khajuraho", description: "Check in and settle in for the evening light-and-sound show at the Western temple group." },
      { day: 2, title: "Khajuraho Temples", description: "The exquisitely carved Western and Eastern temple groups — a UNESCO World Heritage Site of medieval Chandela art." },
      { day: 3, title: "Khajuraho to Bandhavgarh", description: "Drive through rural Madhya Pradesh to the tiger reserve and settle into your jungle lodge." },
      { day: 4, title: "Bandhavgarh Safari", description: "An early jeep safari through sal forests said to hold the highest tiger density in India." },
      { day: 5, title: "Bandhavgarh", description: "A second safari for tigers, leopards, deer and birdlife, with the afternoon at leisure." },
      { day: 6, title: "Departure", description: "Transfer to Khajuraho or Jabalpur for your onward journey." },
    ],
  },

  {
    slug: "leh-ladakh-adventure",
    title: "Leh Ladakh Adventure",
    destination: "Ladakh",
    destinationSlug: "ladakh",
    category: "adventure",
    duration: "6N / 7D",
    nights: 6,
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 42000,
    badge: "High Himalaya",
    featured: false,
    highlights: [
      "Pangong Lake's shifting blues",
      "Nubra Valley via Khardung La",
      "Thiksey & Hemis monasteries",
      "Leh old town & Shanti Stupa",
    ],
    inclusions: [
      "6 nights hotel / camp",
      "Daily breakfast & dinner",
      "Inner-line permits",
      "AC vehicle across the high passes",
    ],
    exclusions: [
      "Airfare to Leh",
      "Monastery & camera fees",
      "Lunch & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Leh", description: "A full day to acclimatise to the altitude, with an easy evening at Shanti Stupa for sunset." },
      { day: 2, title: "Leh Monasteries", description: "Thiksey, Hemis and Shey monasteries, the Sindhu Ghat and Leh's atmospheric old bazaar." },
      { day: 3, title: "Leh to Nubra Valley", description: "Cross Khardung La, one of the world's highest motorable passes, to the sand dunes and camels of Hunder." },
      { day: 4, title: "Nubra to Pangong", description: "Drive along the Shyok valley to the surreal blue expanse of Pangong Tso for a lakeside overnight." },
      { day: 5, title: "Pangong to Leh", description: "Sunrise on the lake before returning to Leh over the Chang La pass." },
      { day: 6, title: "Leh at Leisure", description: "Magnetic Hill, the Indus–Zanskar sangam and Gurudwara Pathar Sahib." },
      { day: 7, title: "Departure", description: "Transfer to Leh airport for your onward flight." },
    ],
  },

  {
    slug: "egypt-pyramids-and-nile",
    title: "Egypt: Pyramids & the Nile",
    destination: "Egypt",
    destinationSlug: "egypt",
    category: "family",
    duration: "6N / 7D",
    nights: 6,
    heroImage: "https://images.unsplash.com/photo-1600520611035-84157ad4084d?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1600520611035-84157ad4084d?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 78000,
    badge: "Bucket List",
    featured: false,
    highlights: [
      "Pyramids of Giza & the Great Sphinx",
      "A Nile cruise from Luxor to Aswan",
      "Karnak temple & the Valley of the Kings",
      "Felucca sail at Aswan",
    ],
    inclusions: [
      "3 nights Cairo hotel + 3 nights Nile cruise",
      "Breakfast daily (full board on the cruise)",
      "Guided sightseeing with Egyptologist",
      "All transfers",
    ],
    exclusions: [
      "International airfare & Egypt visa",
      "Entry & camera fees",
      "Tips & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Cairo", description: "Airport pickup and hotel check-in, with the evening at leisure." },
      { day: 2, title: "Giza & Cairo", description: "The Pyramids, the Great Sphinx and the treasures of the Egyptian Museum." },
      { day: 3, title: "Cairo to Luxor", description: "Fly south and board your Nile cruise; the vast temple complexes of Karnak and Luxor." },
      { day: 4, title: "Valley of the Kings", description: "The royal tombs, Hatshepsut's terraced temple and the Colossi of Memnon before sailing to Edfu." },
      { day: 5, title: "Edfu & Kom Ombo", description: "The temples of Horus and Sobek as you cruise gently on towards Aswan." },
      { day: 6, title: "Aswan", description: "The High Dam, the island temple of Philae and a felucca sail at sunset." },
      { day: 7, title: "Departure", description: "Disembark and transfer to the airport (optional Abu Simbel add-on)." },
    ],
  },

  {
    slug: "baku-and-beyond",
    title: "Baku & Beyond",
    destination: "Azerbaijan",
    destinationSlug: "azerbaijan",
    category: "honeymoon",
    duration: "4N / 5D",
    nights: 4,
    heroImage: "https://images.unsplash.com/photo-1596306499398-8d88944a5ec4?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1596306499398-8d88944a5ec4?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 52000,
    badge: "Offbeat Escape",
    featured: false,
    highlights: [
      "Walled Old City & Maiden Tower, Baku",
      "Flame Towers & Heydar Aliyev Center",
      "Gobustan petroglyphs & mud volcanoes",
      "Ateshgah fire temple & Yanar Dag",
    ],
    inclusions: [
      "4 nights Baku hotel",
      "Daily breakfast",
      "City & Gobustan guided tours",
      "Airport transfers",
    ],
    exclusions: [
      "Airfare & Azerbaijan e-visa",
      "Entry tickets",
      "Lunch & dinner",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Baku", description: "Transfer to your hotel and an evening stroll along the Caspian seafront boulevard." },
      { day: 2, title: "Baku City Tour", description: "The UNESCO-listed Old City, Maiden Tower, Palace of the Shirvanshahs and the sweeping Heydar Aliyev Center." },
      { day: 3, title: "Gobustan & Absheron", description: "Ancient rock petroglyphs, bubbling mud volcanoes, the Ateshgah fire temple and the ever-burning Yanar Dag." },
      { day: 4, title: "Leisure & Shopping", description: "A free day for the Flame Towers funicular, Nizami Street cafés or a Caspian sunset." },
      { day: 5, title: "Departure", description: "Transfer to Baku airport for your onward flight." },
    ],
  },

  {
    slug: "islands-of-seychelles",
    title: "Islands of Seychelles",
    destination: "Seychelles",
    destinationSlug: "seychelles",
    category: "honeymoon",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "https://images.unsplash.com/photo-1553829176-61484f865ac3?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1553829176-61484f865ac3?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 95000,
    badge: "Barefoot Luxury",
    featured: false,
    highlights: [
      "Beau Vallon & the coves of Mahé",
      "Vallée de Mai & Anse Lazio, Praslin",
      "Anse Source d'Argent, La Digue",
      "Island-hopping by ferry",
    ],
    inclusions: [
      "5 nights across Mahé, Praslin & La Digue",
      "Daily breakfast",
      "Inter-island ferry transfers",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare",
      "Excursions & entry fees",
      "Lunch & dinner",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Mahé", description: "Transfer to your beachside stay and a first sunset on Beau Vallon beach." },
      { day: 2, title: "Mahé", description: "The tiny capital Victoria, the Sir Selwyn Clarke market and the palm-fringed coves of the south." },
      { day: 3, title: "Mahé to Praslin", description: "Ferry to Praslin and the primeval Vallée de Mai, home of the legendary coco de mer palm." },
      { day: 4, title: "La Digue Day Trip", description: "Cross to La Digue for the granite boulders of Anse Source d'Argent, explored by bicycle." },
      { day: 5, title: "Praslin", description: "The flawless sands of Anse Lazio and Anse Georgette, or a snorkelling trip to Curieuse Island." },
      { day: 6, title: "Departure", description: "Ferry back and transfer to Mahé airport." },
    ],
  },

  {
    slug: "cape-town-and-kruger-safari",
    title: "Cape Town & Kruger Safari",
    destination: "South Africa",
    destinationSlug: "south-africa",
    category: "adventure",
    duration: "6N / 7D",
    nights: 6,
    heroImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 110000,
    badge: "Safari & City",
    featured: false,
    highlights: [
      "Table Mountain cableway",
      "Cape Point & Boulders penguins",
      "Cape Winelands tastings",
      "Big Five game drives near Kruger",
    ],
    inclusions: [
      "3 nights Cape Town + 3 nights safari lodge",
      "Breakfast daily (full board on safari)",
      "Shared game drives",
      "All transfers",
    ],
    exclusions: [
      "International airfare & visa",
      "Cableway & entry tickets",
      "Some meals & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Cape Town", description: "Transfer to your hotel and an evening at the lively V&A Waterfront." },
      { day: 2, title: "Cape Peninsula", description: "Table Mountain by cableway, Cape Point, the Cape of Good Hope and the penguins of Boulders Beach." },
      { day: 3, title: "Cape Winelands", description: "Stellenbosch and Franschhoek for cellar tours and tastings among the vineyards." },
      { day: 4, title: "Cape Town to Safari", description: "Fly to a private reserve near Kruger and set out on an afternoon game drive." },
      { day: 5, title: "Big Five Safari", description: "Dawn and dusk drives in search of lion, leopard, elephant, rhino and buffalo." },
      { day: 6, title: "Safari", description: "A final morning drive and bush breakfast, with the afternoon at leisure." },
      { day: 7, title: "Departure", description: "Transfer to the airport for your onward flight." },
    ],
  },

  {
    slug: "barcelona-and-madrid",
    title: "Barcelona & Madrid",
    destination: "Spain",
    destinationSlug: "spain",
    category: "family",
    duration: "6N / 7D",
    nights: 6,
    heroImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2000&auto=format&fit=crop",
    gallery: ["https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2000&auto=format&fit=crop"],
    fromPrice: 125000,
    badge: "European Classic",
    featured: false,
    highlights: [
      "Gaudí's Sagrada Família & Park Güell",
      "Las Ramblas & the Gothic Quarter",
      "Madrid's Prado & Royal Palace",
      "A day trip to walled Toledo",
    ],
    inclusions: [
      "3 nights Barcelona + 3 nights Madrid",
      "Daily breakfast",
      "High-speed AVE train between cities",
      "City tours & transfers",
    ],
    exclusions: [
      "International airfare & Schengen visa",
      "Museum & attraction tickets",
      "Lunch & dinner",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Barcelona", description: "Transfer to your hotel and an evening on La Rambla and through the Gothic Quarter." },
      { day: 2, title: "Gaudí's Barcelona", description: "The Sagrada Família, Park Güell and Casa Batlló, then the elegant Passeig de Gràcia." },
      { day: 3, title: "Barcelona", description: "Montjuïc and the old port, with a free afternoon on the city beaches." },
      { day: 4, title: "Barcelona to Madrid", description: "The high-speed AVE train, then an evening at the Plaza Mayor and Puerta del Sol." },
      { day: 5, title: "Madrid", description: "The Royal Palace, the masterpieces of the Prado and the gardens of El Retiro." },
      { day: 6, title: "Toledo Day Trip", description: "The walled hilltop 'city of three cultures', a short ride from Madrid." },
      { day: 7, title: "Departure", description: "Transfer to Madrid airport for your onward flight." },
    ],
  },

  {
    slug: "royal-rajasthan",
    title: "Royal Rajasthan",
    destination: "Rajasthan",
    destinationSlug: "rajasthan",
    category: "family",
    duration: "6N / 7D",
    nights: 6,
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
    ],
    fromPrice: 24999,
    badge: "Land of Kings",
    featured: false,
    highlights: [
      "Amber Fort & City Palace, Jaipur",
      "Mehrangarh Fort, Jodhpur",
      "Lake Pichola boat ride, Udaipur",
      "Ranakpur Jain temples",
    ],
    inclusions: [
      "6 nights heritage-style hotels",
      "Daily breakfast & dinner",
      "AC vehicle with driver",
      "All transfers & sightseeing",
    ],
    exclusions: [
      "Airfare / train tickets",
      "Monument entry & camera fees",
      "Boat & elephant ride charges",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Jaipur", description: "Check in to the Pink City and spend the evening in the colourful bazaars of the old town." },
      { day: 2, title: "Jaipur Sightseeing", description: "The hilltop Amber Fort, the City Palace, Hawa Mahal and the Jantar Mantar observatory." },
      { day: 3, title: "Jaipur to Jodhpur", description: "Drive across the Thar's edge to the Blue City, gateway to the western desert." },
      { day: 4, title: "Jodhpur", description: "The mighty Mehrangarh Fort, Jaswant Thada and the indigo lanes below the clock-tower market." },
      { day: 5, title: "Jodhpur to Udaipur", description: "Break the drive at the marble Jain temples of Ranakpur en route to the lake city." },
      { day: 6, title: "Udaipur", description: "The City Palace, a boat ride on Lake Pichola, Jagdish Temple and Saheliyon ki Bari gardens." },
      { day: 7, title: "Departure", description: "Transfer to the airport for your onward flight." },
    ],
  },

  {
    slug: "manali-solang-escape",
    title: "Manali & Solang Valley Escape",
    destination: "Manali",
    destinationSlug: "manali",
    category: "adventure",
    duration: "4N / 5D",
    nights: 4,
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/manali.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/manali.jpg"],
    fromPrice: 15999,
    badge: "Mountain Adventure",
    featured: false,
    highlights: [
      "Adventure sports at Solang Valley",
      "Snow point via the Atal Tunnel",
      "Hadimba Temple & Vashisht hot springs",
      "River rafting on the Beas",
    ],
    inclusions: [
      "4 nights hotel",
      "Daily breakfast & dinner",
      "AC vehicle with driver",
      "Local sightseeing",
    ],
    exclusions: [
      "Airfare / Volvo coach",
      "Rohtang permit & activity charges",
      "Lunch & personal expenses",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Manali", description: "Drive up the Kullu valley, check in, and spend the evening on the lively Mall Road." },
      { day: 2, title: "Solang Valley", description: "Paragliding, zorbing and the ropeway at Solang, then Hadimba Temple, Vashisht springs and Manu Temple." },
      { day: 3, title: "Atal Tunnel & Sissu", description: "Through the Atal Tunnel to the snow and waterfalls of Sissu in Lahaul (Rohtang seasonal, by permit)." },
      { day: 4, title: "Kullu & Naggar", description: "River rafting on the Beas, Kullu's shawl workshops and the timber-and-stone Naggar Castle." },
      { day: 5, title: "Departure", description: "Transfer for your onward journey." },
    ],
  },

  {
    slug: "maldives-overwater-retreat",
    title: "Maldives Overwater Retreat",
    destination: "Maldives",
    destinationSlug: "maldives",
    category: "honeymoon",
    duration: "3N / 4D",
    nights: 3,
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/maldives.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/maldives.jpg"],
    fromPrice: 54999,
    badge: "Honeymoon Paradise",
    featured: false,
    highlights: [
      "Overwater villa stay",
      "House-reef snorkelling",
      "Sunset dolphin cruise",
      "Sandbank picnic & spa",
    ],
    inclusions: [
      "3 nights resort on half board",
      "Return speedboat / seaplane transfers",
      "Snorkelling gear",
      "Welcome experience",
    ],
    exclusions: [
      "International airfare",
      "Excursions & motorised water sports",
      "Some meals & drinks",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Malé → Resort", description: "Speedboat or seaplane transfer to your island resort, arriving in time for a lagoon sunset." },
      { day: 2, title: "Island & Lagoon", description: "Snorkel over the house reef, join a dolphin cruise and settle into your overwater villa." },
      { day: 3, title: "Leisure & Water Sports", description: "A spa afternoon, kayaking or a private sandbank picnic, ending with a candlelit dinner on the beach." },
      { day: 4, title: "Departure", description: "A last swim before your transfer back to Malé airport." },
    ],
  },

  {
    slug: "bali-island-escape",
    title: "Bali Island Escape",
    destination: "Bali",
    destinationSlug: "bali",
    category: "honeymoon",
    duration: "5N / 6D",
    nights: 5,
    heroImage: "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/bali.jpg",
    gallery: ["https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/bali.jpg"],
    fromPrice: 31999,
    badge: "Island of the Gods",
    featured: false,
    highlights: [
      "Ubud rice terraces & Kintamani",
      "Tanah Lot & Uluwatu temples",
      "Nusa Penida island day trip",
      "Balinese spa & beach time",
    ],
    inclusions: [
      "5 nights hotel",
      "Daily breakfast",
      "Tours with private driver",
      "Airport transfers",
    ],
    exclusions: [
      "International airfare & visa-on-arrival",
      "Entry tickets & fast-boat charges",
      "Lunch & dinner",
      "Travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrive Bali", description: "Transfer to Kuta or Seminyak and unwind with a first evening on the beach." },
      { day: 2, title: "Ubud & Kintamani", description: "The Tegalalang rice terraces, a coffee plantation, Tegenungan waterfall and Mount Batur views." },
      { day: 3, title: "Temples & Uluwatu", description: "The sea temple of Tanah Lot and clifftop Uluwatu, with a Kecak fire dance at sunset." },
      { day: 4, title: "Nusa Penida Day Trip", description: "Fast boat to Kelingking Beach, Angel's Billabong and Broken Beach on the wild eastern isle." },
      { day: 5, title: "Leisure & Spa", description: "A free day for the beach, a Balinese spa or water sports at Nusa Dua." },
      { day: 6, title: "Departure", description: "Transfer to Denpasar airport for your onward flight." },
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
