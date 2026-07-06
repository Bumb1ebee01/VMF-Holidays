import type { Metadata } from "next";
import { getAllDestinations, getAllPackages } from "@/lib/queries";
import { JsonLd, breadcrumbJsonLd, absoluteUrl } from "@/lib/seo";
import TripFinder from "@/components/trip-finder/TripFinder";
import type { FinderDestination, FinderPackage } from "@/lib/trip-finder";
import styles from "./page.module.css";

const TITLE = "Where Should You Go? — Trip Finder";
const DESCRIPTION =
  "Not sure where to holiday? Answer four quick questions and we'll match you to destinations — with a trip for each — that genuinely fit your vibe, budget and who's travelling.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/trip-finder" },
  openGraph: {
    type: "website",
    url: "/tools/trip-finder",
    title: `${TITLE} | VMF Holidays`,
    description: DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | VMF Holidays`,
    description: DESCRIPTION,
  },
};

export default async function TripFinderPage() {
  const [destinations, packages] = await Promise.all([getAllDestinations(), getAllPackages()]);

  const finderDestinations: FinderDestination[] = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
    country: d.country,
    region: d.region,
    heroImage: d.heroImage,
    fromPrice: d.fromPrice,
    blurb: d.blurb,
    tags: d.tags,
  }));

  const finderPackages: FinderPackage[] = packages.map((p) => ({
    slug: p.slug,
    title: p.title,
    destinationSlug: p.destinationSlug,
    category: p.category,
    duration: p.duration,
    fromPrice: p.fromPrice,
    priceOnRequest: p.priceOnRequest ?? false,
    heroImage: p.heroImage,
    featured: p.featured,
  }));

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Travel Tools", path: "/tools" },
          { name: "Trip Finder", path: "/tools/trip-finder" },
        ])}
      />

      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Not sure where to go?</span>
          <h1 className={styles.heroTitle}>Find your kind of trip in 4 taps</h1>
          <p className={styles.heroSub}>
            Tell us your vibe, budget and travel crew — we&apos;ll match you to destinations and a
            trip for each. No sign-up, no typing.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <TripFinder destinations={finderDestinations} packages={finderPackages} />
        </div>
      </section>
    </div>
  );
}
