import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
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
        <div className="container">
          <span className="eyebrow">Where to Next?</span>
          <h1 className={styles.heroTitle}>Explore Destinations</h1>
          <p className={styles.heroSub}>
            Handpicked locations across India and the world, with packages crafted for every travel style.
          </p>
        </div>
      </div>

      <div className="container">
        <section className="section">
          <SectionHeader eyebrow="Within India" title="Domestic Destinations" />
          <div className={`grid-4 ${styles.grid}`}>
            {domestic.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeader eyebrow="Around the World" title="International Destinations" />
          <div className={`grid-4 ${styles.grid}`}>
            {international.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
