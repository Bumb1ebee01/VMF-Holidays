import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllDestinations } from "@/lib/queries";
import { formatINR } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import type { Destination } from "@/lib/types";
import styles from "./hub.module.css";

export const metadata: Metadata = {
  title: "Travel Guides — Best Time to Visit & Things to Do",
  description:
    "Free destination travel guides from VMF Holidays — the best time to visit, top things to do and tailor-made holiday packages for Goa, Kerala, Bali, Dubai, the Maldives and more.",
  keywords: [
    "travel guides",
    "india travel guides",
    "best time to visit",
    "things to do",
    "holiday planning guide",
    "vmf holidays",
  ],
  alternates: { canonical: "/guides" },
  openGraph: {
    type: "website",
    url: "/guides",
    title: "Travel Guides | VMF Holidays",
    description:
      "Destination guides — the best time to visit, top things to do and tailor-made packages for India and beyond.",
  },
};

function GuideCard({ d }: { d: Destination }) {
  return (
    <Link href={`/guides/${d.slug}`} className={styles.card}>
      <div className={styles.cardImg}>
        {d.heroImage && (
          <Image src={d.heroImage} alt={d.name} fill sizes="(max-width: 640px) 100vw, 33vw" className={styles.cardImgEl} />
        )}
        <span className={styles.cardCountry}>{d.country}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{d.name}</h3>
        <p className={styles.cardMeta}>Travel guide · packages from {formatINR(d.fromPrice)}</p>
        <span className={styles.cardCta}>Read the guide →</span>
      </div>
    </Link>
  );
}

export default async function GuidesHubPage() {
  const dests = await getAllDestinations();
  const groups = [
    { label: "Within India", items: dests.filter((d) => d.region === "domestic") },
    { label: "Around the World", items: dests.filter((d) => d.region === "international") },
  ].filter((g) => g.items.length > 0);

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Travel Guides", path: "/guides" },
          ]),
          itemListJsonLd(dests.map((d) => ({ name: `${d.name} Travel Guide`, path: `/guides/${d.slug}` }))),
        ]}
      />

      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Plan with confidence</span>
          <h1 className={styles.title}>Destination Travel Guides</h1>
          <p className={styles.sub}>
            The best time to visit, the top things to do, and tailor-made packages for every destination we cover —
            written by our own travel planners.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {dests.length === 0 ? (
            <p>Guides coming soon.</p>
          ) : (
            groups.map((g) => (
              <div key={g.label} className={styles.group}>
                <h2 className={styles.groupLabel}>{g.label}</h2>
                <div className={styles.grid}>
                  {g.items.map((d) => (
                    <GuideCard key={d.slug} d={d} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
