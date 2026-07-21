import Image from "next/image";
import Link from "next/link";
import PackageCard from "@/components/ui/PackageCard";
import { getPackagesByCategory, getHolidayLandings } from "@/lib/queries";
import { getCategoryBySlug } from "@/lib/data/categories";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from "@/lib/seo";
import { formatINR } from "@/lib/utils";
import type { TripCategorySlug } from "@/lib/types";
import styles from "./CategoryLanding.module.css";
import { whatsappLink } from "@/lib/contact";

export default async function CategoryLanding({ slug }: { slug: TripCategorySlug }) {
  const category = getCategoryBySlug(slug);
  if (!category) return null;
  const pkgs = await getPackagesByCategory(slug);
  const landings = (await getHolidayLandings()).filter((l) => l.category === slug);

  const label = category.label;
  const prices = pkgs.filter((p) => !p.priceOnRequest).map((p) => p.fromPrice);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const faqs = [
    {
      q: `What's included in a ${label} package from VMF Holidays?`,
      a: `Our ${label.toLowerCase()} packages typically include hotels, transfers, sightseeing and on-trip support, with flights added on request. Every itinerary is tailor-made, so inclusions are shaped around your dates, budget and preferences.`,
    },
    {
      q: `Can ${label} packages be customised?`,
      a: `Yes — every package is a starting point. Tell us your dates, group size and what you have in mind, and we'll build the trip around you with a transparent quote.`,
    },
    {
      q: `How much does a ${label} trip cost?`,
      a: minPrice
        ? `${label} packages with VMF Holidays start from ${formatINR(minPrice)} per person. The final price depends on your destination, travel dates, hotel category and inclusions.`
        : `Pricing depends on your destination, dates and inclusions — tell us what you have in mind and we'll tailor a transparent quote to your budget.`,
    },
    {
      q: `How do I book a ${label} trip?`,
      a: `Send an enquiry or message us on WhatsApp for a free quote. There's no online payment — you pay us directly once you approve the itinerary.`,
    },
  ];

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: category.label, path: `/${slug}` },
          ]),
          ...(pkgs.length > 0
            ? [itemListJsonLd(pkgs.map((p) => ({ name: p.title, path: `/packages/${p.slug}` })))]
            : []),
          faqJsonLd(faqs),
        ]}
      />
      <div className={styles.hero}>
        <Image src={category.image} alt={category.label} fill priority sizes="100vw" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
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

      {landings.length > 0 && (
        <div className="container">
          <section className={styles.destSection}>
            <h2 className={styles.sectionTitle}>Popular {category.label} Destinations</h2>
            <div className={styles.destLinks}>
              {landings.map((l) => (
                <Link key={l.slug} href={`/holidays/${l.slug}`} className={styles.destChip}>
                  {l.destinationName}
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      <section className={`section ${styles.faqSection}`}>
        <div className={`container ${styles.faqWrap}`}>
          <h2 className={styles.faqTitle}>{label} Packages — FAQs</h2>
          {faqs.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}</summary>
              <p className={styles.faqA}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className={styles.cta}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Can&apos;t find what you&apos;re looking for?</h2>
          <p className={styles.ctaSub}>We build custom itineraries. Tell us your dream trip and we&apos;ll plan it.</p>
          <div className={styles.ctaActions}>
            <Link href="/trip-builder" className="btn btn-primary btn--lg">Build My Trip</Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-white btn--lg">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
