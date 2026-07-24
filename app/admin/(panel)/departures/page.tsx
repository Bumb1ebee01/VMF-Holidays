import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/user";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import {
  bookingRef,
  collectedTotal,
  balanceDue,
  BOOKING_STATUS_LABELS,
  type BookingStatusValue,
} from "@/lib/bookings";
import {
  daysUntilDeparture,
  departureUrgency,
  departureLabel,
  balanceAtRisk,
  type DepartureUrgency,
} from "@/lib/departures";
import shared from "@/components/admin/shared.module.css";
import styles from "../bookings/bookings.module.css";

export const metadata: Metadata = { title: "Departures" };
export const dynamic = "force-dynamic";

const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

// Countdown chip colour by urgency (inline so no new CSS module is needed).
function chipStyle(urgency: DepartureUrgency | null, hasBalance: boolean): CSSProperties {
  const base: CSSProperties = {
    fontSize: "0.72rem",
    fontWeight: 700,
    padding: "1px 7px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  };
  // Owed money + departed/today/imminent → red. Imminent (paid) → orange. Else muted.
  if ((urgency === "departed" || urgency === "today") && hasBalance)
    return { ...base, background: "#FDECEA", color: "#b42318" };
  if (urgency === "imminent")
    return { ...base, background: hasBalance ? "#FDECEA" : "#FFF3E9", color: hasBalance ? "#b42318" : "var(--orange-ink, #C0341D)" };
  if (urgency === "today") return { ...base, background: "#FFF3E9", color: "var(--orange-ink, #C0341D)" };
  return { ...base, background: "var(--surface)", color: "var(--muted)" };
}

export default async function DeparturesPage() {
  await requirePermission("bookings:view");

  // Active trips only — cancelled/completed have nothing left to depart or collect.
  const bookings = await db.booking.findMany({
    where: { status: { in: ["CONFIRMED", "TRAVELLING"] } },
    include: {
      payments: { select: { amount: true, type: true } },
      advisor: { select: { name: true } },
    },
  });

  const rows = bookings.map((b) => {
    const days = daysUntilDeparture(b.travelStart);
    const collected = collectedTotal(b.payments);
    const balance = balanceDue(b.totalValue, b.payments);
    return {
      b,
      days,
      urgency: departureUrgency(days),
      collected,
      balance,
      atRisk: balanceAtRisk(balance, days),
    };
  });

  // "Needs attention" — owed money, departing within a week or already gone. Most
  // urgent (most overdue) first.
  const attention = rows
    .filter((r) => r.atRisk)
    .sort((a, b) => (a.days ?? 0) - (b.days ?? 0));

  // "Upcoming" — everything still to depart, soonest first. Null dates last.
  const upcoming = rows
    .filter((r) => r.days !== null && r.days >= 0)
    .sort((a, b) => (a.days ?? 0) - (b.days ?? 0));

  const in7 = upcoming.filter((r) => (r.days ?? 99) <= 7).length;
  const in30 = upcoming.filter((r) => (r.days ?? 99) <= 30).length;
  const balanceUpcoming = rows.reduce((sum, r) => sum + r.balance, 0);
  const balanceAtRiskTotal = attention.reduce((sum, r) => sum + r.balance, 0);

  const tiles = [
    { label: "Departing ≤ 7 days", value: String(in7) },
    { label: "Departing ≤ 30 days", value: String(in30) },
    { label: "Balance due (active)", value: formatINR(balanceUpcoming), tone: balanceUpcoming > 0 ? "orange" : undefined },
    { label: "To collect now", value: formatINR(balanceAtRiskTotal), tone: balanceAtRiskTotal > 0 ? "orange" : undefined },
  ];

  const renderTable = (list: typeof rows) => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ref</th>
            <th>Customer</th>
            <th>Trip</th>
            <th>Departs</th>
            <th className={styles.num}>Value</th>
            <th className={styles.num}>Collected</th>
            <th className={styles.num}>Balance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map(({ b, days, urgency, collected, balance }) => (
            <tr key={b.id}>
              <td className={styles.ref}>
                <Link href={`/admin/bookings/${b.id}`} className={styles.rowLink}>{bookingRef(b.id)}</Link>
              </td>
              <td><Link href={`/admin/bookings/${b.id}`} className={styles.rowLink}>{b.customerName}</Link></td>
              <td>{b.packageTitle ?? b.destination ?? "—"}</td>
              <td>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
                  <span>{fmtDate(b.travelStart)}</span>
                  <span style={chipStyle(urgency, balance > 0)}>{departureLabel(days)}</span>
                </div>
              </td>
              <td className={styles.num}>{formatINR(b.totalValue)}</td>
              <td className={styles.num}>{formatINR(collected)}</td>
              <td className={`${styles.num} ${balance > 0 ? styles.due : ""}`}>{formatINR(balance)}</td>
              <td>
                <span className={styles.statusPill} data-status={b.status}>
                  {BOOKING_STATUS_LABELS[b.status as BookingStatusValue]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Workspace</p>
          <h1 className={shared.pageTitle}>Departures</h1>
          <p className={shared.pageSub}>
            Upcoming trips and the balance still to collect — the full payment is due before travel.
          </p>
        </div>
        <Link href="/admin/bookings" className="btn btn-navy btn--sm">All bookings</Link>
      </div>

      <div className={styles.summary}>
        {tiles.map((t) => (
          <div key={t.label} className={styles.tile}>
            <div className={styles.tileLabel}>{t.label}</div>
            <div className={styles.tileValue} data-tone={t.tone}>{t.value}</div>
          </div>
        ))}
      </div>

      {/* Needs attention */}
      <div className={`${shared.panel} ${shared.panelPad}`} style={{ marginBottom: "var(--sp-5, 1.25rem)" }}>
        <h2 className={shared.sectionTitle} style={{ marginTop: 0 }}>Balance to collect</h2>
        <p className={shared.pageSub} style={{ marginTop: 0 }}>
          Owed money, departing within a week or already travelled.
        </p>
        {attention.length === 0 ? (
          <p className={shared.pageSub} style={{ margin: 0 }}>Nothing outstanding — every imminent trip is paid up. 🎉</p>
        ) : (
          renderTable(attention)
        )}
      </div>

      {/* Upcoming */}
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <h2 className={shared.sectionTitle} style={{ marginTop: 0 }}>Upcoming departures</h2>
        {upcoming.length === 0 ? (
          <p className={shared.pageSub} style={{ margin: 0 }}>No upcoming departures.</p>
        ) : (
          renderTable(upcoming)
        )}
      </div>
    </div>
  );
}
