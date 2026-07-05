import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, absoluteUrl } from "@/lib/seo";
import ExpenseSplitter from "@/components/tools/ExpenseSplitter";
import ToolCTA from "@/components/tools/ToolCTA";
import styles from "../tool.module.css";

const TITLE = "Group Trip Expense Splitter";
const DESCRIPTION =
  "Free group trip expense splitter — track who paid for what, split costs fairly, and see exactly who owes whom, settled in the fewest payments. No sign-up. Share the settlement on WhatsApp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/group-expense-splitter" },
  openGraph: {
    type: "website",
    url: "/tools/group-expense-splitter",
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

const FAQS = [
  {
    q: "How does the group expense splitter work?",
    a: "Add everyone on your trip, then log expenses under categories like Stay, Food and Transport — each with who paid and who it's split between. The tool tracks the running total and works out the simplest set of payments to settle everyone up, in the fewest transfers.",
  },
  {
    q: "Can I organise expenses into categories?",
    a: "Yes. It comes with ready-made categories — Stay, Food & Drink, Transport, Activities, Shopping and Other — that you can rename, and you can add your own. Each category shows its own subtotal, and you can add as many items as you like inside it.",
  },
  {
    q: "Can I download a summary?",
    a: "Yes — once you've added your expenses, download a clean, VMF-branded PDF report with the full itemised breakdown by category, who paid what, and the final settlement. Perfect for sharing with the group or keeping for your records.",
  },
  {
    q: "Do I need to sign up or download an app?",
    a: "No. It's completely free and runs in your browser with no account. Your trip is saved on your own device so you can come back to it later, and nothing is sent to us.",
  },
  {
    q: "Does everyone have to split every expense equally?",
    a: "No. For each item you choose exactly who it's split between — so a dinner three of you shared is only divided by those three, not the whole group.",
  },
  {
    q: "Can I use it for an international trip?",
    a: "Yes — pick your currency at the top (₹, $, €, £, ฿ and more). Keep one trip in one currency; for converting between currencies, use our Currency Converter tool.",
  },
];

export default function GroupExpenseSplitterPage() {
  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Travel Tools", path: "/tools" },
            { name: TITLE, path: "/tools/group-expense-splitter" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />

      <div className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/tools">Travel Tools</Link>
            <span aria-hidden="true">/</span>
            <span>Expense Splitter</span>
          </nav>
          <span className={styles.badge}>100% Free · No sign-up</span>
          <h1 className={styles.heroTitle}>Group Trip Expense Splitter</h1>
          <p className={styles.heroSub}>
            Travelling in a group? Organise expenses by category, split costs fairly, and see exactly
            who owes whom — settled in the fewest payments. Then download a branded PDF report or
            share it on WhatsApp.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.body}>
          <ExpenseSplitter />

          <section className={styles.prose}>
            <h2>How it works</h2>
            <ol>
              <li>Add everyone travelling together.</li>
              <li>Add expenses under categories — Stay, Food, Transport and more, with who paid and who shares each item.</li>
              <li>See the running total, each person&apos;s balance, and the simplest way to settle up.</li>
              <li>Download a VMF-branded PDF report, or share the settlement on WhatsApp.</li>
            </ol>
          </section>

          <section className={styles.faq}>
            <h2 className={styles.faqTitle}>Common questions</h2>
            {FAQS.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{f.q}</summary>
                <p className={styles.faqA}>{f.a}</p>
              </details>
            ))}
          </section>

          <ToolCTA
            title="Planning the trip you're splitting?"
            sub="Let VMF Holidays handle the bookings — group-friendly packages, transparent pricing, one point of contact for the whole crew."
            whatsappText="Hi VMF Holidays! We're planning a group trip and would like some package options and a quote."
            ctaLabel="Get a group quote"
          />
        </div>
      </div>
    </div>
  );
}
