"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  allItems,
  categoryTotal,
  computeBalances,
  computeLedger,
  settle,
  itemShares,
  currencyByCode,
  formatMoney,
  CURRENCIES,
  type Person,
  type Category,
  type Expense,
  type SplitMode,
} from "@/lib/expense-split";
import styles from "./ExpenseSplitter.module.css";

const STORAGE_KEY = "vmf-expense-splitter-v2";

const PRESET_CATEGORIES: { id: string; name: string; icon: string }[] = [
  { id: "cat-stay", name: "Stay", icon: "🏨" },
  { id: "cat-food", name: "Food & Drink", icon: "🍽️" },
  { id: "cat-transport", name: "Transport", icon: "🚕" },
  { id: "cat-activities", name: "Activities", icon: "🎟️" },
  { id: "cat-shopping", name: "Shopping", icon: "🛍️" },
  { id: "cat-other", name: "Other", icon: "🧾" },
];

const defaultCategories = (): Category[] => PRESET_CATEGORIES.map((c) => ({ ...c, items: [] }));
const DEFAULT_PEOPLE: Person[] = [
  { id: "seed-1", name: "" },
  { id: "seed-2", name: "" },
];

interface Persisted {
  tripName: string;
  tripDates: string;
  currencyCode: string;
  people: Person[];
  categories: Category[];
}

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function initials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

export default function ExpenseSplitter() {
  const [tripName, setTripName] = useState("");
  const [tripDates, setTripDates] = useState("");
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [people, setPeople] = useState<Person[]>(DEFAULT_PEOPLE);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loaded, setLoaded] = useState(false);

  // Inline add-item form (one open at a time, scoped to a category).
  const [openCatId, setOpenCatId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [sharedBy, setSharedBy] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [draftMode, setDraftMode] = useState<SplitMode>("even");
  const [exactInputs, setExactInputs] = useState<Record<string, string>>({});
  const [percentInputs, setPercentInputs] = useState<Record<string, string>>({});

  const [newCat, setNewCat] = useState("");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const cur = currencyByCode(currencyCode);

  // ── Load once ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Persisted;
        /* eslint-disable react-hooks/set-state-in-effect */
        if (data.people?.length) setPeople(data.people);
        if (data.categories?.length) setCategories(data.categories);
        if (data.tripName) setTripName(data.tripName);
        if (data.tripDates) setTripDates(data.tripDates);
        if (data.currencyCode) setCurrencyCode(data.currencyCode);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      /* corrupt storage — start fresh */
    }
    setLoaded(true);
  }, []);

  // ── Persist ──
  useEffect(() => {
    if (!loaded) return;
    const data: Persisted = { tripName, tripDates, currencyCode, people, categories };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable — still works in-session */
    }
  }, [loaded, tripName, tripDates, currencyCode, people, categories]);

  const namedPeople = useMemo(() => people.filter((p) => p.name.trim()), [people]);
  const namedIds = useMemo(() => namedPeople.map((p) => p.id), [namedPeople]);
  const namedKey = namedIds.join(",");

  // Keep the open draft valid + default to splitting between everyone.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setPaidBy((prev) => (namedIds.includes(prev) ? prev : namedIds[0] ?? ""));
    setSharedBy((prev) => {
      const kept = prev.filter((id) => namedIds.includes(id));
      return kept.length ? kept : namedIds;
    });
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namedKey]);

  const items = useMemo(() => allItems(categories), [categories]);
  const total = useMemo(() => items.reduce((s, i) => s + i.amount, 0), [items]);
  const ledger = useMemo(() => computeLedger(namedPeople, items), [namedPeople, items]);
  const settlements = useMemo(
    () => settle(computeBalances(namedPeople, items)),
    [namedPeople, items]
  );
  const maxAbsNet = useMemo(
    () => Math.max(1, ...ledger.map((l) => Math.abs(l.net))),
    [ledger]
  );

  const nameById = (id: string) => people.find((p) => p.id === id)?.name.trim() || "Someone";
  const enoughPeople = namedPeople.length >= 2;

  const toggleItem = (id: string) =>
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Each sharer's share of one item, honouring its split mode.
  const shareBreakdown = (it: Expense) =>
    itemShares(it).map((s) => ({ id: s.personId, name: nameById(s.personId), amount: s.amount }));

  // Compact "who" label — "Everyone (4)" when the whole group shares it, else names.
  const sharersLabel = (it: Expense) => {
    const all = namedPeople.length > 0 && namedPeople.every((p) => it.sharedBy.includes(p.id));
    return all ? `Everyone (${it.sharedBy.length})` : it.sharedBy.map(nameById).join(", ");
  };

  // How an item is split, in words — for the item meta line and breakdown.
  const modeLabel = (it: Expense) =>
    it.splitMode === "exact" ? "exact amounts" : it.splitMode === "percent" ? "by %" : "split evenly";

  // Each person's total share within a category (sum of their item shares).
  const categoryShares = (cat: Category) => {
    const totals = new Map<string, number>();
    for (const it of cat.items) {
      for (const s of itemShares(it)) totals.set(s.personId, (totals.get(s.personId) ?? 0) + s.amount);
    }
    return [...totals.entries()].map(([id, amount]) => ({ id, name: nameById(id), amount }));
  };

  // Live running totals for the exact / percent allocation inputs.
  const exactTotal = namedPeople.reduce((s, p) => {
    const v = Math.round(parseFloat(exactInputs[p.id] || "") * 100);
    return s + (Number.isFinite(v) && v > 0 ? v : 0);
  }, 0);
  const percentTotal = namedPeople.reduce((s, p) => {
    const v = parseFloat(percentInputs[p.id] || "");
    return s + (Number.isFinite(v) && v > 0 ? v : 0);
  }, 0);
  const percentOk = Math.abs(percentTotal - 100) < 0.01;

  // ── People ──
  const addPerson = () => setPeople((prev) => [...prev, { id: uid(), name: "" }]);
  const renamePerson = (id: string, name: string) =>
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  const removePerson = (id: string) => {
    setPeople((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        items: c.items
          .map((it) => ({ ...it, sharedBy: it.sharedBy.filter((s) => s !== id) }))
          .filter((it) => it.paidBy !== id && it.sharedBy.length > 0),
      }))
    );
  };

  // ── Categories ──
  const renameCategory = (id: string, name: string) =>
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (openCatId === id) setOpenCatId(null);
  };
  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    setCategories((prev) => [...prev, { id: uid(), name, icon: "🏷️", items: [] }]);
    setNewCat("");
  };

  // ── Items ──
  const openForm = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    setOpenCatId(catId);
    setLabel("");
    setAmount("");
    setFormError("");
    setPaidBy(namedIds[0] ?? "");
    setSharedBy(namedIds);
    setDraftMode(cat?.splitMode ?? "even");
    setExactInputs({});
    setPercentInputs({});
  };
  const toggleShared = (id: string) =>
    setSharedBy((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const addItem = (catId: string) => {
    if (!paidBy) {
      setFormError("Add at least two people first.");
      return;
    }
    const base = { id: uid(), label: label.trim() || "Item", paidBy };
    let item: Expense;

    if (draftMode === "exact") {
      const entries = namedPeople
        .map((p) => ({ id: p.id, paise: Math.round(parseFloat(exactInputs[p.id] || "") * 100) }))
        .filter((e) => Number.isFinite(e.paise) && e.paise > 0);
      if (entries.length === 0) {
        setFormError("Enter at least one person's amount.");
        return;
      }
      item = {
        ...base,
        amount: entries.reduce((s, e) => s + e.paise, 0),
        sharedBy: entries.map((e) => e.id),
        splitMode: "exact",
        exact: Object.fromEntries(entries.map((e) => [e.id, e.paise])),
      };
    } else if (draftMode === "percent") {
      const paise = Math.round(parseFloat(amount) * 100);
      if (!Number.isFinite(paise) || paise <= 0) {
        setFormError("Enter the total amount.");
        return;
      }
      const entries = namedPeople
        .map((p) => ({ id: p.id, pct: parseFloat(percentInputs[p.id] || "") }))
        .filter((e) => Number.isFinite(e.pct) && e.pct > 0);
      const sumPct = entries.reduce((s, e) => s + e.pct, 0);
      if (entries.length === 0 || Math.abs(sumPct - 100) > 0.01) {
        setFormError(`Percentages must add up to 100% (currently ${sumPct || 0}%).`);
        return;
      }
      item = {
        ...base,
        amount: paise,
        sharedBy: entries.map((e) => e.id),
        splitMode: "percent",
        percent: Object.fromEntries(entries.map((e) => [e.id, e.pct])),
      };
    } else {
      const paise = Math.round(parseFloat(amount) * 100);
      if (!Number.isFinite(paise) || paise <= 0) {
        setFormError("Enter an amount greater than zero.");
        return;
      }
      if (sharedBy.length === 0) {
        setFormError("Pick who this is split between.");
        return;
      }
      item = { ...base, amount: paise, sharedBy: [...sharedBy], splitMode: "even" };
    }

    // Remember the chosen mode as the category's default for the next item.
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, splitMode: draftMode, items: [item, ...c.items] } : c))
    );
    setLabel("");
    setAmount("");
    setExactInputs({});
    setPercentInputs({});
    setFormError("");
  };

  const removeItem = (catId: string, itemId: string) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c))
    );

  const clearAll = () => {
    if (!confirm("Clear the whole trip — people and all expenses? This can't be undone.")) return;
    setPeople(DEFAULT_PEOPLE);
    setCategories(defaultCategories());
    setTripName("");
    setTripDates("");
    setOpenCatId(null);
  };

  // ── WhatsApp share ──
  const settlementText = useMemo(() => {
    const lines: string[] = [];
    lines.push(`*Trip Settlement${tripName.trim() ? ` — ${tripName.trim()}` : ""}*`);
    lines.push("");
    lines.push(`Total spent: ${formatMoney(total, cur)}`);
    lines.push(`${namedPeople.length} people · ${items.length} item${items.length === 1 ? "" : "s"}`);
    lines.push("");
    if (settlements.length === 0) lines.push("Everyone's square — no payments needed. 🎉");
    else {
      lines.push("*Who pays whom:*");
      for (const s of settlements) lines.push(`• ${nameById(s.fromId)} → ${nameById(s.toId)}: ${formatMoney(s.amount, cur)}`);
    }
    lines.push("");
    lines.push("Split with VMF Holidays' free Group Trip Expense Splitter.");
    return lines.join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripName, total, cur, namedPeople.length, items.length, settlements]);

  const shareHref = `https://wa.me/?text=${encodeURIComponent(settlementText)}`;
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(settlementText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const exportPdf = async () => {
    if (items.length === 0 || exporting) return;
    setExporting(true);
    try {
      const { generateExpensePdf } = await import("@/lib/expense-pdf");
      await generateExpensePdf({ tripName, tripDates, currency: cur, people: namedPeople, categories });
    } catch (err) {
      console.error("[expense-pdf]", err);
      alert("Sorry — the PDF could not be generated. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.tool}>
      {/* ── Trip meta ── */}
      <div className={styles.metaRow}>
        <label className={styles.metaField}>
          <span className={styles.metaLabel}>Trip name</span>
          <input className={styles.input} value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="e.g. Goa 2026" maxLength={60} />
        </label>
        <label className={styles.metaField}>
          <span className={styles.metaLabel}>Dates (optional)</span>
          <input className={styles.input} value={tripDates} onChange={(e) => setTripDates(e.target.value)} placeholder="e.g. 12–16 Mar" maxLength={40} />
        </label>
        <label className={styles.metaField}>
          <span className={styles.metaLabel}>Currency</span>
          <select className={styles.input} value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol.trim()})</option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.columns}>
        {/* ── Left column ── */}
        <div className={styles.left}>
          {/* Crew */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Who&apos;s on the trip?</h2>
            <div className={styles.people}>
              {people.map((p, i) => (
                <div key={p.id} className={styles.personRow}>
                  <span className={styles.avatar}>{initials(p.name) === "?" ? i + 1 : initials(p.name)}</span>
                  <input className={styles.input} value={p.name} onChange={(e) => renamePerson(p.id, e.target.value)} placeholder={`Person ${i + 1}`} maxLength={30} />
                  <button type="button" className={styles.iconBtn} onClick={() => removePerson(p.id)} aria-label="Remove person" disabled={people.length <= 1}>×</button>
                </div>
              ))}
            </div>
            <button type="button" className={styles.ghostBtn} onClick={addPerson}>+ Add person</button>
          </section>

          {/* Categories */}
          {!enoughPeople ? (
            <section className={styles.card}>
              <p className={styles.hint}>Add at least two people above to start adding expenses.</p>
            </section>
          ) : (
            <div className={styles.categories}>
              {categories.map((cat) => {
                const subtotal = categoryTotal(cat);
                const isOpen = openCatId === cat.id;
                return (
                  <motion.section layout key={cat.id} className={styles.catCard}>
                    <div className={styles.catHead}>
                      <span className={styles.catIcon} aria-hidden="true">{cat.icon}</span>
                      <input
                        className={styles.catName}
                        value={cat.name}
                        onChange={(e) => renameCategory(cat.id, e.target.value)}
                        aria-label="Category name"
                        maxLength={30}
                      />
                      <span className={styles.catTotal}>{formatMoney(subtotal, cur)}</span>
                      <button type="button" className={styles.catDelete} onClick={() => removeCategory(cat.id)} aria-label={`Remove ${cat.name}`}>×</button>
                    </div>

                    {cat.items.length > 0 && (
                      <div className={styles.catShares}>
                        {categoryShares(cat).map((s) => (
                          <span key={s.id} className={styles.catShareChip}>
                            {s.name} <strong>{formatMoney(s.amount, cur)}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    <AnimatePresence initial={false}>
                      {cat.items.length > 0 && (
                        <motion.ul className={styles.itemList} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <AnimatePresence initial={false}>
                            {cat.items.map((it) => {
                              const open = expandedItems.has(it.id);
                              return (
                                <motion.li
                                  key={it.id}
                                  className={styles.itemRow}
                                  layout
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className={styles.itemTop}>
                                    <button type="button" className={styles.itemMain} onClick={() => toggleItem(it.id)} aria-expanded={open}>
                                      <span className={`${styles.itemChevron} ${open ? styles.itemChevronOpen : ""}`} aria-hidden="true">▸</span>
                                      <span className={styles.itemInfo}>
                                        <span className={styles.itemLabel}>{it.label}</span>
                                        <span className={styles.itemMeta}>{nameById(it.paidBy)} paid · {modeLabel(it)} · {sharersLabel(it)}</span>
                                      </span>
                                      <span className={styles.itemAmt}>{formatMoney(it.amount, cur)}</span>
                                    </button>
                                    <button type="button" className={styles.iconBtn} onClick={() => removeItem(cat.id, it.id)} aria-label={`Remove ${it.label}`}>×</button>
                                  </div>
                                  <AnimatePresence initial={false}>
                                    {open && (
                                      <motion.ul
                                        className={styles.shareList}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        {shareBreakdown(it).map((s) => (
                                          <li key={s.id} className={styles.shareItem}>
                                            <span className={styles.shareName}>{s.name}</span>
                                            <span className={styles.shareAmt}>{formatMoney(s.amount, cur)}</span>
                                          </li>
                                        ))}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              );
                            })}
                          </AnimatePresence>
                        </motion.ul>
                      )}
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          key="form"
                          className={styles.itemForm}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className={draftMode === "exact" ? styles.formSingle : styles.formGrid}>
                            <input className={styles.input} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="What for? e.g. Dinner" maxLength={40} autoFocus />
                            {draftMode !== "exact" && (
                              <input className={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder={`Total (${cur.symbol.trim()})`} />
                            )}
                          </div>

                          <div className={styles.formRow}>
                            <label className={styles.miniLabel}>Paid by</label>
                            <select className={styles.input} value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                              {namedPeople.map((p) => <option key={p.id} value={p.id}>{p.name.trim()}</option>)}
                            </select>
                          </div>

                          <div className={styles.formRow}>
                            <label className={styles.miniLabel}>How to split</label>
                            <div className={styles.modeSeg} role="group" aria-label="Split mode">
                              {(["even", "exact", "percent"] as SplitMode[]).map((m) => (
                                <button
                                  type="button"
                                  key={m}
                                  className={`${styles.modeBtn} ${draftMode === m ? styles.modeBtnOn : ""}`}
                                  onClick={() => setDraftMode(m)}
                                  aria-pressed={draftMode === m}
                                >
                                  {m === "even" ? "Evenly" : m === "exact" ? `Exact ${cur.symbol.trim()}` : "By %"}
                                </button>
                              ))}
                            </div>
                          </div>

                          {draftMode === "even" && (
                            <div className={styles.formRow}>
                              <label className={styles.miniLabel}>Split between</label>
                              <div className={styles.chips}>
                                {namedPeople.map((p) => (
                                  <button type="button" key={p.id} className={`${styles.chip} ${sharedBy.includes(p.id) ? styles.chipOn : ""}`} onClick={() => toggleShared(p.id)} aria-pressed={sharedBy.includes(p.id)}>
                                    {p.name.trim()}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {draftMode === "exact" && (
                            <div className={styles.formRow}>
                              <label className={styles.miniLabel}>Each person&apos;s amount</label>
                              <div className={styles.allocList}>
                                {namedPeople.map((p) => (
                                  <div key={p.id} className={styles.allocRow}>
                                    <span className={styles.allocName}>{p.name.trim()}</span>
                                    <div className={styles.allocField}>
                                      <span className={styles.allocAffix}>{cur.symbol.trim()}</span>
                                      <input className={styles.allocInput} inputMode="decimal" value={exactInputs[p.id] ?? ""} onChange={(e) => setExactInputs((prev) => ({ ...prev, [p.id]: e.target.value }))} placeholder="0" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className={styles.allocFoot}>Item total: <strong>{formatMoney(exactTotal, cur)}</strong></p>
                            </div>
                          )}

                          {draftMode === "percent" && (
                            <div className={styles.formRow}>
                              <label className={styles.miniLabel}>Each person&apos;s %</label>
                              <div className={styles.allocList}>
                                {namedPeople.map((p) => (
                                  <div key={p.id} className={styles.allocRow}>
                                    <span className={styles.allocName}>{p.name.trim()}</span>
                                    <div className={styles.allocField}>
                                      <input className={styles.allocInput} inputMode="decimal" value={percentInputs[p.id] ?? ""} onChange={(e) => setPercentInputs((prev) => ({ ...prev, [p.id]: e.target.value }))} placeholder="0" />
                                      <span className={styles.allocAffix}>%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className={`${styles.allocFoot} ${percentOk ? "" : styles.allocWarn}`}>
                                Total: <strong>{percentTotal || 0}%</strong> {percentOk ? "✓" : "— must be 100%"}
                              </p>
                            </div>
                          )}

                          {formError && <p className={styles.error}>{formError}</p>}
                          <div className={styles.formActions}>
                            <button type="button" className={styles.addBtn} onClick={() => addItem(cat.id)}>Add item</button>
                            <button type="button" className={styles.doneBtn} onClick={() => setOpenCatId(null)}>Done</button>
                          </div>
                        </motion.div>
                      ) : (
                        <button type="button" className={styles.addItemTrigger} onClick={() => openForm(cat.id)}>
                          + Add item
                        </button>
                      )}
                    </AnimatePresence>
                  </motion.section>
                );
              })}

              <div className={styles.addCatRow}>
                <input className={styles.input} value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Add a custom category…" maxLength={30} onKeyDown={(e) => e.key === "Enter" && addCategory()} />
                <button type="button" className={styles.ghostBtn} onClick={addCategory}>+ Add</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: summary ── */}
        <div className={styles.right}>
          <section className={styles.summaryCard}>
            <div className={styles.summaryTop}>
              <div>
                <span className={styles.summaryLabel}>Total spent</span>
                <motion.span key={total} className={styles.summaryTotal} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                  {formatMoney(total, cur)}
                </motion.span>
              </div>
              {items.length > 0 && <button type="button" className={styles.clearBtn} onClick={clearAll}>Clear</button>}
            </div>

            {namedPeople.length > 0 && (
              <div className={styles.ledger}>
                {ledger.map((l) => {
                  const pct = Math.round((Math.abs(l.net) / maxAbsNet) * 100);
                  const owes = l.net < 0;
                  return (
                    <div key={l.personId} className={styles.ledgerRow}>
                      <span className={styles.miniAvatar}>{initials(nameById(l.personId))}</span>
                      <div className={styles.ledgerBody}>
                        <div className={styles.ledgerTop}>
                          <span className={styles.ledgerName}>{nameById(l.personId)}</span>
                          <span className={`${styles.ledgerNet} ${l.net === 0 ? styles.netZero : owes ? styles.netNeg : styles.netPos}`}>
                            {l.net === 0 ? "settled" : owes ? `owes ${formatMoney(l.net, cur)}` : `gets ${formatMoney(l.net, cur)}`}
                          </span>
                        </div>
                        <div className={styles.bar}>
                          <motion.span className={`${styles.barFill} ${owes ? styles.barNeg : styles.barPos}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.settleBlock}>
              <span className={styles.summaryLabel}>Settle up</span>
              {items.length === 0 ? (
                <p className={styles.hint}>Add expenses to see who owes whom.</p>
              ) : settlements.length === 0 ? (
                <p className={styles.settled}>Everyone&apos;s square — no payments needed. 🎉</p>
              ) : (
                <ul className={styles.settleList}>
                  <AnimatePresence initial={false}>
                    {settlements.map((s, i) => (
                      <motion.li key={`${s.fromId}-${s.toId}-${i}`} className={styles.settleRow} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        <span className={styles.settleName}>{nameById(s.fromId)}</span>
                        <span className={styles.settleArrow} aria-hidden="true">→</span>
                        <span className={styles.settleName}>{nameById(s.toId)}</span>
                        <span className={styles.settleAmt}>{formatMoney(s.amount, cur)}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className={styles.exportRow}>
              <button type="button" className={styles.exportBtn} onClick={exportPdf} disabled={items.length === 0 || exporting}>
                {exporting ? "Preparing…" : "Download PDF report"}
              </button>
              <div className={styles.shareRow}>
                <a href={shareHref} target="_blank" rel="noopener noreferrer" className={styles.waBtn} aria-disabled={items.length === 0} onClick={(e) => items.length === 0 && e.preventDefault()}>WhatsApp</a>
                <button type="button" className={styles.copyBtn} onClick={copySummary} disabled={items.length === 0}>{copied ? "Copied!" : "Copy"}</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Full breakdown ── */}
      {items.length > 0 && (
        <section className={styles.breakdownCard}>
          <h2 className={styles.cardTitle}>Full breakdown</h2>
          {categories
            .filter((c) => c.items.length > 0)
            .map((cat) => (
              <div key={cat.id} className={styles.bdCat}>
                <div className={styles.bdCatHead}>
                  <span>{cat.name}</span>
                  <span>{formatMoney(categoryTotal(cat), cur)}</span>
                </div>
                {cat.items.map((it) => (
                  <div key={it.id} className={styles.bdItem}>
                    <div className={styles.bdItemHead}>
                      <span className={styles.bdItemLabel}>{it.label}</span>
                      <span className={styles.bdItemCalc}>
                        {it.splitMode === "exact"
                          ? `${formatMoney(it.amount, cur)} · exact amounts`
                          : it.splitMode === "percent"
                            ? `${formatMoney(it.amount, cur)} · by %`
                            : `${formatMoney(it.amount, cur)} ÷ ${it.sharedBy.length} = ${formatMoney(Math.floor(it.amount / it.sharedBy.length), cur)} each`}
                      </span>
                    </div>
                    <div className={styles.bdShares}>
                      {shareBreakdown(it).map((s) => (
                        <span key={s.id} className={styles.bdShare}>
                          {s.name} <strong>{formatMoney(s.amount, cur)}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

          <div className={styles.bdTotals}>
            <span className={styles.summaryLabel}>Per-person totals</span>
            {ledger.map((l) => (
              <div key={l.personId} className={styles.bdTotalRow}>
                <span className={styles.bdTotalName}>{nameById(l.personId)}</span>
                <span className={styles.bdTotalMeta}>
                  paid {formatMoney(l.paid, cur)} · owes {formatMoney(l.share, cur)}
                </span>
                <span className={`${styles.bdTotalNet} ${l.net === 0 ? styles.netZero : l.net > 0 ? styles.netPos : styles.netNeg}`}>
                  {l.net === 0 ? "settled" : l.net > 0 ? `gets ${formatMoney(l.net, cur)}` : `owes ${formatMoney(l.net, cur)}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
