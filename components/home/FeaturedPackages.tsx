import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import PackageCard from "@/components/ui/PackageCard";
import { getFeaturedPackages } from "@/lib/queries";
import styles from "./FeaturedPackages.module.css";

export default async function FeaturedPackages() {
  const featured = await getFeaturedPackages();

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <SectionHeader
            eyebrow="Handpicked for You"
            title="Featured Packages"
            sub="Full itineraries, transparent pricing, no hidden costs."
          />
          <Link href="/packages" className="btn btn-outline btn--sm">
            View All Packages →
          </Link>
        </div>
        <div className="grid-3">
          {featured.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
