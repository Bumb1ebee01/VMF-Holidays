"use client";

import { useState, useActionState, useTransition } from "react";
import {
  addCostLine,
  updateCostLine,
  deleteCostLine,
  saveQuoteSettings,
  type QuoteState,
} from "@/app/admin/(panel)/quotes/actions";
import {
  COST_CATEGORIES,
  COST_CATEGORY_LABELS,
  COST_BASIS_LABELS,
  MARGIN_FLOOR_PCT,
  MARGIN_TARGET_PCT,
  marginHealth,
  MARGIN_HEALTH_LABELS,
  lineTotal,
  quoteForBooking,
  toRupees,
  type CostLine,
  type CostCategory,
} from "@/lib/pricing";
import shared from "./shared.module.css";
import styles from "./QuoteBuilder.module.css";

const inr = (paise: number) =>
  `₹${toRupees(paise).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export interface QuoteBuilderProps {
  quoteId: string;
  paxCount: number;
  markupPct: number | null;
  priceOverride: number | null;
  gstApplicable: boolean;
  gstRatePct: number;
  gstBase: string;
  tcsApplicable: boolean;
  tcsRatePct: number;
  costLines: (CostLine & { id: string })[];
}

const initial: QuoteState = {};

export default function QuoteBuilder(props: QuoteBuilderProps) {
  const { quoteId, costLines } = props;
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currency, setCurrency] = useState("INR");
  // Remembered between lines: a quote usually costs several components in the
  // same currency, and retyping the rate each time is the sort of friction that
  // makes people go back to the spreadsheet.
  const [lastFx, setLastFx] = useState("");
  const [pending, startTransition] = useTransition();

  /**
   * Live pricing. The settings are mirrored in local state so the totals move as
   * the markup is typed — a salesperson nudges the margin until the price looks
   * right, and making them save between each attempt is the slow part of quoting.
   */
  const [draft, setDraft] = useState({
    paxCount: String(props.paxCount),
    markupPct: props.markupPct === null ? "" : String(props.markupPct),
    priceOverride: props.priceOverride === null ? "" : String(toRupees(props.priceOverride)),
    gstApplicable: props.gstApplicable,
    gstRatePct: String(props.gstRatePct),
    gstBase: props.gstBase,
    tcsApplicable: props.tcsApplicable,
    tcsRatePct: String(props.tcsRatePct),
  });

  const numOr = (s: string, fallback: number) => {
    const n = Number(s.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) && s.trim() !== "" ? n : fallback;
  };

  const paxCount = Math.max(1, Math.round(numOr(draft.paxCount, 1)));
  const live = {
    paxCount,
    markupPct: draft.markupPct.trim() === "" ? null : numOr(draft.markupPct, 0),
    priceOverride:
      draft.priceOverride.trim() === "" ? null : Math.round(numOr(draft.priceOverride, 0) * 100),
    gstApplicable: draft.gstApplicable,
    gstRatePct: numOr(draft.gstRatePct, 18),
    gstBase: draft.gstBase,
    tcsApplicable: draft.tcsApplicable,
    tcsRatePct: numOr(draft.tcsRatePct, 2),
    costLines,
  };

  const savedDiffers =
    live.markupPct !== props.markupPct ||
    live.priceOverride !== props.priceOverride ||
    live.paxCount !== props.paxCount ||
    live.gstApplicable !== props.gstApplicable ||
    live.tcsApplicable !== props.tcsApplicable ||
    live.gstRatePct !== props.gstRatePct ||
    live.tcsRatePct !== props.tcsRatePct ||
    live.gstBase !== props.gstBase;

  const set = (k: keyof typeof draft, v: string | boolean) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const [addState, addAction, addPending] = useActionState(
    addCostLine.bind(null, quoteId),
    initial
  );
  const [saveState, saveAction, savePending] = useActionState(
    saveQuoteSettings.bind(null, quoteId),
    initial
  );

  const quote = quoteForBooking(live);
  const health = quote ? marginHealth(quote.markupPctOnCost) : null;

  const remove = (id: string) => {
    if (!confirm("Remove this cost line?")) return;
    startTransition(() => {
      void deleteCostLine(id, quoteId);
    });
  };

  return (
    <section className={shared.panel}>
      <div className={shared.panelPad}>
        <div className={styles.head}>
          <div>
            <h2 className={styles.title}>Quote &amp; margin</h2>
            <p className={styles.sub}>
              Costs, markup and taxes behind this booking. Visible to admins only.
            </p>
          </div>
          {!adding && (
            <button type="button" className="btn btn-primary btn--sm" onClick={() => setAdding(true)}>
              Add cost
            </button>
          )}
        </div>

        {/* ── Cost lines ─────────────────────────────────────────────────── */}
        {adding && (
          <form
            action={async (fd) => {
              setLastFx(String(fd.get("fxRate") ?? ""));
              await addAction(fd);
              // Stays open with the amount cleared and refocused, so several
              // lines can be entered in a row. Currency survives (it's held in
              // state, and a quote usually costs in one currency); the component
              // resets, which is right — lines are rarely the same component.
              const unit = document.getElementById("qb-unit") as HTMLInputElement | null;
              const note = document.getElementById("qb-label") as HTMLInputElement | null;
              if (unit) unit.value = "";
              if (note) note.value = "";
              unit?.focus();
            }}
            id="qb-add-form"
            className={styles.form}
          >
            <div className={styles.formGrid}>
              <div>
                <label className="form-label" htmlFor="qb-cat">Component</label>
                <select id="qb-cat" name="category" className="form-input" defaultValue="DMC_LAND">
                  {COST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{COST_CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="qb-basis">Basis</label>
                <select id="qb-basis" name="basis" className="form-input" defaultValue="GROUP">
                  <option value="GROUP">{COST_BASIS_LABELS.GROUP}</option>
                  <option value="PER_PAX">{COST_BASIS_LABELS.PER_PAX}</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="qb-cur">Currency</label>
                <select
                  id="qb-cur"
                  name="currency"
                  className="form-input"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {["INR", "USD", "EUR", "GBP", "AED", "THB", "SGD"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="qb-unit">Unit cost</label>
                <input id="qb-unit" name="unitCost" className="form-input" inputMode="decimal" required />
              </div>
              {currency !== "INR" && (
                <div>
                  <label className="form-label" htmlFor="qb-fx">Rate (₹ per {currency})</label>
                  <input
                    id="qb-fx"
                    name="fxRate"
                    className="form-input"
                    inputMode="decimal"
                    placeholder="97.00"
                    defaultValue={lastFx}
                    required
                  />
                  <p className={styles.hint}>Stored on the line, so the quote stays reproducible.</p>
                </div>
              )}
              <div className={styles.wide}>
                <label className="form-label" htmlFor="qb-label">Note (optional)</label>
                <input id="qb-label" name="label" className="form-input" maxLength={120} />
              </div>
            </div>
            {addState.error && <p className={shared.error}>{addState.error}</p>}
            <div className={shared.formActions}>
              <button type="submit" className="btn btn-primary btn--sm" disabled={addPending}>
                {addPending ? "Adding…" : "Add cost"}
              </button>
              <button
                type="button"
                className="btn btn-outline btn--sm"
                onClick={() => setAdding(false)}
                disabled={addPending}
              >
                Done
              </button>
              <span className={styles.hint}>Keeps adding — press Done when finished.</span>
            </div>
          </form>
        )}

        {costLines.length === 0 ? (
          <p className={shared.empty}>
            No costs recorded yet — add what the trip costs you to see the margin.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Basis</th>
                  <th>Unit cost</th>
                  <th>Total</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {costLines.map((l) =>
                  editingId === l.id ? (
                    <EditCostRow
                      key={l.id}
                      quoteId={quoteId}
                      line={l}
                      onDone={() => setEditingId(null)}
                    />
                  ) : (
                    <tr key={l.id}>
                      <td>
                        {COST_CATEGORY_LABELS[l.category as CostCategory] ?? l.category}
                        {l.label && <span className={styles.meta}>{l.label}</span>}
                      </td>
                      <td>{COST_BASIS_LABELS[l.basis]}</td>
                      <td>
                        {l.currency === "INR"
                          ? inr(l.unitCostMinor)
                          : `${l.currency} ${(l.unitCostMinor / 100).toFixed(2)}`}
                        {l.currency !== "INR" && (
                          <span className={styles.meta}>@ ₹{l.fxRate.toFixed(2)}</span>
                        )}
                      </td>
                      <td className={styles.num}>{inr(lineTotal(l, paxCount))}</td>
                      <td className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => {
                            setEditingId(l.id);
                            setAdding(false);
                          }}
                          disabled={pending}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => remove(l.id)}
                          disabled={pending}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Markup, taxes, manual price ─────────────────────────────────── */}
        <div className={styles.divider} />
        <form action={saveAction} className={styles.settings}>
          <div className={styles.formGrid}>
            <div>
              <label className="form-label" htmlFor="qb-pax">Pax</label>
              <input
                id="qb-pax"
                name="paxCount"
                className="form-input"
                inputMode="numeric"
                value={draft.paxCount}
                onChange={(e) => set("paxCount", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="qb-markup">Markup %</label>
              <input
                id="qb-markup"
                name="markupPct"
                className="form-input"
                inputMode="decimal"
                placeholder="24"
                value={draft.markupPct}
                onChange={(e) => set("markupPct", e.target.value)}
              />
              <p className={styles.hint}>Aim for {MARGIN_TARGET_PCT}%+; {MARGIN_FLOOR_PCT}% is the floor.</p>
            </div>
            <div>
              <label className="form-label" htmlFor="qb-override">Final price (₹) — optional</label>
              <input
                id="qb-override"
                name="priceOverride"
                className="form-input"
                inputMode="decimal"
                placeholder="Leave blank to use markup"
                value={draft.priceOverride}
                onChange={(e) => set("priceOverride", e.target.value)}
              />
              <p className={styles.hint}>Set this to agree a price directly; margin is worked back from it.</p>
            </div>
            <div>
              <label className="form-label" htmlFor="qb-gstrate">GST %</label>
              <input
                id="qb-gstrate"
                name="gstRatePct"
                className="form-input"
                inputMode="decimal"
                value={draft.gstRatePct}
                onChange={(e) => set("gstRatePct", e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="qb-gstbase">GST charged on</label>
              <select id="qb-gstbase" name="gstBase" className="form-input" value={draft.gstBase} onChange={(e) => set("gstBase", e.target.value)}>
                <option value="MARKUP_ONLY">Markup only</option>
                <option value="TOTAL">Cost + markup</option>
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="qb-tcsrate">TCS %</label>
              <input
                id="qb-tcsrate"
                name="tcsRatePct"
                className="form-input"
                inputMode="decimal"
                value={draft.tcsRatePct}
                onChange={(e) => set("tcsRatePct", e.target.value)}
              />
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" name="gstApplicable" checked={draft.gstApplicable} onChange={(e) => set("gstApplicable", e.target.checked)} />
              <span>GST applicable</span>
            </label>
            <label className={styles.toggle}>
              <input type="checkbox" name="tcsApplicable" checked={draft.tcsApplicable} onChange={(e) => set("tcsApplicable", e.target.checked)} />
              <span>TCS applicable (international)</span>
            </label>
          </div>
          {saveState.error && <p className={shared.error}>{saveState.error}</p>}
          <div className={shared.formActions}>
            <button
              type="submit"
              className={savedDiffers ? "btn btn-primary btn--sm" : "btn btn-outline btn--sm"}
              disabled={savePending}
            >
              {savePending ? "Saving…" : savedDiffers ? "Save changes" : "Saved"}
            </button>
            {savedDiffers && (
              <span className={styles.unsaved}>
                Totals below are live — not saved yet
              </span>
            )}
          </div>
        </form>

        {/* ── Summary ────────────────────────────────────────────────────── */}
        {quote && (
          <>
            <div className={styles.divider} />
            <dl className={styles.summary}>
              <div><dt>Land cost</dt><dd>{inr(quote.landCost)}</dd></div>
              <div>
                <dt>Markup</dt>
                <dd>{inr(quote.markup)}</dd>
              </div>
              <div className={styles.passThrough}>
                <dt>GST {props.gstApplicable ? `${props.gstRatePct}%` : "(off)"}</dt>
                <dd>{inr(quote.gst)}</dd>
              </div>
              <div><dt>Subtotal</dt><dd>{inr(quote.subtotal)}</dd></div>
              <div className={styles.passThrough}>
                <dt>TCS {props.tcsApplicable ? `${props.tcsRatePct}%` : "(off)"}</dt>
                <dd>{inr(quote.tcs)}</dd>
              </div>
              <div className={styles.total}>
                <dt>Quote price</dt>
                <dd>{inr(quote.total)}</dd>
              </div>
              <div><dt>Per pax ({paxCount})</dt><dd>{inr(quote.perPax)}</dd></div>
            </dl>

            <div className={styles.marginRow} data-health={health}>
              <div>
                <span className={styles.marginValue}>{quote.markupPctOnCost.toFixed(1)}%</span>
                <span className={styles.marginCaption}>margin on cost</span>
              </div>
              <div>
                <span className={styles.marginValueAlt}>{quote.marginPctOnPrice.toFixed(1)}%</span>
                <span className={styles.marginCaption}>of the price</span>
              </div>
              <span className={styles.marginPill}>{health && MARGIN_HEALTH_LABELS[health]}</span>
            </div>

            <p className={styles.note}>
              GST and TCS are collected for the government and passed on — they are never margin.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

/** Inline editor for one cost line — the row turns into a form in place. */
function EditCostRow({
  quoteId,
  line,
  onDone,
}: {
  quoteId: string;
  line: CostLine & { id: string };
  onDone: () => void;
}) {
  const [currency, setCurrency] = useState(line.currency);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <tr>
      <td colSpan={5}>
        <form
          action={(fd) => {
            start(async () => {
              // Called directly (not via useActionState) so we get the result
              // back and can close the editor only on success. The action
              // revalidates the page, refreshing the row.
              const res = await updateCostLine(line.id, quoteId, {}, fd);
              if (res?.error) setError(res.error);
              else onDone();
            });
          }}
          className={styles.form}
        >
          <div className={styles.formGrid}>
            <div>
              <label className="form-label" htmlFor={`ec-cat-${line.id}`}>Component</label>
              <select id={`ec-cat-${line.id}`} name="category" className="form-input" defaultValue={line.category}>
                {COST_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{COST_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor={`ec-basis-${line.id}`}>Basis</label>
              <select id={`ec-basis-${line.id}`} name="basis" className="form-input" defaultValue={line.basis}>
                <option value="GROUP">{COST_BASIS_LABELS.GROUP}</option>
                <option value="PER_PAX">{COST_BASIS_LABELS.PER_PAX}</option>
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor={`ec-cur-${line.id}`}>Currency</label>
              <select
                id={`ec-cur-${line.id}`}
                name="currency"
                className="form-input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {["INR", "USD", "EUR", "GBP", "AED", "THB", "SGD"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor={`ec-unit-${line.id}`}>Unit cost</label>
              <input
                id={`ec-unit-${line.id}`}
                name="unitCost"
                className="form-input"
                inputMode="decimal"
                defaultValue={toRupees(line.unitCostMinor)}
                required
              />
            </div>
            {currency !== "INR" && (
              <div>
                <label className="form-label" htmlFor={`ec-fx-${line.id}`}>Rate (₹ per {currency})</label>
                <input
                  id={`ec-fx-${line.id}`}
                  name="fxRate"
                  className="form-input"
                  inputMode="decimal"
                  defaultValue={line.fxRate}
                  required
                />
              </div>
            )}
            <div className={styles.wide}>
              <label className="form-label" htmlFor={`ec-label-${line.id}`}>Note (optional)</label>
              <input id={`ec-label-${line.id}`} name="label" className="form-input" maxLength={120} defaultValue={line.label ?? ""} />
            </div>
          </div>
          {error && <p className={shared.error}>{error}</p>}
          <div className={shared.formActions}>
            <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
              {pending ? "Saving…" : "Save line"}
            </button>
            <button type="button" className="btn btn-outline btn--sm" onClick={onDone} disabled={pending}>
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}
