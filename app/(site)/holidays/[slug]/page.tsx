import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getHolidayLandings,
  getHolidayLanding,
  getPackagesForLanding,
  type HolidayLanding,
} from "@/lib/queries";
import { formatINR } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from "@/lib/seo";
import PackageCard from "@/components/ui/PackageCard";
import styles from "./page.module.css";

const WORD: Record<string, string> = {
  honeymoon: "Honeymoon",
  family: "Family",
  adventure: "Adventure",
  corporate: "Corporate & MICE",
  pilgrimage: "Pilgrimage",
  college: "College Group",
};

const titleFor = (l: HolidayLanding) => `${l.destinationName} ${WORD[l.category] ?? "Holiday"} Packages`;

export async function generateStaticParams() {
  return (await getHolidayLandings()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = await getHolidayLanding(slug);
  if (!landing) return {};
  const word = (WORD[landing.category] ?? "holiday").toLowerCase();
  const dest = landing.destinationName;
  const title = titleFor(landing);
  const description = `${landing.count} curated ${word} package${landing.count > 1 ? "s" : ""} in ${dest} from ${formatINR(landing.fromPrice)} per person — tailor-made by VMF Holidays with transparent pricing and full itineraries.`;
  const url = `/holidays/${landing.slug}`;
  return {
    title,
    description,
    keywords: [
      `${dest.toLowerCase()} ${word} packages`,
      `${dest.toLowerCase()} ${word} tour`,
      `${word} packages ${dest.toLowerCase()} from india`,
      `${dest.toLowerCase()} holiday packages`,
      "vmf holidays",
    ],
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${title} | VMF Holidays`, description },
  };
}

export default async function HolidayLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = await getHolidayLanding(slug);
  if (!landing) notFound();

  const [packages, all] = await Promise.all([getPackagesForLanding(landing), getHolidayLandings()]);

  const word = WORD[landing.category] ?? "Holiday";
  const wordLc = word.toLowerCase();
  const dest = landing.destinationName;
  const title = titleFor(landing);
  const heroImage = packages[0]?.heroImage;

  const faqs = [
    {
      q: `How much does a ${dest} ${wordLc} package cost?`,
      a: `Our ${dest} ${wordLc} packages start from ${formatINR(landing.fromPrice)} per person. The final price depends on your travel dates, hotel category and inclusions — we tailor a quote to your budget.`,
    },
    {
      q: `Can these ${dest} ${wordLc} packages be customised?`,
      a: `Yes — every package is a starting point. Tell us your dates, group size and preferences and we'll tailor the itinerary, stays and experiences around you.`,
    },
    {
      q: `How do I book a ${dest} trip with VMF Holidays?`,
      a: `Send an enquiry or message us on WhatsApp for a free quote. There's no online payment — you pay us directly once you approve the itinerary.`,
    },
  ];

  const sameCategory = all.filter((l) => l.category === landing.category && l.slug !== landing.slug).slice(0, 8);
  const sameDestination = all.filter((l) => l.destinationSlug === landing.destinationSlug && l.slug !== landing.slug);

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Holidays", path: "/holidays" },
            { name: title, path: `/holidays/${landing.slug}` },
          ]),
          itemListJsonLd(packages.map((p) => ({ name: p.title, path: `/packages/${p.slug}` }))),
          faqJsonLd(faqs),
        ]}
      />

      <div className={styles.hero}>
        {heroImage && (
          <Image src={heroImage} alt={title} fill priority sizes="100vw" className={styles.heroImg} />
        )}
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.breadcrumb}>
            <Link href="/holidays">Holidays</Link>
            <span>/</span>
            <span>{dest}</span>
          </div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.sub}>
            {landing.count} curated {wordLc} package{landing.count > 1 ? "s" : ""} from{" "}
            <strong>{formatINR(landing.fromPrice)}</strong> per person — fully customisable.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <p className={styles.intro}>
            Planning a {wordLc} trip to {dest}? Browse our handpicked {wordLc} packages below — each one
            tailor-made to your dates, budget and travel style, with transparent pricing and a real person
            to help from enquiry to return.
          </p>
          <p className={styles.guideLink}>
            First time? Read our <Link href={`/guides/${landing.destinationSlug}`}>{dest} travel guide</Link> for the
            best time to visit and top things to do.
          </p>
          {packages.length > 0 ? (
            <div className="grid-3">
              {packages.map((p) => (
                <PackageCard key={p.slug} pkg={p} />
              ))}
            </div>
          ) : (
            <p>
              New packages coming soon — <Link href="/contact">enquire for a custom {wordLc} trip</Link>.
            </p>
          )}
        </div>
      </section>

      <section className={`section ${styles.faqSection}`}>
        <div className={`container ${styles.faqWrap}`}>
          <h2 className={styles.faqTitle}>{dest} {word} Packages — FAQs</h2>
          {faqs.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}</summary>
              <p className={styles.faqA}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {(sameCategory.length > 0 || sameDestination.length > 0) && (
        <section className={`section ${styles.linksSection}`}>
          <div className="container">
            {sameCategory.length > 0 && (
              <div className={styles.linkBlock}>
                <h2 className={styles.linkTitle}>{word} packages in other destinations</h2>
                <div className={styles.linkGrid}>
                  {sameCategory.map((l) => (
                    <Link key={l.slug} href={`/holidays/${l.slug}`} className={styles.linkChip}>
                      {l.destinationName} {WORD[l.category]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {sameDestination.length > 0 && (
              <div className={styles.linkBlock}>
                <h2 className={styles.linkTitle}>Other {dest} trips</h2>
                <div className={styles.linkGrid}>
                  {sameDestination.map((l) => (
                    <Link key={l.slug} href={`/holidays/${l.slug}`} className={styles.linkChip}>
                      {dest} {WORD[l.category]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className={styles.ctaWrap}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to plan your {dest} {wordLc}?</h2>
          <p className={styles.ctaSub}>Get a free, customised quote within 24 hours — no booking fees.</p>
          <div className={styles.ctaActions}>
            <Link href="/trip-builder" className="btn btn-primary btn--lg">Build my trip</Link>
            <a
              href="https://wa.me/917499322412"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn--lg"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
