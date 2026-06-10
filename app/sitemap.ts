import type { MetadataRoute } from "next";
import { packages } from "@/lib/data/packages";
import { destinations } from "@/lib/data/destinations";

const BASE = "https://vmfholidays.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/packages`, priority: 0.9 },
    { url: `${BASE}/destinations`, priority: 0.8 },
    { url: `${BASE}/trip-builder`, priority: 0.8 },
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
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const destinationPages = destinations.map((d) => ({
    url: `${BASE}/packages?destination=${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...packagePages, ...destinationPages];
}
