import SectionHeader from "@/components/ui/SectionHeader";
import DestinationCard from "@/components/ui/DestinationCard";
import { destinations } from "@/lib/data/destinations";
import styles from "./PopularDestinations.module.css";

export default function PopularDestinations() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          eyebrow="Top Picks"
          title="Popular Destinations"
          sub="From serene backwaters to glittering cityscapes — find your perfect escape."
          centered
        />
        <div className={`grid-4 ${styles.grid}`}>
          {destinations.map((dest) => (
            <DestinationCard key={dest.slug} destination={dest} />
          ))}
        </div>
      </div>
    </section>
  );
}
