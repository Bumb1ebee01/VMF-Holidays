"use client";

import { useState, useTransition } from "react";
import { savePhoto, deletePhoto, type PhotoPayload } from "@/app/admin/(panel)/gallery/actions";
import { ImageUpload } from "./fields";
import shared from "./shared.module.css";
import styles from "./PackageForm.module.css";

interface GalleryFormProps {
  initial?: Partial<PhotoPayload> & { id?: string };
}

export default function GalleryForm({ initial }: GalleryFormProps) {
  const isEdit = Boolean(initial?.id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [image, setImage] = useState(initial?.image ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await savePhoto({
        id: initial?.id,
        image,
        caption,
        location,
        published,
        sortOrder: parseInt(sortOrder, 10) || 0,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <ImageUpload label="Photo" value={image} onChange={setImage} required />
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={shared.formGrid}>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="g-caption">Caption</label>
            <input
              id="g-caption"
              className="form-input"
              value={caption}
              placeholder="e.g. The Sharma family on the Alleppey backwaters"
              onChange={(e) => setCaption(e.target.value)}
            />
            <p className={shared.fieldHint}>Optional — shown when the photo is opened.</p>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="g-location">Location</label>
            <input
              id="g-location"
              className="form-input"
              value={location}
              placeholder="Kerala, India"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="g-sort">Sort order</label>
            <input
              id="g-sort"
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
          {pending ? "Saving…" : isEdit ? "Save Changes" : "Add Photo"}
        </button>
        {isEdit && initial?.id && (
          <button
            type="button"
            className={shared.dangerBtn}
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this photo?")) {
                startTransition(() => deletePhoto(initial.id!));
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
