"use client";

import { useState } from "react";
import styles from "./CTABanner.module.css";

const DESTINATIONS = [
  "Goa", "Kerala", "Rajasthan", "Ladakh", "Andaman",
  "Maldives", "Dubai", "Thailand", "Singapore", "Bali", "Europe",
];

export default function CTABanner() {
  const [form, setForm] = useState({ name: "", phone: "", destination: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: "" }),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`${styles.inner} reveal`}>

          {/* Form side */}
          <div className={styles.formSide}>
            <div className={styles.eyebrow}>Talk To Us</div>
            <h2 className={styles.title}>The Trip You Can Trust</h2>
            <p className={styles.sub}>
              We do the planning, so you can enjoy the experience. Tell us your dream — no fees, no pressure, no fake deals.
            </p>

            {status === "sent" ? (
              <div className={styles.successMsg}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <strong>Enquiry received!</strong>
                <p>We&apos;ll get back to you within 24 hours — usually much sooner.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className={styles.input}
                      placeholder="e.g. Rahul Gupta"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className={styles.input}
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Where Do You Want to Go?</label>
                  <select
                    name="destination"
                    className={styles.input}
                    value={form.destination}
                    onChange={handleChange}
                  >
                    <option value="">Select a destination</option>
                    {DESTINATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    <option value="Other">Other / Surprise Me</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tell Us More (Optional)</label>
                  <textarea
                    name="message"
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Budget, travel dates, number of travellers…"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                {status === "error" && (
                  <p className={styles.errorMsg}>Something went wrong. Please try WhatsApp instead.</p>
                )}

                <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  {status === "loading" ? "Sending…" : "Send Enquiry"}
                </button>
                <p className={styles.responseNote}>
                  We respond within 24 hours — usually much sooner.
                </p>
              </form>
            )}
          </div>

          {/* Image side */}
          <div className={styles.imgSide}>
            <div className={styles.imgOverlay} />
            <div className={styles.trustList}>
              {[
                "Transparent Pricing — No Hidden Charges",
                "Personal Travel Expert Assigned to You",
                "24 / 7 Support Before & During Your Trip",
                "200+ Happy Travellers & Counting",
              ].map((item) => (
                <div key={item} className={styles.trustItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
