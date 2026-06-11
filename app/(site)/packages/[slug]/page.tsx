import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPackageBySlug, getRelatedPackages } from "@/lib/queries";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import ItineraryAccordion from "@/components/packages/ItineraryAccordion";
import EnquirySidebar from "@/components/packages/EnquirySidebar";
import PackageCard from "@/components/ui/PackageCard";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const rows = await db.package.findMany({ select: { slug: true } });
  return rows.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/packages/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};
  return {
    title: pkg.title,
    description: `${pkg.duration} in ${pkg.destination} from ${formatINR(pkg.fromPrice)} per person. ${pkg.highlights[0]}.`,
  };
}

export default async function PackageDetailPage(props: PageProps<"/packages/[slug]">) {
  const { slug } = await props.params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const related = await getRelatedPackages(pkg);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.breadcrumb}>
            <Link href="/packages">Packages</Link>
            <span>/</span>
            <span>{pkg.destination}</span>
          </div>
          <div className={styles.heroBadges}>
            {pkg.badge && <span className="badge badge-orange">{pkg.badge}</span>}
            <span className="badge badge-white">{pkg.duration}</span>
          </div>
          <h1 className={styles.heroTitle}>{pkg.title}</h1>
          <p className={styles.heroPrice}>
            from <strong>{formatINR(pkg.fromPrice)}</strong> per person
          </p>
        </div>
      </div>

      {/* Body */}
      <div className={`container ${styles.body}`}>
        {/* Main content */}
        <div className={styles.main}>

          {/* Overview */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <div className={styles.highlightsGrid}>
              {pkg.highlights.map((h) => (
                <div key={h} className={styles.highlightCard}>
                  <span className={styles.highlightCheck}>✓</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Itinerary */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Day-by-Day Itinerary</h2>
            <ItineraryAccordion itinerary={pkg.itinerary} />
          </section>

          {/* Inclusions & Exclusions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Inclusions &amp; Exclusions</h2>
            <div className={styles.incExcGrid}>
              <div className={styles.incBlock}>
                <h3 className={styles.incLabel}>
                  <span className={styles.incIcon}>✓</span> What&apos;s Included
                </h3>
                <ul className={styles.incList}>
                  {pkg.inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.excBlock}>
                <h3 className={styles.excLabel}>
                  <span className={styles.excIcon}>✕</span> Not Included
                </h3>
                <ul className={styles.excList}>
                  {pkg.exclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <EnquirySidebar pkg={pkg} />
      </div>

      {/* Related packages */}
      {related.length > 0 && (
        <div className={styles.related}>
          <div className="container">
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className="grid-3">
              {related.map((p) => (
                <PackageCard key={p.slug} pkg={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
