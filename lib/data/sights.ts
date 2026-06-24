import { geography } from "./geography";

// Groups a place's free-form activity labels into city-wise sightseeing lists.
// The geography data tags the city either as a trailing "(City)" — e.g.
// "Periyar Tiger Reserve (Thekkady)" — or as a leading "City City Tour /
// Sightseeing" — e.g. "Munnar City Sightseeing". Anything we can't confidently
// attribute to a city is left out rather than guessed.

export interface CitySights {
  city: string;
  sights: string[];
}

function extract(activity: string): { city: string; sight: string } | null {
  // Trailing "(City)" — the parenthetical names the city.
  const trailing = activity.match(/\(([^)]+)\)\s*$/);
  if (trailing) {
    return { city: trailing[1].trim(), sight: activity.replace(/\s*\([^)]+\)\s*$/, "").trim() };
  }
  // Leading "<City> City Tour/Sightseeing" — strip any alias in parentheses.
  const leading = activity.match(/^(.+?)\s+City\s+(?:Tour|Sightseeing)/i);
  if (leading) {
    const city = leading[1].replace(/\s*\([^)]+\)\s*/g, " ").trim();
    if (city) return { city, sight: activity };
  }
  return null;
}

export function cityWiseSights(activities: string[]): CitySights[] {
  const groups = new Map<string, string[]>();
  for (const activity of activities) {
    const parsed = extract(activity);
    if (!parsed) continue;
    const list = groups.get(parsed.city) ?? [];
    if (!list.includes(parsed.sight)) list.push(parsed.sight);
    groups.set(parsed.city, list);
  }
  return Array.from(groups.entries())
    .filter(([, sights]) => sights.length > 0)
    .map(([city, sights]) => ({ city, sights }));
}

/** City-wise sightseeing for a Destination, sourced from the geography place that links to it. */
export function sightsForDestination(destinationSlug: string): CitySights[] {
  for (const country of geography) {
    const place = country.places.find((p) => p.destinationSlug === destinationSlug);
    if (place) {
      const grouped = cityWiseSights(place.activities);
      // Only worth showing as a "city by city" view if there are at least 2 cities.
      return grouped.length >= 2 ? grouped : [];
    }
  }
  return [];
}
