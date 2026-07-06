import type { Metadata } from "next";
import { getAllPackages } from "@/lib/queries";
import PackageCompare, { type CompareItem } from "@/components/packages/PackageCompare";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Compare Holiday Packages",
  description:
    "Compare VMF Holidays packages side by side — price, duration, hotels, highlights and inclusions — to find the trip that fits you best.",
  alternates: { canonical: "/compare" },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p = "" } = await searchParams;
  const packages = await getAllPackages();

  const items: CompareItem[] = packages.map((pk) => ({
    slug: pk.slug,
    title: pk.title,
    destination: pk.destination,
    category: pk.category,
    duration: pk.duration,
    nights: pk.nights,
    fromPrice: pk.fromPrice,
    priceOnRequest: pk.priceOnRequest ?? false,
    heroImage: pk.heroImage,
    hotel: pk.hotel ?? null,
    highlights: pk.highlights,
    inclusions: pk.inclusions,
    exclusions: pk.exclusions,
    featured: pk.featured,
    badge: pk.badge ?? null,
  }));

  const initial = p
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Find your fit</span>
          <h1 className={styles.title}>Compare Holiday Packages</h1>
          <p className={styles.sub}>
            Put up to three packages side by side — price, duration, hotels and what&apos;s included.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <p className={styles.empty}>No packages to compare yet.</p>
          ) : (
            <PackageCompare items={items} initial={initial} />
          )}
        </div>
      </section>
    </div>
  );
}
