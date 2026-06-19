"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Destination, Package } from "@/lib/types";
import { geography, CONTINENT_ORDER, type GeoCountry, type GeoPlace } from "@/lib/data/geography";
import styles from "./TripWizard.module.css";

interface Props {
  destinations: Destination[];
  packages: Package[];
}

const CATEGORIES = [
  { slug: "honeymoon", label: "Honeymoon", emoji: "💑", blurb: "Romance & luxury escapes" },
  { slug: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", blurb: "Fun for every generation" },
  { slug: "adventure", label: "Adventure", emoji: "🧗", blurb: "Thrills & exploration" },
  { slug: "corporate", label: "Corporate / MICE", emoji: "🏢", blurb: "Team getaways & events" },
  { slug: "pilgrimage", label: "Pilgrimage", emoji: "🙏", blurb: "Sacred & spiritual journeys" },
  { slug: "college", label: "College Tours", emoji: "🎓", blurb: "Group trips for students" },
];

const BUDGETS = [
  { label: "Budget", sub: "Under ₹15K/pp" },
  { label: "Mid-Range", sub: "₹15K – ₹40K/pp" },
  { label: "Premium", sub: "₹40K – ₹80K/pp" },
  { label: "Luxury", sub: "₹80K+/pp" },
  { label: "Flexible", sub: "We'll advise you" },
];

const STEP_LABELS = ["Destination", "Travel Style", "Package", "Dates", "Your Details"];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getCalDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
}

function DatePicker({ startDate, endDate, onRange }: {
  startDate: Date | null;
  endDate: Date | null;
  onRange: (start: Date, end: Date | null) => void;
}) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [picking, setPicking] = useState<"start" | "end">("start");

  function handleDay(day: Date) {
    if (day < today) return;
    if (picking === "start" || !startDate) {
      onRange(day, null);
      setPicking("end");
    } else {
      if (day < startDate) { onRange(day, startDate); }
      else { onRange(startDate, day); }
      setPicking("start");
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const shortcuts = [
    { label: "This Weekend", fn: () => {
      const d = new Date(); d.setHours(0,0,0,0);
      const diff = (6 - d.getDay() + 7) % 7 || 7;
      const sat = new Date(d); sat.setDate(d.getDate() + diff);
      const sun = new Date(sat); sun.setDate(sat.getDate() + 1);
      onRange(sat, sun); setPicking("start");
    }},
    { label: "Next Weekend", fn: () => {
      const d = new Date(); d.setHours(0,0,0,0);
      const diff = (6 - d.getDay() + 7) % 7 + 7;
      const sat = new Date(d); sat.setDate(d.getDate() + diff);
      const sun = new Date(sat); sun.setDate(sat.getDate() + 1);
      onRange(sat, sun); setPicking("start");
    }},
    { label: "This Month", fn: () => {
      const d = new Date(); d.setHours(0,0,0,0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      onRange(d, end); setPicking("start");
    }},
    { label: "Next Month", fn: () => {
      const d = new Date();
      const start = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 2, 0);
      onRange(start, end); setPicking("start");
    }},
  ];

  const days = getCalDays(viewYear, viewMonth);

  return (
    <div className={styles.calendarWrap}>
      <div className={styles.calShortcuts}>
        {shortcuts.map(s => (
          <button key={s.label} className={styles.shortcut} onClick={s.fn} type="button">{s.label}</button>
        ))}
      </div>
      <div className={styles.calendar}>
        <div className={styles.calHeader}>
          <button className={styles.calNav} onClick={prevMonth} type="button">‹</button>
          <span className={styles.calMonthLabel}>{MONTHS[viewMonth]} {viewYear}</span>
          <button className={styles.calNav} onClick={nextMonth} type="button">›</button>
        </div>
        <div className={styles.calGrid}>
          {DAY_LABELS.map(d => <div key={d} className={styles.calDayLabel}>{d}</div>)}
          {days.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const isPast = day < today;
            const isStart = !!(startDate && sameDay(day, startDate));
            const isEnd = !!(endDate && sameDay(day, endDate));
            const inRange = !!(startDate && endDate && day > startDate && day < endDate);
            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={isPast}
                className={[
                  styles.calDay,
                  isPast ? styles.calDayPast : "",
                  isStart ? styles.calDayStart : "",
                  isEnd ? styles.calDayEnd : "",
                  inRange ? styles.calDayRange : "",
                ].join(" ")}
                onClick={() => handleDay(day)}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.calFooter}>
        {startDate ? (
          <>
            <span className={styles.calDate}>{formatDate(startDate)}</span>
            <span className={styles.calArrow}>→</span>
            {endDate
              ? <span className={styles.calDate}>{formatDate(endDate)}</span>
              : <span className={styles.calHint}>Pick return date</span>
            }
          </>
        ) : (
          <span className={styles.calHint}>Click a date to begin</span>
        )}
      </div>
    </div>
  );
}

export default function TripWizard({ destinations, packages }: Props) {
  const [step, setStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<GeoCountry | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<GeoPlace | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [customPackage, setCustomPackage] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // The chosen place maps to a real Destination when possible — this drives the
  // package step, dates summary and enquiry just like the old flat selection did.
  const selectedDest = useMemo<Destination | null>(
    () =>
      selectedPlace?.destinationSlug
        ? destinations.find(d => d.slug === selectedPlace.destinationSlug) ?? null
        : null,
    [selectedPlace, destinations]
  );

  const countriesByContinent = CONTINENT_ORDER
    .map(continent => ({ continent, countries: geography.filter(c => c.continent === continent) }))
    .filter(group => group.countries.length > 0);

  const placeImage = (p: GeoPlace): string | undefined =>
    p.image ?? destinations.find(d => d.slug === p.destinationSlug)?.heroImage;

  const placePrice = (p: GeoPlace) =>
    destinations.find(d => d.slug === p.destinationSlug)?.fromPrice ?? null;

  const destPackages = selectedDest
    ? packages.filter(p => p.destinationSlug === selectedDest.slug)
    : [];

  function toggleCategory(slug: string) {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  }

  function toggleActivity(label: string) {
    setSelectedActivities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  }

  function selectPlace(place: GeoPlace) {
    setSelectedPlace(place);
    setSelectedActivities([]);
    setSelectedPackage(null);
    setCustomPackage(false);
  }

  function handleBack() {
    if (step === 0 && selectedPlace) { setSelectedPlace(null); return; }
    if (step === 0 && selectedCountry) { setSelectedCountry(null); return; }
    setStep(s => s - 1);
  }

  function canNext() {
    if (step === 0) return !!selectedPlace;
    if (step === 1) return selectedCategories.length > 0;
    if (step === 2) return !!(selectedPackage || customPackage);
    if (step === 3) return !!startDate;
    if (step === 4) return !!(form.name && form.phone);
    return true;
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
          destination: selectedPlace
            ? `${selectedPlace.name}${selectedCountry ? `, ${selectedCountry.name}` : ""}`
            : "",
          dates: datesStr,
          travelers: `${adults} Adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}`,
          budget,
          interests: [...selectedCategories, ...selectedActivities],
          message: form.message,
          packageTitle: selectedPackage?.title ?? (customPackage ? "Custom Package" : ""),
        }),
      });
      if (res.ok) { setStatus("success"); return; }
    } catch { /* fall through */ }
    setStatus("error");
  }

  const stepSubtitles = [
    "Where in the world are you headed?",
    "What kind of experience are you after?",
    "Any specific package catch your eye?",
    "When do you want to go, and who's coming?",
    "Almost done — how do we reach you?",
  ];

  if (status === "success") {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successInner}>
          <div className={styles.successCheck}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Your Dream Trip is Locked In!</h2>
          <p className={styles.successSub}>
            Thanks, {form.name}! Our travel experts will reach out within 24 hours with a personalised itinerary
            {selectedPlace ? ` for ${selectedPlace.name}` : ""}.
          </p>
          <div className={styles.successDetails}>
            {selectedPlace && <span>📍 {selectedPlace.name}</span>}
            {startDate && <span>📅 {formatDate(startDate)}{endDate ? ` – ${formatDate(endDate)}` : ""}</span>}
            <span>👥 {adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}</span>
          </div>
          <a
            href={`https://wa.me/917499322412?text=${encodeURIComponent(`Hi VMF Holidays! I just submitted a trip request for ${selectedPlace?.name ?? "a destination"}. My name is ${form.name} and my phone is ${form.phone}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.112 1.523 5.836L.057 23.571a.5.5 0 0 0 .617.609l5.878-1.543A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.69-.501-5.232-1.376l-.374-.216-3.878 1.018 1.037-3.788-.236-.386A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Chat on WhatsApp
          </a>
          <Link href="/packages" className={styles.browseLink}>Browse all packages →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <div className={styles.stepPill}>Step {step + 1} of {STEP_LABELS.length}</div>
          <h1 className={styles.pageTitle}>Build Your Dream Journey</h1>
          <p className={styles.pageSub}>{stepSubtitles[step]}</p>
        </div>
        {/* Progress steps */}
        <div className={styles.progressRow}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`${styles.progressItem} ${i <= step ? styles.progressItemActive : ""} ${i < step ? styles.progressItemDone : ""}`}>
              <div className={styles.progressDot}>
                {i < step ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (i + 1)}
              </div>
              <span className={styles.progressLabel}>{label}</span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`${styles.progressLine} ${i < step ? styles.progressLineDone : ""}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className={styles.stepWrap}>

        {/* STEP 1 — DESTINATION (Country › Place › Activities drill-down) */}
        {step === 0 && (
          <div className={styles.step} key="step-0">
            {/* Breadcrumb */}
            <div className={styles.geoCrumbs}>
              <button
                type="button"
                className={`${styles.crumb} ${!selectedCountry ? styles.crumbActive : ""}`}
                onClick={() => { setSelectedCountry(null); setSelectedPlace(null); }}
              >
                🌍 All Countries
              </button>
              {selectedCountry && (
                <>
                  <span className={styles.crumbSep}>›</span>
                  <button
                    type="button"
                    className={`${styles.crumb} ${!selectedPlace ? styles.crumbActive : ""}`}
                    onClick={() => setSelectedPlace(null)}
                  >
                    {selectedCountry.flag} {selectedCountry.name}
                  </button>
                </>
              )}
              {selectedPlace && (
                <>
                  <span className={styles.crumbSep}>›</span>
                  <span className={`${styles.crumb} ${styles.crumbActive}`}>{selectedPlace.name}</span>
                </>
              )}
            </div>

            {/* 0a — Choose country (grouped by continent) */}
            {!selectedCountry && (
              <div className={styles.continents}>
                {countriesByContinent.map(group => (
                  <div key={group.continent} className={styles.continentGroup}>
                    <h3 className={styles.continentLabel}>{group.continent}</h3>
                    <div className={styles.countryGrid}>
                      {group.countries.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          className={styles.countryCard}
                          onClick={() => { setSelectedCountry(c); setSelectedPlace(null); }}
                        >
                          <span className={styles.countryFlag}>{c.flag}</span>
                          <span className={styles.countryName}>{c.name}</span>
                          <span className={styles.countryCount}>
                            {c.places.length} {c.places.length === 1 ? "place" : "places"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 0b — Choose place within country */}
            {selectedCountry && !selectedPlace && (
              <div className={styles.destGrid}>
                {selectedCountry.places.map(place => {
                  const price = placePrice(place);
                  const img = placeImage(place);
                  return (
                    <button
                      key={place.slug}
                      type="button"
                      className={styles.destCard}
                      onClick={() => selectPlace(place)}
                    >
                      <div className={styles.destImgWrap}>
                        {img ? (
                          <Image
                            src={img}
                            alt={place.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className={styles.destImg}
                          />
                        ) : (
                          <div className={styles.destImgFallback} aria-hidden="true">
                            <span className={styles.destImgFlag}>{selectedCountry.flag}</span>
                          </div>
                        )}
                        <div className={styles.destGradient} />
                        <div className={styles.destBottom}>
                          <div className={styles.destName}>{place.name}</div>
                          <div className={styles.destCountry}>{selectedCountry.name}</div>
                        </div>
                        {price != null && (
                          <div className={styles.destPrice}>From ₹{price.toLocaleString("en-IN")}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 0c — Choose activities in the place */}
            {selectedPlace && (
              selectedPlace.activities.length > 0 ? (
                <>
                  <p className={styles.stepHint}>
                    What do you want to do in {selectedPlace.name}?{" "}
                    <span className={styles.hintMuted}>Select all that apply — optional</span>
                  </p>
                  <div className={styles.activityGrid}>
                    {selectedPlace.activities.map(a => (
                      <button
                        key={a}
                        type="button"
                        className={`${styles.activityPill} ${selectedActivities.includes(a) ? styles.activityPillActive : ""}`}
                        onClick={() => toggleActivity(a)}
                      >
                        {selectedActivities.includes(a) && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                        {a}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.noActivities}>
                  <div className={styles.noActivitiesGlyph}>✦</div>
                  <h3>We&apos;ll plan the best of {selectedPlace.name}</h3>
                  <p>No fixed activities listed here yet — continue and our experts will tailor the experiences for you.</p>
                </div>
              )
            )}
          </div>
        )}

        {/* STEP 2 — TRAVEL STYLE */}
        {step === 1 && (
          <div className={styles.step} key="step-1">
            <p className={styles.stepHint}>Select all that apply</p>
            <div className={styles.catGrid}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.slug}
                  type="button"
                  className={`${styles.catCard} ${selectedCategories.includes(cat.slug) ? styles.catCardSelected : ""}`}
                  onClick={() => toggleCategory(cat.slug)}
                >
                  <span className={styles.catEmoji}>{cat.emoji}</span>
                  <span className={styles.catLabel}>{cat.label}</span>
                  <span className={styles.catBlurb}>{cat.blurb}</span>
                  {selectedCategories.includes(cat.slug) && (
                    <div className={styles.catCheckBadge}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — PACKAGE */}
        {step === 2 && (
          <div className={styles.step} key="step-2">
            {destPackages.length > 0 ? (
              <>
                <p className={styles.stepHint}>Choose a package or let us build one from scratch</p>
                <div className={styles.pkgGrid}>
                  {destPackages.map(pkg => (
                    <button
                      key={pkg.slug}
                      type="button"
                      className={`${styles.pkgCard} ${selectedPackage?.slug === pkg.slug ? styles.pkgCardSelected : ""}`}
                      onClick={() => { setSelectedPackage(pkg); setCustomPackage(false); }}
                    >
                      <div className={styles.pkgImgWrap}>
                        <Image
                          src={pkg.heroImage || "/images/placeholder.jpg"}
                          alt={pkg.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={styles.destImg}
                        />
                        {pkg.badge && <span className={styles.pkgBadge}>{pkg.badge}</span>}
                        {selectedPackage?.slug === pkg.slug && (
                          <div className={styles.destCheckBadge}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                          </div>
                        )}
                      </div>
                      <div className={styles.pkgInfo}>
                        <div className={styles.pkgTitle}>{pkg.title}</div>
                        <div className={styles.pkgMeta}>
                          <span>{pkg.duration}</span>
                          <span className={styles.pkgPrice}>From ₹{pkg.fromPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`${styles.pkgCard} ${styles.pkgCardCustom} ${customPackage ? styles.pkgCardSelected : ""}`}
                    onClick={() => { setCustomPackage(true); setSelectedPackage(null); }}
                  >
                    <div className={styles.customIcon}>✦</div>
                    <div className={styles.pkgTitle}>Custom Package</div>
                    <p className={styles.customSub}>We&apos;ll design a trip tailored entirely to you</p>
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.noPackages}>
                <div className={styles.noPackagesGlyph}>✦</div>
                <h3>We&apos;ll build it from scratch</h3>
                <p>No pre-set packages for {selectedDest?.name} yet — our experts will craft a personalised itinerary just for you.</p>
                <button
                  type="button"
                  className={`${styles.pkgCard} ${styles.pkgCardCustom} ${customPackage ? styles.pkgCardSelected : ""}`}
                  style={{ maxWidth: 280, width: "100%" }}
                  onClick={() => setCustomPackage(true)}
                >
                  <div className={styles.customIcon}>✦</div>
                  <div className={styles.pkgTitle}>Build Custom Package</div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — DATES & TRAVELERS */}
        {step === 3 && (
          <div className={`${styles.step} ${styles.stepDates}`} key="step-3">
            <div className={styles.datesLeft}>
              <div className={styles.subhead}>When are you travelling?</div>
              <DatePicker startDate={startDate} endDate={endDate} onRange={(s, e) => { setStartDate(s); setEndDate(e); }} />
            </div>
            <div className={styles.datesRight}>
              <div className={styles.subhead}>Who&apos;s coming?</div>
              <div className={styles.travelerCard}>
                <div className={styles.travelerRow}>
                  <div>
                    <div className={styles.travelerLabel}>Adults</div>
                    <div className={styles.travelerSub}>Age 13+</div>
                  </div>
                  <div className={styles.counter}>
                    <button type="button" className={styles.counterBtn} onClick={() => setAdults(a => Math.max(1, a - 1))}>−</button>
                    <span className={styles.counterVal}>{adults}</span>
                    <button type="button" className={styles.counterBtn} onClick={() => setAdults(a => a + 1)}>+</button>
                  </div>
                </div>
                <div className={styles.travelerRow}>
                  <div>
                    <div className={styles.travelerLabel}>Children</div>
                    <div className={styles.travelerSub}>Age 2–12</div>
                  </div>
                  <div className={styles.counter}>
                    <button type="button" className={styles.counterBtn} onClick={() => setChildren(c => Math.max(0, c - 1))}>−</button>
                    <span className={styles.counterVal}>{children}</span>
                    <button type="button" className={styles.counterBtn} onClick={() => setChildren(c => c + 1)}>+</button>
                  </div>
                </div>
              </div>

              <div className={styles.subhead} style={{ marginTop: 32 }}>Budget per person?</div>
              <div className={styles.budgetGrid}>
                {BUDGETS.map(b => (
                  <button
                    key={b.label}
                    type="button"
                    className={`${styles.budgetCard} ${budget === b.label ? styles.budgetCardActive : ""}`}
                    onClick={() => setBudget(b.label)}
                  >
                    <span className={styles.budgetLabel}>{b.label}</span>
                    <span className={styles.budgetSub}>{b.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — CONTACT */}
        {step === 4 && (
          <div className={`${styles.step} ${styles.stepContact}`} key="step-4">
            <div className={styles.contactGrid}>
              <div className={styles.contactLeft}>
                <div className={styles.subhead}>How do we reach you?</div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input type="text" className={styles.formInput} placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number *</label>
                  <input type="tel" className={styles.formInput} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address <span className={styles.optionalTag}>(optional)</span></label>
                  <input type="email" className={styles.formInput} placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Anything else? <span className={styles.optionalTag}>(optional)</span></label>
                  <textarea className={`${styles.formInput} ${styles.formTextarea}`} placeholder="Special requests, dietary needs, room preferences…" rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>
                {status === "error" && (
                  <p className={styles.errorMsg}>Something went wrong. <a href="https://wa.me/917499322412" target="_blank" rel="noopener noreferrer">Try WhatsApp instead →</a></p>
                )}
              </div>

              {/* Trip summary */}
              <div className={styles.contactRight}>
                <div className={styles.tripSummary}>
                  <div className={styles.summaryHead}>Your Trip Summary</div>
                  {selectedPlace && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryIcon}>📍</span>
                      <div>
                        <div className={styles.summaryLabel}>Destination</div>
                        <div className={styles.summaryVal}>
                          {selectedPlace.name}{selectedCountry ? `, ${selectedCountry.name}` : ""}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedActivities.length > 0 && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryIcon}>🎯</span>
                      <div>
                        <div className={styles.summaryLabel}>Things to do</div>
                        <div className={styles.summaryVal}>{selectedActivities.join(", ")}</div>
                      </div>
                    </div>
                  )}
                  {selectedCategories.length > 0 && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryIcon}>✦</span>
                      <div>
                        <div className={styles.summaryLabel}>Travel Style</div>
                        <div className={styles.summaryVal}>{selectedCategories.map(c => CATEGORIES.find(x => x.slug === c)?.label).join(", ")}</div>
                      </div>
                    </div>
                  )}
                  {(selectedPackage || customPackage) && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryIcon}>🗺</span>
                      <div>
                        <div className={styles.summaryLabel}>Package</div>
                        <div className={styles.summaryVal}>{selectedPackage?.title ?? "Custom Package"}</div>
                      </div>
                    </div>
                  )}
                  {startDate && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryIcon}>📅</span>
                      <div>
                        <div className={styles.summaryLabel}>Travel Dates</div>
                        <div className={styles.summaryVal}>{formatDate(startDate)}{endDate ? ` – ${formatDate(endDate)}` : ""}</div>
                      </div>
                    </div>
                  )}
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryIcon}>👥</span>
                    <div>
                      <div className={styles.summaryLabel}>Travelers</div>
                      <div className={styles.summaryVal}>{adults} Adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children !== 1 ? "ren" : ""}` : ""}</div>
                    </div>
                  </div>
                  {budget && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryIcon}>💰</span>
                      <div>
                        <div className={styles.summaryLabel}>Budget</div>
                        <div className={styles.summaryVal}>{budget}</div>
                      </div>
                    </div>
                  )}
                  <div className={styles.summaryPromise}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    We respond within 24 hours — usually much sooner.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Sticky nav */}
      <div className={styles.navBar}>
        <div className={styles.navInner}>
          {step > 0 || selectedCountry ? (
            <button type="button" className={styles.backBtn} onClick={handleBack}>← Back</button>
          ) : <div />}
          <div className={styles.navRight}>
            {step === 3 && !startDate && <span className={styles.navHint}>Pick your departure date to continue</span>}
            {step < STEP_LABELS.length - 1 ? (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
              >
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!canNext() || status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Get My Personalised Itinerary"}
                {status !== "sending" && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
