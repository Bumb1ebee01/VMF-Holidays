import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL as BASE } from "@/lib/seo";
import { getHolidayLandings, getAllDestinations } from "@/lib/queries";
import { LIVE_TOOLS } from "@/lib/data/tools";
import { DEPARTURE_CITIES } from "@/lib/data/cities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packages, posts, landings, dests] = await Promise.all([
    db.package.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    getHolidayLandings(),
    getAllDestinations(),
  ]);

  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/destinations`, priority: 0.9 },
    { url: `${BASE}/holidays`, priority: 0.8 },
    { url: `${BASE}/trip-builder`, priority: 0.8 },
    { url: `${BASE}/blog`, priority: 0.7 },
    { url: `${BASE}/guides`, priority: 0.7 },
    { url: `${BASE}/offers`, priority: 0.7 },
    { url: `${BASE}/tools`, priority: 0.7 },
    { url: `${BASE}/gallery`, priority: 0.6 },
    { url: `${BASE}/about`, priority: 0.7 },
    { url: `${BASE}/contact`, priority: 0.7 },
    { url: `${BASE}/travellers-club`, priority: 0.6 },
    { url: `${BASE}/compare`, priority: 0.5 },
    { url: `${BASE}/faq`, priority: 0.5 },
    { url: `${BASE}/honeymoon`, priority: 0.7 },
    { url: `${BASE}/family`, priority: 0.7 },
    { url: `${BASE}/adventure`, priority: 0.7 },
    { url: `${BASE}/corporate`, priority: 0.7 },
    { url: `${BASE}/pilgrimage`, priority: 0.7 },
    { url: `${BASE}/college`, priority: 0.7 },
    { url: `${BASE}/privacy`, priority: 0.3 },
    { url: `${BASE}/terms`, priority: 0.3 },
  ].map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  const packagePages = packages.map((p) => ({
    url: `${BASE}/packages/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const postPages = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const holidayPages = landings.map((l) => ({
    url: `${BASE}/holidays/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guidePages = dests.map((d) => ({
    url: `${BASE}/guides/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const toolPages = LIVE_TOOLS.map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const cityPages = DEPARTURE_CITIES.map((c) => ({
    url: `${BASE}/packages-from/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...packagePages, ...postPages, ...holidayPages, ...guidePages, ...toolPages, ...cityPages];
}
