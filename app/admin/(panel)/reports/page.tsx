import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { formatINR } from "@/lib/utils";
import { collectedTotal, BOOKING_STATUS_LABELS, type BookingStatusValue } from "@/lib/bookings";
import { SOURCE_LABELS } from "@/components/admin/leadMeta";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

export default async function ReportsPage() {
  const me = await requireUser();
  // Management view — gated behind the oversight permission.
  if (!can(me, "activity:view-all")) notFound();

  const [bookings, sourceStatus, advisorStatus, users] = await Promise.all([
    db.booking.findMany({ select: { status: true, totalValue: true, payments: { select: { amount: true, type: true } } } }),
    db.lead.groupBy({ by: ["source", "status"], _count: { _all: true } }),
    db.lead.groupBy({ by: ["assignedToId", "status"], _count: { _all: true } }),
    db.user.findMany({ select: { id: true, name: true } }),
  ]);

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
