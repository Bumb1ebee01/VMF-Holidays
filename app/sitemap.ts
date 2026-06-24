import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { getAllDestinations } from "@/lib/queries";

const BASE = "https://vmfholidays.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [packages, destinations, posts] = await Promise.all([
    db.package.findMany({ select: { slug: true, updatedAt: true } }),
    getAllDestinations(),
    db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/packages`, priority: 0.9 },
    { url: `${BASE}/destinations`, priority: 0.8 },
    { url: `${BASE}/trip-builder`, priority: 0.8 },
    { url: `${BASE}/blog`, priority: 0.7 },
    { url: `${BASE}/about`, priority: 0.7 },
    { url: `${BASE}/contact`, priority: 0.7 },
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

  const destinationPages = destinations.map((d) => ({
    url: `${BASE}/packages?destination=${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postPages = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...packagePages, ...destinationPages, ...postPages];
}
