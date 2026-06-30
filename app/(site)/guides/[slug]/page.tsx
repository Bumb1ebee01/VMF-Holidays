import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllDestinations, getHolidayLandings } from "@/lib/queries";
import { getDestinationGuide } from "@/lib/data/destination-guides";
import { formatINR } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import styles from "./page.module.css";

const WORD: Record<string, string> = {
  honeymoon: "Honeymoon",
  family: "Family",
  adventure: "Adventure",
  corporate: "Corporate & MICE",
  pilgrimage: "Pilgrimage",
  college: "College Group",
};

export async function generateStaticParams() {
  return (await getAllDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = (await getAllDestinations()).find((d) => d.slug === slug);
  if (!dest) return {};
  const name = dest.name;
  const title = `${name} Travel Guide`;
  const description = `${name} travel guide — the best time to visit, top things to do, and tailor-made ${name} holiday packages from ${formatINR(dest.fromPrice)} with VMF Holidays.`;
  const url = `/guides/${slug}`;
  return {
    title,
    description,
    keywords: [
      `${name.toLowerCase()} travel guide`,
      `things to do in ${name.toLowerCase()}`,
      `best time to visit ${name.toLowerCase()}`,
      `${name.toLowerCase()} packages`,
      "vmf holidays",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} | VMF Holidays`,
      description,
      images: dest.heroImage ? [{ url: dest.heroImage, alt: title }] : undefined,
    },
  };
}

export default async function DestinationGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [dests, allLandings] = await Promise.all([getAllDestinations(), getHolidayLandings()]);
  const dest = dests.find((d) => d.slug === slug);
  if (!dest) notFound();

  const guide = getDestinationGuide(slug);
  const intro = guide?.intro ?? dest.blurb;
  const bestTime =
    guide?.bestTime ?? `Tell us your dates and we'll advise the best time to visit ${dest.name} for your trip.`;
  const thingsToDo = guide?.thingsToDo ?? dest.tags.map((t) => `Experience the ${t.toLowerCase()} of ${dest.name}`);
  const landings = allLandings.filter((l) => l.destinationSlug === slug);

  const faqs = [
    { q: `What is the best time to visit ${dest.name}?`, a: bestTime },
    {
      q: `How much does a ${dest.name} trip cost?`,
      a: `Our ${dest.name} packages start from ${formatINR(dest.fromPrice)} per person and are fully customisable to your dates, hotel category and inclusions — we tailor a quote to your budget.`,
    },
    {
      q: `How do I plan a ${dest.name} trip with VMF Holidays?`,
      a: `Tell us your dates and interests via our enquiry form or WhatsApp and we'll build a personalised itinerary. There's no online payment — you pay us directly once you approve it.`,
    },
  ];

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            { name: `${dest.name} Guide`, path: `/guides/${slug}` },
          ]),
          faqJsonLd(faqs),
        ]}
      />

      <div className={styles.hero}>
        {dest.heroImage && (
          <Image src={dest.heroImage} alt={`${dest.name} travel guide`} fill priority sizes="100vw" className={styles.heroImg} />
        )}
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.kicker}>Travel Guide</span>
          <h1 className={styles.title}>{dest.name} Travel Guide</h1>
          <p className={styles.sub}>
            {dest.country} · packages from {formatINR(dest.fromPrice)} per person
          </p>
        </div>
      </div>

      <section className="section">
        <div className={`container ${styles.body}`}>
          <p className={styles.intro}>{intro}</p>

          <h2 className={styles.h2}>Best time to visit {dest.name}</h2>
          <p className={styles.para}>{bestTime}</p>

          <h2 className={styles.h2}>Top things to do in {dest.name}</h2>
          <ul className={styles.todo}>
            {thingsToDo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {guide?.tip && (
            <p className={styles.tip}>
              <strong>Insider tip:</strong> {guide.tip}
            </p>
          )}

          {landings.length > 0 && (
            <>
              <h2 className={styles.h2}>{dest.name} holiday packages</h2>
              <p className={styles.para}>Ready to go? Browse our tailor-made {dest.name} packages by trip type:</p>
              <div className={styles.links}>
                {landings.map((l) => (
                  <Link key={l.slug} href={`/holidays/${l.slug}`} className={styles.link}>
                    {dest.name} {WORD[l.category] ?? "Holiday"} Packages →
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 className={styles.h2}>{dest.name} — FAQs</h2>
          {faqs.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>{f.q}</summary>
              <p className={styles.faqA}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.ctaWrap}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Plan your {dest.name} trip</h2>
          <p className={styles.ctaSub}>Get a free, customised quote within 24 hours — no booking fees.</p>
          <div className={styles.ctaActions}>
            <Link href="/trip-builder" className="btn btn-primary btn--lg">Build my trip</Link>
            <a href="https://wa.me/917499322412" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn--lg">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
