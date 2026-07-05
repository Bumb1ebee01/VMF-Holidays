import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PackageCard from "@/components/ui/PackageCard";
import { getDomesticStates, getPackagesByState } from "@/lib/queries";
import styles from "../../page.module.css";

export async function generateStaticParams() {
  return (await getDomesticStates()).map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const data = await getPackagesByState(state);
  if (!data) return {};
  return {
    title: `${data.name} Holiday Packages`,
    description: `Browse our ${data.name} holiday packages — customised itineraries, transparent pricing and personal service from VMF Holidays.`,
    alternates: { canonical: `/destinations/domestic/${state}` },
  };
}

export default async function StatePackagesPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const data = await getPackagesByState(state);
  if (!data) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>
            <Link href="/destinations/domestic">Domestic</Link> · India
          </span>
          <h1 className={styles.heroTitle}>{data.name} Holiday Packages</h1>
          <p className={styles.heroSub}>
            {data.packages.length} package{data.packages.length === 1 ? "" : "s"} in {data.name} — tap any to see
            the full itinerary, or build a custom trip.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.sectionBlock}>
          {data.packages.length > 0 ? (
            <div className={styles.pkgGrid}>
              {data.packages.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          ) : (
            <p className={styles.guideIntro}>
              No {data.name} packages published yet — tell us what you have in mind and we&apos;ll build the trip
              around you. <Link href="/contact">Get in touch</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
