import styles from "./AfterEnquiry.module.css";

// An honest "what happens next" strip — sets expectations after an enquiry without
// over-promising. The 24-hour callback matches the promise already in our enquiry
// confirmation emails.
const STEPS = [
  { n: 1, title: "You enquire", body: "Send the form, WhatsApp us or call — just tell us where you'd like to go and roughly when." },
  { n: 2, title: "We plan it", body: "A real travel expert reviews your request and researches the best options for your dates, group and budget." },
  { n: 3, title: "We call you back", body: "Within 24 hours, with a tailored itinerary and a transparent, no-obligation quote." },
  { n: 4, title: "You travel, your way", body: "Happy with the plan? We handle hotels, flights, transfers and on-trip support. No online payment — you pay us directly." },
];

export default function AfterEnquiry() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">No pressure, no surprises</span>
          <h2 className={styles.title}>What happens after you enquire</h2>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.num}>{s.n}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
