"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Hero.module.css";

const DESTINATIONS = [
  { label: "Kerala", value: "kerala" },
  { label: "Rajasthan", value: "rajasthan" },
  { label: "Goa", value: "goa" },
  { label: "Manali", value: "manali" },
  { label: "Maldives", value: "maldives" },
  { label: "Dubai", value: "dubai" },
  { label: "Thailand", value: "thailand" },
  { label: "Bali", value: "bali" },
];

export default function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("2");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (travelers) params.set("travelers", travelers);
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>✦ Goa&apos;s Most Trusted Travel Company</p>
        <h1 className={styles.headline}>
          Discover Your World,<br />Your Way
        </h1>
        <p className={styles.sub}>
          Expertly crafted domestic &amp; international holidays from Goa.
          Transparent pricing, full itineraries, personal service.
        </p>

        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Where to?</label>
            <select
              className={styles.fieldInput}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Any Destination</option>
              {DESTINATIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.sep} />

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Travelers</label>
            <select
              className={styles.fieldInput}
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={String(n)}>
                  {n} {n === 1 ? "Traveler" : "Travelers"}
                </option>
              ))}
              <option value="10+">10+ Travelers</option>
            </select>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
            Search
          </button>
        </form>

        <div className={styles.ctas}>
          <Link href="/packages" className="btn btn-primary btn--lg">
            Explore Packages
          </Link>
          <a
            href="https://wa.me/917499322412"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-white btn--lg"
          >
            Talk to an Expert
          </a>
        </div>

        <div className={styles.badges}>
          <span>✦ 500+ Trips Planned</span>
          <span>✦ Transparent Pricing</span>
          <span>✦ 24/7 Support</span>
          <span>✦ Based in Goa</span>
        </div>
      </div>
    </section>
  );
}
