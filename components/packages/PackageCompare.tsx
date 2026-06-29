"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import styles from "./PackageCompare.module.css";

export type CompareItem = {
  slug: string;
  title: string;
  destination: string;
  category: string;
  duration: string;
  nights: number;
  fromPrice: number;
  priceOnRequest: boolean;
  heroImage: string;
  hotel: string | null;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function PackageCompare({
  items,
  initial,
}: {
  items: CompareItem[];
  initial: string[];
}) {
  const isValid = (slug: string) => items.some((i) => i.slug === slug);

  const [slots, setSlots] = useState<string[]>(() => {
    const init = initial.filter(isValid).slice(0, 3);
    while (init.length < 3) init.push("");
    return init;
  });

  const selected = slots.map((s) => items.find((i) => i.slug === s)).filter(Boolean) as CompareItem[];

  const setSlot = (idx: number, slug: string) =>
    setSlots((prev) => prev.map((s, i) => (i === idx ? slug : s)));

  const priceOf = (it: CompareItem) =>
    it.priceOnRequest ? "On request" : `from ${formatINR(it.fromPrice)}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.pickers}>
        {[0, 1, 2].map((i) => (
          <select
            key={i}
            className={`form-select ${styles.picker}`}
            value={slots[i]}
            onChange={(e) => setSlot(i, e.target.value)}
            aria-label={`Package ${i + 1} to compare`}
          >
            <option value="">Select a package…</option>
            {items.map((it) => (
              <option
                key={it.slug}
                value={it.slug}
                disabled={slots.includes(it.slug) && slots[i] !== it.slug}
              >
                {it.title}
              </option>
            ))}
          </select>
        ))}
      </div>

      {selected.length < 2 ? (
        <p className={styles.hint}>Pick at least two packages above to compare them side by side.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.rowHead} aria-hidden="true" />
                {selected.map((it) => (
                  <th key={it.slug} className={styles.colHead}>
                    <span
                      className={styles.thumb}
                      style={{ backgroundImage: `url(${it.heroImage})` }}
                      aria-hidden="true"
                    />
                    <span className={styles.colTitle}>{it.title}</span>
                    <span className={styles.colPrice}>{priceOf(it)}</span>
                    <Link href={`/packages/${it.slug}`} className={`btn btn-primary btn--sm ${styles.colBtn}`}>
                      View details
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Destination" cells={selected.map((it) => it.destination)} />
              <Row label="Duration" cells={selected.map((it) => it.duration)} />
              <Row label="Nights" cells={selected.map((it) => String(it.nights))} />
              <Row label="Category" cells={selected.map((it) => cap(it.category))} />
              <Row label="Hotel" cells={selected.map((it) => it.hotel ?? "—")} />
              <ListRow label="Highlights" cells={selected.map((it) => it.highlights)} />
              <ListRow label="Inclusions" cells={selected.map((it) => it.inclusions)} />
              <ListRow label="Not included" cells={selected.map((it) => it.exclusions)} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr>
      <th className={styles.rowHead}>{label}</th>
      {cells.map((c, i) => (
        <td key={i} className={styles.cell}>{c || "—"}</td>
      ))}
    </tr>
  );
}

function ListRow({ label, cells }: { label: string; cells: string[][] }) {
  return (
    <tr>
      <th className={styles.rowHead}>{label}</th>
      {cells.map((list, i) => (
        <td key={i} className={styles.cell}>
          {list.length ? (
            <ul className={styles.list}>
              {list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            "—"
          )}
        </td>
      ))}
    </tr>
  );
}
