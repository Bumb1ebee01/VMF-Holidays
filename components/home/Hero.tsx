"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

const PILLS = [
  { label: "Honeymoon", href: "/honeymoon" },
  { label: "Family", href: "/family" },
  { label: "Adventure", href: "/adventure" },
  { label: "Corporate", href: "/corporate" },
];

const MARQUEE_ITEMS = [
  "500+ Happy Travellers",
  "Transparent Pricing",
  "24/7 Support",
  "Personalised Itineraries",
  "Goa's Most Trusted",
  "8+ Years of Excellence",
  "50+ Destinations",
  "100% Satisfaction",
];

export default function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBgLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (travelers) params.set("travelers", travelers);
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={`${styles.heroBg} ${bgLoaded ? styles.heroBgLoaded : ""}`} />
        <div className={styles.heroOverlay} />

        <div className={`container ${styles.content}`}>
          <div className={`${styles.overline} reveal`}>
            <span className={styles.overlineRule} />
            Goa&apos;s Most Trusted Travel Company
            <span className={styles.overlineRule} />
          </div>

          <h1 className={`${styles.headline} reveal reveal-d1`}>
            Discover Your World,<br /><em>Your Way</em>
          </h1>

          <p className={`${styles.sub} reveal reveal-d2`}>
            Expertly crafted domestic &amp; international holidays from Goa.
            Transparent pricing, full itineraries, personal service.
          </p>

          <form className={`${styles.searchBar} reveal reveal-d3`} onSubmit={handleSearch}>
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
            <button type="submit" className={styles.searchBtn}>
              Search
            </button>
          </form>

          <div className={`${styles.pills} reveal reveal-d4`}>
            {PILLS.map((p) => (
              <Link key={p.href} href={p.href} className={styles.pill}>
                {p.label}
              </Link>
            ))}
          </div>

          <div className={`${styles.ctas} reveal reveal-d5`}>
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
        </div>

        <div className={styles.scrollIndicator}>
          <span className={styles.scrollLabel}>Scroll</span>
          <div className={styles.scrollLine} />
        </div>

        <div className={styles.heroFolio}>
          <span>Est. 2016</span>
          <span className={styles.folioRule} />
          <span>Nagoa · Bardez · Goa</span>
        </div>
      </section>

      <div className={styles.marqueeStrip}>
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className={styles.marqueeItem}>
              <span>✦</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
