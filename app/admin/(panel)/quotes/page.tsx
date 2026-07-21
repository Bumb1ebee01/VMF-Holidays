import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { formatINR } from "@/lib/utils";
import NewQuoteButton from "@/components/admin/NewQuoteButton";
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUSES,
  OPEN_QUOTE_STATUSES,
  type QuoteStatusValue,
} from "@/lib/quotes";
import {
  quoteForBooking,
  toRupees,
  marginHealth,
  MARGIN_TARGET_PCT,
} from "@/lib/pricing";
import shared from "@/components/admin/shared.module.css";
import styles from "./quotes.module.css";

export const metadata: Metadata = { title: "Quotes" };
export const dynamic = "force-dynamic";

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const me = await requireUser();
  if (me.role !== "ADMIN") notFound();

  const { q = "", status = "" } = await searchParams;
  const search = q.trim();

  const quotes = await db.quote.findMany({
    where: {
      ...(status && (QUOTE_STATUSES as readonly string[]).includes(status)
        ? { status: status as QuoteStatusValue }
        : {}),
      ...(search
        ? {
            OR: [
              { ref: { contains: search, mode: "insensitive" as const } },
              { customerName: { contains: search, mode: "insensitive" as const } },
              { destination: { contains: search, mode: "insensitive" as const } },
              { lead: { name: { contains: search, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      costLines: true,
      lead: { select: { id: true, name: true } },
    },
  });

  // Pipeline value counts only quotes still in play — draft and sent.
  let openValue = 0;
  let openCount = 0;
  let acceptedValue = 0;
  let acceptedMargin = 0;
  for (const qt of quotes) {
    const priced = quoteForBooking(qt);
    if (!priced) continue;
    if ((OPEN_QUOTE_STATUSES as string[]).includes(qt.status)) {
      openValue += priced.total;
      openCount += 1;
    }
    if (qt.status === "ACCEPTED") {
      acceptedValue += priced.total;
      acceptedMargin += priced.markup;
    }
  }

  const tiles = [
    { label: "Open pipeline", value: formatINR(Math.round(toRupees(openValue))), desc: `${openCount} live quote${openCount === 1 ? "" : "s"}` },
    { label: "Accepted value", value: formatINR(Math.round(toRupees(acceptedValue))), desc: "won quotes" },
    { label: "Accepted margin", value: formatINR(Math.round(toRupees(acceptedMargin))), desc: "excludes GST & TCS" },
    { label: "Quotes", value: quotes.length, desc: search || status ? "matching" : "most recent" },
  ];

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Sales</p>
          <h1 className={shared.pageTitle}>Quotes</h1>
          <p className={shared.pageSub}>
            Price a trip before it&apos;s booked. Search by reference, customer or destination.
          </p>
        </div>
        <NewQuoteButton />
      </div>

      <div className={shared.kpiGrid} style={{ marginBottom: "var(--sp-6)" }}>
        {tiles.map((t) => (
          <div key={t.label} className={shared.kpiCard}>
            <div className={shared.kpiValue}>{t.value}</div>
            <div className={shared.kpiLabel}>{t.label}</div>
            <div className={shared.kpiDesc}>{t.desc}</div>
          </div>
        ))}
      </div>

      <form className={styles.filters} method="get">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search VMF-XXXXXX, customer or destination…"
          className={`form-input ${styles.search}`}
          aria-label="Search quotes"
        />
        <select name="status" defaultValue={status} className="form-input" aria-label="Filter by status">
          <option value="">All statuses</option>
          {QUOTE_STATUSES.map((s) => (
            <option key={s} value={s}>{QUOTE_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline btn--sm">Filter</button>
        {(search || status) && (
          <Link href="/admin/quotes" className={styles.clear}>Clear</Link>
        )}
      </form>

      {quotes.length === 0 ? (
        <p className={shared.empty}>
          {search || status ? "No quotes match that." : "No quotes yet — start one from an enquiry or create a standalone quote."}
        </p>
      ) : (
        <div className={shared.panel}>
          <div className={styles.tableWrap}>
            <table className={`${shared.table} ${shared.tableHover}`}>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                  <th style={{ textAlign: "right" }}>Margin</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((qt) => {
                  const priced = quoteForBooking(qt);
                  const health = priced ? marginHealth(priced.markupPctOnCost) : null;
                  return (
                    <tr key={qt.id}>
                      <td>
                        <Link href={`/admin/quotes/${qt.id}`} className={shared.rowLink}>
                          {qt.ref}
                        </Link>
                        <span className={styles.meta}>
                          v{qt.version}{qt.optionLabel ? ` · ${qt.optionLabel}` : ""}
                        </span>
                      </td>
                      <td>{qt.customerName ?? qt.lead?.name ?? "—"}</td>
                      <td>{qt.destination ?? "—"}</td>
                      <td style={{ textAlign: "right" }}>
                        {priced ? formatINR(Math.round(toRupees(priced.total))) : "—"}
                      </td>
                      <td style={{ textAlign: "right" }} data-health={health}>
                        {priced ? (
                          <span className={styles.marginCell} data-health={health}>
                            {priced.markupPctOnCost.toFixed(1)}%
                          </span>
                        ) : "—"}
                      </td>
                      <td>
                        <span className={styles.statusPill} data-status={qt.status}>
                          {QUOTE_STATUS_LABELS[qt.status as QuoteStatusValue]}
                        </span>
                      </td>
                      <td>{fmtDate(qt.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className={shared.kpiDesc} style={{ marginTop: "var(--sp-4)" }}>
        Margin shown is markup on cost. Target is {MARGIN_TARGET_PCT}%+.
      </p>
    </div>
  );
}
