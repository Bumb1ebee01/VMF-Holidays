import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { formatINR } from "@/lib/utils";
import { collectedTotal, BOOKING_STATUS_LABELS, type BookingStatusValue } from "@/lib/bookings";
import { toRupees, MARGIN_FLOOR_PCT, MARGIN_TARGET_PCT } from "@/lib/pricing";
import { marginBands, summariseQuotes } from "@/lib/quote-analytics";
import { SOURCE_LABELS } from "@/components/admin/leadMeta";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

export default async function ReportsPage() {
  const me = await requireUser();
  // Management view — gated behind the oversight permission.
  if (!can(me, "activity:view-all")) notFound();

  const isAdmin = me.role === "ADMIN";

  const [bookings, sourceStatus, advisorStatus, users, quotes] = await Promise.all([
    db.booking.findMany({ select: { status: true, totalValue: true, payments: { select: { amount: true, type: true } } } }),
    db.lead.groupBy({ by: ["source", "status"], _count: { _all: true } }),
    db.lead.groupBy({ by: ["assignedToId", "status"], _count: { _all: true } }),
    db.user.findMany({ select: { id: true, name: true } }),
    // Pricing is admin-only, so non-admins never even fetch it.
    isAdmin
      ? db.quote.findMany({
          select: {
            status: true,
            destination: true,
            paxCount: true,
            markupPct: true,
            priceOverride: true,
            gstApplicable: true,
            gstRatePct: true,
            gstBase: true,
            tcsApplicable: true,
            tcsRatePct: true,
            costLines: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const quoteStats = summariseQuotes(quotes);
  const bands = marginBands(quotes);
  const maxBandDecided = Math.max(1, ...bands.map((b) => b.decided));

  // Revenue (active = not cancelled).
  let bookedValue = 0;
  let collected = 0;
  const byStatus: Record<string, number> = {};
  for (const b of bookings) {
    byStatus[b.status] = (byStatus[b.status] ?? 0) + 1;
    if (b.status !== "CANCELLED") {
      bookedValue += b.totalValue;
      collected += collectedTotal(b.payments);
    }
  }
  const outstanding = Math.max(0, bookedValue - collected);

  // Conversion by source.
  const srcMap = new Map<string, { total: number; won: number }>();
  for (const r of sourceStatus) {
    const e = srcMap.get(r.source) ?? { total: 0, won: 0 };
    e.total += r._count._all;
    if (r.status === "WON") e.won += r._count._all;
    srcMap.set(r.source, e);
  }
  const sources = [...srcMap.entries()]
    .map(([source, v]) => ({ label: SOURCE_LABELS[source] ?? source, ...v }))
    .sort((a, b) => b.total - a.total);
  const maxSource = Math.max(1, ...sources.map((s) => s.total));

  // Conversion by advisor.
  const userName = new Map(users.map((u) => [u.id, u.name]));
  const advMap = new Map<string, { total: number; won: number }>();
  for (const r of advisorStatus) {
    const key = r.assignedToId ?? "—";
    const e = advMap.get(key) ?? { total: 0, won: 0 };
    e.total += r._count._all;
    if (r.status === "WON") e.won += r._count._all;
    advMap.set(key, e);
  }
  const advisors = [...advMap.entries()]
    .map(([id, v]) => ({ name: id === "—" ? "Unassigned" : userName.get(id) ?? "Former member", ...v }))
    .sort((a, b) => b.won - a.won);

  const statusOrder: BookingStatusValue[] = ["CONFIRMED", "TRAVELLING", "COMPLETED", "CANCELLED"];
  const maxBookingStatus = Math.max(1, ...statusOrder.map((s) => byStatus[s] ?? 0));

  const tiles = [
    { label: "Booked value", value: formatINR(bookedValue), desc: "active bookings" },
    { label: "Collected", value: formatINR(collected), desc: "payments in" },
    { label: "Outstanding", value: formatINR(outstanding), desc: "balance due", tone: "kpiIconOrange" as const },
    { label: "Bookings", value: bookings.length, desc: "all-time" },
  ];

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Oversight</p>
          <h1 className={shared.pageTitle}>Reports</h1>
          <p className={shared.pageSub}>Revenue, collections and conversion across the pipeline.</p>
        </div>
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

      {/* Margin and quote performance — admins only. */}
      {isAdmin && (
        <div className={shared.card} style={{ marginBottom: "var(--sp-6)" }}>
          <div className={shared.cardHead}>
            <h2 className={shared.cardTitle}>Quotes &amp; Margin</h2>
          </div>

          {quoteStats.costedCount === 0 ? (
            <p className={shared.pageSub} style={{ margin: 0 }}>
              No costed quotes yet. Price a quote to see margin and win rates here.
            </p>
          ) : null}

          {quoteStats.costedCount > 0 && (
            <>
              <div className={shared.kpiGrid} style={{ marginBottom: "var(--sp-5)" }}>
                <div className={shared.kpiCard}>
                  <div className={shared.kpiValue}>{formatINR(Math.round(toRupees(quoteStats.openValue)))}</div>
                  <div className={shared.kpiLabel}>Open pipeline</div>
                  <div className={shared.kpiDesc}>{quoteStats.openCount} live quote{quoteStats.openCount === 1 ? "" : "s"}</div>
                </div>
                <div className={shared.kpiCard}>
                  <div className={shared.kpiValue}>{formatINR(Math.round(toRupees(quoteStats.acceptedMargin)))}</div>
                  <div className={shared.kpiLabel}>Accepted margin</div>
                  <div className={shared.kpiDesc}>excludes GST &amp; TCS</div>
                </div>
                <div className={shared.kpiCard}>
                  <div className={shared.kpiValue}>{quoteStats.avgMarginOnCost.toFixed(1)}%</div>
                  <div className={shared.kpiLabel}>Avg margin on cost</div>
                  <div className={shared.kpiDesc}>target {MARGIN_TARGET_PCT}%+</div>
                </div>
                <div className={shared.kpiCard}>
                  <div className={shared.kpiValue}>
                    {quoteStats.decidedCount > 0 ? `${quoteStats.conversionPct.toFixed(0)}%` : "—"}
                  </div>
                  <div className={shared.kpiLabel}>Quote win rate</div>
                  <div className={shared.kpiDesc}>
                    {quoteStats.acceptedCount}/{quoteStats.decidedCount} decided
                  </div>
                </div>
                <div className={shared.kpiCard}>
                  <div className={shared.kpiValue}>{quoteStats.belowFloor}</div>
                  <div className={shared.kpiLabel}>Below {MARGIN_FLOOR_PCT}% floor</div>
                  <div className={shared.kpiDesc}>of {quoteStats.costedCount} costed</div>
                </div>
              </div>

              {/* The question worth asking: does a higher ask actually lose work? */}
              <h3 className={shared.sectionTitle} style={{ fontSize: "0.9rem" }}>Win rate by margin</h3>
              <p className={shared.kpiDesc} style={{ marginBottom: "var(--sp-3)" }}>
                Only quotes the customer has accepted or declined — a quote still sitting
                unanswered says nothing about whether the price was right.
              </p>
              <div className={shared.breakdown} style={{ marginBottom: "var(--sp-5)" }}>
                {bands.map((b) => (
                  <div key={b.label} className={shared.breakRow}>
                    <div className={shared.breakMeta}>
                      <span className={shared.breakName}>{b.label}</span>
                      <span className={shared.breakCount}>
                        {b.decided === 0 ? "no data" : `${b.won}/${b.decided} won · ${b.winRatePct.toFixed(0)}%`}
                      </span>
                    </div>
                    <div className={shared.breakTrack}>
                      <div
                        className={shared.breakFill}
                        style={{ width: `${(b.decided / maxBandDecided) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {quoteStats.byDestination.length > 0 && (
                <>
                  <h3 className={shared.sectionTitle} style={{ fontSize: "0.9rem" }}>Margin by destination</h3>
                  <table className={shared.table}>
                    <thead>
                      <tr>
                        <th>Destination</th>
                        <th style={{ textAlign: "right" }}>Revenue</th>
                        <th style={{ textAlign: "right" }}>Margin</th>
                        <th style={{ textAlign: "right" }}>Margin %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteStats.byDestination.slice(0, 8).map((d) => (
                        <tr key={d.destination}>
                          <td>{d.destination}</td>
                          <td style={{ textAlign: "right" }}>{formatINR(Math.round(toRupees(d.revenue)))}</td>
                          <td style={{ textAlign: "right" }}>{formatINR(Math.round(toRupees(d.margin)))}</td>
                          <td style={{ textAlign: "right" }}>
                            {d.revenue > 0 ? ((d.margin / d.revenue) * 100).toFixed(1) : "0.0"}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className={shared.kpiDesc} style={{ marginTop: "var(--sp-3)" }}>
                    Margin % here is a share of price. The quote page also shows it on cost —
                    same money, different denominator.
                  </p>
                </>
              )}

            </>
          )}

          {/* Outside the costed check — uncosted quotes are still worth exporting. */}
          <div style={{ marginTop: "var(--sp-4)" }}>
            <a href="/api/quotes/export" className="btn btn-outline btn--sm" download>
              Export quotes (CSV)
            </a>
          </div>
        </div>
      )}

      <div className={shared.gridMain}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
          {/* Conversion by source */}
          <div className={shared.card}>
            <div className={shared.cardHead}><h2 className={shared.cardTitle}>Conversion by Source</h2></div>
            {sources.length === 0 ? (
              <p className={shared.pageSub} style={{ margin: 0 }}>No leads yet.</p>
            ) : (
              <div className={shared.breakdown}>
                {sources.map((s) => (
                  <div key={s.label} className={shared.breakRow}>
                    <div className={shared.breakMeta}>
                      <span className={shared.breakName}>{s.label}</span>
                      <span className={shared.breakCount}>{s.won}/{s.total} won · {pct(s.won, s.total)}%</span>
                    </div>
                    <div className={shared.breakTrack}>
                      <div className={shared.breakFill} style={{ width: `${(s.total / maxSource) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advisor performance */}
          <div className={shared.card}>
            <div className={shared.cardHead}><h2 className={shared.cardTitle}>Advisor Performance</h2></div>
            {advisors.length === 0 ? (
              <p className={shared.pageSub} style={{ margin: 0 }}>No assigned leads yet.</p>
            ) : (
              <table className={shared.table}>
                <thead>
                  <tr><th>Advisor</th><th>Leads</th><th>Won</th><th>Conversion</th></tr>
                </thead>
                <tbody>
                  {advisors.map((a) => (
                    <tr key={a.name}>
                      <td>{a.name}</td>
                      <td>{a.total}</td>
                      <td>{a.won}</td>
                      <td>{pct(a.won, a.total)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bookings by status */}
        <div className={shared.card}>
          <div className={shared.cardHead}><h2 className={shared.cardTitle}>Bookings by Status</h2></div>
          <div className={shared.breakdown}>
            {statusOrder.map((s) => (
              <div key={s} className={shared.breakRow}>
                <div className={shared.breakMeta}>
                  <span className={shared.breakName}>{BOOKING_STATUS_LABELS[s]}</span>
                  <span className={shared.breakCount}>{byStatus[s] ?? 0}</span>
                </div>
                <div className={shared.breakTrack}>
                  <div className={shared.breakFill} style={{ width: `${((byStatus[s] ?? 0) / maxBookingStatus) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
