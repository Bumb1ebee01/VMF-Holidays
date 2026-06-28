// ─────────────────────────────────────────────────────────────────────────────
// SEED TRIP-BUILDER GEOGRAPHY
//
// Imports lib/data/geography.ts into the GeoCountry / GeoPlace tables so the
// admin CMS starts populated with the current countries, cities and activities.
//
// Idempotent: countries are upserted by `code`; each country's places are fully
// replaced from the bundled data on every run. Run AFTER `npm run db:push`.
//
// Run:  npx tsx prisma/seed-geography.ts   (or  npm run db:geo)
// ─────────────────────────────────────────────────────────────────────────────
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { geography, PLACE_COORDS } from "../lib/data/geography";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  let countries = 0;
  let places = 0;

  for (let i = 0; i < geography.length; i++) {
    const c = geography[i];
    const country = await db.geoCountry.upsert({
      where: { code: c.code },
      create: {
        code: c.code,
        name: c.name,
        flag: c.flag,
        continent: c.continent,
        region: c.region,
        heroImage: c.heroImage,
        sortOrder: i,
      },
      update: {
        name: c.name,
        flag: c.flag,
        continent: c.continent,
        region: c.region,
        heroImage: c.heroImage,
        sortOrder: i,
      },
    });
    countries++;

    await db.geoPlace.deleteMany({ where: { countryId: country.id } });
    if (c.places.length > 0) {
      await db.geoPlace.createMany({
        data: c.places.map((p, j) => {
          const coords = PLACE_COORDS[`${c.code}:${p.slug}`];
          return {
            countryId: country.id,
            slug: p.slug,
            name: p.name,
            destinationSlug: p.destinationSlug ?? null,
            image: p.image ?? null,
            lat: coords?.[0] ?? null,
            lng: coords?.[1] ?? null,
            activities: p.activities,
            sortOrder: j,
          };
        }),
      });
      places += c.places.length;
    }
  }

  console.log(`Seeded ${countries} countries and ${places} places.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
