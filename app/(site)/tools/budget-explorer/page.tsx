import type { Metadata } from "next";
import { getAllDestinations, getAllPackages } from "@/lib/queries";
import { JsonLd, breadcrumbJsonLd, absoluteUrl } from "@/lib/seo";
import BudgetExplorer, { type BudgetDestination, type BudgetPackage } from "@/components/tools/BudgetExplorer";
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

export default async function BudgetExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ budget?: string }>;
}) {
  const { budget } = await searchParams;
  const initialBudget = budget !== undefined ? Number(budget) : undefined;
  const [destinations, packages] = await Promise.all([getAllDestinations(), getAllPackages()]);

  // Group real, priced packages under their destination so a budget match can
  // link straight to a bookable trip, not just the read-only guide. On-request
  // packages have no comparable price, so they're left out of a budget tool.
  const byDestination = new Map<string, BudgetPackage[]>();
  for (const p of packages) {
    if (p.priceOnRequest) continue;
    const list = byDestination.get(p.destinationSlug) ?? [];
    list.push({ slug: p.slug, title: p.title, duration: p.duration, fromPrice: p.fromPrice });
    byDestination.set(p.destinationSlug, list);
  }

  const data: BudgetDestination[] = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
    country: d.country,
    region: d.region,
    fromPrice: d.fromPrice,
    tags: d.tags,
    packages: (byDestination.get(d.slug) ?? []).sort((a, b) => a.fromPrice - b.fromPrice),
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
          <BudgetExplorer destinations={data} initialBudget={initialBudget} />
        </div>
      </section>
    </div>
  );
}
