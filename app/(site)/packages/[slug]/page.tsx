import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPackageBySlug, getRelatedPackages } from "@/lib/queries";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { JsonLd, packageJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ItineraryAccordion from "@/components/packages/ItineraryAccordion";
import CitySights from "@/components/packages/CitySights";
import PackageFaq from "@/components/packages/PackageFaq";
import PackageTerms from "@/components/packages/PackageTerms";
import EnquirySidebar from "@/components/packages/EnquirySidebar";
import PackageCard from "@/components/ui/PackageCard";
import ShareTripButton from "@/components/packages/ShareTripButton";
import DownloadItineraryButton from "@/components/packages/DownloadItineraryButton";
import styles from "./page.module.css";

export async function generateStaticParams() {
  // Only pre-build published packages — CMS-only ones must not exist publicly.
  const rows = await db.package.findMany({ where: { published: true }, select: { slug: true } });
  return rows.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/packages/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg || pkg.published === false) return {};
  const url = `/packages/${pkg.slug}`;
  const priceText = pkg.priceOnRequest ? "custom pricing on request" : `from ${formatINR(pkg.fromPrice)} per person`;
  const description = `${pkg.duration} in ${pkg.destination} — ${priceText}. ${pkg.highlights[0]}.`;
  return {
    title: pkg.title,
    description,
    keywords: [
      `${pkg.destination} tour package`,
      `${pkg.destination} holiday`,
      `${pkg.category} packages`,
      `${pkg.destination} itinerary`,
      "vmf holidays",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${pkg.title} | VMF Holidays`,
      description,
      images: [{ url: pkg.heroImage, width: 1200, height: 630, alt: pkg.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.title} | VMF Holidays`,
      description,
      images: [pkg.heroImage],
    },
  };
}

export default async function PackageDetailPage(props: PageProps<"/packages/[slug]">) {
  const { slug } = await props.params;
  const pkg = await getPackageBySlug(slug);
  // getPackageBySlug is unfiltered (staff tools share it); the public page must
  // 404 on a CMS-only package so hidden packages aren't reachable by URL.
  if (!pkg || pkg.published === false) notFound();

  const related = await getRelatedPackages(pkg);

  // Same lookup the itinerary PDF uses to pick the correct T&C set.
  const dest = await db.destination.findUnique({
    where: { slug: pkg.destinationSlug },
    select: { region: true },
  });
  const region = dest?.region === "international" ? "international" : "domestic";

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          packageJsonLd(pkg),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            { name: pkg.title, path: `/packages/${pkg.slug}` },
          ]),
        ]}
      />
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
            <Link href="/destinations">Destinations</Link>
            <span>/</span>
            <span>{pkg.destination}</span>
          </div>
          <div className={styles.heroBadges}>
            {pkg.badge && <span className="badge badge-orange">{pkg.badge}</span>}
            <span className="badge badge-white">{pkg.duration}</span>
          </div>
          <h1 className={styles.heroTitle}>{pkg.title}</h1>
          <p className={styles.heroPrice}>
            {pkg.priceOnRequest ? (
              <><strong>Price on Request</strong> · tailored to you</>
            ) : (
              <>from <strong>{formatINR(pkg.fromPrice)}</strong> per person</>
            )}
          </p>
          <div className={styles.heroActions}>
            <DownloadItineraryButton slug={pkg.slug} />
            <ShareTripButton title={pkg.title} />
            <Link
              href={`/compare?p=${pkg.slug}`}
              className={`btn btn-primary btn--sm ${styles.compareLink}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              Compare this package
            </Link>
          </div>
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
            <p className={styles.guideLink}>
              First time in {pkg.destination}? Read our{" "}
              <Link href={`/guides/${pkg.destinationSlug}`}>{pkg.destination} travel guide</Link>{" "}
              for the best time to visit and top things to do.
            </p>
          </section>

          {/* Itinerary */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Day-by-Day Itinerary</h2>
            <ItineraryAccordion itinerary={pkg.itinerary} />
          </section>

          {/* City-wise sightseeing */}
          <CitySights destinationSlug={pkg.destinationSlug} />

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

          {/* Hotels */}
          {pkg.hotels && pkg.hotels.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Where You&apos;ll Stay</h2>
              <div className={styles.hotelGrid}>
                {pkg.hotels.map((h, i) => (
                  <div key={i} className={styles.hotelCard}>
                    {h.image ? (
                      <div className={styles.hotelImgWrap}>
                        <Image src={h.image} alt={h.name} fill sizes="(max-width: 768px) 100vw, 320px" className={styles.hotelImg} />
                      </div>
                    ) : (
                      <div className={`${styles.hotelImgWrap} ${styles.hotelImgEmpty}`} />
                    )}
                    <div className={styles.hotelInfo}>
                      {h.city && <span className={styles.hotelCity}>{h.city}</span>}
                      <span className={styles.hotelName}>{h.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={styles.hotelNote}>
                Hotels are indicative; an equivalent-category hotel may be substituted subject to availability.
              </p>
            </section>
          )}

          {/* FAQ */}
          <PackageFaq pkg={pkg} />

          {/* Terms & Conditions (same set as the written quotation) */}
          <PackageTerms region={region} />
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
