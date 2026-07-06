import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, absoluteUrl } from "@/lib/seo";
import { getFxRates } from "@/lib/fx";
import { CURRENCIES } from "@/lib/data/currencies";
import CurrencyConverter from "@/components/tools/CurrencyConverter";
import ToolCTA from "@/components/tools/ToolCTA";
import tool from "../tool.module.css";
import styles from "./fx.module.css";

// Refresh the page (and cached rates) hourly.
export const revalidate = 3600;

const TITLE = "Currency Converter for Indian Travellers";
const DESCRIPTION =
  "Free currency converter for Indian travellers — convert Indian Rupees (INR) to US Dollars, Dirhams, Baht, Euros and 25+ destination currencies at live reference rates. No sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "currency converter",
    "inr to usd",
    "inr to aed",
    "indian rupee converter",
    "travel currency converter",
    "vmf holidays",
  ],
  alternates: { canonical: "/tools/currency-converter" },
  openGraph: {
    type: "website",
    url: "/tools/currency-converter",
    title: `${TITLE} | VMF Holidays`,
    description: DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | VMF Holidays`, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "How current are these exchange rates?",
    a: "They're live mid-market reference rates, refreshed about once an hour. The tool always shows when the rates were last updated. If the live source is briefly unavailable it falls back to a recent snapshot and tells you so.",
  },
  {
    q: "Will I get this exact rate when I travel?",
    a: "No — treat it as a guide. The rate you actually get from your bank, forex card, or a money-changer will be a little worse because they add their own margin and fees. It's great for budgeting, not for the exact amount.",
  },
  {
    q: "Which currencies can I convert?",
    a: `You can convert between the Indian Rupee and ${CURRENCIES.length - 1}+ popular destination and world currencies — US Dollar, Dirham, Baht, Singapore Dollar, Euro, Pound and more.`,
  },
  {
    q: "Is it free? Do I need to sign up?",
    a: "It's completely free and runs in your browser — no account, no app.",
  },
];

export default async function CurrencyConverterPage() {
  const fx = await getFxRates();

  return (
    <div className={tool.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Travel Tools", path: "/tools" },
            { name: "Currency Converter", path: "/tools/currency-converter" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />

      <div className={tool.hero}>
        <div className="container">
          <nav className={tool.breadcrumb} aria-label="Breadcrumb">
            <Link href="/tools">Travel Tools</Link>
            <span aria-hidden="true">/</span>
            <span>Currency Converter</span>
          </nav>
          <span className={tool.badge}>100% Free · Live rates</span>
          <h1 className={tool.heroTitle}>Currency Converter</h1>
          <p className={tool.heroSub}>
            Planning your travel budget? Convert Indian Rupees to your destination&apos;s currency — and back — at
            live reference rates, updated hourly. Handy for costing hotels, activities and shopping before you go.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={tool.body}>
          <CurrencyConverter fx={fx} />

          <p className={styles.disclaimer}>
            <strong>Indicative rates only.</strong> These are mid-market reference rates sourced from{" "}
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">exchangerate-api.com</a>{" "}
            and updated about hourly — <strong>not the exact rate you&apos;ll get</strong>. Banks, forex cards and
            money-changers apply their own margins and fees, so use this as a budgeting guide, not financial advice.
          </p>

          <section className={tool.prose}>
            <h2>How to use it</h2>
            <ol>
              <li>Type an amount and pick the two currencies (it defaults to ₹ → US Dollar).</li>
              <li>See the converted amount and the exact rate, both ways.</li>
              <li>Tap a “Popular from ₹” chip to jump straight to a common destination currency, or swap with the ⇄ button.</li>
            </ol>
          </section>

          <section className={tool.faq}>
            <h2 className={tool.faqTitle}>Common questions</h2>
            {FAQS.map((f) => (
              <details key={f.q} className={tool.faqItem}>
                <summary className={tool.faqQ}>{f.q}</summary>
                <p className={tool.faqA}>{f.a}</p>
              </details>
            ))}
          </section>

          <ToolCTA
            title="Turning that budget into a trip?"
            sub="VMF Holidays plans your holiday with transparent pricing in rupees — clear inclusions, no hidden costs or foreign-exchange surprises."
            whatsappText="Hi VMF Holidays! I'm planning a trip and would like a quote with clear pricing."
            ctaLabel="Get a quote"
            secondaryHref="/destinations"
            secondaryLabel="Explore destinations"
          />
        </div>
      </div>
    </div>
  );
}
