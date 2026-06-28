"use client";

import { useState, useTransition } from "react";
import {
  saveCountry,
  deleteCountry,
  type GeoCountryPayload,
} from "@/app/admin/(panel)/trip-builder/actions";
import { ImageUpload, StringListEditor } from "./fields";
import { slugify } from "@/lib/utils";
import shared from "./shared.module.css";
import styles from "./PackageForm.module.css";

const CONTINENTS = ["Asia", "Europe", "Africa", "North America", "South America"] as const;

interface PlaceRow {
  slug: string;
  name: string;
  destinationSlug: string;
  image: string;
  lat: string;
  lng: string;
  activities: string[];
}

interface InitialPlace {
  slug: string;
  name: string;
  destinationSlug: string | null;
  image: string | null;
  lat: number | null;
  lng: number | null;
  activities: string[];
}

interface GeoCountryFormProps {
  initial?: {
    id?: string;
    code: string;
    name: string;
    flag: string;
    continent: string;
    region: string;
    heroImage: string;
    places: InitialPlace[];
  };
}

const emptyPlace = (): PlaceRow => ({
  slug: "",
  name: "",
  destinationSlug: "",
  image: "",
  lat: "",
  lng: "",
  activities: [],
});

export default function GeoCountryForm({ initial }: GeoCountryFormProps) {
  const isEdit = Boolean(initial?.id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState(initial?.code ?? "");
  const [codeTouched, setCodeTouched] = useState(isEdit);
  const [name, setName] = useState(initial?.name ?? "");
  const [flag, setFlag] = useState(initial?.flag ?? "");
  const [continent, setContinent] = useState(initial?.continent ?? "Asia");
  const [region, setRegion] = useState(initial?.region ?? "domestic");
  const [heroImage, setHeroImage] = useState(initial?.heroImage ?? "");
  const [places, setPlaces] = useState<PlaceRow[]>(
    initial?.places.map((p) => ({
      slug: p.slug,
      name: p.name,
      destinationSlug: p.destinationSlug ?? "",
      image: p.image ?? "",
      lat: p.lat != null ? String(p.lat) : "",
      lng: p.lng != null ? String(p.lng) : "",
      activities: p.activities,
    })) ?? []
  );

  function updatePlace(i: number, patch: Partial<PlaceRow>) {
    setPlaces((prev) => prev.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload: GeoCountryPayload = {
      id: initial?.id,
      code,
      name,
      flag,
      continent,
      region,
      heroImage,
      places: places.map((p) => ({
        slug: p.slug,
        name: p.name,
        destinationSlug: p.destinationSlug,
        image: p.image,
        lat: p.lat.trim() ? Number(p.lat) : null,
        lng: p.lng.trim() ? Number(p.lng) : null,
        activities: p.activities,
      })),
    };
    startTransition(async () => {
      const result = await saveCountry(payload);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Country */}
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={shared.formGrid}>
          <div className="form-group">
            <label className="form-label" htmlFor="geo-name">Country name</label>
            <input
              id="geo-name"
              className="form-input"
              value={name}
              required
              onChange={(e) => {
                setName(e.target.value);
                if (!codeTouched) setCode(slugify(e.target.value));
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="geo-code">Code (unique)</label>
            <input
              id="geo-code"
              className="form-input"
              value={code}
              required
              placeholder="e.g. india"
              onChange={(e) => {
                setCodeTouched(true);
                setCode(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="geo-flag">Flag emoji</label>
            <input
              id="geo-flag"
              className="form-input"
              value={flag}
              placeholder="🇮🇳 (optional)"
              onChange={(e) => setFlag(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="geo-continent">Continent</label>
            <select
              id="geo-continent"
              className="form-select"
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
            >
              {CONTINENTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="geo-region">Region</label>
            <select
              id="geo-region"
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="domestic">Domestic (India)</option>
              <option value="international">International</option>
            </select>
          </div>
        </div>
        <div className={styles.spacer} />
        <ImageUpload label="Country hero image" value={heroImage} onChange={setHeroImage} required />
      </div>

      {/* Places */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 className={shared.pageTitle} style={{ fontSize: "1.1rem" }}>Cities &amp; Activities</h2>
        <span className={shared.pageSub}>{places.length} {places.length === 1 ? "city" : "cities"}</span>
      </div>

      {places.map((place, i) => (
        <div key={i} className={`${shared.panel} ${shared.panelPad}`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <strong>{place.name.trim() || `City ${i + 1}`}</strong>
            <button
              type="button"
              className="btn btn-outline btn--sm"
              onClick={() => setPlaces((prev) => prev.filter((_, j) => j !== i))}
            >
              Remove city
            </button>
          </div>
          <div className={shared.formGrid}>
            <div className="form-group">
              <label className="form-label">City name</label>
              <input
                className="form-input"
                value={place.name}
                required
                onChange={(e) => updatePlace(i, { name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                className="form-input"
                value={place.slug}
                placeholder="auto from name"
                onChange={(e) => updatePlace(i, { slug: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Linked destination slug</label>
              <input
                className="form-input"
                value={place.destinationSlug}
                placeholder="optional — e.g. goa"
                onChange={(e) => updatePlace(i, { destinationSlug: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                className="form-input"
                type="number"
                step="any"
                value={place.lat}
                placeholder="optional"
                onChange={(e) => updatePlace(i, { lat: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                className="form-input"
                type="number"
                step="any"
                value={place.lng}
                placeholder="optional"
                onChange={(e) => updatePlace(i, { lng: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.spacer} />
          <ImageUpload
            label="City image (optional)"
            value={place.image}
            onChange={(url) => updatePlace(i, { image: url })}
          />
          <div className={styles.spacer} />
          <StringListEditor
            label="Activities"
            values={place.activities}
            onChange={(activities) => updatePlace(i, { activities })}
            placeholder="e.g. North Goa Tour"
          />
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline"
        onClick={() => setPlaces((prev) => [...prev, emptyPlace()])}
      >
        + Add city
      </button>

      {error && <p className={shared.error}>{error}</p>}

      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Country"}
        </button>
        {isEdit && initial?.id && (
          <button
            type="button"
            className={shared.dangerBtn}
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete “${name}” and all its cities? This can't be undone.`)) {
                startTransition(() => deleteCountry(initial.id!));
              }
            }}
          >
            Delete Country
          </button>
        )}
      </div>
    </form>
  );
}
