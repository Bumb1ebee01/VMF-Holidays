import type { Package } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import styles from "./PackageFaq.module.css";

// Sensible default FAQs that apply to any package, lightly personalised with the
// trip's own details. The team can refine the copy later (per Edwin's note that
// the answers will be filled in) — until then these are accurate for VMF.
export function packageFaqs(pkg: Package): { q: string; a: string }[] {
  return [
    {
      q: `How do I book the ${pkg.title} package?`,
      a: `Send us an enquiry through the form on this page or on WhatsApp. We'll confirm availability for your dates, share a detailed quote, and once you're happy a small deposit secures your booking.`,
    },
    {
      q: "Can this itinerary be customised?",
      a: `Absolutely. Every VMF Holidays trip is tailor-made — we can adjust the number of nights, swap hotels, add or remove cities and experiences in ${pkg.destination}, and match the plan to your budget.`,
    },
    {
      q: "What does the price include?",
      a: `Prices start from ${formatINR(pkg.fromPrice)} per person and cover the inclusions listed above. Anything in the "Not Included" list — such as flights, personal expenses and optional activities — is extra. We'll give you a fully itemised quote with no hidden costs.`,
    },
    {
      q: "Are flights included?",
      a: `This is a land package, so international/domestic flights are usually quoted separately. Just tell us your departure city and we'll add the best-value flights to your itinerary.`,
    },
    {
      q: "What is the payment and cancellation policy?",
      a: `A deposit confirms your trip, with the balance due before departure. Cancellation terms depend on the hotels and services booked; we'll set everything out clearly in writing before you pay. See our Terms & Conditions for full details.`,
    },
    {
      q: "Is this trip suitable for families and honeymooners?",
      a: `Yes — this ${pkg.duration} itinerary can be shaped for couples, families with children, or groups. Let us know who's travelling and we'll fine-tune the hotels and pace to suit.`,
    },
  ];
}

export default function PackageFaq({ pkg }: { pkg: Package }) {
  const faqs = packageFaqs(pkg);
  return (
    <section>
      <JsonLd data={faqJsonLd(faqs)} />
      <h2 className={styles.title}>Frequently Asked Questions</h2>
      <div className={styles.list}>
        {faqs.map((f, i) => (
          <details key={i} className={styles.item} name="package-faq">
            <summary className={styles.question}>
              <span>{f.q}</span>
              <svg className={styles.chevron} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <p className={styles.answer}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
