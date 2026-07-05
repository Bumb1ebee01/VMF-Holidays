import type { Metadata } from "next";
import LocationTiles from "@/components/ui/LocationTiles";
import { getInternationalCountries } from "@/lib/queries";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "International Holiday Packages & Destinations",
  description:
    "Explore our international destinations — Dubai, Thailand, Vietnam, Bali, Maldives and more. See how many holiday packages we offer for each country and plan your trip.",
  alternates: { canonical: "/destinations/international" },
  openGraph: {
    type: "website",
    url: "/destinations/international",
    title: "International Holiday Destinations | VMF Holidays",
    description: "Explore our international destinations by country and browse the packages for each.",
  },
};

export default async function InternationalDestinationsPage() {
  const countries = await getInternationalCountries();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>Around the World</span>
          <h1 className={styles.heroTitle}>International Destinations</h1>
          <p className={styles.heroSub}>
            Explore our destinations country by country. Tap a country to see all its holiday packages.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.sectionBlock}>
          {countries.length > 0 ? (
            <LocationTiles tiles={countries} hrefBase="/destinations/international" />
          ) : (
            <p className={styles.guideIntro}>International destinations are on the way — check back soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
