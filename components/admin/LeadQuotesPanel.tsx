import Link from "next/link";
import NewQuoteButton from "./NewQuoteButton";
import { QUOTE_STATUS_LABELS, type QuoteStatusValue } from "@/lib/quotes";
import { quoteForBooking, toRupees, marginHealth, type CostLine } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import shared from "./shared.module.css";
import styles from "@/app/admin/(panel)/quotes/quotes.module.css";

export interface LeadQuoteRow {
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
 * Quotes raised for an enquiry. Quoting happens here, before anything is booked —
 * the booking panel below is the final step, not the starting point.
 */
export default function LeadQuotesPanel({
  leadId,
  leadRef,
  quotes,
}: {
  leadId: string;
  leadRef: string | null;
  quotes: LeadQuoteRow[];
}) {
  return (
    <div className={`${shared.panel} ${shared.panelPad}`}>
      <div className={styles.filters} style={{ marginBottom: "var(--sp-4)" }}>
        <div style={{ flex: 1 }}>
          <h2 className={shared.sectionTitle} style={{ margin: 0 }}>Quotes</h2>
          {leadRef && <span className={styles.meta}>Reference {leadRef}</span>}
        </div>
        <NewQuoteButton leadId={leadId} />
      </div>

      {quotes.length === 0 ? (
        <p className={shared.empty} style={{ margin: 0 }}>
          No quotes yet. Price this trip before converting it to a booking.
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={shared.table}>
            <thead>
              <tr>
                <th>Version</th>
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
                        v{q.version}{q.optionLabel ? ` · ${q.optionLabel}` : ""}
                      </Link>
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
      )}
    </div>
  );
}
