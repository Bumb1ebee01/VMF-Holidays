import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, absoluteUrl } from "@/lib/seo";
import { VISA_CATEGORIES, VISA_REVIEWED } from "@/lib/data/visas";
import VisaChecker from "@/components/tools/VisaChecker";
import ToolCTA from "@/components/tools/ToolCTA";
import tool from "../tool.module.css";
import styles from "./visa.module.css";

const TITLE = "Visa & eVisa Checker for Indian Passport Holders";
const DESCRIPTION =
  "Free visa checker for Indian passport holders — see at a glance whether popular destinations are visa-free, visa on arrival, eVisa/eTA or need a visa, with the allowed stay and each country's official source. Verified against official government portals.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "visa checker for indians",
    "visa free countries for indian passport",
    "evisa for indians",
    "visa on arrival for indians",
    "indian passport visa requirements",
    "vmf holidays",
  ],
  alternates: { canonical: "/tools/visa-checker" },
  openGraph: {
    type: "website",
    url: "/tools/visa-checker",
    title: `${TITLE} | VMF Holidays`,
    description: DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | VMF Holidays`, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "Do Indian passport holders need a visa for these countries?",
    a: "It depends on the destination. Many are visa-free or offer a visa on arrival for Indian tourists (like Thailand, Malaysia, the Maldives and Mauritius), several need an eVisa or eTA you apply for online (like Vietnam, Sri Lanka and Georgia), and others need a visa arranged before you travel (like the UK, USA, Schengen Europe, Australia and Singapore). Use the checker above and always confirm on the official link.",
  },
  {
    q: "Is this visa information official and up to date?",
    a: `Every entry is compiled from the destination's own official government immigration or e-visa portal, which is linked on each card, and the tool was last reviewed in ${VISA_REVIEWED}. Visa rules change often, so we show you the official source to confirm the current rules before you book.`,
  },
  {
    q: "What's the difference between visa-free, visa on arrival and eVisa?",
    a: "Visa-free means you can enter without a visa (a free arrival card or travel authorisation may still be needed). Visa on arrival means you get the visa at the airport, often after pre-applying online. An eVisa or eTA is applied for online before you fly and approved by email — no embassy visit. Visa required means you must apply at the embassy or visa centre in advance.",
  },
  {
    q: "Can VMF Holidays help me with my visa?",
    a: "Yes. We offer visa assistance for the destinations we sell — helping with documentation, appointments and the paperwork so your application is smooth. Ask us on WhatsApp or through our contact form.",
  },
];

export default function VisaCheckerPage() {
  return (
    <div className={tool.page}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Travel Tools", path: "/tools" },
            { name: "Visa Checker", path: "/tools/visa-checker" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />

      <div className={tool.hero}>
        <div className="container">
          <nav className={tool.breadcrumb} aria-label="Breadcrumb">
            <Link href="/tools">Travel Tools</Link>
            <span aria-hidden="true">/</span>
            <span>Visa Checker</span>
          </nav>
          <span className={tool.badge}>100% Free · For Indian passports</span>
          <h1 className={tool.heroTitle}>Visa &amp; eVisa Checker</h1>
          <p className={tool.heroSub}>
            Planning a trip on an Indian passport? See at a glance whether a destination is visa-free, visa on
            arrival, eVisa/eTA or needs a visa — with the allowed stay and a link to each country&apos;s official
            source. Verified against official government portals.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={tool.body}>
          <VisaChecker />

          <div className={styles.legend}>
            {VISA_CATEGORIES.map((c) => (
              <div key={c.key} className={styles.legendItem}>
                <span className={styles.legendDot} data-cat={c.key} aria-hidden="true" />
                <span><strong>{c.label}</strong> — {c.meaning}</span>
              </div>
            ))}
          </div>

          <section className={styles.disclaimer} aria-label="Important disclaimer">
            <h2 className={styles.disclaimerTitle}>Important — please read</h2>
            <p>
              This checker is a <strong>free, at-a-glance guide only</strong>. The details are compiled from each
              destination&apos;s <strong>official government sources</strong> (linked on every card) and were last
              reviewed in <strong>{VISA_REVIEWED}</strong>.
            </p>
            <p>
              <strong>We are not visa experts or a visa agency, and this is not legal or immigration advice.</strong>{" "}
              <strong>Visa rules change every day, often at short notice.</strong> Always confirm the exact current
              requirements on the <strong>official link for each country and with that country&apos;s embassy or
              consulate</strong> before you book flights or travel. VMF Holidays accepts no liability for any decision
              made on the basis of this tool — <strong>please consult an actual visa specialist</strong> for your
              specific case.
            </p>
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
            title="Need a hand with your visa?"
            sub="VMF Holidays offers visa assistance for the destinations we sell — documentation, appointments and the paperwork, handled, so your application goes through smoothly."
            whatsappText="Hi VMF Holidays! I'd like some help with a visa for my trip — can you assist?"
            ctaLabel="Get visa help"
            secondaryHref="/contact?service=Visa%20Assistance"
            secondaryLabel="Visa assistance"
          />
        </div>
      </div>
    </div>
  );
}
