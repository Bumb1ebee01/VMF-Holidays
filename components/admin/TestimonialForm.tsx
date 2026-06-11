"use client";

import { useState, useTransition } from "react";
import {
  saveTestimonial,
  deleteTestimonial,
  type TestimonialPayload,
} from "@/app/admin/(panel)/testimonials/actions";
import shared from "./shared.module.css";
import styles from "./PackageForm.module.css";

interface TestimonialFormProps {
  initial?: Partial<TestimonialPayload> & { id?: string };
}

export default function TestimonialForm({ initial }: TestimonialFormProps) {
  const isEdit = Boolean(initial?.id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [trip, setTrip] = useState(initial?.trip ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveTestimonial({
        id: initial?.id,
        name,
        location,
        trip,
        rating: Number(rating),
        quote,
        published,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={shared.formGrid}>
          <div className="form-group">
            <label className="form-label" htmlFor="t-name">Customer name</label>
            <input
              id="t-name"
              className="form-input"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="t-location">Location</label>
            <input
              id="t-location"
              className="form-input"
              value={location}
              placeholder="e.g. Panjim, Goa"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="t-trip">Trip</label>
            <input
              id="t-trip"
              className="form-input"
              value={trip}
              placeholder="e.g. Kerala Honeymoon"
              onChange={(e) => setTrip(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="t-rating">Rating</label>
            <select
              id="t-rating"
              className="form-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{"★".repeat(r)}{"☆".repeat(5 - r)}</option>
              ))}
            </select>
          </div>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="t-quote">Quote</label>
            <textarea
              id="t-quote"
              className="form-textarea"
              rows={4}
              value={quote}
              required
              onChange={(e) => setQuote(e.target.value)}
            />
          </div>
          <label className={styles.featuredRow}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span>Published on website</span>
          </label>
        </div>
      </div>

      {error && <p className={shared.error}>{error}</p>}

      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save Changes" : "Add Testimonial"}
        </button>
        {isEdit && initial?.id && (
          <button
            type="button"
            className={shared.dangerBtn}
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this testimonial?")) {
                startTransition(() => deleteTestimonial(initial.id!));
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
