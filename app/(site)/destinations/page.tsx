import type { Metadata } from "next";
import DestinationCard from "@/components/ui/DestinationCard";
import { getAllDestinations } from "@/lib/queries";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore our handpicked domestic and international destinations — from Kerala backwaters to Bali temples.",
};

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();
  const domestic = destinations.filter((d) => d.region === "domestic");
  const international = destinations.filter((d) => d.region === "international");

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
          <div className={styles.grid}>
            {domestic.map((d, i) => (
              <div key={d.slug} className={`reveal reveal-d${Math.min(i + 1, 6)}`}>
                <DestinationCard destination={d} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sectionBlock}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Around the World</span>
            <h2 className={styles.sectionTitle}>International Destinations</h2>
          </div>
          <div className={styles.grid}>
            {international.map((d, i) => (
              <div key={d.slug} className={`reveal reveal-d${Math.min(i + 1, 6)}`}>
                <DestinationCard destination={d} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
