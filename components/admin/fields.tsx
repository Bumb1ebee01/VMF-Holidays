"use client";

import { useRef, useState } from "react";
import styles from "./fields.module.css";

/* ---------- Image upload ---------- */

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export function ImageUpload({ label, value, onChange, required }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="form-group">
      <span className="form-label">{label}</span>
      <div className={styles.imageField}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className={styles.imagePreview} />
        ) : (
          <div className={styles.imageEmpty}>No image</div>
        )}
        <div className={styles.imageControls}>
          <button
            type="button"
            className="btn btn-outline btn--sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          <input
            type="text"
            className={`form-input ${styles.imageUrlInput}`}
            value={value}
            placeholder="…or paste an image path"
            required={required}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

/* ---------- String list editor ---------- */

interface StringListEditorProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function StringListEditor({ label, values, onChange, placeholder }: StringListEditorProps) {
  return (
    <div className="form-group">
      <span className="form-label">{label}</span>
      <div className={styles.list}>
        {values.map((v, i) => (
          <div key={i} className={styles.listRow}>
            <input
              type="text"
              className="form-input"
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className={styles.removeBtn}
              aria-label="Remove"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => onChange([...values, ""])}
        >
          + Add {label.replace(/s$/, "").toLowerCase()}
        </button>
      </div>
    </div>
  );
}

/* ---------- Itinerary editor ---------- */

export interface ItineraryDayInput {
  title: string;
  description: string;
}

interface ItineraryEditorProps {
  values: ItineraryDayInput[];
  onChange: (values: ItineraryDayInput[]) => void;
}

export function ItineraryEditor({ values, onChange }: ItineraryEditorProps) {
  return (
    <div className="form-group">
      <span className="form-label">Itinerary</span>
      <div className={styles.list}>
        {values.map((day, i) => (
          <div key={i} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <span className={styles.dayNum}>Day {i + 1}</span>
              <button
                type="button"
                className={styles.removeBtn}
                aria-label={`Remove day ${i + 1}`}
                onClick={() => onChange(values.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              value={day.title}
              placeholder="Day title — e.g. Arrival in Kochi"
              onChange={(e) => {
                const next = [...values];
                next[i] = { ...next[i], title: e.target.value };
                onChange(next);
              }}
            />
            <textarea
              className="form-textarea"
              rows={2}
              value={day.description}
              placeholder="What happens on this day"
              onChange={(e) => {
                const next = [...values];
                next[i] = { ...next[i], description: e.target.value };
                onChange(next);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => onChange([...values, { title: "", description: "" }])}
        >
          + Add day
        </button>
      </div>
    </div>
  );
}

/* ---------- Hotels editor (name + city + image, repeatable) ---------- */

export interface HotelInput {
  name: string;
  image: string;
  city: string;
}

interface HotelsEditorProps {
  values: HotelInput[];
  onChange: (values: HotelInput[]) => void;
}

export function HotelsEditor({ values, onChange }: HotelsEditorProps) {
  const update = (i: number, patch: Partial<HotelInput>) => {
    const next = [...values];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  return (
    <div className="form-group">
      <span className="form-label">Hotels</span>
      <p className={styles.help}>
        Add each hotel this trip stays at. Name and photo appear on the package page and in the
        downloadable itinerary PDF. Add more than one for multi-city trips.
      </p>
      <div className={styles.list}>
        {values.map((h, i) => (
          <div key={i} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <span className={styles.dayNum}>Hotel {i + 1}</span>
              <button
                type="button"
                className={styles.removeBtn}
                aria-label={`Remove hotel ${i + 1}`}
                onClick={() => onChange(values.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              value={h.city}
              placeholder="City / stop — e.g. Munnar (optional)"
              onChange={(e) => update(i, { city: e.target.value })}
            />
            <input
              type="text"
              className="form-input"
              value={h.name}
              placeholder="Hotel name — e.g. Taj Backwater Resort"
              onChange={(e) => update(i, { name: e.target.value })}
            />
            <ImageUpload label="Hotel image" value={h.image} onChange={(url) => update(i, { image: url })} />
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => onChange([...values, { name: "", image: "", city: "" }])}
        >
          + Add hotel
        </button>
      </div>
    </div>
  );
}

/* ---------- Sections editor (heading + body) ---------- */

export interface SectionInput {
  heading: string;
  body: string;
}

interface SectionsEditorProps {
  label: string;
  values: SectionInput[];
  onChange: (values: SectionInput[]) => void;
}

export function SectionsEditor({ label, values, onChange }: SectionsEditorProps) {
  return (
    <div className="form-group">
      <span className="form-label">{label}</span>
      <div className={styles.list}>
        {values.map((s, i) => (
          <div key={i} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <span className={styles.dayNum}>Section {i + 1}</span>
              <button
                type="button"
                className={styles.removeBtn}
                aria-label={`Remove section ${i + 1}`}
                onClick={() => onChange(values.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              value={s.heading}
              placeholder="Section heading — e.g. Getting around"
              onChange={(e) => {
                const next = [...values];
                next[i] = { ...next[i], heading: e.target.value };
                onChange(next);
              }}
            />
            <textarea
              className="form-textarea"
              rows={3}
              value={s.body}
              placeholder="Section text"
              onChange={(e) => {
                const next = [...values];
                next[i] = { ...next[i], body: e.target.value };
                onChange(next);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => onChange([...values, { heading: "", body: "" }])}
        >
          + Add section
        </button>
      </div>
    </div>
  );
}
