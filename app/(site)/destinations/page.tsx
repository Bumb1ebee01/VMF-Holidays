import type { Metadata } from "next";
import DestinationExplorer, { type ExplorerCountry } from "@/components/ui/DestinationExplorer";
import { geography, type GeoCountry, type GeoPlace } from "@/lib/data/geography";
import { getAllDestinations, getAllPackages } from "@/lib/queries";
import type { Destination, Package } from "@/lib/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore our handpicked domestic and international destinations — from Kerala backwaters to Bali temples.",
  alternates: { canonical: "/destinations" },
};

function placeImages(p: GeoPlace, c: GeoCountry, destinations: Destination[], packages: Package[]): string[] {
  const dest = p.destinationSlug ? destinations.find((d) => d.slug === p.destinationSlug) : null;
  const imgs = [p.image ?? dest?.heroImage ?? c.heroImage];
  if (dest) {
    const pkgs = packages.filter((pk) => pk.destinationSlug === dest.slug);
    imgs.push(...pkgs.flatMap((pk) => [pk.heroImage, ...(pk.gallery ?? [])]));
  }
  return Array.from(new Set(imgs.filter(Boolean))).slice(0, 5);
}

function toExplorer(countries: GeoCountry[], destinations: Destination[], packages: Package[]): ExplorerCountry[] {
  return countries.map((c) => {
    const places = c.places.map((p) => {
      const dest = p.destinationSlug ? destinations.find((d) => d.slug === p.destinationSlug) : null;
      return {
        slug: p.slug,
        name: p.name,
        images: placeImages(p, c, destinations, packages),
        href: dest ? `/packages?destination=${dest.slug}` : "/trip-builder",
        activityCount: p.activities.length,
      };
    });
    // Country slideshow = its hero plus a sampling of its places' photos.
    const images = Array.from(
      new Set([c.heroImage, ...places.flatMap((p) => p.images)].filter(Boolean))
    ).slice(0, 5);
    return { code: c.code, name: c.name, flag: c.flag, images, placeCount: c.places.length, places };
  });
}

export default async function DestinationsPage() {
  const [destinations, packages] = await Promise.all([getAllDestinations(), getAllPackages()]);

  const domestic = toExplorer(
    geography.filter((c) => c.region === "domestic"),
    destinations,
    packages
  );
  const international = toExplorer(
    geography.filter((c) => c.region === "international"),
    destinations,
    packages
  );

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>Where to Next?</span>
          <h1 className={styles.heroTitle}>Explore Destinations</h1>
          <p className={styles.heroSub}>
            Handpicked locations across India and the world, with packages crafted for every travel style.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Within India</span>
            <h2 className={styles.sectionTitle}>Domestic Destinations</h2>
          </div>
          <DestinationExplorer countries={domestic} />
        </div>

        <div className={styles.sectionBlock}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Around the World</span>
            <h2 className={styles.sectionTitle}>International Destinations</h2>
          </div>
          <DestinationExplorer countries={international} />
        </div>
      </div>
    </div>
  );
}
