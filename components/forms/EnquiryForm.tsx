"use client";

import { useState, useId } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackLead, trackWhatsAppClick } from "@/lib/analytics";
import Turnstile from "@/components/ui/Turnstile";
import styles from "./EnquiryForm.module.css";

interface Props {
  packageTitle?: string;
}

export default function EnquiryForm({ packageTitle }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    destination: packageTitle || "",
    timeframe: "",
    dates: "",
    travelers: "2",
    message: "",
    company: "", // honeypot — must stay empty
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [waLink, setWaLink] = useState("");
  const [captcha, setCaptcha] = useState("");
  const uid = useId();

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      destination: form.destination,
      timeframe: form.timeframe,
      dates: form.dates,
      travelers: form.travelers,
      message: form.message,
      packageTitle: packageTitle,
      company: form.company,
      turnstileToken: captcha,
    };

    const wa = buildWhatsAppLink(payload);
    setWaLink(wa);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok || data.whatsappFallback) {
        setStatus("success");
        trackLead({ source: packageTitle ? "package_page" : "contact_form", item: packageTitle });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h3>Enquiry Received!</h3>
        <p>Thanks, {form.name}! Our team will get back to you within a few hours.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className={`btn btn-primary`} onClick={() => trackWhatsAppClick({ location: "enquiry_form_success" })}>
          Also Message Us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.company}
        onChange={(e) => set("company", e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label" htmlFor={`${uid}-name`}>Full Name *</label>
          <input
            id={`${uid}-name`}
            className="form-input"
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${uid}-phone`}>Phone *</label>
          <input
            id={`${uid}-phone`}
            className="form-input"
            type="tel"
            required
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${uid}-email`}>Email *</label>
        <input
          id={`${uid}-email`}
          className="form-input"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label" htmlFor={`${uid}-dest`}>Destination / Package</label>
          <input
            id={`${uid}-dest`}
            className="form-input"
            type="text"
            placeholder="Where do you want to go?"
            value={form.destination}
            onChange={(e) => set("destination", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${uid}-trav`}>Travelers</label>
          <select
            id={`${uid}-trav`}
            className="form-select"
            value={form.travelers}
            onChange={(e) => set("travelers", e.target.value)}
          >
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <option key={n} value={String(n)}>{n} {n === 1 ? "Traveler" : "Travelers"}</option>
            ))}
            <option value="10+">10+ Travelers</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label" htmlFor={`${uid}-when`}>When are you travelling?</label>
          <select
            id={`${uid}-when`}
            className="form-select"
            value={form.timeframe}
            onChange={(e) => set("timeframe", e.target.value)}
          >
            <option value="">Select…</option>
            <option value="Within 2 weeks">Within 2 weeks</option>
            <option value="This month">This month</option>
            <option value="In 1–3 months">In 1–3 months</option>
            <option value="Later / flexible">Later / flexible</option>
            <option value="Just exploring">Just exploring</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${uid}-dates`}>Preferred Travel Dates</label>
          <input
            id={`${uid}-dates`}
            className="form-input"
            type="text"
            placeholder="e.g. 15 Dec – 22 Dec 2025"
            value={form.dates}
            onChange={(e) => set("dates", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${uid}-msg`}>Message</label>
        <textarea
          id={`${uid}-msg`}
          className="form-textarea"
          rows={4}
          placeholder="Tell us about your travel plans, special requests, budget, etc."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      {status === "error" && (
        <div className={styles.errorBanner}>
          Couldn&apos;t send — please try WhatsApp below or email us at info@vmfholidays.com
        </div>
      )}

      <Turnstile onVerify={setCaptcha} />

      <button
        type="submit"
        className={`btn btn-primary btn--lg ${styles.submitBtn}`}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Enquiry"}
      </button>

      <p className={styles.orText}>or</p>

      <a
        href={buildWhatsAppLink({
          name: form.name || "Traveller",
          phone: form.phone || "—",
          email: form.email || "—",
          destination: form.destination,
          dates: form.dates,
          travelers: form.travelers,
          message: form.message,
          packageTitle,
        })}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn--lg ${styles.waBtn}`}
        onClick={() => trackWhatsAppClick({ location: "enquiry_form" })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp Us Directly
      </a>
    </form>
  );
}
