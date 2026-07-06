import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd, absoluteUrl } from "@/lib/seo";
import { LIVE_TOOLS, SOON_TOOLS, type ToolIcon } from "@/lib/data/tools";
import { ToolGlyph } from "@/components/tools/ToolGlyph";
import styles from "./page.module.css";

const TITLE = "Free Travel Tools";
const DESCRIPTION =
  "Free, no-sign-up travel tools from VMF Holidays — find where to go, split group trip expenses, convert currency and check visa requirements for Indian passports. Built for Indian travellers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools" },
  openGraph: {
    type: "website",
    url: "/tools",
    title: `${TITLE} | VMF Holidays`,
    description: DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | VMF Holidays`,
    description: DESCRIPTION,
  },
};

// Static — this hub only changes when the tools registry does.
export const revalidate = false;

export default function ToolsHubPage() {
  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Travel Tools", path: "/tools" },
          ]),
          itemListJsonLd(
            LIVE_TOOLS.map((t) => ({ name: t.title, path: `/tools/${t.slug}` }))
          ),
        ]}
      />

      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Free travel tools</span>
          <h1 className={styles.heroTitle}>Handy tools for your trip</h1>
          <p className={styles.heroSub}>
            Free, no-sign-up utilities to make planning easier — from finding where to go to
            splitting group expenses, converting currency and checking visa requirements.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {LIVE_TOOLS.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className={styles.card}>
              <div className={styles.cardIcon}>
                <ToolGlyph icon={tool.icon as ToolIcon} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardHead}>
                  <h2 className={styles.cardTitle}>{tool.title}</h2>
                  {tool.badge && <span className={styles.cardBadge}>{tool.badge}</span>}
                </div>
                <p className={styles.cardBlurb}>{tool.blurb}</p>
                <span className={styles.cardLink}>Open tool →</span>
              </div>
            </Link>
          ))}
        </div>

        {SOON_TOOLS.length > 0 && (
          <section className={styles.soon}>
            <h2 className={styles.soonTitle}>More tools on the way</h2>
            <div className={styles.soonGrid}>
              {SOON_TOOLS.map((tool) => (
                <div key={tool.slug} className={styles.soonChip}>
                  <span className={styles.soonGlyph}>
                    <ToolGlyph icon={tool.icon as ToolIcon} />
                  </span>
                  <span className={styles.soonName}>{tool.title}</span>
                  <span className={styles.soonTag}>Soon</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
