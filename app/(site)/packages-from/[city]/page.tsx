import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedPackages, getPublishedPackages } from "@/lib/queries";
import { DEPARTURE_CITIES, getDepartureCity } from "@/lib/data/cities";
import { formatINR } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd, faqJsonLd, absoluteUrl } from "@/lib/seo";
import PackageCard from "@/components/ui/PackageCard";
import styles from "./page.module.css";
import { whatsappLink } from "@/lib/contact";

const CATEGORY_LINKS = [
  { slug: "honeymoon", label: "Honeymoon" },
  { slug: "family", label: "Family" },
  { slug: "adventure", label: "Adventure" },
  { slug: "corporate", label: "Corporate & MICE" },
  { slug: "pilgrimage", label: "Pilgrimage" },
  { slug: "college", label: "College Tours" },
];

export function generateStaticParams() {
  return DEPARTURE_CITIES.map((c) => ({ city: c.slug }));
}

async function cityPackages() {
  const featured = await getFeaturedPackages();
  if (featured.length >= 3) return featured;
  return (await getPublishedPackages()).slice(0, 6);
}

const minPriceOf = (pkgs: { fromPrice: number; priceOnRequest?: boolean }[]) => {
  const prices = pkgs.filter((p) => !p.priceOnRequest).map((p) => p.fromPrice);
  return prices.length ? Math.min(...prices) : 0;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const c = getDepartureCity(city);
  if (!c) return {};
  const title = `Holiday Packages from ${c.name}`;
  const description = `Book domestic and international holiday packages from ${c.name} — flights from ${c.airport}, tailor-made itineraries and transparent pricing. Popular from ${c.name}: ${c.popular}.`;
  const url = `/packages-from/${c.slug}`;
  return {
    title,
    description,
    keywords: [
      `holiday packages from ${c.name.toLowerCase()}`,
      `tour packages from ${c.name.toLowerCase()}`,
      `${c.name.toLowerCase()} travel agency`,
      `international packages from ${c.name.toLowerCase()}`,
      "vmf holidays",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | VMF Holidays`,
      description,
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `${title} | VMF Holidays`, description },
  };
}

export default async function PackagesFromCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const c = getDepartureCity(city);
  if (!c) notFound();

  const packages = await cityPackages();
  const fromPrice = minPriceOf(packages);
  const heroImage = packages[0]?.heroImage;
  const title = `Holiday Packages from ${c.name}`;
  const otherCities = DEPARTURE_CITIES.filter((x) => x.slug !== c.slug);

  const faqs = [
    {
      q: `Do you arrange flights from ${c.name}?`,
      a: `Yes. Every VMF Holidays package can include return flights from ${c.name}'s ${c.airport}, or you can book your own — we'll adjust the price accordingly. Either way we handle hotels, transfers, sightseeing and support end to end.`,
    },
    {
      q: `How much do holiday packages from ${c.name} cost?`,
      a: fromPrice
        ? `Our packages start from ${formatINR(fromPrice)} per person. The final price depends on your destination, travel dates, hotel category and inclusions — we tailor a quote to your budget.`
        : `Pricing depends on your destination, dates and inclusions — tell us what you have in mind and we'll tailor a transparent quote.`,
    },
    {
      q: `Can I get a customised package from ${c.name}?`,
      a: `Absolutely — every package is a starting point. Share your dates, group size and preferences and we'll build the itinerary, stays and experiences around you.`,
    },
    {
      q: `How do I book a trip from ${c.name}?`,
      a: `Send an enquiry or message us on WhatsApp for a free quote. There's no online payment — you pay us directly once you approve the itinerary.`,
    },
  ];

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: title, path: `/packages-from/${c.slug}` },
          ]),
          itemListJsonLd(packages.map((p) => ({ name: p.title, path: `/packages/${p.slug}` }))),
          faqJsonLd(faqs),
        ]}
      />

      <div className={styles.hero}>
        {heroImage && <Image src={heroImage} alt={title} fill priority sizes="100vw" className={styles.heroImg} />}
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className="eyebrow">From {c.name}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.sub}>
            Domestic &amp; international trips from {c.name}
            {fromPrice ? <> — from <strong>{formatINR(fromPrice)}</strong> per person</> : ""}, tailor-made with
            transparent pricing.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <p className={styles.intro}>
            Planning a holiday from {c.name}? VMF Holidays arranges domestic and international trips departing from{" "}
            {c.airport}, with return flights, hotels, transfers and sightseeing all handled for you. Travellers from{" "}
            {c.name} especially love {c.popular} — but every trip is tailor-made to your dates, budget and travel style.
          </p>

          <div className="grid-3">
            {packages.map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.linkBlock}>
            <h2 className={styles.linkTitle}>Browse trips by type</h2>
            <div className={styles.linkGrid}>
              {CATEGORY_LINKS.map((cat) => (
                <Link key={cat.slug} href={`/${cat.slug}`} className={styles.linkChip}>
                  {cat.label} from {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.linkBlock}>
            <h2 className={styles.linkTitle}>Popular destinations</h2>
            <div className={styles.linkGrid}>
              <Link href="/destinations/domestic" className={styles.linkChip}>India destinations</Link>
              <Link href="/destinations/international" className={styles.linkChip}>International destinations</Link>
              <Link href="/packages" className={styles.linkChip}>All packages</Link>
              <Link href="/tools/trip-finder" className={styles.linkChip}>Not sure? Trip Finder</Link>
            </div>
          </div>

          <div className={styles.linkBlock}>
            <h2 className={styles.linkTitle}>Packages from other cities</h2>
            <div className={styles.linkGrid}>
              {otherCities.map((x) => (
                <Link key={x.slug} href={`/packages-from/${x.slug}`} className={styles.linkChip}>
                  From {x.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.faqSection}`}>
        <div className={`container ${styles.faqWrap}`}>
          <h2 className={styles.faqTitle}>Holiday Packages from {c.name} — FAQs</h2>
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
          <h2 className={styles.ctaTitle}>Ready to plan your trip from {c.name}?</h2>
          <p className={styles.ctaSub}>Get a free, customised quote within 24 hours — no booking fees.</p>
          <div className={styles.ctaActions}>
            <Link href="/trip-builder" className="btn btn-primary btn--lg">Build my trip</Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn--lg">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
