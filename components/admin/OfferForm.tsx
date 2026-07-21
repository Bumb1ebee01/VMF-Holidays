"use client";

import { useState, useTransition } from "react";
import { saveOffer, deleteOffer, type OfferPayload } from "@/app/admin/(panel)/offers/actions";
import { ImageUpload } from "./fields";
import shared from "./shared.module.css";
import { whatsappLink } from "@/lib/contact";
import styles from "./PackageForm.module.css";

interface OfferFormProps {
  initial?: Partial<OfferPayload> & { id?: string };
}

export default function OfferForm({ initial }: OfferFormProps) {
  const isEdit = Boolean(initial?.id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel ?? "");
  const [ctaHref, setCtaHref] = useState(initial?.ctaHref ?? "");
  const [badge, setBadge] = useState(initial?.badge ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [endsAt, setEndsAt] = useState(initial?.endsAt ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveOffer({
        id: initial?.id,
        title,
        description,
        image,
        ctaLabel,
        ctaHref,
        badge,
        published,
        sortOrder: parseInt(sortOrder, 10) || 0,
        endsAt,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <ImageUpload label="Offer flyer / image" value={image} onChange={setImage} required />
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={shared.formGrid}>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="o-title">Title</label>
            <input
              id="o-title"
              className="form-input"
              value={title}
              required
              placeholder="e.g. Monsoon Special — Kerala 6N from ₹24,999"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="o-desc">Description</label>
            <textarea
              id="o-desc"
              className="form-textarea"
              rows={2}
              value={description}
              placeholder="One line shown under the title (optional)."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="o-badge">Badge</label>
            <input
              id="o-badge"
              className="form-input"
              value={badge}
              placeholder="Limited time"
              onChange={(e) => setBadge(e.target.value)}
            />
            <p className={shared.fieldHint}>Small pill on the tile (optional).</p>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="o-ends">Ends on</label>
            <input
              id="o-ends"
              type="date"
              className="form-input"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
            <p className={shared.fieldHint}>Leave blank for no expiry.</p>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="o-ctalabel">Button label</label>
            <input
              id="o-ctalabel"
              className="form-input"
              value={ctaLabel}
              placeholder="Enquire now"
              onChange={(e) => setCtaLabel(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="o-ctahref">Button link</label>
            <input
              id="o-ctahref"
              className="form-input"
              value={ctaHref}
              placeholder={`/trip-builder or ${whatsappLink()}`}
              onChange={(e) => setCtaHref(e.target.value)}
            />
            <p className={shared.fieldHint}>Where the button goes. Defaults to WhatsApp if blank.</p>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="o-sort">Sort order</label>
            <input
              id="o-sort"
              type="number"
              className="form-input"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <p className={shared.fieldHint}>Lower numbers show first.</p>
          </div>
        </div>
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <label className={styles.featuredRow}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Show on website</span>
        </label>
      </div>

      {error && <p className={shared.error}>{error}</p>}

      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Offer"}
        </button>
        {isEdit && initial?.id && (
          <button
            type="button"
            className={shared.dangerBtn}
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this offer?")) {
                startTransition(() => deleteOffer(initial.id!));
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
