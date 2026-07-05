import type { Metadata } from "next";
import LocationTiles from "@/components/ui/LocationTiles";
import { getDomesticStates } from "@/lib/queries";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Domestic Holiday Destinations in India",
  description:
    "Explore India state by state — Goa, Kerala, Rajasthan, Himachal and more. See how many holiday packages we offer for each and plan your trip with VMF Holidays.",
  alternates: { canonical: "/destinations/domestic" },
  openGraph: {
    type: "website",
    url: "/destinations/domestic",
    title: "Domestic Holiday Destinations in India | VMF Holidays",
    description: "Explore India state by state and browse the holiday packages for each.",
  },
};

export default async function DomesticDestinationsPage() {
  const states = await getDomesticStates();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>Within India</span>
          <h1 className={styles.heroTitle}>Domestic Destinations</h1>
          <p className={styles.heroSub}>
            Explore India state by state. Tap a state to see all its holiday packages.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.sectionBlock}>
          {states.length > 0 ? (
            <LocationTiles tiles={states} hrefBase="/destinations/domestic" />
          ) : (
            <p className={styles.guideIntro}>Domestic destinations are on the way — check back soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
