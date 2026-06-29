import type { Metadata } from "next";
import DestinationExplorer, { type ExplorerCountry } from "@/components/ui/DestinationExplorer";
import { type GeoCountry, type GeoPlace } from "@/lib/data/geography";
import { loadGeography } from "@/lib/data/geography-db";
import { getAllDestinations, getAllPackages } from "@/lib/queries";
import type { Destination, Package } from "@/lib/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore our handpicked domestic and international destinations — and the holiday packages for each — from Kerala backwaters to Bali temples.",
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
      const placePackages = dest ? packages.filter((pk) => pk.destinationSlug === dest.slug) : [];
      return {
        slug: p.slug,
        name: p.name,
        images: placeImages(p, c, destinations, packages),
        activityCount: p.activities.length,
        packages: placePackages,
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
  const [destinations, packages, geo] = await Promise.all([
    getAllDestinations(),
    getAllPackages(),
    loadGeography(),
  ]);

  const domestic = toExplorer(
    geo.filter((c) => c.region === "domestic"),
    destinations,
    packages
  );
  const international = toExplorer(
    geo.filter((c) => c.region === "international"),
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
            Handpicked locations across India and the world. Tap any destination to see its
            holiday packages, or build a custom trip.
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
