import type { Metadata } from "next";
import { getAllDestinations } from "@/lib/queries";
import { JsonLd, breadcrumbJsonLd, absoluteUrl } from "@/lib/seo";
import BudgetExplorer, { type BudgetDestination } from "@/components/tools/BudgetExplorer";
import styles from "./page.module.css";

const TITLE = "Budget Explorer — Where Can I Go?";
const DESCRIPTION =
  "Tell us your budget and instantly see which destinations you can travel to. A free, no-sign-up tool from VMF Holidays — from a weekend in Goa to an overwater villa in the Maldives.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/budget-explorer" },
  keywords: [
    "holiday for my budget",
    "where can i travel for 50000",
    "budget travel india",
    "cheap holiday packages",
    "vmf holidays",
  ],
  openGraph: {
    type: "website",
    url: "/tools/budget-explorer",
    title: `${TITLE} | VMF Holidays`,
    description: DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | VMF Holidays`, description: DESCRIPTION },
};

export default async function BudgetExplorerPage() {
  const destinations = await getAllDestinations();
  const data: BudgetDestination[] = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
    country: d.country,
    region: d.region,
    fromPrice: d.fromPrice,
    tags: d.tags,
  }));

  return (
    <div className={styles.page}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Travel Tools", path: "/tools" },
          { name: "Budget Explorer", path: "/tools/budget-explorer" },
        ])}
      />

      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Budget-first</span>
          <h1 className={styles.heroTitle}>Where can I go for my budget?</h1>
          <p className={styles.heroSub}>
            Slide to your budget per person and see every destination that fits — no sign-up, no
            guesswork. Every trip is fully customisable.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <BudgetExplorer destinations={data} />
        </div>
      </section>
    </div>
  );
}
