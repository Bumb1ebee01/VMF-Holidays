import Link from "next/link";
import { creditsToRupees, REFERRAL_REWARD, WELCOME_BONUS, JOIN_BONUS } from "@/lib/referral";
import styles from "./ClubStrip.module.css";

// Homepage Travellers Club strip (WI-11) + 3-step explainer (WI-17e). Community
// and refer-&-earn led — no discount-% or FOMO language (brand rule).
const STEPS = [
  { n: "1", t: "Join free", d: `Create your account and start with ${creditsToRupees(JOIN_BONUS)} credit.` },
  { n: "2", t: "Share your link", d: "Send it to friends who love to travel." },
  { n: "3", t: "Earn when they travel", d: `You get ${creditsToRupees(REFERRAL_REWARD)}, they get ${creditsToRupees(WELCOME_BONUS)} off.` },
];

export default function ClubStrip() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>VMF Holidays Travellers Club</span>
          <h2 className={styles.title}>A community of travellers where your rewards compound into your next trip.</h2>
          <p className={styles.body}>
            Join free, share your link, and earn {creditsToRupees(REFERRAL_REWARD)} in VMF travel credit each time a
            friend completes their first trip — they get {creditsToRupees(WELCOME_BONUS)} off theirs. Plus a
            members-only WhatsApp community for early access and trip inspiration.
          </p>
          <Link href="/travellers-club" className={styles.cta}>Join the Club →</Link>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.stepNum}>{s.n}</span>
              <div className={styles.stepText}>
                <strong>{s.t}</strong>
                <span>{s.d}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
