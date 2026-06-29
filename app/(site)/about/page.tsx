import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description: "VMF Holidays Pvt. Ltd. — Goa's trusted travel company. Our story, mission and why 200+ families choose us.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "200+", label: "Trips Planned" },
  { value: "24/7", label: "Support" },
  { value: "20+", label: "Destinations" },
  { value: "98%", label: "Happy Clients" },
];

const VALUES = [
  {
    title: "Transparency First",
    desc: "Every quote includes a full cost breakdown. No hidden fees, no last-minute surprises.",
  },
  {
    title: "Personal Touch",
    desc: "Your trip is never a template. We listen, plan and refine until it matches your dream exactly.",
  },
  {
    title: "Local Expertise",
    desc: "Based in Goa, we combine national reach with local knowledge — the best of both worlds.",
  },
  {
    title: "Always Available",
    desc: "Before, during and after your trip — our team is reachable round the clock on WhatsApp.",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Our Story</span>
          <h1 className={styles.heroTitle}>We Are VMF Holidays</h1>
          <p className={styles.heroSub}>
            A Goa-based travel company built on one promise — making every journey as remarkable as the destination.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className={`container ${styles.story}`}>
          <div className={styles.storyText}>
            <span className="eyebrow">How We Started</span>
            <h2 className="section-title">Born from a Passion for Travel</h2>
            <div className="divider" />
            <p>
              VMF Holidays Pvt. Ltd. was founded with a simple frustration — too many travel agencies promised the world and delivered confusion, hidden costs and impersonal service.
            </p>
            <p>
              We set out to do it differently. Based in Nagoa, Bardez, Goa, we started by helping friends and family plan trips with full transparency and personal attention. Word spread, and today we&apos;ve helped over 200 families and couples experience extraordinary journeys — domestic and international.
            </p>
            <p>
              Every package we sell comes with a detailed itinerary, a transparent cost breakdown and a dedicated point of contact who stays with you from planning to return.
            </p>
          </div>
          <div className={styles.storyStats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className={styles.valuesHeader}>
            <span className="eyebrow">What We Stand For</span>
            <h2 className="section-title">Our Values</h2>
            <div className="divider" />
          </div>
          <div className="grid-4">
            {VALUES.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MICE highlight */}
      <section className={`section ${styles.miceSection}`}>
        <div className="container">
          <div className={styles.miceContent}>
            <div>
              <span className="eyebrow">Tailor-Made Travel</span>
              <h2 className={styles.miceTitle}>Specialists in Customised Trips</h2>
              <p className={styles.miceDesc}>
                We&apos;re not a one-size-fits-all agency — every itinerary is built around you. Whether it&apos;s a honeymoon, a family holiday, a college tour or a corporate offsite, we tailor the route, stays, transport and experiences to match exactly what you want, then stay with you from planning to return.
              </p>
              <Link href="/contact" className="btn btn-primary btn--lg">
                Plan a Custom Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to Plan Your Next Trip?</h2>
          <p className={styles.ctaSub}>Talk to our team — we&apos;ll make it happen.</p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className="btn btn-primary btn--lg">Get in Touch</Link>
            <a
              href="https://wa.me/917499322412"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn--lg"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
