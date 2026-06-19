// ─────────────────────────────────────────────────────────────────────────────
// TRIP BUILDER GEOGRAPHY
// Continent → Country → Place → Activities, used by the Trip Builder drill-down.
//
// HOW TO EXTEND:
//  • Add a country with a unique `code`, `name`, `flag` emoji, `continent` and
//    `region` ("domestic" = India, "international" = everywhere else).
//  • Add places under it. `slug` must be unique within the country.
//  • `destinationSlug` (optional) links a place to an existing Destination so the
//    Trip Builder can show its packages + photo. Places WITHOUT it still work —
//    they route to the "we'll build it custom" path and show a styled fallback.
//  • `image` (optional) overrides the photo.
//  • `activities` = the "things to do" the traveller can pick. Free-form labels.
//
// Source list: see lib/data/trip-builder-destinations.md
// ─────────────────────────────────────────────────────────────────────────────

export type Continent = "Asia" | "Europe" | "Africa" | "North America" | "South America";

export const CONTINENT_ORDER: Continent[] = [
  "Asia",
  "Europe",
  "Africa",
  "North America",
  "South America",
];

export interface GeoPlace {
  slug: string;
  name: string;
  destinationSlug?: string;
  image?: string;
  activities: string[];
}

export interface GeoCountry {
  code: string;
  name: string;
  flag: string;
  continent: Continent;
  region: "domestic" | "international";
  /** Representative photo (Unsplash, free for commercial use). Used as the
   *  default image for any place in this country that has no image of its own. */
  heroImage: string;
  places: GeoPlace[];
}

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=70&auto=format&fit=crop`;

export const geography: GeoCountry[] = [
  // ── ASIA ──────────────────────────────────────────────────────────────────
  {
    code: "india",
    name: "India",
    flag: "🇮🇳",
    continent: "Asia",
    region: "domestic",
    heroImage: U("1564507592333-c60657eea523"),
    places: [
      { slug: "goa", name: "Goa", destinationSlug: "goa", activities: ["Beaches", "Water Sports", "Nightlife", "Dolphin Cruise", "Old Goa Churches", "Spice Plantation", "Dudhsagar Falls"] },
      { slug: "kerala", name: "Kerala", destinationSlug: "kerala", activities: ["Backwater Houseboat", "Munnar Tea Gardens", "Ayurveda Spa", "Alleppey", "Kovalam Beach", "Wildlife Safari"] },
      { slug: "kashmir", name: "Kashmir", destinationSlug: "kashmir", activities: ["Dal Lake Shikara", "Gulmarg Gondola", "Sonmarg", "Pahalgam", "Mughal Gardens", "Snow Activities"] },
      { slug: "rajasthan", name: "Rajasthan", destinationSlug: "rajasthan", activities: ["Desert Safari", "Palace Stays", "Amber Fort", "Udaipur Lakes", "Camel Ride", "Folk Culture"] },
      { slug: "manali", name: "Manali", destinationSlug: "manali", activities: ["Solang Valley", "Rohtang Pass", "River Rafting", "Paragliding", "Hadimba Temple", "Snow Trekking"] },
    ],
  },
  {
    code: "sri-lanka",
    name: "Sri Lanka",
    flag: "🇱🇰",
    continent: "Asia",
    region: "international",
    heroImage: U("1566296314736-6eaac1ca0cb9"),
    places: [
      { slug: "colombo", name: "Colombo", activities: ["Colombo Day Tour", "Gangaramaya Temple", "Independence Square"] },
      { slug: "sigiriya", name: "Sigiriya", activities: ["Sigiriya Rock Fortress", "Sigiriya Sightseeings", "Sigiriya Village Trekking Experience"] },
      { slug: "minneriya", name: "Minneriya National Park", activities: ["Minneriya Safari"] },
      { slug: "kandy", name: "Kandy", activities: ["Kandy Day Tour", "Pinnawala National Park Visit", "Gem Museum", "Kandy Lake Club – Cultural Dance Show", "Temple of Tooth Relic", "Ambulawawa Tower", "Peradeniya Royal Botanical Garden", "Scenic Train Ride", "Dambulla Cave Temple", "Sinharaja National Park Trekking", "Spice Garden", "Kandy Temple Tour", "Sri Lankan Village Experience"] },
      { slug: "ella", name: "Ella", activities: ["Nuwara Eliya Train Journey", "Nine Arch Bridge", "Mini Adam's Peak", "Ravana Falls"] },
      { slug: "jaffna", name: "Jaffna", activities: ["Jaffna City Tour", "Nallur Kandaswamy Devasthanam", "Nainativu Nagapooshani Amman Temple"] },
      { slug: "galle", name: "Galle", activities: ["Discovering Galle", "Madu River Safari"] },
      { slug: "bentota", name: "Bentota", activities: ["Turtle Farm and Madu River Boat Ride", "Galle City Tour", "Polgampola Waterfall Day Tour", "Kande Vihara Temple", "Bentota Water Sports", "White Water Rafting"] },
      { slug: "nuwara-eliya", name: "Nuwara Eliya", activities: ["Romboda Water Falls", "Seetha Amman Temple", "Nuwara Eliya Sightseeing", "Tea Factory and Tea Plantation", "St Clairs and Devon Falls", "Hakgala Botanical Garden", "Gregory Lake", "Pinnawela Elephant Orphanage", "Victoria Park", "Laxapana Waterfalls", "Seeta Amman Kovil Temple", "Divurumpola Temple", "Ravana Falls"] },
      { slug: "yala", name: "Yala National Park", activities: ["Jungle Safari"] },
      { slug: "dambulla", name: "Dambulla", activities: ["Dambulla Cave Temple"] },
      { slug: "mirissa", name: "Mirissa", activities: ["Shore Exploration", "Mirissa Whale Watching", "Coconut Tree Hill & Secret Beach"] },
      { slug: "ramboda", name: "Ramboda", activities: ["Ramboda Falls and Ramboda Hanuman Temple"] },
      { slug: "trincomalee", name: "Trincomalee", activities: ["Shakti Peetam", "Koneshwaram Temple"] },
      { slug: "negombo", name: "Negombo", activities: ["Negombo Beach Experience"] },
      { slug: "tangalle", name: "Tangalle", activities: ["Hiriketiya Beach"] },
      { slug: "udawalawe", name: "Udawalawe", activities: ["Udawalawe National Park Safari"] },
      { slug: "kataragama", name: "Kataragama", activities: ["Ruhunu Maha Kataragama Dewalaya"] },
    ],
  },
  {
    code: "vietnam",
    name: "Vietnam",
    flag: "🇻🇳",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "da-nang", name: "Da Nang", activities: ["Golden Bridge", "My Son & Hoi An Private Day Tour", "Marble Mountain and Hoi An Day Tour", "Funtastic Danang Food Tour", "Hue City Tour", "Marble Mountain", "Basket Boat & Coconut Forest", "Cam Thanh Coconut Village", "Da Nang Half Day City Tour", "Hoi An Experience", "Fantasy Park Danang", "Hoi An Ancient Town", "Ba Na Hills Cable Car Ride", "Lantern Boat Ride", "Cham Island Snorkeling Tour", "Bana Hills – Golden Bridge – Fantasy Park", "Dragon Bridge", "Lady Buddha", "Lantern Making Class"] },
      { slug: "hanoi", name: "Hanoi", destinationSlug: "vietnam", activities: ["Hanoi Sightseeing Motorbike Tour", "Halong Bay Day Cruise Tour", "Hoa Lu & Tam Coc Tour", "Majestic Trang An Tour", "Old Quarter Food Tour", "Hoa Lu, Trang An, Hang Mua Cave", "Incense Village & Train Street", "Thang Long Water Puppet Show", "Hanoi City Tour", "Luon Cave & Titop Island", "Mega Grand World Ha Noi", "Street Food & Shopping", "Ninh Binh Tour", "Sampan Boat", "Incense Village Tour", "Dinner Cruise", "Cruise Experience"] },
      { slug: "ho-chi-minh", name: "Ho Chi Minh", activities: ["Excursion To Mekong Delta", "M.O.M Cooking Class", "Cu Chi Tunnels Half Day", "Ho Chi Minh City & Cu Chi Tunnels Tour", "Saigon Motorbike Adventures", "Saigon River Dinner Cruise", "City Tour by U.S Army Jeep", "Cu Chi Tunnels & Mekong Delta Tour", "Mui Ne Day Trip", "Black Virgin Mountain & Cao Dai Temple Tour", "Short Cyclo Ride Tour", "Ho Chi Minh City Half Day Tour", "Suoi Tien Theme Park", "Night Life", "War Remnants Museum"] },
      { slug: "ha-long-bay", name: "Ha Long Bay", activities: ["Shore Excursion", "Overnight Cruise", "Sunlight Grand Cruise"] },
      { slug: "sa-pa", name: "Sa Pa", activities: ["Day Tour to Sapa's Cat Cat Village", "Day Tour at Fansipan", "Rong May Glass Bridge", "Lonely Tree", "Moana View", "Sapa – Silver Waterfall – Love Waterfall", "Swing Sapa", "Fansipan – the Roof of Indochina", "Alpine Coaster"] },
      { slug: "hoi-an", name: "Hoi An", activities: ["Basket Boat – Ancient Town – Lantern Boat", "Son Tra Marble Mountain", "Hoi An Farming and Fishing Life Experience Tour", "Monkey Mountain", "Hoi An Tour with Lantern Boat Ride", "Lantern Boat Ride"] },
      { slug: "phu-quoc", name: "Phu Quoc", activities: ["Vin Wonders Phu Quoc", "4 Islands Tour by Cable Car and Speedboat", "Vinpearl Safari", "Kiss Bridge", "South of the Island", "Phu Quoc Safari", "The Legend of Bamboo", "Grand World Night", "North Tour of Phu Quoc", "Vin Safari & Grand World", "Island Hopping Tour", "Sunset Town", "Kiss Of The Sea Show", "Starfish Beach", "Hon Thom Cable Car"] },
    ],
  },
  {
    code: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "kuala-lumpur", name: "Kuala Lumpur", activities: ["Genting Highlands and Batu Caves Day Tour", "KL Hop-On Hop-Off Sightseeing Bus Pass", "Sunway Lagoon Ticket", "Aquaria KLCC Tour", "KL Tower Ticket", "KL City Tour", "Melaka Day Tour", "KL Bird Park", "Genting Highlands", "Petronas Twin Tower", "Putrajaya Day Tour", "Batu Caves", "LEGOLAND Malaysia", "Putrajaya Cruise", "Thean Hou Temple", "China Town Tour", "Zoo Negara", "Awana Skyway Cable Car", "Just Farm", "Skytropolis Indoor Theme Park", "Genting SkyWorlds Outdoor Theme Park"] },
      { slug: "penang", name: "Penang", activities: ["Entopia by Penang Butterfly Farm", "ESCAPE Theme Park", "Penang Hill and Temple Sightseeing", "Dark Mansion Museum"] },
      { slug: "langkawi", name: "Langkawi", activities: ["Underwater World", "Half Day Mangrove Safari Boat Tour", "Langkawi Island Hopping Tour", "Langkawi Oriental Village Excursion", "Pantai Cenang Tour", "Langkawi Dream Forest Tour", "Langkawi Half Day City Tour", "Langkawi Cable Car", "Sunset Cruise Experience", "Adventure and Xtreme Park", "Crocodile Adventureland", "Pulau Kentut Snorkeling", "Langkawi Mangrove", "Sunset Cruise with Dinner", "Skyway Cable Car & Skybridge"] },
      { slug: "cameron-highlands", name: "Cameron Highlands", activities: ["Cameron Highlands Day Tour"] },
      { slug: "george-town", name: "George Town", activities: [] },
      { slug: "ipoh", name: "Ipoh", activities: [] },
      { slug: "johor-bahru", name: "Johor Bahru", activities: ["Legoland Day Tour"] },
    ],
  },
  {
    code: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "krabi", name: "Krabi", activities: ["Krabi to Phi Phi Day Tour", "Krabi 4 Islands Day Tour", "Krabi Mangrove Kayak Trip", "Bioluminescent Night Tour", "James Bond – Hong Islands & Koh Yao Noi Speed Boat", "Krabi 5 Islands and Talu Cave Snorkeling Tour", "Ya's Thai Cookery School Class", "Phi Phi Islands One Day Tour", "Rock Climbing at Railay", "Phi Phi Island Tour", "Krabi to Phi Phi by Speedboat", "Krabi Sunset Cruises", "Tiger Cave & Emerald Jungle Pool", "Krabi Elephant Shelter Experience", "7 Island Sunset Tour", "Walking Street Krabi", "Railay Beach", "Hong Island Tour", "Hot Spring & Emerald Pool", "Krabi City Tour", "Klong Root Canal Kayaking & Swimming Tour"] },
      { slug: "pattaya", name: "Pattaya", activities: ["Pattaya Island Hopping Tour", "Koh Larn Speedboat Day Trip", "Elephant Jungle Sanctuary", "Pattaya to Koh Larn Half Day Tour", "The Sanctuary of Truth", "Tiger Park Pattaya Tour", "Floating Market", "Coral Island", "Sri Racha Tiger Zoo", "Alcazar Show", "Nong Nooch Village", "Sky Diving Pattaya", "Pattaya Dolphinarium Show", "Ramayana Water Park", "Underwater World Pattaya", "Gems Gallery Pattaya", "Walking Street Pattaya", "Art In Paradise Pattaya", "Pattaya City Tour", "Ocean Sky Cruise"] },
      { slug: "phuket", name: "Phuket", destinationSlug: "thailand", activities: ["James Bond Island Tour", "Phi Phi Islands & Maya Bay Day Tour", "Racha & Coral Islands Day Tour", "Phang Nga Sea Canoeing", "Phi Phi Islands by Speedboat", "Phuket Guided Tour & Big Buddha", "Phuket Elephant Sanctuary", "Half-Day Phuket Easy Thai Cooking", "Phi Phi, Khai & Maiton Island Tour", "Big Buddha Jungle Trekking", "Phi Phi Sunrise from Phuket", "Phang Nga Bay Speedboat Tour", "4-Waters Eco-Adventure Trip", "Phang Nga Bay Sea Cave Canoeing", "Phuket City Tour", "Tiger Kingdom", "Fantasea Show with Dinner", "Melody Sunset Dinner Cruise", "Phuket Dolphin Show", "Carnival Magic Experience", "Phuket Aquaria", "Similan Islands Day Trip", "Flying Hanuman Adventure", "Bamboo Rafting"] },
      { slug: "bangkok", name: "Bangkok", activities: ["Damnoen Saduak Floating Market Half Day Tour", "Classic Bangkok Tour", "Kanchanaburi Instagram Day Tour", "Maeklong Train Market & Amphawa Floating Market", "Ayutthaya Day Tour", "Grand Palace and Emerald Buddha Tour", "Private Tour of Bangkok's Temples", "Colors of Bangkok", "Half-Day Market Tour and Thai Cooking Class", "6-Hour Best of Bangkok City Tour", "Ayutthaya Temples and River Cruise", "Bangkok by Night", "Experience Real Bangkok by Bike", "Thai Cooking Class with Market Visit", "Apsara Dinner Cruise", "Chao Phraya Dinner Cruise", "Safari World Day Tour", "Shopping Tour", "The Opulence Luxury Cruise", "Mahanakhon Tower", "Safari World & Marine Park"] },
      { slug: "chiang-mai", name: "Chiang Mai", activities: ["Chiang Rai Temple Tour", "Elephant Sanctuary Tour", "Chiang Mai Night Safari", "Lalitta Café", "Lantern Festival", "Royal Park Rajapruek", "Bamboo Rafting", "Chiang Mai City Tour", "Doi Inthanon National Park Full Day", "Dantewada (Land of Angels)", "Bua Tong Sticky Waterfalls", "Hidden Village", "Botanical Gardens", "Lakeside Escape", "Chai Lai Orchid Elephant Sanctuary"] },
      { slug: "ko-pha-ngan", name: "Ko Pha Ngan Island", activities: ["Phaeng Waterfall", "Bottle Beach", "Zen Beach", "Haad Yuan Beach", "Full Moon Party"] },
      { slug: "ko-tao", name: "Ko Tao", activities: ["Shark Bay", "Hin Wong Bay", "Ao Leuk Beach", "Tanote Bay"] },
      { slug: "koh-samui", name: "Koh Samui", activities: ["Island Exploration", "Koh Nang Yuan Snorkeling Tour", "ATV Safari", "Island Nightlife", "Snorkeling Tour", "Island Hopping", "Koh Tan & Koh Madsum Snorkeling Tour", "Koh Phangan Full-Day Cruise with Sunset", "Jungle Safari Jeep Tour with Elephants", "Angthong Snorkeling & Kayaking Tour", "4x4 Safari Tour"] },
      { slug: "chiang-rai", name: "Chiang Rai", activities: ["Wat Huay Pla Kang", "White Temple (Wat Rong Khun)", "Baan Dam Museum", "Blue Temple (Wat Rong Suea Ten)", "Lalitta Café"] },
    ],
  },
  {
    code: "maldives",
    name: "Maldives",
    flag: "🇲🇻",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "male", name: "Male", destinationSlug: "maldives", activities: ["Water Activities", "Local Island Visit", "Dolphin Watching", "Sunset Cruise", "Tropical Beach Party", "Sunset Maldives", "Birthday Celebration"] },
      { slug: "addu-city", name: "Addu City", activities: [] },
      { slug: "fuvahmulah", name: "Fuvahmulah", activities: [] },
      { slug: "hithadhoo", name: "Hithadhoo", activities: [] },
    ],
  },
  {
    code: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "singapore", name: "Singapore", destinationSlug: "singapore", activities: ["Gardens by the Bay", "Singapore Zoo", "Singapore River Cruise", "Singapore Cable Car Sky Pass", "Madame Tussauds", "National Museum of Singapore", "S.E.A. Aquarium", "LEGOLAND (Johor Bahru)", "Sentosa Fun Pass", "Universal Studios", "Museum of Ice Cream", "River Wonders & Night Safari", "Buddha Tooth Relic Temple", "Marina Bay Sands", "Singapore Flyer", "Night Safari", "City Tour with Flyer", "Wings Of Time", "Bird Paradise", "Singapore City Tour", "Duck Tour", "4-in-1 Parkhopper Tour", "ArtScience Museum", "Genting Dreams Cruise", "Breakfast in the Wild"] },
    ],
  },
  {
    code: "indonesia",
    name: "Indonesia",
    flag: "🇮🇩",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "bali", name: "Bali", destinationSlug: "bali", activities: ["Bali Safari and Marine Park", "Ayung White Water Rafting", "Mount Batur Sunrise Trekking", "Uluwatu & Kecak Fire Dance", "Bali Zoo", "Bali Swing and Waterfall Tour", "Bali Bird Park", "Bali Hidden Waterfalls Trip", "Nusa Penida Tour", "Ulun Danu Beratan Temple", "Sacred Monkey Forest", "Rice Terrace", "Bali Swing", "Tanah Lot Temple", "Uluwatu Temple", "Kecak Dance", "Temple Run ATV", "River Rafting", "Beginner Scuba", "Water Sports", "Spa", "Floating Breakfast", "Pura Tirta Empul", "Handara Gate", "Garuda Wisnu Kencana"] },
      { slug: "gili-islands", name: "Gili Islands", activities: ["Cruise to Gili Island", "3 Gili Snorkeling Tour", "Gili Trawangan"] },
      { slug: "jakarta", name: "Jakarta", activities: [] },
      { slug: "surabaya", name: "Surabaya", activities: [] },
      { slug: "bandung", name: "Bandung", activities: [] },
      { slug: "medan", name: "Medan", activities: [] },
      { slug: "manado-city", name: "Manado City", activities: ["Christ Blessing Statue", "Mount Mahawu", "Lake Linow", "Narwastu Hills", "Lihaga Island", "Bunaken Island Snorkeling", "Tangkoko Nature Reserve"] },
    ],
  },
  {
    code: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "dubai", name: "Dubai", destinationSlug: "dubai", activities: ["Burj Khalifa Observation + Aquarium", "The Green Planet", "Ferrari World + Qasr Al Watan", "Dubai Dolphinarium", "iFly Dubai Indoor Skydiving", "Dubai Big Bus Tour", "Water Sports in Dubai", "Mall of Emirates & Ski Dubai", "Dubai Marina Luxury Yacht", "Dhow Cruise", "Desert Safari", "Dubai Frame", "Miracle Garden & Global Village", "Global Village", "Miracle Garden", "Burj Khalifa & Dubai Mall", "Atlantis Aqua Park", "Aya Universe", "Museum of The Future", "Skydive Dubai", "Dubai Safari Park", "Ain Dubai", "Dubai City Tour", "Dubai Aquarium & Underwater Zoo", "Dubai Glass Slide"] },
      { slug: "sharjah", name: "Sharjah", activities: [] },
      { slug: "abu-dhabi", name: "Abu Dhabi", activities: ["Warner Bros (Yas Island)", "Sea World (Yas Island)", "Grand Mosque Tour", "Abu Dhabi Mall", "BAPS Temple", "Ferrari World (Yas Island)", "Louvre Abu Dhabi", "Emirates Palace", "Emirates Park Zoo", "Ferrari World Theme Park", "City Tour with Grand Mosque + Warner Bros", "Desert Safari", "KidZania Abu Dhabi", "Qasr Al Watan", "Zayed Mosque & Emirates Palace", "BAPS Hindu Mandir", "Hot Air Balloon", "teamLab Phenomena", "Abu Dhabi City Tour", "Yas Waterworld", "Heritage Village"] },
      { slug: "ajman", name: "Ajman", activities: [] },
      { slug: "al-seef", name: "Al Seef", activities: [] },
    ],
  },
  {
    code: "armenia",
    name: "Armenia",
    flag: "🇦🇲",
    continent: "Asia",
    region: "international",
    places: [
      { slug: "yerevan", name: "Yerevan", activities: ["Yerevan Tour", "Tsaghkadzor", "Lake Sevan", "Dilijan", "Garni Temple", "Geghard Monastery", "Symphony of Stones", "Khor Virap Monastery", "Areni Wine Factory", "Noravank Monastery", "Jermuk Waterfall & Water Gallery"] },
    ],
  },

  // ── EUROPE ────────────────────────────────────────────────────────────────
  {
    code: "georgia",
    name: "Georgia",
    flag: "🇬🇪",
    continent: "Europe",
    region: "international",
    places: [
      { slug: "tbilisi", name: "Tbilisi", destinationSlug: "georgia", activities: ["Tbilisi City Private Tour", "Gudauri, Kazbegi and Gergeti", "Kakheti Tour with Wine Tastings", "Dashbashi Canyon Day Tour", "Rabati Castle", "Gergeti Church and Eliah Gorge", "Martvili Canyon Tour", "Mtskheta-Jvari-Gori and Uplistsikhe Cave Tour", "Ananuri & Gudauri Day Tour", "Dashbashi Canyon", "St. Nino Monastery in Bodbe", "Sighnaghi Town", "Zhinvali Water Reservoir", "Friendship Monument", "Ananuri Complex", "Liberty Square", "Bridge of Peace", "Holy Trinity Cathedral", "Mother of Georgia", "Stepantsminda", "Chronicle of Georgia", "Gergeti Trinity Church", "Svetitskhoveli Cathedral", "Dendrological Park"] },
      { slug: "kazbegi", name: "Kazbegi", activities: ["Mtskheta and Kazbegi Day Tour", "Kazbegi Private Tour"] },
      { slug: "kakheti", name: "Kakheti", activities: ["Kakheti Wine Region", "Bodbe – Signagi – Kakheti Day Tour"] },
      { slug: "kutaisi", name: "Kutaisi", activities: ["Prometheus Cave and Martvili Canyon", "Bagrati Cathedral"] },
      { slug: "batumi", name: "Batumi", activities: ["Batumi City Tour", "Makhuntsethi Waterfall Tour", "Mtirala National Park", "Martvili Canyon Tour", "Batumi Botanical Garden", "Dolphin Show"] },
      { slug: "borjomi", name: "Borjomi", activities: ["Borjomi Day Tour", "Uplistsikhe Cave Town Visit"] },
    ],
  },

  // ── AFRICA ────────────────────────────────────────────────────────────────
  {
    code: "mauritius",
    name: "Mauritius",
    flag: "🇲🇺",
    continent: "Africa",
    region: "international",
    places: [
      { slug: "vacoas-phoenix", name: "Vacoas – Phoenix", activities: ["Full-Day Catamaran Cruise to Île aux Cerfs"] },
      { slug: "port-louis", name: "Port Louis", activities: ["Whale Watching", "Tamarind Falls / 7 Cascades Half Day Tour", "Le Morne Mountain Trek", "Dolphins Encounter and BBQ on Benitiers Island", "Pirate Boat Cruise to Ile Aux Cerfs Island"] },
      { slug: "rodrigues-island", name: "Rodrigues Island", activities: ["Authentic South Tour", "Mauritius Private North Tour", "Historical Guided Day Tour", "Casela World of Adventures", "Port Louis Street Food Tour", "South Mauritius Day Tour", "Full Day Catamaran Cruise", "Walk with Lions at Casela Park", "Ile Aux Cerfs Island Tour on Speed Boat", "5 Islands Speedboat Sea Turtle", "Sea Plane Experience", "Water Sports"] },
      { slug: "curepipe", name: "Curepipe", activities: [] },
      { slug: "quatre-bornes", name: "Quatre Bornes", activities: ["North Mauritius Day Tour"] },
    ],
  },

  // ── NORTH AMERICA ─────────────────────────────────────────────────────────
  {
    code: "turks-caicos",
    name: "Turks and Caicos Islands",
    flag: "🇹🇨",
    continent: "North America",
    region: "international",
    places: [
      { slug: "grace-bay", name: "Grace Bay", activities: ["Full Day Cruise with Snorkeling", "Mangrove Clear Kayak Tour & ATV Island Excursion", "Half Day Snorkeling Excursion", "Champagne Sunset Cruise"] },
    ],
  },

  // ── SOUTH AMERICA ─────────────────────────────────────────────────────────
  {
    code: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    continent: "South America",
    region: "international",
    places: [
      { slug: "rio-de-janeiro", name: "Rio de Janeiro", activities: ["Rio de Janeiro City Tour", "Angra dos Reis & Ilha Grande Boat Tour"] },
      { slug: "manaus", name: "Manaus", activities: [] },
    ],
  },
  {
    code: "peru",
    name: "Peru",
    flag: "🇵🇪",
    continent: "South America",
    region: "international",
    places: [
      { slug: "lima", name: "Lima", activities: ["Huaca Pucllana Museum", "Convent of Santo Domingo", "Ballestas Islands", "Huacachina Oasis"] },
      { slug: "arequipa", name: "Arequipa", activities: [] },
      { slug: "cusco", name: "Cusco", activities: ["Pisac", "Ollantaytambo", "Machu Picchu", "Cusco City Tour"] },
      { slug: "trujillo", name: "Trujillo", activities: [] },
      { slug: "iquitos", name: "Iquitos", activities: [] },
      { slug: "sacred-valley", name: "Sacred Valley", activities: [] },
    ],
  },
];

export function getCountry(code: string) {
  return geography.find((c) => c.code === code);
}

export function getPlace(countryCode: string, placeSlug: string) {
  return getCountry(countryCode)?.places.find((p) => p.slug === placeSlug);
}
