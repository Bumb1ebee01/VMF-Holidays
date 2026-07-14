"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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

type Ranked = { item: CompareItem; reason: string };

// Ranks packages worth putting next to what's already chosen: relevance (shared
// destination/category) plus a cheaper price or a featured flag, so a nudge is
// always a fitting alternative rather than filler. Driving both the "compare
// with…" starters (one chosen) and the third-slot suggestion (two chosen) from
// one scorer keeps the reasons consistent across the page.
function rankCandidates(
  selected: CompareItem[],
  items: CompareItem[],
  taken: string[],
  limit: number
): Ranked[] {
  if (selected.length === 0) return [];
  const dests = new Set(selected.map((s) => s.destination));
  const cats = new Set(selected.map((s) => s.category));
  const prices = selected.filter((s) => !s.priceOnRequest).map((s) => s.fromPrice);
  const minPrice = prices.length ? Math.min(...prices) : Infinity;

  const scored: { item: CompareItem; score: number; reason: string }[] = [];
  for (const cand of items) {
    if (taken.includes(cand.slug)) continue;
    const sameDest = dests.has(cand.destination);
    const sameCat = cats.has(cand.category);
    const cheaper = !cand.priceOnRequest && cand.fromPrice < minPrice;
    let score = 0;
    if (sameDest) score += 3;
    if (sameCat) score += 2;
    if (cheaper) score += 2;
    if (cand.featured) score += 1;
    if (score < 2) continue; // must be genuinely related, not filler
    const reason = sameDest
      ? "Same destination"
      : sameCat && cheaper
        ? "Similar style, lower price"
        : sameCat
          ? "Similar style"
          : cheaper
            ? "Lower price"
            : "Popular pick";
    scored.push({ item: cand, score, reason });
  }
  scored.sort((a, b) => b.score - a.score || a.item.fromPrice - b.item.fromPrice);
  return scored.slice(0, limit).map(({ item, reason }) => ({ item, reason }));
}

// window.location.origin can't be read while rendering on the server, and reading
// it in an effect would set state on mount. useSyncExternalStore is the sanctioned
// way to hand React a different value per environment: it serves "" through
// hydration (so the markup matches) and swaps in the real origin straight after.
const subscribeToNothing = () => () => {};
const readOrigin = () => window.location.origin;
const readOriginOnServer = () => "";

function Icon({ name }: { name: "columns" | "diff" | "share" }) {
  const paths = {
    columns: (
      <>
        <rect x="3" y="4" width="5" height="16" rx="1.5" />
        <rect x="9.5" y="4" width="5" height="16" rx="1.5" />
        <rect x="16" y="4" width="5" height="16" rx="1.5" />
      </>
    ),
    diff: (
      <>
        <rect x="3" y="5" width="18" height="5" rx="1.5" />
        <rect x="3" y="14" width="11" height="5" rx="1.5" opacity="0.45" />
      </>
    ),
    share: (
      <>
        <circle cx="6" cy="12" r="2.6" />
        <circle cx="18" cy="6" r="2.6" />
        <circle cx="18" cy="18" r="2.6" />
        <path d="M8.4 10.9 15.6 7.2M8.4 13.1l7.2 3.7" stroke="currentColor" strokeWidth="1.6" fill="none" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.valueIcon}>
      {paths[name]}
    </svg>
  );
}

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
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const origin = useSyncExternalStore(subscribeToNothing, readOrigin, readOriginOnServer);

  const selected = useMemo(
    () =>
      slots
        .map((s) => items.find((i) => i.slug === s))
        .filter(Boolean) as CompareItem[],
    [slots, items]
  );

  // Keep the URL in step with the on-screen selection so the address bar is always
  // a shareable snapshot — without a server round-trip (replaceState, not router).
  useEffect(() => {
    const chosen = slots.filter(Boolean);
    const qs = chosen.length ? `?p=${chosen.join(",")}` : "";
    window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
  }, [slots]);

  useEffect(() => {
    if (pickerFor === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickerFor(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [pickerFor]);

  const setSlot = (idx: number, slug: string) =>
    setSlots((prev) => prev.map((s, i) => (i === idx ? slug : s)));

  const addToFirstEmpty = (slug: string) =>
    setSlots((prev) => {
      const idx = prev.findIndex((s) => !s);
      if (idx === -1) return prev;
      return prev.map((s, i) => (i === idx ? slug : s));
    });

  const openPicker = (idx: number) => {
    setQuery("");
    setPickerFor(idx);
  };

  // Starters for a cold arrival: one representative pair per category, favouring
  // featured trips and two different destinations so the pair reads as a real
  // choice rather than two near-identical rows.
  const quickPairs = useMemo(() => {
    const byCat = new Map<string, CompareItem[]>();
    for (const it of items) {
      const list = byCat.get(it.category);
      if (list) list.push(it);
      else byCat.set(it.category, [it]);
    }
    const pairs: { label: string; category: string; slugs: [string, string] }[] = [];
    for (const [category, list] of byCat) {
      if (list.length < 2) continue;
      const ranked = [...list].sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.fromPrice - b.fromPrice
      );
      const first = ranked[0];
      const second =
        ranked.find((x) => x.slug !== first.slug && x.destination !== first.destination) ??
        ranked[1];
      if (!second) continue;
      pairs.push({
        label:
          first.destination === second.destination
            ? `${first.title} vs ${second.title}`
            : `${first.destination} vs ${second.destination}`,
        category: cap(category),
        slugs: [first.slug, second.slug],
      });
    }
    return pairs.slice(0, 3);
  }, [items]);

  const companions = useMemo(
    () => (selected.length === 1 ? rankCandidates(selected, items, slots, 3) : []),
    [selected, items, slots]
  );

  const suggestion = useMemo(
    () => (selected.length === 2 ? rankCandidates(selected, items, slots, 1)[0] ?? null : null),
    [selected, items, slots]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.destination.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
    );
  }, [items, query]);

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
      <div className={styles.slots}>
        {[0, 1, 2].map((i) => {
          const it = items.find((x) => x.slug === slots[i]);
          if (!it) {
            return (
              <button
                key={i}
                type="button"
                className={styles.slotEmpty}
                onClick={() => openPicker(i)}
              >
                <span className={styles.slotPlus} aria-hidden="true">
                  +
                </span>
                <span>{selected.length ? "Add another" : "Add a package"}</span>
              </button>
            );
          }
          return (
            <div key={i} className={styles.slot}>
              <span
                className={styles.slotThumb}
                style={{ backgroundImage: `url(${it.heroImage})` }}
                aria-hidden="true"
              />
              <span className={styles.slotBody}>
                <span className={styles.slotTitle}>{it.title}</span>
                <span className={styles.slotMeta}>
                  {it.destination} · {it.duration}
                </span>
                <span className={styles.slotPrice}>{priceLabel(it)}</span>
              </span>
              <span className={styles.slotActions}>
                <button
                  type="button"
                  className={styles.slotChange}
                  onClick={() => openPicker(i)}
                >
                  Change
                </button>
                <button
                  type="button"
                  className={styles.slotClear}
                  onClick={() => setSlot(i, "")}
                  aria-label={`Remove ${it.title}`}
                >
                  ×
                </button>
              </span>
            </div>
          );
        })}
      </div>

      {selected.length < 2 ? (
        <div className={styles.starter}>
          {selected.length === 0 && quickPairs.length > 0 && (
            <div className={styles.quick}>
              <span className={styles.quickLabel}>Popular comparisons</span>
              <div className={styles.quickRow}>
                {quickPairs.map((p) => (
                  <button
                    key={p.slugs.join()}
                    type="button"
                    className={styles.quickChip}
                    onClick={() => setSlots([p.slugs[0], p.slugs[1], ""])}
                  >
                    <span className={styles.quickChipLabel}>{p.label}</span>
                    <span className={styles.quickChipCat}>{p.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selected.length === 1 && companions.length > 0 && (
            <div className={styles.quick}>
              <span className={styles.quickLabel}>
                Compare {selected[0].title} with…
              </span>
              <div className={styles.compRow}>
                {companions.map((c) => (
                  <button
                    key={c.item.slug}
                    type="button"
                    className={styles.compCard}
                    onClick={() => addToFirstEmpty(c.item.slug)}
                  >
                    <span
                      className={styles.compThumb}
                      style={{ backgroundImage: `url(${c.item.heroImage})` }}
                      aria-hidden="true"
                    />
                    <span className={styles.compBody}>
                      <span className={styles.compReason}>{c.reason}</span>
                      <span className={styles.compTitle}>{c.item.title}</span>
                      <span className={styles.compMeta}>
                        {c.item.destination} · {priceLabel(c.item)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul className={styles.value}>
            <li className={styles.valueItem}>
              <Icon name="columns" />
              <span className={styles.valueText}>
                <strong>Side by side</strong>
                Price, duration, hotel and what&apos;s included, in one view.
              </span>
            </li>
            <li className={styles.valueItem}>
              <Icon name="diff" />
              <span className={styles.valueText}>
                <strong>Only the differences</strong>
                Hide everything the trips share and see what actually sets them apart.
              </span>
            </li>
            <li className={styles.valueItem}>
              <Icon name="share" />
              <span className={styles.valueText}>
                <strong>Decide as a group</strong>
                Send the exact comparison on WhatsApp — the link opens right back here.
              </span>
            </li>
          </ul>
        </div>
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

      {pickerFor !== null && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a package to compare"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPickerFor(null);
          }}
        >
          <div className={styles.picker}>
            <div className={styles.pickerHead}>
              <input
                ref={searchRef}
                type="search"
                className={`form-input ${styles.pickerSearch}`}
                placeholder="Search by name, destination or type…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search packages"
              />
              <button
                type="button"
                className={styles.pickerClose}
                onClick={() => setPickerFor(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {results.length === 0 ? (
              <p className={styles.pickerEmpty}>
                Nothing matches &ldquo;{query.trim()}&rdquo;. Try a destination like Goa or Bali.
              </p>
            ) : (
              <ul className={styles.pickerList}>
                {results.map((it) => {
                  const takenElsewhere =
                    slots.includes(it.slug) && slots[pickerFor] !== it.slug;
                  return (
                    <li key={it.slug}>
                      <button
                        type="button"
                        className={styles.pickerRow}
                        disabled={takenElsewhere}
                        onClick={() => {
                          setSlot(pickerFor, it.slug);
                          setPickerFor(null);
                        }}
                      >
                        <span
                          className={styles.pickerThumb}
                          style={{ backgroundImage: `url(${it.heroImage})` }}
                          aria-hidden="true"
                        />
                        <span className={styles.pickerBody}>
                          <span className={styles.pickerTitle}>{it.title}</span>
                          <span className={styles.pickerMeta}>
                            {it.destination} · {it.duration} · {cap(it.category)}
                          </span>
                        </span>
                        <span className={styles.pickerPrice}>
                          {takenElsewhere ? "Added" : priceLabel(it)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
