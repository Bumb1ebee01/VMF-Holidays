"use client";

import { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import styles from "./TripWizard.module.css";

const DESTINATIONS = ["Kerala","Rajasthan","Goa","Manali","Maldives","Dubai","Thailand","Bali","Other"];
const INTERESTS = ["Beach & Relaxation","Culture & Heritage","Adventure & Trekking","Wildlife","Food & Cuisine","Honeymoon / Romance","Family Fun","Pilgrimage","Shopping"];
const BUDGETS = ["Under ₹15,000 pp","₹15,000 – ₹30,000 pp","₹30,000 – ₹60,000 pp","₹60,000+ pp","Flexible"];

type Step = "destination" | "dates" | "travelers" | "budget" | "interests" | "contact";
const STEPS: Step[] = ["destination","dates","travelers","budget","interests","contact"];
const STEP_LABELS = ["Destination","Dates","Travelers","Budget","Interests","Contact"];

export default function TripWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    destination: "",
    customDestination: "",
    checkIn: "",
    checkOut: "",
    travelers: "2",
    budget: "",
    interests: [] as string[],
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");

  function set(field: string, value: string) {
    setData((d) => ({ ...d, [field]: value }));
  }

  function toggleInterest(val: string) {
    setData((d) => ({
      ...d,
      interests: d.interests.includes(val)
        ? d.interests.filter((i) => i !== val)
        : [...d.interests, val],
    }));
  }

  function canNext(): boolean {
    const s = STEPS[step];
    if (s === "destination") return !!data.destination;
    if (s === "dates") return !!data.checkIn;
    if (s === "travelers") return !!data.travelers;
    if (s === "budget") return !!data.budget;
    if (s === "interests") return data.interests.length > 0;
    if (s === "contact") return !!(data.name && data.phone && data.email);
    return true;
  }

  async function handleSubmit() {
    setStatus("sending");
    const dest = data.destination === "Other" ? data.customDestination : data.destination;
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      destination: dest,
      dates: data.checkIn + (data.checkOut ? ` – ${data.checkOut}` : ""),
      travelers: data.travelers,
      budget: data.budget,
      interests: data.interests,
      message: data.message,
    };
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setStatus("success"); return; }
    } catch {}
    setStatus("error");
  }

  const dest = data.destination === "Other" ? data.customDestination : data.destination;
  const waLink = buildWhatsAppLink({
    name: data.name || "Traveller",
    phone: data.phone || "—",
    email: data.email || "—",
    destination: dest,
    dates: data.checkIn + (data.checkOut ? ` – ${data.checkOut}` : ""),
    travelers: data.travelers,
    budget: data.budget,
    interests: data.interests,
    message: data.message,
  });

  if (status === "success") {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h2>Your Trip Request is In!</h2>
        <p>Thanks, {data.name}! We&apos;ll send a personalised itinerary to {data.email} within 24 hours.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn--lg">
          Also Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={styles.wizard}>
      {/* Progress */}
      <div className={styles.progress}>
        {STEPS.map((s, i) => (
          <div key={s} className={`${styles.progressStep} ${i <= step ? styles.progressActive : ""}`}>
            <div className={styles.progressDot}>{i < step ? "✓" : i + 1}</div>
            <span className={styles.progressLabel}>{STEP_LABELS[i]}</span>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        {/* Step: Destination */}
        {STEPS[step] === "destination" && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Where do you want to go?</h2>
            <div className={styles.chipGrid}>
              {DESTINATIONS.map((d) => (
                <button
                  key={d}
                  className={`${styles.chip} ${data.destination === d ? styles.chipActive : ""}`}
                  onClick={() => set("destination", d)}
                >
                  {d}
                </button>
              ))}
            </div>
            {data.destination === "Other" && (
              <input
                className="form-input"
                placeholder="Tell us your dream destination"
                value={data.customDestination}
                onChange={(e) => set("customDestination", e.target.value)}
                style={{ marginTop: "16px" }}
              />
            )}
          </div>
        )}

        {/* Step: Dates */}
        {STEPS[step] === "dates" && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>When are you planning to travel?</h2>
            <div className={styles.dateRow}>
              <div className="form-group">
                <label className="form-label">Check-in Date *</label>
                <input className="form-input" type="date" value={data.checkIn} onChange={(e) => set("checkIn", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out Date</label>
                <input className="form-input" type="date" value={data.checkOut} onChange={(e) => set("checkOut", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step: Travelers */}
        {STEPS[step] === "travelers" && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>How many travelers?</h2>
            <div className={styles.chipGrid}>
              {["1","2","3","4","5","6","7","8","9","10","10+"].map((n) => (
                <button
                  key={n}
                  className={`${styles.chip} ${data.travelers === n ? styles.chipActive : ""}`}
                  onClick={() => set("travelers", n)}
                >
                  {n} {parseInt(n) === 1 ? "Person" : "People"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Budget */}
        {STEPS[step] === "budget" && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>What&apos;s your budget per person?</h2>
            <div className={styles.chipGrid}>
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  className={`${styles.chip} ${data.budget === b ? styles.chipActive : ""}`}
                  onClick={() => set("budget", b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Interests */}
        {STEPS[step] === "interests" && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>What are you interested in?</h2>
            <p className={styles.stepSub}>Select all that apply</p>
            <div className={styles.chipGrid}>
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  className={`${styles.chip} ${data.interests.includes(interest) ? styles.chipActive : ""}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Contact */}
        {STEPS[step] === "contact" && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Almost there — how do we reach you?</h2>
            <div className={styles.contactForm}>
              <div className={styles.dateRow}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" type="text" placeholder="Your name" value={data.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={data.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Anything else?</label>
                <textarea className="form-textarea" rows={3} placeholder="Special requests, preferences…" value={data.message} onChange={(e) => set("message", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.nav}>
          {step > 0 && (
            <button className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
            >
              Continue →
            </button>
          ) : (
            <div className={styles.submitRow}>
              {status === "error" && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className={`btn ${styles.waBtn}`}>
                  Send via WhatsApp instead
                </a>
              )}
              <button
                className="btn btn-primary btn--lg"
                onClick={handleSubmit}
                disabled={!canNext() || status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Submit & Get My Itinerary"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
