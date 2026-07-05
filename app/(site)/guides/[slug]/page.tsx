import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllDestinations, getHolidayLandings } from "@/lib/queries";
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

  // Guide content lives on the destination (admin-editable); fall back to the
  // blurb/tags so every destination still has a usable page.
  const intro = dest.guideIntro || dest.blurb;
  const bestTime =
    dest.guideBestTime ||
    `Tell us your dates and we'll advise the best time to visit ${dest.name} for your trip.`;
  const thingsToDo =
    dest.guideThingsToDo && dest.guideThingsToDo.length > 0
      ? dest.guideThingsToDo
      : dest.tags.map((t) => `Experience the ${t.toLowerCase()} of ${dest.name}`);
  const tip = dest.guideTip;
  const gallery = (dest.guideGallery ?? []).filter(Boolean);
  const sections = (dest.guideSections ?? []).filter((s) => s.heading || s.body);
  const landings = allLandings.filter((l) => l.destinationSlug === slug);
  const moreGuides = dests.filter((d) => d.slug !== slug);

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
            { name: "Travel Guides", path: "/guides" },
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
          <div className={styles.breadcrumb}>
            <Link href="/guides">Travel Guides</Link>
            <span>/</span>
            <span>{dest.name}</span>
          </div>
          <h1 className={styles.title}>{dest.name} Travel Guide</h1>
          <p className={styles.sub}>
            {dest.country} · packages from {formatINR(dest.fromPrice)} per person
          </p>
          {dest.tags.length > 0 && (
            <div className={styles.heroTags}>
              {dest.tags.slice(0, 4).map((t) => (
                <span key={t} className={styles.heroTag}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <div className={`container ${styles.body}`}>
          <p className={styles.intro}>{intro}</p>

          {gallery.length > 0 && (
            <div className={styles.gallery}>
              {gallery.slice(0, 6).map((src, i) => (
                <div key={i} className={styles.galleryItem}>
                  <Image src={src} alt={`${dest.name} — photo ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className={styles.galleryImg} />
                </div>
              ))}
            </div>
          )}

          <h2 className={styles.h2}>Best time to visit {dest.name}</h2>
          <p className={styles.para}>{bestTime}</p>

          <h2 className={styles.h2}>Top things to do in {dest.name}</h2>
          <ul className={styles.todo}>
            {thingsToDo.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {sections.map((s, i) => (
            <div key={i}>
              {s.heading && <h2 className={styles.h2}>{s.heading}</h2>}
              {s.body && <p className={styles.para}>{s.body}</p>}
            </div>
          ))}

          {tip && (
            <p className={styles.tip}>
              <strong>Insider tip:</strong> {tip}
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

      {moreGuides.length > 0 && (
        <section className={`section ${styles.moreSection}`}>
          <div className="container">
            <div className={styles.moreHead}>
              <h2 className={styles.moreTitle}>More destination guides</h2>
              <Link href="/guides" className={styles.moreAll}>View all guides →</Link>
            </div>
            <div className={styles.moreGrid}>
              {moreGuides.map((d) => (
                <Link key={d.slug} href={`/guides/${d.slug}`} className={styles.moreChip}>
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
