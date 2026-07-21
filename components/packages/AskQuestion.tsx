"use client";

import { useState } from "react";
import Turnstile from "@/components/ui/Turnstile";
import { trackWhatsAppClick } from "@/lib/analytics";
import { whatsappLink } from "@/lib/contact";
import styles from "./AskQuestion.module.css";

// Soft, low-commitment "Ask a question" CTA — catches curious visitors who aren't
// ready for the full enquiry. Opens a 3-field mini-form (captured as an ASK_QUESTION
// lead) plus a WhatsApp shortcut for an instant answer.
export default function AskQuestion({ packageTitle }: { packageTitle?: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "", company: "" });
  const [captcha, setCaptcha] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const about = packageTitle ? ` about the ${packageTitle} package` : "";
  const waHref = whatsappLink(`Hi VMF Holidays! I have a question${about}: `);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.message,
          packageTitle,
          enquiryType: "question",
          company: form.company,
          turnstileToken: captcha,
        }),
      });
      const data = await res.json();
      setStatus(res.ok || data.whatsappFallback ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Ask a question
      </button>

      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className={styles.modal}>
            <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>

            {status === "success" ? (
              <div className={styles.success}>
                <div className={styles.tick}>✓</div>
                <h3 className={styles.title}>Question sent!</h3>
                <p className={styles.sub}>
                  Thanks{form.name ? `, ${form.name}` : ""} — our team will get back to you shortly.
                </p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn--lg"
                  onClick={() => trackWhatsAppClick({ location: "ask_question_success", item: packageTitle })}
                >
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <>
                <h3 className={styles.title}>Ask a question</h3>
                <p className={styles.sub}>
                  Not ready to enquire? Ask us anything{about} — no commitment, no pressure.
                </p>
                <form onSubmit={submit} className={styles.form}>
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
                  <input
                    className="form-input"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Your question…"
                    required
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                  <Turnstile onVerify={setCaptcha} />
                  {status === "error" && (
                    <p className={styles.err}>Couldn&apos;t send — please try WhatsApp below.</p>
                  )}
                  <button type="submit" className="btn btn-primary btn--lg" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send question"}
                  </button>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waLink}
                    onClick={() => trackWhatsAppClick({ location: "ask_question", item: packageTitle })}
                  >
                    or ask on WhatsApp →
                  </a>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
