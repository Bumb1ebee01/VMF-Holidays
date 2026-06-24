import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedOffers } from "@/lib/queries";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Offers & Deals",
  description:
    "Current VMF Holidays offers and seasonal travel deals — limited-time prices on handpicked holiday packages across India and beyond.",
  alternates: { canonical: "/offers" },
};

// Cached (ISR) instead of per-request so visitors never wait on a DB round-trip.
// Admin edits revalidate "/offers" instantly; expiring offers refresh within 5 min.
export const revalidate = 300;

const WA_DEFAULT =
  "https://wa.me/917499322412?text=Hi%20VMF%20Holidays!%20I%27d%20like%20details%20on%20your%20current%20offers.";

function offerLink(href: string | null) {
  return href && href.trim() ? href : WA_DEFAULT;
}

function fmtEnds(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function OffersPage() {
  const offers = await getPublishedOffers();
  // Duplicate so the marquee has enough tiles to scroll seamlessly.
  const strip = offers.length > 0 ? [...offers, ...offers] : [];

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Offers", path: "/offers" }])} />

      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Limited-time deals</span>
          <h1 className={styles.heroTitle}>Offers &amp; Seasonal Deals</h1>
          <p className={styles.heroSub}>
            Handpicked holiday offers at special prices. Grab them while they last — every deal is
            fully customisable to your dates and group.
          </p>
        </div>
      </div>

      <div className="container">
        {offers.length === 0 ? (
          <div className={styles.empty}>
            <p>No live offers right now — but we can always build you a deal.</p>
            <Link href="/trip-builder" className="btn btn-primary">
              Plan a custom trip
            </Link>
          </div>
        ) : (
          <>
            {strip.length >= 6 && (
              <div className={styles.marquee} aria-hidden="true">
                <div className={styles.track}>
                  {strip.map((o, i) => (
                    <Link key={`${o.id}-${i}`} href={offerLink(o.ctaHref)} className={styles.stripTile}>
                      <Image src={o.image} alt={o.title} fill sizes="320px" className={styles.stripImg} />
                      <span className={styles.stripTitle}>{o.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.grid}>
              {offers.map((o) => {
                const external = (o.ctaHref ?? "").startsWith("http");
                const href = offerLink(o.ctaHref);
                const cta = (
                  <span className={styles.cardBtn}>{o.ctaLabel?.trim() || "Enquire now"}</span>
                );
                return (
                  <article key={o.id} className={styles.card}>
                    <div className={styles.cardImg}>
                      <Image src={o.image} alt={o.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className={styles.img} />
                      {o.badge && <span className={styles.badge}>{o.badge}</span>}
                    </div>
                    <div className={styles.cardBody}>
                      <h2 className={styles.cardTitle}>{o.title}</h2>
                      {o.description && <p className={styles.cardDesc}>{o.description}</p>}
                      <div className={styles.cardFoot}>
                        {o.endsAt ? (
                          <span className={styles.ends}>Ends {fmtEnds(o.endsAt)}</span>
                        ) : (
                          <span />
                        )}
                        {external ? (
                          <a href={href} target="_blank" rel="noopener noreferrer">{cta}</a>
                        ) : (
                          <Link href={href}>{cta}</Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
