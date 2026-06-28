import { db } from "@/lib/db";
import {
  geography as staticGeography,
  PLACE_COORDS,
  type GeoCountry,
  type Continent,
} from "@/lib/data/geography";

// Merge the static PLACE_COORDS map into each place so the route map keeps
// working when we serve the bundled fallback data.
function withStaticCoords(list: GeoCountry[]): GeoCountry[] {
  return list.map((c) => ({
    ...c,
    places: c.places.map((p) => {
      const coords = PLACE_COORDS[`${c.code}:${p.slug}`];
      return { ...p, lat: p.lat ?? coords?.[0], lng: p.lng ?? coords?.[1] };
    }),
  }));
}

/**
 * Trip Builder geography for the public site. Reads the admin-managed DB tables
 * and falls back to the bundled lib/data/geography.ts when they're empty or not
 * migrated yet — so a deploy never breaks the Trip Builder before `db:push`.
 */
export async function loadGeography(): Promise<GeoCountry[]> {
  try {
    const rows = await db.geoCountry.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { places: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] } },
    });
    if (rows.length > 0) {
      return rows.map((c) => ({
        code: c.code,
        name: c.name,
        flag: c.flag,
        continent: c.continent as Continent,
        region: c.region,
        heroImage: c.heroImage,
        places: c.places.map((p) => ({
          slug: p.slug,
          name: p.name,
          destinationSlug: p.destinationSlug ?? undefined,
          image: p.image ?? undefined,
          lat: p.lat ?? undefined,
          lng: p.lng ?? undefined,
          activities: p.activities,
        })),
      }));
    }
  } catch {
    // Tables not migrated yet — serve the bundled data instead.
  }
  return withStaticCoords(staticGeography);
}
