import Image from "next/image";
import Link from "next/link";
import PackageCard from "@/components/ui/PackageCard";
import { getPackagesByCategory } from "@/lib/queries";
import { getCategoryBySlug } from "@/lib/data/categories";
import type { TripCategorySlug } from "@/lib/types";
import styles from "./CategoryLanding.module.css";

export default async function CategoryLanding({ slug }: { slug: TripCategorySlug }) {
  const category = getCategoryBySlug(slug);
  if (!category) return null;
  const pkgs = await getPackagesByCategory(slug);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Image src={category.image} alt={category.label} fill priority sizes="100vw" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroIcon}>{category.icon}</span>
          <h1 className={styles.heroTitle}>{category.label}</h1>
          <p className={styles.heroBlurb}>{category.blurb}</p>
        </div>
      </div>

      <div className="container">
        <section className="section">
          <h2 className={styles.sectionTitle}>
            {pkgs.length > 0
              ? `${pkgs.length} Package${pkgs.length !== 1 ? "s" : ""} Available`
              : `Tailor-Made ${category.label} Trips`}
          </h2>
          {pkgs.length > 0 ? (
            <div className="grid-3">
              {pkgs.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>
                We don&apos;t have ready-made {category.label.toLowerCase()} packages listed right now —
                and that&apos;s on purpose. Every one of these trips is planned around you. Tell us what
                you have in mind and we&apos;ll build a personalised itinerary, with a transparent quote.
              </p>
              <Link
                href={`/contact?service=${encodeURIComponent(category.label)}`}
                className="btn btn-primary btn--lg"
              >
                Plan My {category.label} Trip
              </Link>
            </div>
          )}
        </section>
      </div>

      <div className={styles.cta}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Can&apos;t find what you&apos;re looking for?</h2>
          <p className={styles.ctaSub}>We build custom itineraries. Tell us your dream trip and we&apos;ll plan it.</p>
          <div className={styles.ctaActions}>
            <Link href="/trip-builder" className="btn btn-primary btn--lg">Build My Trip</Link>
            <a href="https://wa.me/917499322412" target="_blank" rel="noopener noreferrer" className="btn btn-ghost-white btn--lg">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
