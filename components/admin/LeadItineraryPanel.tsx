"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import shared from "./shared.module.css";
import styles from "./LeadItineraryPanel.module.css";
import { ItineraryEditor, type ItineraryDayInput } from "./fields";

interface PkgOption {
  slug: string;
  title: string;
  destination: string;
  nights: number;
  days: ItineraryDayInput[];
}

/**
 * Staff one-stop on the lead: search the packages, personalise one for this
 * customer (name / dates / pax, an editable day-by-day, and a notes block), then
 * share the branded PDF over WhatsApp or email. Every generate is logged against
 * the lead so the timeline shows how many itineraries we've prepared for them.
 * Delivery is deep-link + attach — no BSP or mail pipeline required.
 */
export default function LeadItineraryPanel({
  leadId,
  customerName,
  customerPhone,
  customerEmail,
  defaultDates,
  defaultQuery,
  packages,
}: {
  leadId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  defaultDates: string;
  defaultQuery: string;
  packages: PkgOption[];
}) {
  const router = useRouter();
  const firstName = customerName.trim().split(/\s+/)[0] || customerName;
  const phoneDigits = customerPhone.replace(/\D/g, "").slice(-10);
  const waNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : null;
  const email = customerEmail?.trim() || null;

  const [query, setQuery] = useState(defaultQuery);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = packages.find((p) => p.slug === selectedSlug) ?? null;

  const [custName, setCustName] = useState(customerName);
  const [dates, setDates] = useState(defaultDates);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [days, setDays] = useState<ItineraryDayInput[]>([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState<null | "download" | "whatsapp" | "email">(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return packages;
    return packages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q)
    );
  }, [query, packages]);

  function choose(p: PkgOption) {
    setSelectedSlug(p.slug);
    setDays(p.days.length ? p.days.map((d) => ({ ...d })) : [{ title: "", description: "" }]);
    setError(null);
  }

  const message = selected
    ? [
        `Hi ${firstName},`,
        ``,
        `Thank you for your interest in *${selected.title}* with VMF Holidays. I've prepared the itinerary for you — please find the PDF attached.`,
        ``,
        `Do share any changes you'd like and I'll tailor it for you.`,
        ``,
        `Warm regards,`,
        `Team VMF Holidays`,
        `Discover Your World Your Way`,
      ].join("\n")
    : "";

  async function generate(channel: "download" | "whatsapp" | "email"): Promise<boolean> {
    if (!selected) return false;
    setBusy(channel);
    setError(null);
    try {
      const res = await fetch(`/api/itinerary/${selected.slug}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, customerName: custName, dates, adults, children, infants, days, notes, channel }),
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(msg.error ?? `Failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vmf-${selected.slug}-itinerary.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      router.refresh(); // surface the new "itinerary shared" entry in the activity timeline
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return false;
    } finally {
      setBusy(null);
    }
  }

  // WhatsApp: open the deep link synchronously (within the click) so it isn't
  // popup-blocked, then generate + download the PDF for staff to attach.
  function shareWhatsApp() {
    if (!selected || !waNumber) return;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    void generate("whatsapp");
  }

  // Email: generate + download first, then open the mail client (mailto doesn't
  // navigate the page, so it's safe after the await).
  async function shareEmail() {
    if (!selected || !email) return;
    const ok = await generate("email");
    if (!ok) return;
    const subject = `Your ${selected.title} itinerary — VMF Holidays`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  const numField = (value: number, set: (n: number) => void, label: string, min: number) => (
    <label className="form-group" style={{ flex: 1 }}>
      <span className="form-label">{label}</span>
      <input
        type="number"
        min={min}
        step={1}
        className="form-input"
        value={value}
        onChange={(e) => set(Math.max(min, Number(e.target.value) || 0))}
      />
    </label>
  );

  return (
    <div>
      <h3 className={shared.cardTitle}>Send itinerary</h3>
      <p className={shared.cardSub}>
        Find a package, personalise it for {firstName}, and share the PDF — attach the downloaded file to the
        WhatsApp/email that opens.
      </p>

      {packages.length === 0 ? (
        <p className={shared.cardSub} style={{ marginTop: 12 }}>
          No packages yet — add one under Packages first.
        </p>
      ) : !selected ? (
        <div className={styles.wrap}>
          <input
            type="search"
            className="form-input"
            placeholder="Search packages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.list}>
            {filtered.length === 0 ? (
              <p className={styles.empty}>No packages match “{query}”.</p>
            ) : (
              filtered.map((p) => (
                <button key={p.slug} type="button" className={styles.item} onClick={() => choose(p)}>
                  <span className={styles.itemTitle}>{p.title}</span>
                  <span className={styles.itemSub}>
                    {p.destination}
                    {p.nights ? ` · ${p.nights}N` : ""}
                    {p.days.length ? ` · ${p.days.length} days` : ""}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className={styles.wrap}>
          <div className={styles.selectedBar}>
            <span className={styles.selectedTitle}>{selected.title}</span>
            <button type="button" className={styles.changeBtn} onClick={() => setSelectedSlug(null)}>
              Change
            </button>
          </div>

          <label className="form-group">
            <span className="form-label">Customer name</span>
            <input type="text" className="form-input" value={custName} onChange={(e) => setCustName(e.target.value)} />
          </label>

          <label className="form-group">
            <span className="form-label">Travel dates</span>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 12–17 Aug 2026"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </label>

          <div className={styles.paxRow}>
            {numField(adults, setAdults, "Adults", 1)}
            {numField(children, setChildren, "Children", 0)}
            {numField(infants, setInfants, "Infants", 0)}
          </div>

          <ItineraryEditor values={days} onChange={setDays} />

          <label className="form-group">
            <span className="form-label">Personalised notes (optional)</span>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Day 3 swapped to a sunset cruise; airport transfers included."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          {error && <p className={styles.err}>{error}</p>}

          <div className={styles.btnRow}>
            <button
              type="button"
              className="btn btn-outline btn--sm"
              onClick={() => generate("download")}
              disabled={busy !== null}
            >
              {busy === "download" ? "Generating…" : "Download PDF"}
            </button>
            <button
              type="button"
              className="btn btn-primary btn--sm"
              onClick={shareWhatsApp}
              disabled={busy !== null || !waNumber}
              title={waNumber ? undefined : "No phone number on this lead"}
            >
              {busy === "whatsapp" ? "Generating…" : "WhatsApp"}
            </button>
            <button
              type="button"
              className="btn btn-navy btn--sm"
              onClick={shareEmail}
              disabled={busy !== null || !email}
              title={email ? undefined : "No email on this lead"}
            >
              {busy === "email" ? "Generating…" : "Email"}
            </button>
          </div>

          {(!waNumber || !email) && (
            <p className={styles.hint}>
              {!waNumber && "No phone on this lead — WhatsApp disabled. "}
              {!email && "No email on this lead — email disabled."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
