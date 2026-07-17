"use client";

import { useState, useId } from "react";
import { trackLead } from "@/lib/analytics";
import Turnstile from "@/components/ui/Turnstile";
import styles from "./CTABanner.module.css";

const DESTINATIONS = [
  "Goa", "Kerala", "Rajasthan", "Ladakh", "Andaman",
  "Maldives", "Dubai", "Thailand", "Singapore", "Bali", "Europe",
];

export default function CTABanner() {
  const [form, setForm] = useState({ name: "", phone: "", destination: "", message: "", company: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [captcha, setCaptcha] = useState("");
  const uid = useId();

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
        body: JSON.stringify({ ...form, email: "", turnstileToken: captcha }),
      });
      if (res.ok) {
        setStatus("sent");
        trackLead({ source: "cta_banner", destination: form.destination || undefined });
      } else setStatus("error");
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
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.company}
                  onChange={handleChange}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor={`${uid}-name`}>Your Name</label>
                    <input
                      id={`${uid}-name`}
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
                    <label className={styles.label} htmlFor={`${uid}-phone`}>Phone Number</label>
                    <input
                      id={`${uid}-phone`}
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
                  <label className={styles.label} htmlFor={`${uid}-destination`}>Where Do You Want to Go?</label>
                  <select
                    id={`${uid}-destination`}
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
                  <label className={styles.label} htmlFor={`${uid}-message`}>Tell Us More (Optional)</label>
                  <textarea
                    id={`${uid}-message`}
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

                <Turnstile onVerify={setCaptcha} />
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
                "Full Itinerary Shared Before You Pay",
                "Custom Domestic & International Trips",
                "Real People on WhatsApp, Not Bots",
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
