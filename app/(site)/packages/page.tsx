import type { Metadata } from "next";
import Link from "next/link";
import { getAllPackages, getAllDestinations } from "@/lib/queries";
import { categories } from "@/lib/data/categories";
import PackageGrid from "@/components/ui/PackageGrid";
import PackageFilters from "@/components/packages/PackageFilters";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Holiday Packages",
  description:
    "Browse our full range of domestic and international holiday packages — transparent pricing, full itineraries, no hidden costs.",
  alternates: { canonical: "/packages" },
};

export default async function PackagesPage(props: PageProps<"/packages">) {
  const sp = await props.searchParams;
  const destination = typeof sp.destination === "string" ? sp.destination : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const region = typeof sp.region === "string" ? sp.region : "";
  const q = typeof sp.q === "string" ? sp.q : "";
  const query = q.trim().toLowerCase();

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
    if (query) {
      const haystack = `${pkg.title} ${pkg.destination} ${pkg.category} ${pkg.highlights?.join(" ") ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
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
            {q.trim() ? ` for “${q.trim()}”` : ""}
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
          activeQuery={q}
        />

        <div className={styles.results}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <h3>No packages found{q.trim() ? ` for “${q.trim()}”` : ""}</h3>
              <p>Try adjusting your filters, or tell us where you want to go — we build custom trips too.</p>
              <div className={styles.emptyActions}>
                <Link href="/packages" className="btn btn-navy btn--sm">
                  Clear Filters
                </Link>
                <Link href="/trip-builder" className="btn btn-primary btn--sm">
                  Build a Custom Trip
                </Link>
              </div>
            </div>
          ) : (
            <PackageGrid packages={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
