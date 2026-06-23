// ─────────────────────────────────────────────────────────────────────────────
// IMPORT TRIP-BUILDER PLACES AS DESTINATIONS
//
// Turns every place in lib/data/geography.ts into a real Destination row so it
// shows on the Destinations tab. Places that already link to a curated
// Destination (`destinationSlug`) are skipped — they're already represented.
//
// Idempotent: existing rows are left untouched (`update: {}`), so any price/
// blurb/image you edit in the admin panel is preserved on re-run. Only new
// places are inserted.
//
// Run:  npx tsx prisma/import-places.ts   (or  npm run db:places)
//
// The prices/blurbs below are sensible ESTIMATES — refine them in /admin.
// ─────────────────────────────────────────────────────────────────────────────
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { geography } from "../lib/data/geography";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Rough "from" price per person (INR) by country — placeholder estimates.
const COUNTRY_FROM_PRICE: Record<string, number> = {
  india: 14000,
  "sri-lanka": 38000,
  vietnam: 42000,
  malaysia: 40000,
  thailand: 38000,
  maldives: 65000,
  singapore: 55000,
  indonesia: 45000,
  uae: 48000,
  armenia: 60000,
  georgia: 58000,
  mauritius: 75000,
  "turks-caicos": 120000,
  brazil: 140000,
  peru: 130000,
};

function buildBlurb(place: string, country: string, activities: string[]): string {
  if (activities.length > 0) {
    return `Discover ${place} in ${country}. Highlights include ${activities
      .slice(0, 3)
      .join(", ")} — and our experts will tailor the rest to you.`;
  }
  return `Discover ${place} in ${country} with a personalised itinerary crafted by the VMF Holidays team.`;
}

async function main() {
  let created = 0;
  let skipped = 0;
  const usedSlugs = new Set<string>();

  for (const country of geography) {
    for (const place of country.places) {
      // Already a curated Destination — leave it.
      if (place.destinationSlug) {
        skipped++;
        continue;
      }

      // country-prefixed slug guarantees global uniqueness
      let slug = `${country.code}-${place.slug}`;
      while (usedSlugs.has(slug)) slug = `${slug}-x`;
      usedSlugs.add(slug);

      const fromPrice = COUNTRY_FROM_PRICE[country.code] ?? (country.region === "domestic" ? 15000 : 45000);
      const tags = place.activities.slice(0, 3);

      await db.destination.upsert({
        where: { slug },
        create: {
          slug,
          name: place.name,
          country: country.name,
          region: country.region,
          heroImage: place.image ?? country.heroImage,
          fromPrice,
          blurb: buildBlurb(place.name, country.name, place.activities),
          tags: tags.length > 0 ? tags : ["Sightseeing", country.name],
        },
        update: {},
      });
      created++;
    }
  }

  console.log(`Imported ${created} places as destinations (${skipped} already linked, skipped).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
