import Link from "next/link";
import { QUOTE_STATUS_LABELS, type QuoteStatusValue } from "@/lib/quotes";
import { quoteForBooking, toRupees, marginHealth, type CostLine } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import shared from "./shared.module.css";
import styles from "@/app/admin/(panel)/quotes/quotes.module.css";

export interface BookingQuoteRow {
  id: string;
  ref: string;
  version: number;
  optionLabel: string | null;
  status: string;
  paxCount: number;
  markupPct: number | null;
  priceOverride: number | null;
  gstApplicable: boolean;
  gstRatePct: number;
  gstBase: string;
  tcsApplicable: boolean;
  tcsRatePct: number;
  costLines: CostLine[];
}

/**
 * The quotes behind a booking — the priced history of how it got to this figure.
 * An accepted quote drives the booking's total, so the two can't disagree.
 */
export default function BookingQuotesPanel({ quotes }: { quotes: BookingQuoteRow[] }) {
  if (quotes.length === 0) return null;

  const accepted = quotes.find((q) => q.status === "ACCEPTED");
  const acceptedPriced = accepted ? quoteForBooking(accepted) : null;

  return (
    <section className={shared.panel}>
      <div className={shared.panelPad}>
        <h2 className={shared.sectionTitle} style={{ marginTop: 0 }}>Quotes</h2>
        <p className={styles.meta} style={{ marginBottom: "var(--sp-3)" }}>
          {accepted
            ? "The accepted quote sets this booking's total value."
            : "No quote accepted yet — the booking value was entered directly."}
        </p>

        {accepted && acceptedPriced && (
          <p className={styles.meta} style={{ marginBottom: "var(--sp-3)" }}>
            Confirmed: <strong>{accepted.ref} v{accepted.version}</strong> ·{" "}
            {formatINR(Math.round(toRupees(acceptedPriced.perPax)))}/pax × {accepted.paxCount} ·{" "}
            {acceptedPriced.markupPctOnCost.toFixed(1)}% margin
          </p>
        )}

        <div className={styles.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Quote</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Margin</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const priced = quoteForBooking(q);
                const health = priced ? marginHealth(priced.markupPctOnCost) : null;
                return (
                  <tr key={q.id}>
                    <td>
                      <Link href={`/admin/quotes/${q.id}`} className={shared.rowLink}>
                        {q.ref} v{q.version}
                      </Link>
                      {q.optionLabel && <span className={styles.meta}>{q.optionLabel}</span>}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {priced ? formatINR(Math.round(toRupees(priced.total))) : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {priced ? (
                        <span className={styles.marginCell} data-health={health}>
                          {priced.markupPctOnCost.toFixed(1)}%
                        </span>
                      ) : "—"}
                    </td>
                    <td>
                      <span className={styles.statusPill} data-status={q.status}>
                        {QUOTE_STATUS_LABELS[q.status as QuoteStatusValue]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
