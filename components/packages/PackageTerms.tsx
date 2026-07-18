import Link from "next/link";
import { getTerms, PRICE_NOTES, type TourRegion } from "@/lib/itinerary-terms";
import styles from "./PackageTerms.module.css";

/**
 * The same Terms & Conditions the traveller receives on their written
 * quotation, shown on the package page so nothing in the booking is a surprise.
 * The domestic / international set is chosen from the destination's region.
 */
export default function PackageTerms({ region }: { region: TourRegion }) {
  const { sections } = getTerms(region);
  const label = region === "international" ? "international" : "domestic";

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Terms &amp; Conditions</h2>
      <p className={styles.intro}>
        These are the terms for this {label} tour — the same ones printed on your written
        quotation. Please read them before you book.
      </p>

      <ul className={styles.notes}>
        {PRICE_NOTES.map((n) => (
          <li key={n} className={styles.note}>{n}</li>
        ))}
      </ul>

      <div className={styles.list}>
        {sections.map((s, i) => (
          <details key={s.heading} className={styles.item}>
            <summary className={styles.summary}>
              <span className={styles.num}>{i + 1}</span>
              <span className={styles.heading}>{s.heading}</span>
              <span className={styles.chevron} aria-hidden="true" />
            </summary>
            <ul className={styles.points}>
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <p className={styles.footNote}>
        See our full <Link href="/terms">website terms &amp; conditions</Link> for general
        booking conditions.
      </p>
    </section>
  );
}
