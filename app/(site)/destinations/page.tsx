import type { Metadata } from "next";
import Link from "next/link";
import LocationTiles from "@/components/ui/LocationTiles";
import { getAllDestinations, getDomesticStates, getInternationalCountries } from "@/lib/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Holiday Destinations & Tour Packages",
  description:
    "Explore handpicked domestic & international destinations and the holiday packages for each — Kerala backwaters to Bali beaches, Goa to Dubai. Customised tours, transparent pricing.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    type: "website",
    url: "/destinations",
    title: "Holiday Destinations & Tour Packages | VMF Holidays",
    description:
      "Handpicked domestic & international destinations with customised holiday packages and transparent pricing.",
  },
};

export default async function DestinationsPage() {
  const [destinations, states, countries] = await Promise.all([
    getAllDestinations(),
    getDomesticStates(),
    getInternationalCountries(),
  ]);

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
          {states.length > 0 ? (
            <LocationTiles tiles={states} hrefBase="/destinations/domestic" />
          ) : (
            <p className={styles.guideIntro}>Domestic destinations are on the way — check back soon.</p>
          )}
        </div>

        <div className={styles.sectionBlock}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Around the World</span>
            <h2 className={styles.sectionTitle}>International Destinations</h2>
          </div>
          {countries.length > 0 ? (
            <LocationTiles tiles={countries} hrefBase="/destinations/international" />
          ) : (
            <p className={styles.guideIntro}>
              New international destinations are on the way. Tell us where you&apos;d like to go and
              we&apos;ll build the trip around you — <Link href="/contact">get in touch</Link>.
            </p>
          )}
        </div>

        <div className={styles.sectionBlock}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Before you go</span>
            <h2 className={styles.sectionTitle}>Destination Travel Guides</h2>
          </div>
          <p className={styles.guideIntro}>
            New to a destination? Our free travel guides cover the best time to visit, the top things to do and
            tailor-made packages — read up, then plan your trip.
          </p>
          <div className={styles.guideChips}>
            {destinations.map((d) => (
              <Link key={d.slug} href={`/guides/${d.slug}`} className={styles.guideChip}>
                {d.name}
              </Link>
            ))}
            <Link href="/guides" className={styles.guideChipAll}>View all guides →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
