"use client";

import { useState, useTransition } from "react";
import {
  saveDestination,
  deleteDestination,
  type DestinationPayload,
} from "@/app/admin/(panel)/destinations/actions";
import { ImageUpload, StringListEditor } from "./fields";
import { slugify } from "@/lib/utils";
import shared from "./shared.module.css";
import styles from "./PackageForm.module.css";

interface DestinationFormProps {
  initial?: Partial<DestinationPayload> & { id?: string };
}

export default function DestinationForm({ initial }: DestinationFormProps) {
  const isEdit = Boolean(initial?.id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [country, setCountry] = useState(initial?.country ?? "India");
  const [state, setStateName] = useState(initial?.state ?? "");
  const [region, setRegion] = useState(initial?.region ?? "domestic");
  const [heroImage, setHeroImage] = useState(initial?.heroImage ?? "");
  const [fromPrice, setFromPrice] = useState(initial?.fromPrice ?? 0);
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveDestination({
        id: initial?.id,
        name,
        slug,
        country,
        state,
        region,
        heroImage,
        fromPrice: Number(fromPrice),
        blurb,
        tags,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={shared.formGrid}>
          <div className="form-group">
            <label className="form-label" htmlFor="dest-name">Name</label>
            <input
              id="dest-name"
              className="form-input"
              value={name}
              required
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dest-slug">URL Slug</label>
            <input
              id="dest-slug"
              className="form-input"
              value={slug}
              required
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dest-country">Country</label>
            <input
              id="dest-country"
              className="form-input"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dest-region">Region</label>
            <select
              id="dest-region"
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="domestic">Domestic (India)</option>
              <option value="international">International</option>
            </select>
          </div>
          {region === "domestic" && (
            <div className="form-group">
              <label className="form-label" htmlFor="dest-state">State</label>
              <input
                id="dest-state"
                className="form-input"
                value={state}
                placeholder="e.g. Himachal Pradesh"
                onChange={(e) => setStateName(e.target.value)}
              />
              <p className={shared.cardSub}>Groups this destination on the Domestic destinations page.</p>
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="dest-price">From price (₹)</label>
            <input
              id="dest-price"
              type="number"
              min={0}
              step={500}
              className="form-input"
              value={fromPrice}
              onChange={(e) => setFromPrice(Number(e.target.value))}
            />
          </div>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="dest-blurb">Blurb</label>
            <textarea
              id="dest-blurb"
              className="form-textarea"
              rows={3}
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <ImageUpload label="Hero image" value={heroImage} onChange={setHeroImage} required />
        <div className={styles.spacer} />
        <StringListEditor
          label="Tags"
          values={tags}
          onChange={setTags}
          placeholder="e.g. Beaches"
        />
      </div>

      {error && <p className={shared.error}>{error}</p>}

      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Destination"}
        </button>
        {isEdit && initial?.id && (
          <button
            type="button"
            className={shared.dangerBtn}
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this destination? Packages pointing to it will stay but lose their destination filter.")) {
                startTransition(() => deleteDestination(initial.id!));
              }
            }}
          >
            Delete Destination
          </button>
        )}
      </div>
    </form>
  );
}
