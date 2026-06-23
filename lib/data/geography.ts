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
const C = (name: string) => `https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/${name}.jpg`;

// Hawa Mahal, Jaipur — the Cloudinary `rajasthan.jpg` is mistakenly the Taj Mahal (Agra, UP).
const RAJASTHAN_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg";

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
      { slug: "goa", name: "Goa", destinationSlug: "goa", image: C("goa"), activities: ["Panjim", "North Goa Tour", "South Goa Tour", "Dudhsagar Waterfall Tour", "Harvalem Waterfalls", "Spice Plantation Tour", "Dinner Cruise", "Sunset Cruise", "Water Sports", "Go Karting", "Snow Park", "Grand Island Water Combo", "Dolphin Ride", "Jeep Safari", "Soul Travelling Activities", "Kayaking at a Private Island", "Farm to Table Experience in South Goa", "Secret Food and Tavern Trail", "Feni Tasting by the River", "The Goan Hinterland Experience", "Nature Trail at Chorao Island", "Island Exploration at Divar"] },
      { slug: "kerala", name: "Kerala", destinationSlug: "kerala", image: C("kerala"), activities: ["Kochi (Cochin) City Sightseeing", "Lulu Mall Shopping", "Munnar City Sightseeing", "Eravikulam National Park (Munnar)", "Mattupetty Dam (Munnar)", "Tea Estate / Garden (Munnar)", "Marayoor Wildlife Sanctuary", "Meesapulimala (Suryanelli)", "Kolukkumalai (Suryanelli)", "Adventure Activities (Suryanelli)", "Water Sports (Suryanelli)", "Kalaripayattu Show (Thekkady)", "Elephant Ride (Thekkady)", "Periyar Tiger Reserve (Thekkady)", "Martial Art Show (Thekkady)", "House Boat (Alleppey)", "Alleppey Backwater Boat Ride", "Trivandrum City Tour", "Kovalam Beach", "Lighthouse Beach (Kovalam)", "Ayurvedic Massage (Trivandrum)", "Varkala City Tour", "Surfing & Kayaking (Varkala)", "Vagamon Meadows", "Marmala Waterfalls (Vagamon)", "Tea Gardens & Viewpoints (Vagamon)", "Wayanad City Tour", "Wayanad Wildlife Sanctuary", "Kozhikode City Tour", "Kozhikode Beach", "Kadalundi Bird Sanctuary"] },
      { slug: "himachal-pradesh", name: "Himachal Pradesh", destinationSlug: "manali", image: C("manali"), activities: ["Shimla City Tour", "Manali City Tour", "Solang Valley", "Sissu Village via Atal Tunnel", "Sissu Village via Rohtang Pass", "Atal Tunnel Visit", "Rohtang Pass Visit", "Kasol Local Shopping Tour", "Manikaran Local Tour", "Kullu", "Jogni Waterfall Trek (Manali)", "Shinkula Top Sightseeing Tour", "Hampta Pass & Sethan Sightseeing Tour", "Kheerganga Trek"] },
      { slug: "jammu-and-kashmir", name: "Jammu & Kashmir", destinationSlug: "kashmir", image: U("1595815771614-ade9d652a65d"), activities: ["Jammu City Tour", "Srinagar City Tour", "Srinagar Houseboat", "Gulmarg Tour", "Sonmarg Tour", "Pahalgam Tour", "Patnitop Tour"] },
      { slug: "leh", name: "Leh – Ladakh", image: U("1593118845043-359e5f628214"), activities: ["Leh Tour", "Sham Valley", "Nubra Valley", "Khardung La", "Pangong Lake", "Hanle", "Umling La Pass"] },
      { slug: "andaman", name: "Andaman Islands", image: U("1586359716568-3e1907e4cf9f"), activities: ["Port Blair City Tour", "Ross Island & North Bay Island Excursion", "Havelock Island Tour", "Elephant Beach Excursion", "Neil Island"] },
      { slug: "lakshadweep", name: "Lakshadweep", image: U("1540202404-a2f29016b523"), activities: ["Agatti Island Tour", "Kalpitti Island Tour", "Bangaram Island Tour", "Thinnakara Island Excursion", "Kavaratti Island Tour"] },
      { slug: "rajasthan", name: "Rajasthan", destinationSlug: "rajasthan", image: RAJASTHAN_IMAGE, activities: ["Pushkar", "Udaipur", "Jaipur Sightseeing", "Jaisalmer City Tour", "Ranthambore National Park", "Bikaner", "Mount Abu", "Jodhpur City Tour", "Ajmer Sightseeing", "Sand Dunes Excursion", "Camel Safari", "Wildlife Safari", "Chokhi Dhani – Traditional Rajasthani Village"] },
      { slug: "coorg-ooty-mysore", name: "Coorg, Ooty & Mysore", image: U("1657856855186-7cf4909a4f78"), activities: ["Bangalore City Tour", "Bangalore Palace", "Mysore Palace", "Mysore City Tour", "Coorg City Tour", "Ooty City Tour", "Payana Car Museum", "St. Philomena Church", "Gokarna", "Hampi", "Coorg Local Sightseeing", "Wonderla", "Nagarhole Jungle Safari", "Bandipur National Park", "Chikmagalur Sightseeing", "Murdeshwar Temple"] },
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
    heroImage: U("1528127269322-539801943592"),
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
    heroImage: U("1596422846543-75c6fc197f07"),
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
    heroImage: U("1528181304800-259b08848526"),
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
    heroImage: U("1540202404-a2f29016b523"),
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
    heroImage: U("1525625293386-3f8f99389edd"),
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
    heroImage: U("1537996194471-e657df975ab4"),
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
    heroImage: U("1512453979798-5ea266f8880c"),
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
    heroImage: U("1602002418816-5c0aeef426aa"),
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
    heroImage: U("1565008576549-57569a49371d"),
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
    heroImage: U("1544550581-5f7ceaf7f992"),
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
    heroImage: U("1559827260-dc66d52bef19"),
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
    heroImage: U("1483729558449-99ef09a8c325"),
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
    heroImage: U("1526392060635-9d6019884377"),
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

// Approx coordinates [lat, lng] for the Trip Builder route map. Keyed by
// `${countryCode}:${placeSlug}`. Extend as more places get plotted.
export const PLACE_COORDS: Record<string, [number, number]> = {
  "india:goa": [15.49, 73.83],
  "india:kerala": [9.93, 76.27],
  "india:himachal-pradesh": [32.24, 77.19],
  "india:jammu-and-kashmir": [34.08, 74.80],
  "india:leh": [34.16, 77.58],
  "india:andaman": [11.62, 92.73],
  "india:lakshadweep": [10.57, 72.64],
  "india:rajasthan": [26.91, 75.79],
  "india:coorg-ooty-mysore": [12.42, 75.74],
};

export function placeCoords(countryCode: string, placeSlug: string): [number, number] | undefined {
  return PLACE_COORDS[`${countryCode}:${placeSlug}`];
}

// Per-place hero photos, keyed by `${countryCode}:${placeSlug}`. Sourced from
// Unsplash (U), the VMF Cloudinary library (C), and Wikimedia Commons lead
// photos for cities Unsplash didn't cover. Applied below to any place that
// doesn't already declare its own `image`.
export const PLACE_IMAGES: Record<string, string> = {
  // Sri Lanka
  "sri-lanka:colombo": U("1623595289196-007a22dd8560"),
  "sri-lanka:sigiriya": U("1612862862126-865765df2ded"),
  "sri-lanka:minneriya": U("1533484482814-3fe2d922be89"),
  "sri-lanka:kandy": U("1609681980718-340e7f4b11d7"),
  "sri-lanka:ella": U("1566296314736-6eaac1ca0cb9"),
  "sri-lanka:jaffna": U("1591410448119-1b49cbb3b83e"),
  "sri-lanka:galle": "https://upload.wikimedia.org/wikipedia/commons/7/77/Galle_Fort.jpg",
  "sri-lanka:bentota": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Sri_Lanka%2C_Bentota%2C_beach_%282%29.JPG",
  "sri-lanka:nuwara-eliya": "https://upload.wikimedia.org/wikipedia/commons/c/c6/NuwaraEliya_from_top.jpg",
  "sri-lanka:yala": "https://upload.wikimedia.org/wikipedia/commons/7/77/Yala_Beach.jpg",
  "sri-lanka:dambulla": "https://upload.wikimedia.org/wikipedia/commons/1/14/Dambulla-outside.jpg",
  "sri-lanka:mirissa": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Mirissa-Plage_%283%29.jpg",
  "sri-lanka:ramboda": "https://upload.wikimedia.org/wikipedia/commons/0/04/SL_NuwaraEDistrict_asv2020-01_img09_Ramboda_Tunnel.jpg",
  "sri-lanka:trincomalee": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Bay_of_Trincomalee.jpg",
  "sri-lanka:negombo": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Negombo_Beach_resort_pool_%28Unsplash%29.jpg",
  "sri-lanka:tangalle": "https://upload.wikimedia.org/wikipedia/commons/3/36/TangalleBeach.JPG",
  "sri-lanka:udawalawe": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Udawalawe_National_Park_%28Udawalawa_Reservoir%29.jpg",
  "sri-lanka:kataragama": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Kiri_Vehera_at_night.jpg",
  // Vietnam
  "vietnam:da-nang": U("1559592413-7cec4d0cae2b"),
  "vietnam:hanoi": U("1555921015-5532091f6026"),
  "vietnam:ho-chi-minh": U("1583417319070-4a69db38a482"),
  "vietnam:ha-long-bay": U("1643029891412-92f9a81a8c16"),
  "vietnam:sa-pa": U("1531737212413-667205e1cda7"),
  "vietnam:hoi-an": U("1701397955118-79059690ef50"),
  "vietnam:phu-quoc": U("1693294603830-f44c9511d643"),
  // Malaysia
  "malaysia:kuala-lumpur": U("1596422846543-75c6fc197f07"),
  "malaysia:penang": U("1620488212381-dea91f7dd69a"),
  "malaysia:langkawi": U("1622665645573-b0b5dea09d98"),
  "malaysia:cameron-highlands": U("1669812848176-593dcd49f308"),
  "malaysia:george-town": U("1739194073546-03112cda3eb8"),
  "malaysia:ipoh": U("1532442782935-dc7ee648a2a5"),
  "malaysia:johor-bahru": U("1687861717577-8ff74dd61a47"),
  // Thailand
  "thailand:krabi": U("1519451241324-20b4ea2c4220"),
  "thailand:pattaya": U("1625492206717-61c584a8b11e"),
  "thailand:phuket": U("1589394815804-964ed0be2eb5"),
  "thailand:bangkok": U("1508009603885-50cf7c579365"),
  "thailand:chiang-mai": U("1599576838688-8a6c11263108"),
  "thailand:ko-pha-ngan": U("1537956965359-7573183d1f57"),
  "thailand:ko-tao": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Ban_Mae_Haad_Ko_Tao.jpg",
  "thailand:koh-samui": U("1572529593091-6c05c37cacc7"),
  "thailand:chiang-rai": U("1671188893377-ee825a53d27f"),
  // Singapore
  "singapore:singapore": U("1525625293386-3f8f99389edd"),
  // Indonesia
  "indonesia:bali": C("bali"),
  "indonesia:gili-islands": U("1619681216575-d6b3964fc278"),
  "indonesia:jakarta": U("1555899434-94d1368aa7af"),
  "indonesia:surabaya": U("1566176553949-872b2a73e04e"),
  "indonesia:bandung": U("1505993597083-3bd19fb75e57"),
  "indonesia:medan": U("1673877547012-577aec9ed2d7"),
  "indonesia:manado-city": U("1612091508912-2136973784c3"),
  // UAE
  "uae:dubai": C("dubai"),
  "uae:sharjah": U("1683471546843-3dd6eace89b5"),
  "uae:abu-dhabi": U("1512632578888-169bbbc64f33"),
  "uae:ajman": U("1593334305856-1c6281efaa18"),
  "uae:al-seef": U("1722958093151-4dc4370c4dd1"),
  // Maldives
  "maldives:male": C("maldives"),
  "maldives:addu-city": U("1581500274180-6331eea8b184"),
  "maldives:fuvahmulah": U("1574226780565-388f10f8121e"),
  "maldives:hithadhoo": U("1587059481645-b3a17becd6e0"),
  // Armenia
  "armenia:yerevan": "https://upload.wikimedia.org/wikipedia/commons/4/45/Mount_Ararat_and_the_Yerevan_skyline_%28June_2018%29.jpg",
  // Georgia
  "georgia:tbilisi": "https://upload.wikimedia.org/wikipedia/commons/4/45/View_of_Tbilisi_from_Tabori_Church_2023-10-08-2.jpg",
  "georgia:kazbegi": "https://upload.wikimedia.org/wikipedia/commons/a/a1/View_of_Stepantsminda_09.23.jpg",
  "georgia:kakheti": "https://upload.wikimedia.org/wikipedia/commons/1/17/Black_Rock_Lake_%E1%83%90.jpg",
  "georgia:kutaisi": "https://upload.wikimedia.org/wikipedia/commons/4/40/Downtown_Kutaisi_%26_White_Bridge_as_seen_from_Mt_Gora_%28August_2011%29-cropped.jpg",
  "georgia:batumi": "https://upload.wikimedia.org/wikipedia/commons/0/01/Changing_skyline_of_Batumi%2C_Georgia.jpg",
  "georgia:borjomi": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Panorama_of_Borjomi_from_the_cable_car.jpg",
  // Mauritius
  "mauritius:vacoas-phoenix": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Mauritius_vacoas-phoenix.jpg",
  "mauritius:port-louis": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Port_Louis_Skyline.JPG",
  "mauritius:rodrigues-island": "https://upload.wikimedia.org/wikipedia/commons/b/be/Port_Mathurin.jpg",
  "mauritius:curepipe": "https://upload.wikimedia.org/wikipedia/commons/b/be/Mauritius_curepipe.jpg",
  "mauritius:quatre-bornes": "https://upload.wikimedia.org/wikipedia/commons/7/7d/2011-06-25_13-31-51_Mauritius_Plaines_Wilhems_Camp_Roches.jpg",
  // Turks & Caicos
  "turks-caicos:grace-bay": "https://upload.wikimedia.org/wikipedia/commons/5/54/Turtle_Cove_Providenciales_Beach.jpg",
  // Brazil
  "brazil:rio-de-janeiro": "https://upload.wikimedia.org/wikipedia/commons/9/98/Cidade_Maravilhosa.jpg",
  "brazil:manaus": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Manaus_amazonas.jpg",
  // Peru
  "peru:lima": "https://upload.wikimedia.org/wikipedia/commons/6/69/Bas%C3%ADlica_Catedral_Metropolitana_de_Lima_%28cropped%29.jpg",
  "peru:arequipa": "https://upload.wikimedia.org/wikipedia/commons/2/20/Plaza_de_Armas%2C_Arequipa_2006.jpg",
  "peru:cusco": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Vista_Calle_Suecia.jpg",
  "peru:trujillo": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Freedom_Monument%2C_Trujillo.jpg",
  "peru:iquitos": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Plaza_de_Armas_en_Iquitos.jpg",
  "peru:sacred-valley": "https://upload.wikimedia.org/wikipedia/commons/9/91/Ollantaytambo_-_Heiliges_Tal.jpg",
};

// Apply the central image map to every place that didn't declare its own photo,
// so the Trip Builder, Destinations tab and importer all show the same image.
for (const country of geography) {
  for (const place of country.places) {
    if (!place.image) {
      const img = PLACE_IMAGES[`${country.code}:${place.slug}`];
      if (img) place.image = img;
    }
  }
}

export function getCountry(code: string) {
  return geography.find((c) => c.code === code);
}

export function getPlace(countryCode: string, placeSlug: string) {
  return getCountry(countryCode)?.places.find((p) => p.slug === placeSlug);
}
