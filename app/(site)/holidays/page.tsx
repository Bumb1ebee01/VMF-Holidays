import type { Metadata } from "next";
import Link from "next/link";
import { getHolidayLandings, type HolidayLanding } from "@/lib/queries";
import { formatINR } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import styles from "./hub.module.css";

const WORD: Record<string, string> = {
  honeymoon: "Honeymoon",
  family: "Family",
  adventure: "Adventure",
  corporate: "Corporate & MICE",
  pilgrimage: "Pilgrimage",
  college: "College Group",
};

export const metadata: Metadata = {
  title: "Holiday Packages by Destination & Type",
  description:
    "Browse VMF Holidays packages by destination and trip type — honeymoon, family, adventure, corporate and more, across India and worldwide. Tailor-made with transparent pricing.",
  alternates: { canonical: "/holidays" },
};

export default async function HolidaysHubPage() {
  const landings = await getHolidayLandings();

  const byDest = new Map<string, HolidayLanding[]>();
  for (const l of landings) {
    const arr = byDest.get(l.destinationName) ?? [];
    arr.push(l);
    byDest.set(l.destinationName, arr);
  }
  const groups = [...byDest.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Holidays", path: "/holidays" },
          ]),
          itemListJsonLd(
            landings.map((l) => ({
              name: `${l.destinationName} ${WORD[l.category] ?? "Holiday"} Packages`,
              path: `/holidays/${l.slug}`,
            }))
          ),
        ]}
      />

      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Browse by type</span>
          <h1 className={styles.title}>Holiday Packages by Destination &amp; Type</h1>
          <p className={styles.sub}>
            Find your perfect trip — pick a destination and the kind of holiday you&apos;re after.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {groups.length === 0 ? (
            <p>Packages coming soon.</p>
          ) : (
            <div className={styles.grid}>
              {groups.map(([dest, items]) => (
                <div key={dest} className={styles.group}>
                  <h2 className={styles.groupTitle}>{dest}</h2>
                  <ul className={styles.links}>
                    {items.map((l) => (
                      <li key={l.slug}>
                        <Link href={`/holidays/${l.slug}`} className={styles.link}>
                          <span>{dest} {WORD[l.category] ?? "Holiday"} Packages</span>
                          <span className={styles.price}>from {formatINR(l.fromPrice)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
