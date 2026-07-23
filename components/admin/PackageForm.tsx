"use client";

import { useState, useTransition } from "react";
import {
  savePackage,
  deletePackage,
  type PackagePayload,
} from "@/app/admin/(panel)/packages/actions";
import {
  ImageUpload,
  StringListEditor,
  ItineraryEditor,
  HotelsEditor,
  type ItineraryDayInput,
  type HotelInput,
} from "./fields";
import { slugify } from "@/lib/utils";
import shared from "./shared.module.css";
import styles from "./PackageForm.module.css";

const CATEGORIES = [
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family" },
  { value: "adventure", label: "Adventure" },
  { value: "corporate", label: "Corporate / MICE" },
  { value: "pilgrimage", label: "Pilgrimage" },
  { value: "college", label: "College Tours" },
];

interface DestinationOption {
  slug: string;
  name: string;
}

interface PackageFormProps {
  destinations: DestinationOption[];
  initial?: Partial<PackagePayload> & { id?: string; itinerary?: ItineraryDayInput[] };
}

export default function PackageForm({ destinations, initial }: PackageFormProps) {
  const isEdit = Boolean(initial?.id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [destinationSlug, setDestinationSlug] = useState(initial?.destinationSlug ?? "");
  const [destination, setDestination] = useState(initial?.destination ?? "");
  const [category, setCategory] = useState(initial?.category ?? "family");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [nights, setNights] = useState(initial?.nights ?? 3);
  const [fromPrice, setFromPrice] = useState(initial?.fromPrice ?? 0);
  const [priceOnRequest, setPriceOnRequest] = useState(initial?.priceOnRequest ?? false);
  const [heroImage, setHeroImage] = useState(initial?.heroImage ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [hotels, setHotels] = useState<HotelInput[]>(() => {
    if (initial?.hotels?.length) {
      return initial.hotels.map((h) => ({ name: h.name ?? "", image: h.image ?? "", city: h.city ?? "" }));
    }
    // Migrate a legacy single hotel into the list so nothing is lost on first edit.
    return initial?.hotel ? [{ name: initial.hotel, image: initial.hotelImage ?? "", city: "" }] : [];
  });
  const [highlights, setHighlights] = useState<string[]>(initial?.highlights ?? []);
  const [inclusions, setInclusions] = useState<string[]>(initial?.inclusions ?? []);
  const [exclusions, setExclusions] = useState<string[]>(initial?.exclusions ?? []);
  const [itinerary, setItinerary] = useState<ItineraryDayInput[]>(initial?.itinerary ?? []);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  // New packages default to shown on the website; existing ones keep their value.
  const [published, setPublished] = useState(initial?.published ?? true);
  const [badge, setBadge] = useState(initial?.badge ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload: PackagePayload = {
      id: initial?.id,
      title,
      slug,
      destination,
      destinationSlug,
      category,
      duration,
      nights: Number(nights),
      fromPrice: Number(fromPrice),
      priceOnRequest,
      heroImage,
      gallery,
      hotels,
      // Legacy single-hotel fields kept in sync (first hotel) for anything still reading them.
      hotel: hotels[0]?.name ?? "",
      hotelImage: hotels[0]?.image ?? "",
      highlights,
      inclusions,
      exclusions,
      itinerary,
      featured,
      published,
      badge,
    };
    startTransition(async () => {
      const result = await savePackage(payload);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={shared.formGrid}>
          <div className="form-group">
            <label className="form-label" htmlFor="pkg-title">Title</label>
            <input
              id="pkg-title"
              className="form-input"
              value={title}
              required
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="pkg-slug">URL Slug</label>
            <input
              id="pkg-slug"
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
            <label className="form-label" htmlFor="pkg-dest">Destination</label>
            <select
              id="pkg-dest"
              className="form-select"
              value={destinationSlug}
              required
              onChange={(e) => {
                const d = destinations.find((x) => x.slug === e.target.value);
                setDestinationSlug(e.target.value);
                if (d) setDestination(d.name);
              }}
            >
              <option value="" disabled>Select destination…</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="pkg-cat">Category</label>
            <select
              id="pkg-cat"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="pkg-duration">Duration label</label>
            <input
              id="pkg-duration"
              className="form-input"
              value={duration}
              placeholder="e.g. 5 Days / 4 Nights"
              required
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className={styles.threeCol}>
            <div className="form-group">
              <label className="form-label" htmlFor="pkg-nights">Nights</label>
              <input
                id="pkg-nights"
                type="number"
                min={0}
                className="form-input"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pkg-price">From price (₹)</label>
              <input
                id="pkg-price"
                type="number"
                min={0}
                step={500}
                className="form-input"
                value={fromPrice}
                onChange={(e) => setFromPrice(Number(e.target.value))}
                disabled={priceOnRequest}
              />
              <label className={styles.featuredRow} style={{ marginTop: 10 }}>
                <input
                  type="checkbox"
                  checked={priceOnRequest}
                  onChange={(e) => setPriceOnRequest(e.target.checked)}
                />
                <span>Price on request (hide the price, show “On Request”)</span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pkg-badge">Badge</label>
              <input
                id="pkg-badge"
                className="form-input"
                value={badge}
                placeholder="e.g. Bestseller"
                onChange={(e) => setBadge(e.target.value)}
              />
            </div>
          </div>
          <label className={styles.featuredRow}>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span>Featured on homepage</span>
          </label>
          <label className={styles.featuredRow} style={{ marginTop: 10 }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span>
              Show on website
              <small style={{ display: "block", color: "var(--muted)", fontWeight: 400 }}>
                Off = kept in the CMS for quotes &amp; itineraries only, hidden from the public site.
              </small>
            </span>
          </label>
        </div>
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <ImageUpload label="Hero image" value={heroImage} onChange={setHeroImage} required />
        <div className={styles.spacer} />
        <StringListEditor
          label="Gallery images"
          values={gallery}
          onChange={setGallery}
          placeholder="/uploads/… or /images/…"
        />
        <div className={styles.spacer} />
        <HotelsEditor values={hotels} onChange={setHotels} />
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={styles.stack}>
          <ItineraryEditor values={itinerary} onChange={setItinerary} />
          <StringListEditor
            label="Highlights"
            values={highlights}
            onChange={setHighlights}
            placeholder="e.g. Houseboat stay in Alleppey"
          />
          <StringListEditor
            label="Inclusions"
            values={inclusions}
            onChange={setInclusions}
            placeholder="e.g. Daily breakfast"
          />
          <StringListEditor
            label="Exclusions"
            values={exclusions}
            onChange={setExclusions}
            placeholder="e.g. Airfare"
          />
        </div>
      </div>

      {error && <p className={shared.error}>{error}</p>}

      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Package"}
        </button>
        {isEdit && initial?.id && (
          <button
            type="button"
            className={shared.dangerBtn}
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this package? It will disappear from the website immediately.")) {
                startTransition(() => deletePackage(initial.id!));
              }
            }}
          >
            Delete Package
          </button>
        )}
      </div>
    </form>
  );
}
