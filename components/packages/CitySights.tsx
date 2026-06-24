import { sightsForDestination } from "@/lib/data/sights";
import styles from "./CitySights.module.css";

export default function CitySights({ destinationSlug }: { destinationSlug: string }) {
  const cities = sightsForDestination(destinationSlug);
  if (cities.length === 0) return null;

  return (
    <section>
      <h2 className={styles.title}>Sightseeing, City by City</h2>
      <p className={styles.intro}>
        A taste of what you can explore in each stop. We&apos;ll tailor the final mix to your pace and interests.
      </p>
      <div className={styles.grid}>
        {cities.map((c) => (
          <div key={c.city} className={styles.card}>
            <div className={styles.cityHead}>
              <span className={styles.pin} aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <h3 className={styles.cityName}>{c.city}</h3>
              <span className={styles.count}>{c.sights.length}</span>
            </div>
            <ul className={styles.sightList}>
              {c.sights.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
