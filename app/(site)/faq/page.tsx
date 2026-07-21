import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./page.module.css";
import { whatsappLink } from "@/lib/contact";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I book a trip with VMF Holidays?",
    a: "Tell us where and when you'd like to travel — through the enquiry form, the Trip Builder, or WhatsApp. We send a personalised quote with a full cost breakdown. Once you approve it, we confirm your bookings and share the payment details. There's no online checkout — you pay us directly by bank transfer or UPI.",
  },
  {
    q: "Do you charge any booking or service fees?",
    a: "No hidden fees. Every quote is itemised so you can see exactly what you're paying for — no surprise markups and no pressure to commit.",
  },
  {
    q: "Are your packages fixed, or can I customise them?",
    a: "Everything is tailor-made. Use our Trip Builder or simply tell us your dates, budget and interests, and we build the itinerary around you.",
  },
  {
    q: "Do you handle both domestic and international trips?",
    a: "Yes — across India and worldwide, including the Maldives, Dubai, Thailand, Bali, Vietnam, Singapore and Georgia.",
  },
  {
    q: "Do you help with visas?",
    a: "Yes. We assist with visa guidance and documentation for destinations that require it, such as Dubai, Thailand and Vietnam.",
  },
  {
    q: "How quickly will you respond to my enquiry?",
    a: "Within 24 hours, and usually much sooner. Messaging us on WhatsApp is the fastest way to reach our team.",
  },
  {
    q: "How do payments work?",
    a: "After you approve your quote, you pay us directly (bank transfer or UPI) — typically a deposit to confirm your trip and the balance before you travel. The exact schedule is set out in your quote.",
  },
  {
    q: "What is the VMF Travellers Club?",
    a: "It's our free referral program. Refer friends and you both earn VMF travel credit that's redeemable against future bookings. You can join free from the Travellers Club page.",
  },
  {
    q: "What is your cancellation policy?",
    a: "It depends on the hotels, airlines and suppliers in your package. We explain the cancellation terms clearly in your quote before you confirm anything.",
  },
  {
    q: "Where are you based?",
    a: "Our head office is in Nagoa, Bardez, Goa, with a branch in Mangalore. We plan trips for travellers across India and beyond.",
  },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "How booking with VMF Holidays works — customised packages, transparent pricing, payments, visas, response times and the Travellers Club.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className={styles.page}>
      <JsonLd
        data={[
          faqJsonLd(FAQS),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQs", path: "/faq" },
          ]),
        ]}
      />
      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Help Centre</span>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.sub}>
            Everything you need to know about planning and booking with VMF Holidays.
          </p>
        </div>
      </div>

      <section className="section">
        <div className={`container ${styles.list}`}>
          {FAQS.map((f) => (
            <details key={f.q} className={styles.item}>
              <summary className={styles.q}>{f.q}</summary>
              <p className={styles.a}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.ctaWrap}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Still have a question?</h2>
          <p className={styles.ctaSub}>Our team replies within 24 hours — usually much sooner.</p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className="btn btn-primary btn--lg">Contact us</Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn--lg"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
