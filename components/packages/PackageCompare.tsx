"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";
import ShareActions from "@/components/club/ShareActions";
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
  featured: boolean;
  badge: string | null;
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const priceLabel = (it: CompareItem) =>
  it.priceOnRequest ? "On request" : `from ${formatINR(it.fromPrice)}`;

// Scalar attributes rendered one-per-row and eligible for difference highlighting.
const SCALAR_ROWS: { label: string; get: (it: CompareItem) => string }[] = [
  { label: "Price", get: priceLabel },
  { label: "Destination", get: (it) => it.destination },
  { label: "Duration", get: (it) => it.duration },
  { label: "Nights", get: (it) => String(it.nights) },
  { label: "Category", get: (it) => cap(it.category) },
  { label: "Hotel", get: (it) => it.hotel ?? "—" },
];

const LIST_ROWS: { label: string; get: (it: CompareItem) => string[] }[] = [
  { label: "Highlights", get: (it) => it.highlights },
  { label: "Inclusions", get: (it) => it.inclusions },
  { label: "Exclusions", get: (it) => it.exclusions },
];

const allEqual = (values: string[]) => values.every((v) => v === values[0]);

// Entries present in every selected package's list — the "common ground". Anything
// outside this set is what actually differs, and gets highlighted.
const commonItems = (lists: string[][]) =>
  lists.reduce<string[]>(
    (acc, list) => acc.filter((x) => list.includes(x)),
    lists[0] ?? []
  );

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
  const [diffOnly, setDiffOnly] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const selected = slots
    .map((s) => items.find((i) => i.slug === s))
    .filter(Boolean) as CompareItem[];

  // Keep the URL in step with the on-screen selection so the address bar is always
  // a shareable snapshot — without a server round-trip (replaceState, not router).
  useEffect(() => {
    const chosen = slots.filter(Boolean);
    const qs = chosen.length ? `?p=${chosen.join(",")}` : "";
    window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
  }, [slots]);

  const setSlot = (idx: number, slug: string) =>
    setSlots((prev) => prev.map((s, i) => (i === idx ? slug : s)));

  const addToFirstEmpty = (slug: string) =>
    setSlots((prev) => {
      const idx = prev.findIndex((s) => !s);
      if (idx === -1) return prev;
      return prev.map((s, i) => (i === idx ? slug : s));
    });

  // "You might also consider" — surfaced only while exactly two are compared (a slot
  // is free). Scored on relevance (shared destination/category) plus a cheaper price
  // or a featured flag, so the nudge is a fitting third option, not a random one.
  const suggestion = useMemo(() => {
    if (selected.length !== 2) return null;
    const dests = new Set(selected.map((s) => s.destination));
    const cats = new Set(selected.map((s) => s.category));
    const prices = selected.filter((s) => !s.priceOnRequest).map((s) => s.fromPrice);
    const minPrice = prices.length ? Math.min(...prices) : Infinity;

    let best: { item: CompareItem; score: number } | null = null;
    for (const cand of items) {
      if (slots.includes(cand.slug)) continue;
      const sameDest = dests.has(cand.destination);
      const sameCat = cats.has(cand.category);
      const cheaper = !cand.priceOnRequest && cand.fromPrice < minPrice;
      let score = 0;
      if (sameDest) score += 3;
      if (sameCat) score += 2;
      if (cheaper) score += 2;
      if (cand.featured) score += 1;
      if (score < 2) continue; // must be genuinely related, not filler
      if (
        !best ||
        score > best.score ||
        (score === best.score && cand.fromPrice < best.item.fromPrice)
      ) {
        best = { item: cand, score };
      }
    }
    if (!best) return null;

    const c = best.item;
    const sameDest = dests.has(c.destination);
    const sameCat = cats.has(c.category);
    const cheaper = !c.priceOnRequest && c.fromPrice < minPrice;
    const reason = sameDest
      ? "Same destination"
      : sameCat && cheaper
        ? "Similar style, lower price"
        : sameCat
          ? "Similar style"
          : cheaper
            ? "Lower price"
            : "Popular pick";
    return { item: c, reason };
  }, [items, slots, selected]);

  const chosen = slots.filter(Boolean);
  const shareLink = origin ? `${origin}/compare?p=${chosen.join(",")}` : "";
  const shareMessage =
    selected.length >= 2
      ? `Help me pick our trip — comparing ${selected
          .map((s) => s.title)
          .join(" and ")}. Which one do you prefer?`
      : "";

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
        <>
          <div className={styles.controls}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={diffOnly}
                onChange={(e) => setDiffOnly(e.target.checked)}
              />
              Show differences only
            </label>
            <span className={styles.legend}>
              <span className={styles.legendSwatch} aria-hidden="true" />
              Highlighted = differs between trips
            </span>
          </div>

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
                      <span className={styles.colPrice}>{priceLabel(it)}</span>
                      <Link href={`/packages/${it.slug}`} className={`btn btn-primary btn--sm ${styles.colBtn}`}>
                        View details
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCALAR_ROWS.map(({ label, get }) => {
                  const cells = selected.map(get);
                  const differs = !allEqual(cells);
                  if (diffOnly && !differs) return null;
                  return (
                    <tr key={label} className={differs ? styles.rowDiff : undefined}>
                      <th className={styles.rowHead}>{label}</th>
                      {cells.map((c, i) => (
                        <td
                          key={i}
                          className={`${styles.cell} ${differs ? styles.cellDiff : ""}`}
                        >
                          {c || "—"}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {LIST_ROWS.map(({ label, get }) => {
                  const lists = selected.map(get);
                  const common = commonItems(lists);
                  const differs = lists.some((l) => l.length !== common.length);
                  if (diffOnly && !differs) return null;
                  return (
                    <tr key={label} className={differs ? styles.rowDiff : undefined}>
                      <th className={styles.rowHead}>{label}</th>
                      {lists.map((list, i) => (
                        <td key={i} className={styles.cell}>
                          {list.length ? (
                            <ul className={styles.list}>
                              {list.map((item) => (
                                <li
                                  key={item}
                                  className={common.includes(item) ? undefined : styles.liDiff}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "—"
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {suggestion && (
            <div className={styles.suggest}>
              <span className={styles.suggestEyebrow}>You might also consider</span>
              <div className={styles.suggestCard}>
                <span
                  className={styles.suggestThumb}
                  style={{ backgroundImage: `url(${suggestion.item.heroImage})` }}
                  aria-hidden="true"
                />
                <div className={styles.suggestBody}>
                  <span className={styles.suggestReason}>{suggestion.reason}</span>
                  <span className={styles.suggestTitle}>{suggestion.item.title}</span>
                  <span className={styles.suggestMeta}>
                    {suggestion.item.destination} · {priceLabel(suggestion.item)}
                  </span>
                </div>
                <div className={styles.suggestActions}>
                  <button
                    type="button"
                    className="btn btn-outline btn--sm"
                    onClick={() => addToFirstEmpty(suggestion.item.slug)}
                  >
                    Add to compare
                  </button>
                  <Link
                    href={`/packages/${suggestion.item.slug}`}
                    className={`btn btn-primary btn--sm ${styles.suggestView}`}
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          )}

          {shareLink && (
            <div className={styles.shareBar}>
              <div className={styles.shareCopy}>
                <span className={styles.shareTitle}>Deciding as a group?</span>
                <span className={styles.shareSub}>
                  Send this exact comparison to everyone — the link opens right back here.
                </span>
              </div>
              <ShareActions
                link={shareLink}
                message={shareMessage}
                showLink
                linkLabel="Comparison link"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
