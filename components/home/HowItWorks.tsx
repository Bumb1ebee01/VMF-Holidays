import SectionHeader from "@/components/ui/SectionHeader";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    number: "01",
    title: "Share Your Dream",
    desc: "Tell us where you want to go, when, and what experience you're looking for. WhatsApp, call or fill our form — we're easy to reach.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "We Plan It",
    desc: "Our experts craft a detailed itinerary with hotels, transfers, activities and a transparent cost breakdown — all reviewed until you're happy.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "You Explore",
    desc: "Sit back and enjoy your holiday. We handle everything end-to-end — and we're one WhatsApp away the entire time you're travelling.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10,8 16,12 10,16 10,8" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          eyebrow="The Process"
          title="How It Works"
          sub="Planning your perfect holiday takes just three simple steps."
          centered
        />
        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={step.number} className={styles.step}>
              {i < STEPS.length - 1 && <div className={styles.connector} />}
              <div className={styles.iconCircle}>{step.icon}</div>
              <span className={styles.stepNum}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
