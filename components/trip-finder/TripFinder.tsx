"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatINR } from "@/lib/utils";
import {
  matchTrips,
  summariseAnswers,
  BUDGET_TIERS,
  CUSTOM_BUDGET,
  customBudgetChoice,
  type QuizAnswers,
  type BudgetChoice,
  type FinderDestination,
  type FinderPackage,
} from "@/lib/trip-finder";
import styles from "./TripFinder.module.css";

type OptionDef = { id: string; label: string; icon: string };
type Step =
  | { key: "vibe" | "who" | "region"; kind: "options"; title: string; options: OptionDef[] }
  | { key: "budget"; kind: "budget"; title: string };

const STEPS: Step[] = [
  {
    key: "vibe",
    kind: "options",
    title: "What's your ideal holiday vibe?",
    options: [
      { id: "beach", label: "Beaches & relaxation", icon: "🏖️" },
      { id: "mountains", label: "Mountains & nature", icon: "⛰️" },
      { id: "culture", label: "Culture & heritage", icon: "🏛️" },
      { id: "adventure", label: "Adventure & thrills", icon: "🧗" },
      { id: "city", label: "City & shopping", icon: "🌆" },
    ],
  },
  {
    key: "who",
    kind: "options",
    title: "Who's travelling?",
    options: [
      { id: "couple", label: "Just us two", icon: "💑" },
      { id: "family", label: "Family with kids", icon: "👨‍👩‍👧" },
      { id: "friends", label: "Group of friends", icon: "👯" },
      { id: "group", label: "Large group (10+)", icon: "🎉" },
      { id: "solo", label: "Solo", icon: "🎒" },
    ],
  },
  { key: "budget", kind: "budget", title: "What's your budget per person?" },
  {
    key: "region",
    kind: "options",
    title: "India or abroad?",
    options: [
      { id: "domestic", label: "India", icon: "🛕" },
      { id: "international", label: "Abroad", icon: "🌍" },
      { id: "any", label: "Surprise me", icon: "🎲" },
    ],
  },
];

const WA_NUMBER = "917499322412";

const priceLabel = (p: FinderPackage) =>
  p.priceOnRequest ? "On request" : `from ${formatINR(p.fromPrice)}`;

const COUNT_WORD: Record<number, string> = { 1: "One", 2: "Two", 3: "Three" };

const labelFor = (key: "vibe" | "who" | "region", id: string | undefined) => {
  const s = STEPS.find((st) => st.key === key);
  return (s?.kind === "options" && s.options.find((o) => o.id === id)?.label) || "";
};

export default function TripFinder({
  destinations,
  packages,
}: {
  destinations: FinderDestination[];
  packages: FinderPackage[];
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [done, setDone] = useState(false);
  const [customBudget, setCustomBudget] = useState(false);
  const [sliderVal, setSliderVal] = useState(CUSTOM_BUDGET.default);

  const results = useMemo(
    () => (done ? matchTrips(answers as QuizAnswers, destinations, packages) : []),
    [done, answers, destinations, packages]
  );

  const advance = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const pickOption = (key: "vibe" | "who" | "region", id: string) => {
    setAnswers((prev) => ({ ...prev, [key]: id }));
    advance();
  };

  const pickBudget = (choice: BudgetChoice) => {
    setAnswers((prev) => ({ ...prev, budget: choice }));
    advance();
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    setCustomBudget(false);
    setSliderVal(CUSTOM_BUDGET.default);
  };

  const waHref = useMemo(() => {
    const lines = [
      "Hi VMF Holidays! I just took your trip finder quiz 🙂",
      `Vibe: ${labelFor("vibe", answers.vibe)}`,
      `Travelling: ${labelFor("who", answers.who)}`,
      `Budget: ${answers.budget?.label ?? ""}`,
      `Preference: ${labelFor("region", answers.region)}`,
      results[0] ? `Top match: ${results[0].pkg.title}` : "",
      "Could you help me plan it?",
    ].filter(Boolean);
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [answers, results]);

  if (done) {
    return (
      <div className={styles.results}>
        <div className={styles.resultsHead}>
          <span className="eyebrow">Your matches</span>
          <h2 className={styles.resultsTitle}>
            {results.length > 0
              ? `${COUNT_WORD[results.length]} trip${results.length > 1 ? "s" : ""} we think you'll love`
              : "Let's find your trip together"}
          </h2>
          <p className={styles.resultsSub}>
            {results.length > 0
              ? `Because you're after ${summariseAnswers(answers as QuizAnswers)}. Open a trip for the details, or message us and we'll take it from here.`
              : "We didn't find an exact match this time — but we plan trips like these every day."}
          </p>
        </div>

        {results.length > 0 ? (
          <div className={styles.resultsGrid}>
            {results.map((r, i) => (
              <motion.article
                key={r.destination.slug}
                className={styles.card}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <span
                  className={styles.cardThumb}
                  style={{ backgroundImage: `url(${r.destination.heroImage})` }}
                  aria-hidden="true"
                >
                  <span className={styles.cardRank}>#{i + 1} match</span>
                </span>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{r.destination.name}</h3>
                  <span className={styles.cardCountry}>{r.destination.country}</span>
                  <p className={styles.cardPitch}>{r.pitch}</p>
                  {r.reasons.length > 0 && (
                    <div className={styles.reasonRow}>
                      {r.reasons.map((reason) => (
                        <span key={reason} className={styles.reasonChip}>
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className={styles.pkgRow}>
                    <div className={styles.pkgInfo}>
                      <span className={styles.pkgLabel}>Top pick</span>
                      <span className={styles.pkgTitle}>{r.pkg.title}</span>
                      <span className={styles.pkgMeta}>
                        {r.pkg.duration} · {priceLabel(r.pkg)}
                      </span>
                    </div>
                    <Link
                      href={`/packages/${r.pkg.slug}`}
                      className={`btn btn-primary btn--sm ${styles.pkgBtn}`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <p className={styles.fallback}>
            We couldn&apos;t find a perfect match — <Link href="/destinations">browse all destinations</Link>{" "}
            or <Link href="/contact">tell us what you&apos;re after</Link> and we&apos;ll plan it for you.
          </p>
        )}

        <div className={styles.resultsCta}>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn--lg">
            Plan this on WhatsApp
          </a>
          <Link href="/trip-builder" className="btn btn-outline btn--lg">
            Build a custom trip
          </Link>
          <button type="button" className={styles.restart} onClick={restart}>
            ↻ Start over
          </button>
        </div>
      </div>
    );
  }

  const s = STEPS[step];

  return (
    <div className={styles.quiz}>
      <div className={styles.progress}>
        <div className={styles.progressBar} style={{ width: `${(step / STEPS.length) * 100}%` }} />
      </div>
      <span className={styles.progressText}>
        Question {step + 1} of {STEPS.length}
      </span>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className={styles.qTitle}>{s.title}</h2>

        {s.kind === "options" ? (
          <div className={styles.options}>
            {s.options.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`${styles.option} ${answers[s.key] === o.id ? styles.optionActive : ""}`}
                onClick={() => pickOption(s.key, o.id)}
              >
                <span className={styles.optionIcon} aria-hidden="true">
                  {o.icon}
                </span>
                <span className={styles.optionLabel}>{o.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.budget}>
            <div className={styles.options}>
              {BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.label}
                  type="button"
                  className={`${styles.option} ${!customBudget && answers.budget?.label === tier.label ? styles.optionActive : ""}`}
                  onClick={() => {
                    setCustomBudget(false);
                    pickBudget({ min: tier.min, max: tier.max, label: tier.label });
                  }}
                >
                  <span className={styles.optionIcon} aria-hidden="true">
                    {tier.icon}
                  </span>
                  <span className={styles.optionLabel}>{tier.label}</span>
                </button>
              ))}
              <button
                type="button"
                className={`${styles.option} ${customBudget ? styles.optionActive : ""}`}
                onClick={() => setCustomBudget((v) => !v)}
              >
                <span className={styles.optionIcon} aria-hidden="true">
                  🎚️
                </span>
                <span className={styles.optionLabel}>Set my own</span>
              </button>
            </div>

            {customBudget && (
              <div className={styles.sliderBox}>
                <div className={styles.sliderValue}>
                  {customBudgetChoice(sliderVal).label}
                  <span className={styles.sliderPer}> per person</span>
                </div>
                <input
                  type="range"
                  className={styles.slider}
                  min={CUSTOM_BUDGET.min}
                  max={CUSTOM_BUDGET.max}
                  step={CUSTOM_BUDGET.step}
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  aria-label="Budget per person"
                />
                <div className={styles.sliderScale}>
                  <span>₹15k</span>
                  <span>₹2L+</span>
                </div>
                <button
                  type="button"
                  className={`btn btn-primary ${styles.sliderBtn}`}
                  onClick={() => pickBudget(customBudgetChoice(sliderVal))}
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {step > 0 && (
        <button type="button" className={styles.back} onClick={() => setStep(step - 1)}>
          ← Back
        </button>
      )}
    </div>
  );
}
