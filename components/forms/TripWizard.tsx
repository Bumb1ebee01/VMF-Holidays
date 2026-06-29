"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/types";
import type { Continent, GeoCountry, GeoPlace } from "@/lib/data/geography";
import { MultiMonthCalendar } from "@/components/ui/MultiMonthCalendar";
import RouteMap, { type RoutePoint } from "@/components/ui/RouteMap";
import { trackLead } from "@/lib/analytics";
import Turnstile from "@/components/ui/Turnstile";
import styles from "./TripWizard.module.css";

// The Trip Builder data now arrives from the DB-backed loader (with a static
// fallback), so we only need the canonical continent order here — not the heavy
// geography module in the client bundle.
const CONTINENT_ORDER: Continent[] = ["Asia", "Europe", "Africa", "North America", "South America"];

interface Props {
  destinations: Destination[];
  geography: GeoCountry[];
}

const CONTACT_MODES = [
  { label: "WhatsApp", sub: "Fastest reply" },
  { label: "Phone Call", sub: "Talk to an expert" },
  { label: "Email", sub: "Detailed itinerary" },
];

const CONTACT_TIMES = [
  { label: "Morning", sub: "9 AM – 12 PM" },
  { label: "Afternoon", sub: "12 – 5 PM" },
  { label: "Evening", sub: "5 – 9 PM" },
  { label: "Anytime", sub: "Whenever suits" },
];

const HOTEL_CATEGORIES = [
  { label: "3 Star", sub: "Comfortable & great value" },
  { label: "4 Star", sub: "Premium comfort" },
  { label: "5 Star", sub: "Luxury all the way" },
];

const MEAL_PLANS = [
  { label: "Breakfast Only", sub: "Daily breakfast" },
  { label: "Half Board", sub: "Breakfast + lunch or dinner" },
  { label: "Full Board", sub: "Breakfast, lunch & dinner" },
];

const STEPS = [
  { title: "Select Countries", sub: "Choose the countries you wish to travel to" },
  { title: "Add Cities", sub: "Add the cities you want to visit" },
  { title: "Add Experiences", sub: "Collate the experiences in each city" },
  { title: "Choose Dates", sub: "Plan your travel dates & travellers" },
  { title: "Preferences", sub: "Hotel category & meal plan" },
  { title: "Traveller Details", sub: "We'll send your itinerary across" },
];

function StepIcon({ index }: { index: number }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (index) {
    case 0: return <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" /></svg>;
    case 1: return <svg {...common}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case 2: return <svg {...common}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case 3: return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    case 4: return <svg {...common}><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" /><path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><path d="M2 18h20" /><path d="M8 10V8h8v2" /></svg>;
    default: return <svg {...common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  }
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function TripWizard({ destinations, geography }: Props) {
  const [step, setStep] = useState(0);

  // Step 0 — countries
  const [continent, setContinent] = useState<Continent>("Asia");
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState<GeoCountry[]>([]);

  // Step 1 — cities
  const [cityTab, setCityTab] = useState<string>("all");
  const [places, setPlaces] = useState<{ country: GeoCountry; place: GeoPlace }[]>([]);

  // Step 2 — experiences (keyed by `${countryCode}:${placeSlug}`)
  const [expTab, setExpTab] = useState<string>("");
  const [experiences, setExperiences] = useState<Record<string, string[]>>({});

  // Step 3 — dates & travellers
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Step 4 — preferences
  const [hotelCategory, setHotelCategory] = useState("");
  const [mealPlan, setMealPlan] = useState("");

  // Step 5 — contact
  const [contactMode, setContactMode] = useState("WhatsApp");
  const [contactTime, setContactTime] = useState("Anytime");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", company: "" });
  const [captcha, setCaptcha] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const placeKey = (c: GeoCountry, p: GeoPlace) => `${c.code}:${p.slug}`;

  const placeImage = (c: GeoCountry, p: GeoPlace): string => {
    const destHero = destinations.find((d) => d.slug === p.destinationSlug)?.heroImage;
    return p.image ?? (destHero && destHero.startsWith("https://") ? destHero : c.heroImage);
  };

  function toggleCountry(c: GeoCountry) {
    if (countries.some((x) => x.code === c.code)) {
      setCountries(countries.filter((x) => x.code !== c.code));
      setPlaces(places.filter((p) => p.country.code !== c.code));
      setExperiences((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => { if (k.startsWith(`${c.code}:`)) delete next[k]; });
        return next;
      });
    } else {
      setCountries([...countries, c]);
    }
  }

  function togglePlace(c: GeoCountry, p: GeoPlace) {
    const key = placeKey(c, p);
    if (places.some((x) => placeKey(x.country, x.place) === key)) {
      setPlaces(places.filter((x) => placeKey(x.country, x.place) !== key));
      setExperiences((prev) => { const n = { ...prev }; delete n[key]; return n; });
    } else {
      setPlaces([...places, { country: c, place: p }]);
    }
  }

  function toggleExperience(key: string, activity: string) {
    setExperiences((prev) => {
      const cur = prev[key] ?? [];
      return { ...prev, [key]: cur.includes(activity) ? cur.filter((a) => a !== activity) : [...cur, activity] };
    });
  }

  // Derived ----------------------------------------------------------------
  const continentCountries = geography
    .filter((c) => c.continent === continent)
    .filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));

  const citiesToShow = cityTab === "all"
    ? countries.flatMap((c) => c.places.map((p) => ({ country: c, place: p })))
    : (countries.find((c) => c.code === cityTab)?.places ?? []).map((p) => ({
        country: countries.find((c) => c.code === cityTab)!,
        place: p,
      }));

  const activeExpKey = expTab || (places[0] ? placeKey(places[0].country, places[0].place) : "");
  const activeExpPlace = places.find((p) => placeKey(p.country, p.place) === activeExpKey);

  const totalExperiences = Object.values(experiences).reduce((n, a) => n + a.length, 0);
  const tripDays = Math.min(Math.max(places.length, 1) * 2 + Math.ceil(totalExperiences / 3), 21);
  const tripNights = Math.max(tripDays - 1, 1);

  const routePoints = useMemo<RoutePoint[]>(
    () =>
      places
        .map(({ place }) => {
          const coords: [number, number] | null =
            place.lat != null && place.lng != null ? [place.lat, place.lng] : null;
          return coords ? { name: place.name, coords } : null;
        })
        .filter((p): p is RoutePoint => p !== null),
    [places]
  );

  const travelersLabel =
    `${adults} Adult${adults !== 1 ? "s" : ""}` +
    (children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : "") +
    (infants > 0 ? `, ${infants} Infant${infants !== 1 ? "s" : ""}` : "");

  const allExperiences = Object.values(experiences).flat();
  const destinationStr = places.map((p) => p.place.name).join(", ");

  function canNext() {
    if (step === 0) return countries.length > 0;
    if (step === 1) return places.length > 0;
    if (step === 2) return true;
    if (step === 3) return !!startDate;
    if (step === 4) return !!(hotelCategory && mealPlan);
    if (step === 5) return !!(form.name && form.phone);
    return true;
  }

  function goNext() {
    if (step === 0) setCityTab("all");
    if (step === 1 && places[0]) setExpTab(placeKey(places[0].country, places[0].place));
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function handleSubmit() {
    setStatus("sending");
    const datesStr = startDate
      ? formatDate(startDate) + (endDate ? ` – ${formatDate(endDate)}` : "")
      : "";
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || "",
          destination: `${destinationStr}${countries.length ? ` (${countries.map((c) => c.name).join(", ")})` : ""}`,
          dates: datesStr,
          travelers: travelersLabel,
          tripLength: `${tripDays} Days / ${tripNights} Nights`,
          hotelCategory,
          mealPlan,
          contactMode,
          contactTime,
          interests: allExperiences,
          message: form.message,
          company: form.company,
          turnstileToken: captcha,
          packageTitle: "Custom Itinerary",
        }),
      });
      if (res.ok) {
        setStatus("success");
        // Note: keep this independent of `destinationStr` — referencing that
        // memoised value here makes the React Compiler bail on the waText useMemo.
        trackLead({ source: "trip_wizard" });
        return;
      }
    } catch { /* fall through */ }
    setStatus("error");
  }

  const waText = useMemo(() => {
    const lines = [
      "Hi VMF Holidays! I've just planned a trip.",
      form.name ? `Name: ${form.name}` : "",
      form.phone ? `Phone: ${form.phone}` : "",
      destinationStr ? `Itinerary: ${destinationStr}` : "",
      `Approx. length: ${tripDays} Days / ${tripNights} Nights`,
      startDate ? `Dates: ${formatDate(startDate)}${endDate ? ` – ${formatDate(endDate)}` : ""}` : "",
      `Travellers: ${travelersLabel}`,
      hotelCategory ? `Hotel: ${hotelCategory}` : "",
      mealPlan ? `Meals: ${mealPlan}` : "",
      `Preferred contact: ${contactMode} (${contactTime})`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [form.name, form.phone, destinationStr, tripDays, tripNights, startDate, endDate, travelersLabel, hotelCategory, mealPlan, contactMode, contactTime]);

  const waHref = `https://wa.me/917499322412?text=${encodeURIComponent(waText)}`;

  // The cities + experiences determine an approximate trip length (tripDays).
  // So once the traveller picks a departure date we auto-set the return date to
  // match that length (e.g. 8 days from the 10th → the 17th), rather than making
  // them count it out themselves.
  useEffect(() => {
    if (!startDate) return;
    const end = new Date(startDate);
    end.setDate(end.getDate() + Math.max(tripDays - 1, 0));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEndDate(end);
  }, [startDate, tripDays]);

  // On each step change, jump back to the top so every step starts at its
  // heading. Routed through Lenis (see SmoothScroll) — a raw window.scrollTo
  // desyncs the smooth-scroll driver and the page snaps back down.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vmf:scroll-top"));
    }
  }, [step]);

  const waOpened = useRef(false);
  useEffect(() => {
    if (status === "success" && contactMode === "WhatsApp" && !waOpened.current) {
      waOpened.current = true;
      window.open(waHref, "_blank", "noopener,noreferrer");
    }
  }, [status, contactMode, waHref]);

  if (status === "success") {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successInner}>
          <div className={styles.successCheck}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className={styles.successTitle}>Your Dream Trip is Locked In!</h2>
          <p className={styles.successSub}>
            Thanks, {form.name}! Our travel experts will reach out within 24 hours with a personalised itinerary{destinationStr ? ` for ${destinationStr}` : ""}.
          </p>
          <div className={styles.successDetails}>
            {destinationStr && <span>{destinationStr}</span>}
            {startDate && <span>{formatDate(startDate)}{endDate ? ` – ${formatDate(endDate)}` : ""}</span>}
            <span>{travelersLabel}</span>
          </div>
          {contactMode === "WhatsApp" && (
            <p className={styles.waAutoNote}>WhatsApp should have opened with your details ready to send. If it didn&apos;t, tap below.</p>
          )}
          <a href={waHref} target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.112 1.523 5.836L.057 23.571a.5.5 0 0 0 .617.609l5.878-1.543A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.69-.501-5.232-1.376l-.374-.216-3.878 1.018 1.037-3.788-.236-.386A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
            Chat on WhatsApp
          </a>
          <Link href="/destinations" className="btn btn-outline">Explore destinations</Link>
        </div>
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className={styles.pageWrap}>
      <div className={styles.shell}>
      {/* ── Left step rail ── */}
      <aside className={styles.rail}>
        <div className={styles.railLogo}>
          <span className={styles.railLogoMark}>VMF</span>
          <span className={styles.railLogoText}>Holidays</span>
        </div>
        <ol className={styles.railSteps}>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className={`${styles.railStep} ${i === step ? styles.railStepActive : ""} ${i < step ? styles.railStepDone : ""}`}
                onClick={() => { if (i <= step) setStep(i); }}
                disabled={i > step}
              >
                <span className={styles.railIcon}><StepIcon index={i} /></span>
                <span className={styles.railText}>
                  <span className={styles.railTitle}>{s.title}</span>
                  <span className={styles.railSub}>{s.sub}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className={styles.railFoot}>
          <span>+91 7499322412</span>
          <span>info@vmfholidays.com</span>
        </div>
      </aside>

      {/* ── Main panel ── */}
      <div className={styles.main}>
        <div className={styles.brandHead}>
          <h1 className={styles.brandTitle}>Build your dream journey, your way.</h1>
          <p className={styles.brandSub}>Start planning your perfect getaway!</p>
        </div>

        <div className={styles.mainScroll}>
          {/* STEP 0 — Countries */}
          {step === 0 && (
            <>
              <div className={styles.tabsRow}>
                <div className={styles.filterTabs}>
                  {CONTINENT_ORDER.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.filterTab} ${continent === c ? styles.filterTabActive : ""}`}
                      onClick={() => setContinent(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className={styles.searchBox}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                  <input className={styles.searchInput} placeholder="Search countries" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>

              <div className={styles.cardGrid}>
                {continentCountries.map((c) => {
                  const on = countries.some((x) => x.code === c.code);
                  return (
                    <button key={c.code} type="button" className={`${styles.gcard} ${on ? styles.gcardOn : ""}`} onClick={() => toggleCountry(c)}>
                      <div className={styles.gcardImgWrap}>
                        <Image src={c.heroImage} alt={c.name} fill sizes="(max-width:900px) 50vw, 30vw" className={styles.gcardImg} />
                        {on && <span className={styles.gcardCheck}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>}
                      </div>
                      <div className={styles.gcardBody}>
                        <span className={styles.gcardName}>{c.name}</span>
                        <span className={styles.gcardSub}>{c.continent} · {c.places.length} {c.places.length === 1 ? "place" : "places"}</span>
                      </div>
                    </button>
                  );
                })}
                {continentCountries.length === 0 && (
                  <p className={styles.emptyNote}>No countries match “{search}” in {continent}.</p>
                )}
              </div>
            </>
          )}

          {/* STEP 1 — Cities */}
          {step === 1 && (
            <>
              <div className={styles.tabsRow}>
                <div className={styles.filterTabs}>
                  <button type="button" className={`${styles.filterTab} ${cityTab === "all" ? styles.filterTabActive : ""}`} onClick={() => setCityTab("all")}>All</button>
                  {countries.map((c) => (
                    <button key={c.code} type="button" className={`${styles.filterTab} ${cityTab === c.code ? styles.filterTabActive : ""}`} onClick={() => setCityTab(c.code)}>{c.flag} {c.name}</button>
                  ))}
                </div>
              </div>

              <div className={styles.cardGrid}>
                {citiesToShow.map(({ country, place }) => {
                  const on = places.some((x) => placeKey(x.country, x.place) === placeKey(country, place));
                  return (
                    <button key={placeKey(country, place)} type="button" className={`${styles.gcard} ${on ? styles.gcardOn : ""}`} onClick={() => togglePlace(country, place)}>
                      <div className={styles.gcardImgWrap}>
                        <Image src={placeImage(country, place)} alt={place.name} fill sizes="(max-width:900px) 50vw, 30vw" className={styles.gcardImg} />
                        {on && <span className={styles.gcardCheck}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>}
                      </div>
                      <div className={styles.gcardBody}>
                        <span className={styles.gcardName}>{place.name}</span>
                        <span className={styles.gcardSub}>{country.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 2 — Experiences */}
          {step === 2 && (
            <>
              <div className={styles.tabsRow}>
                <div className={styles.filterTabs}>
                  {places.map(({ country, place }) => {
                    const key = placeKey(country, place);
                    return (
                      <button key={key} type="button" className={`${styles.filterTab} ${activeExpKey === key ? styles.filterTabActive : ""}`} onClick={() => setExpTab(key)}>{place.name}</button>
                    );
                  })}
                </div>
                <div className={styles.daysPill}>
                  <span className={styles.daysPillLabel}>Approx. Days Covered</span>
                  <span className={styles.daysPillNum}>{tripDays} Days</span>
                </div>
              </div>

              {activeExpPlace && (
                activeExpPlace.place.activities.length > 0 ? (
                  <div className={styles.expGrid}>
                    {activeExpPlace.place.activities.map((a) => {
                      const sel = (experiences[activeExpKey] ?? []).includes(a);
                      return (
                        <button key={a} type="button" className={`${styles.expCard} ${sel ? styles.expCardOn : ""}`} onClick={() => toggleExperience(activeExpKey, a)}>
                          <span className={styles.expCheck}>
                            {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                          </span>
                          {a}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.emptyExp}>
                    <div className={styles.emptyExpGlyph}>✦</div>
                    <h3>We&apos;ll craft the best of {activeExpPlace.place.name}</h3>
                    <p>No fixed experiences listed yet — continue and our experts will tailor them for you.</p>
                  </div>
                )
              )}
            </>
          )}

          {/* STEP 3 — Dates & travellers */}
          {step === 3 && (
            <div className={styles.datesLayout}>
              <div>
                <div className={styles.subhead}>When are you travelling?</div>
                <p className={styles.calNote}>
                  Based on your cities &amp; experiences we&apos;ve planned an approximate{" "}
                  <strong>{tripDays}-day</strong> trip. Just pick your <strong>departure date</strong> —
                  we&apos;ll set the return automatically. You can fine-tune it with us later.
                </p>
                <div className={styles.calendarWrap}>
                  <MultiMonthCalendar
                    mode="single"
                    numberOfMonths={2}
                    disabledBefore={(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })()}
                    selected={startDate ?? undefined}
                    onSelect={(value) => {
                      // Single-date picker: every click is the new departure date and
                      // the return is re-derived from tripDays (effect above). This lets
                      // travellers change their date freely, with no range-select quirks.
                      if (value instanceof Date) setStartDate(value);
                    }}
                  />
                  <div className={styles.calFooter}>
                    {startDate ? (
                      <>
                        <span className={styles.calDateBlock}>
                          <span className={styles.calDateLabel}>Departure</span>
                          <span className={styles.calDate}>{formatDate(startDate)}</span>
                        </span>
                        <span className={styles.calArrow}>→</span>
                        <span className={styles.calDateBlock}>
                          <span className={styles.calDateLabel}>Return ({tripDays} days)</span>
                          <span className={styles.calDate}>{endDate ? formatDate(endDate) : "—"}</span>
                        </span>
                      </>
                    ) : <span className={styles.calHint}>Pick your departure date</span>}
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.subhead}>Who&apos;s coming?</div>
                <div className={styles.travelerCard}>
                  {([["Adults", "Age 12+", adults, setAdults, 1], ["Children", "Age 5–12", children, setChildren, 0], ["Infants", "Under 5", infants, setInfants, 0]] as const).map(([label, sub, val, setter, min]) => (
                    <div key={label} className={styles.travelerRow}>
                      <div>
                        <div className={styles.travelerLabel}>{label}</div>
                        <div className={styles.travelerSub}>{sub}</div>
                      </div>
                      <div className={styles.counter}>
                        <button type="button" className={styles.counterBtn} onClick={() => setter((v) => Math.max(min, v - 1))}>−</button>
                        <span className={styles.counterVal}>{val}</span>
                        <button type="button" className={styles.counterBtn} onClick={() => setter((v) => v + 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.subhead} style={{ marginTop: 28 }}>Your route</div>
                {routePoints.length > 0 ? (
                  <RouteMap points={routePoints} />
                ) : (
                  <p className={styles.routeNote}>Add cities with mapped locations to preview your route here.</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — Preferences */}
          {step === 4 && (
            <div className={styles.prefsWrap}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Preferred hotel category *</label>
                <div className={styles.contactModeGrid}>
                  {HOTEL_CATEGORIES.map((h) => (
                    <button
                      key={h.label}
                      type="button"
                      className={`${styles.contactModeCard} ${hotelCategory === h.label ? styles.contactModeCardActive : ""}`}
                      onClick={() => setHotelCategory(h.label)}
                    >
                      <span className={styles.contactModeLabel}>{h.label}</span>
                      <span className={styles.contactModeSub}>{h.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meal preferences *</label>
                <div className={styles.contactModeGrid}>
                  {MEAL_PLANS.map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      className={`${styles.contactModeCard} ${mealPlan === m.label ? styles.contactModeCardActive : ""}`}
                      onClick={() => setMealPlan(m.label)}
                    >
                      <span className={styles.contactModeLabel}>{m.label}</span>
                      <span className={styles.contactModeSub}>{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — Contact */}
          {step === 5 && (
            <div className={styles.contactGrid}>
              <div className={styles.contactLeft}>
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input type="text" className={styles.formInput} placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number *</label>
                  <input type="tel" className={styles.formInput} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address <span className={styles.optionalTag}>(optional)</span></label>
                  <input type="email" className={styles.formInput} placeholder="you@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>How should we contact you?</label>
                  <div className={styles.contactModeGrid}>
                    {CONTACT_MODES.map((m) => (
                      <button key={m.label} type="button" className={`${styles.contactModeCard} ${contactMode === m.label ? styles.contactModeCardActive : ""}`} onClick={() => setContactMode(m.label)}>
                        <span className={styles.contactModeLabel}>{m.label}</span>
                        <span className={styles.contactModeSub}>{m.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Best time to reach you</label>
                  <div className={styles.contactTimeGrid}>
                    {CONTACT_TIMES.map((t) => (
                      <button key={t.label} type="button" className={`${styles.contactTimeCard} ${contactTime === t.label ? styles.contactTimeCardActive : ""}`} onClick={() => setContactTime(t.label)}>
                        <span className={styles.contactTimeLabel}>{t.label}</span>
                        <span className={styles.contactTimeSub}>{t.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Anything else? <span className={styles.optionalTag}>(optional)</span></label>
                  <textarea className={`${styles.formInput} ${styles.formTextarea}`} placeholder="Special requests, dietary needs, room preferences…" rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                </div>
                <Turnstile onVerify={setCaptcha} />
                {status === "error" && (
                  <p className={styles.errorMsg}>Something went wrong. <a href="https://wa.me/917499322412" target="_blank" rel="noopener noreferrer">Try WhatsApp instead →</a></p>
                )}
              </div>

              <div className={styles.contactRight}>
                <div className={styles.tripSummary}>
                  <div className={styles.summaryHead}>Your Itinerary</div>
                  {places.length > 0 && (
                    <div className={styles.summaryItem}><div><div className={styles.summaryLabel}>Cities</div><div className={styles.summaryVal}>{destinationStr}</div></div></div>
                  )}
                  {allExperiences.length > 0 && (
                    <div className={styles.summaryItem}><div><div className={styles.summaryLabel}>Experiences</div><div className={styles.summaryVal}>{allExperiences.slice(0, 6).join(", ")}{allExperiences.length > 6 ? "…" : ""}</div></div></div>
                  )}
                  <div className={styles.summaryItem}><div><div className={styles.summaryLabel}>Approx. Length</div><div className={styles.summaryVal}>{tripDays} Days / {tripNights} Nights</div></div></div>
                  {startDate && (
                    <div className={styles.summaryItem}><div><div className={styles.summaryLabel}>Travel Dates</div><div className={styles.summaryVal}>{formatDate(startDate)}{endDate ? ` – ${formatDate(endDate)}` : ""}</div></div></div>
                  )}
                  <div className={styles.summaryItem}><div><div className={styles.summaryLabel}>Travellers</div><div className={styles.summaryVal}>{travelersLabel}</div></div></div>
                  {(hotelCategory || mealPlan) && (
                    <div className={styles.summaryItem}><div><div className={styles.summaryLabel}>Preferences</div><div className={styles.summaryVal}>{[hotelCategory, mealPlan].filter(Boolean).join(" · ")}</div></div></div>
                  )}
                  <div className={styles.summaryItem}><div><div className={styles.summaryLabel}>Contact Preference</div><div className={styles.summaryVal}>{contactMode} · {contactTime}</div></div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer nav ── */}
        <div className={styles.footerBar}>
          {step > 0 ? (
            <button type="button" className={styles.footerBack} onClick={() => setStep((s) => s - 1)}>← Previous</button>
          ) : <span />}
          {!isLast ? (
            <button type="button" className={styles.footerNext} onClick={goNext} disabled={!canNext()}>Next →</button>
          ) : (
            <button type="button" className={styles.footerNext} onClick={handleSubmit} disabled={!canNext() || status === "sending"}>
              {status === "sending" ? "Sending…" : "Get My Itinerary"}
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
