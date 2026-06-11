import type { Metadata } from "next";
import Link from "next/link";
import { getAllPackages, getAllDestinations } from "@/lib/queries";
import { categories } from "@/lib/data/categories";
import PackageCard from "@/components/ui/PackageCard";
import PackageFilters from "@/components/packages/PackageFilters";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Holiday Packages",
  description:
    "Browse our full range of domestic and international holiday packages — transparent pricing, full itineraries, no hidden costs.",
};

export default async function PackagesPage(props: PageProps<"/packages">) {
  const sp = await props.searchParams;
  const destination = typeof sp.destination === "string" ? sp.destination : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const region = typeof sp.region === "string" ? sp.region : "";

  const [packages, destinations] = await Promise.all([
    getAllPackages(),
    getAllDestinations(),
  ]);

  const filtered = packages.filter((pkg) => {
    if (destination && pkg.destinationSlug !== destination) return false;
    if (category && pkg.category !== category) return false;
    if (region) {
      const dest = destinations.find((d) => d.slug === pkg.destinationSlug);
      if (dest && dest.region !== region) return false;
    }
    return true;
  });

  const activeDestName = destination
    ? destinations.find((d) => d.slug === destination)?.name
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHero}>
        <div className="container">
          <span className="eyebrow">All Holidays</span>
          <h1 className={styles.heroTitle}>
            {activeDestName ? `${activeDestName} Packages` : "Holiday Packages"}
          </h1>
          <p className={styles.heroSub}>
            {filtered.length} package{filtered.length !== 1 ? "s" : ""} available
            {activeDestName ? ` in ${activeDestName}` : ""}
          </p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <PackageFilters
          destinations={destinations}
          categories={categories}
          activeDestination={destination}
          activeCategory={category}
          activeRegion={region}
        />

        <div className={styles.results}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No packages found</h3>
              <p>Try adjusting your filters or browse all packages.</p>
              <Link href="/packages" className="btn btn-navy btn--sm">
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
