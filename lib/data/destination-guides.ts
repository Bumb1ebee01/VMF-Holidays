// Editorial content for the destination travel guides (/guides/[slug]). Keyed by
// destination slug. Destinations without an entry fall back to a templated guide
// built from the destination's blurb + tags, so every destination still gets a page.

export type DestinationGuide = {
  intro: string;
  bestTime: string;
  thingsToDo: string[];
  tip?: string;
};

export const destinationGuides: Record<string, DestinationGuide> = {
  goa: {
    intro:
      "Goa pairs golden beaches and Portuguese heritage with India's most relaxed pace. The north buzzes with shacks, markets and nightlife; the south is calmer, greener and made for slow mornings.",
    bestTime:
      "November to February is peak season — warm days, cool evenings and the famous beach parties. March to May is hotter but cheaper, and the June–September monsoon turns Goa lush and quiet at its lowest rates.",
    thingsToDo: [
      "Beach-hop North Goa — Baga, Calangute and Anjuna",
      "Wander Old Goa's churches and the Fontainhas Latin Quarter",
      "Chase Dudhsagar Falls and a spice-plantation lunch",
      "Sunset cruise on the Mandovi River",
      "Browse the Anjuna and Arpora night markets",
      "Unwind on the quieter south beaches — Palolem and Agonda",
    ],
    tip: "Stay in North Goa for nightlife and markets, South Goa for peace — or split your trip and do both.",
  },
  kerala: {
    intro:
      "Kerala — 'God's Own Country' — packs backwaters, tea hills, wildlife and beaches into one easy-to-travel state, with some of India's best food along the way.",
    bestTime:
      "September to March is ideal — pleasant and dry. The monsoon (June–August) is atmospheric and the best time for authentic Ayurveda treatments.",
    thingsToDo: [
      "Spend a night on an Alleppey backwater houseboat",
      "Roll through the tea estates of Munnar",
      "Take a spice-plantation and wildlife tour in Thekkady",
      "Explore Fort Kochi's Chinese fishing nets and Kathakali",
      "Book an authentic Ayurveda spa session",
      "Relax on Varkala's cliffs or Kovalam beach",
    ],
    tip: "The houseboat night is the trip's highlight — don't skip it.",
  },
  kashmir: {
    intro:
      "Kashmir is the Himalayas at their most cinematic — Dal Lake houseboats, snow-dusted meadows, saffron fields and warm hospitality.",
    bestTime:
      "April to October for green valleys and flowers (the tulip garden peaks in April). December to February brings snow and skiing in Gulmarg.",
    thingsToDo: [
      "Stay on a Dal Lake houseboat and take a shikara ride",
      "Ride the Gulmarg gondola — one of the world's highest",
      "Picnic in the meadows of Pahalgam and Betaab Valley",
      "Visit Sonmarg and the Thajiwas glacier",
      "Stroll the Mughal gardens of Srinagar",
    ],
    tip: "Time an April trip with the Tulip Garden bloom for unforgettable photos.",
  },
  rajasthan: {
    intro:
      "Rajasthan is the Land of Kings — mighty forts, lake palaces, golden deserts and colour-soaked bazaars at every turn.",
    bestTime:
      "October to March, when the desert days are comfortable and evenings are cool.",
    thingsToDo: [
      "Tour Jaipur's Amber Fort and Hawa Mahal",
      "Drift past Udaipur's lake palaces",
      "Climb Jodhpur's Mehrangarh over the blue city",
      "Camp and camel-safari in the Jaisalmer dunes",
      "Visit holy Pushkar and its lake",
    ],
    tip: "Short on time? The Golden Triangle — Delhi, Agra and Jaipur — is the perfect first-timer's loop.",
  },
  manali: {
    intro:
      "Manali is North India's adventure capital — pine forests, snow peaks, river rapids and buzzing cafe culture in Old Manali.",
    bestTime:
      "October to June for clear mountain weather; December to February for snow and winter sports.",
    thingsToDo: [
      "Ski, zorb and paraglide at Solang Valley",
      "Cross the high Rohtang Pass for snow (permit needed)",
      "Cafe-hop and shop in Old Manali",
      "Visit the cedar-wood Hadimba Temple",
      "Raft the Beas River near Kullu",
    ],
    tip: "Book your Rohtang Pass permit well in advance — daily numbers are capped.",
  },
  dubai: {
    intro:
      "Dubai is a futuristic playground of record-breaking towers, desert adventure and world-class shopping — an easy, family-friendly first international trip.",
    bestTime:
      "November to March, when the weather is warm and pleasant rather than searing.",
    thingsToDo: [
      "Ride to the top of the Burj Khalifa",
      "Take a dune-bashing desert safari with a BBQ dinner",
      "Shop the Dubai Mall and watch the fountain show",
      "Visit Palm Jumeirah and Atlantis Aquaventure",
      "Cross Dubai Creek by abra and explore the gold and spice souks",
    ],
    tip: "Indian travellers need a UAE e-visa — we arrange it as part of your package.",
  },
  thailand: {
    intro:
      "Thailand serves temples, legendary street food and tropical islands at exceptional value — splendour without the splurge.",
    bestTime:
      "November to March is the dry, cool season and the best time to travel country-wide.",
    thingsToDo: [
      "Temple-hop and eat your way through Bangkok",
      "Island-hop around Phuket, Krabi and Phi Phi",
      "Day-trip to James Bond Island in Phang Nga Bay",
      "Meet elephants at an ethical sanctuary",
      "Browse the floating and night markets",
    ],
    tip: "Pair a couple of Bangkok days with a beach base for the perfect first Thailand trip.",
  },
  vietnam: {
    intro:
      "Vietnam is Southeast Asia's most diverse — limestone bays, lantern-lit old towns, rice terraces and food you'll think about for years — and the best-value international trip from India.",
    bestTime:
      "February to April and August to October are the safest all-country windows; the climate varies north to south.",
    thingsToDo: [
      "Cruise overnight among the karsts of Ha Long Bay",
      "Wander Hanoi's Old Quarter and street-food lanes",
      "Stroll lantern-lit Hoi An ancient town",
      "Relax on Da Nang's My Khe beach",
      "Boat through the Mekong Delta",
    ],
    tip: "Most Indians travel on a Vietnam e-visa — we handle the application and timing.",
  },
  georgia: {
    intro:
      "Georgia is Europe's best-kept secret — Silk Road cities, dramatic Caucasus mountains, ancient wine and the Black Sea coast, all on a friendly budget.",
    bestTime:
      "May to October for mountains and wine country; December to March for skiing.",
    thingsToDo: [
      "Explore Tbilisi's old town and sulphur baths",
      "Drive to the Kazbegi mountains and Gergeti church",
      "Taste your way through the Kakheti wine region",
      "Visit ancient Mtskheta",
      "Unwind on the Batumi seafront",
    ],
    tip: "Georgia's easy e-visa and low prices make it a Europe-feel trip without the Schengen hassle.",
  },
  singapore: {
    intro:
      "Singapore is a gleaming, ultra-efficient city-state of futuristic gardens, theme parks and incredible food — and one of the easiest family destinations anywhere.",
    bestTime:
      "Year-round; February to April tends to be the driest.",
    thingsToDo: [
      "Marvel at the Supertrees of Gardens by the Bay",
      "Spend a day at Universal Studios on Sentosa",
      "Take in the view from Marina Bay Sands",
      "Do the Night Safari and Singapore Zoo",
      "Eat at a hawker centre and shop Orchard Road",
    ],
    tip: "Travelling with kids? Singapore's compact, safe and packed with family attractions.",
  },
  maldives: {
    intro:
      "The Maldives is the definitive honeymoon paradise — overwater villas, glass-clear lagoons and some of the best diving on earth.",
    bestTime:
      "November to April is the dry season with the calmest, clearest water.",
    thingsToDo: [
      "Stay a night in an overwater villa",
      "Snorkel or dive the house reef",
      "Picnic on a private sandbank",
      "Take a sunset dolphin cruise",
      "Book an overwater spa treatment",
    ],
    tip: "Travel in the shoulder months (May or September) for the same villas at much lower rates.",
  },
  bali: {
    intro:
      "Bali is the rare destination that's romantic, adventurous and great value at once — rice-terrace mornings, clifftop sunsets and a wellness scene like nowhere else.",
    bestTime:
      "April to October is the dry season; May, June and September hit the sweet spot of good weather and softer rates.",
    thingsToDo: [
      "Wander Ubud's rice terraces, temples and waterfalls",
      "Watch the Kecak fire dance on the Uluwatu cliffs",
      "Beach-club it in Seminyak and Canggu",
      "Day-trip to Nusa Penida's viewpoints",
      "Book a couples' spa and a jungle-villa stay",
    ],
    tip: "Split your stay — a few nights in green Ubud, then the beach — for the best of Bali.",
  },
};

export function getDestinationGuide(slug: string): DestinationGuide | null {
  return destinationGuides[slug] ?? null;
}
