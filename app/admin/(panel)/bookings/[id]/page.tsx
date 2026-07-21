import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { formatINR } from "@/lib/utils";
import BookingStatusControl from "@/components/admin/BookingStatusControl";
import PaymentForm from "@/components/admin/PaymentForm";
import TravellerManifest from "@/components/admin/TravellerManifest";
import { deletePayment } from "../actions";
import {
  bookingRef,
  collectedTotal,
  balanceDue,
  PAYMENT_TYPE_LABELS,
  PAYMENT_MODE_LABELS,
  BOOKING_STATUS_LABELS,
  type BookingStatusValue,
} from "@/lib/bookings";
import shared from "@/components/admin/shared.module.css";
import styles from "../bookings.module.css";
import lead from "@/app/admin/(panel)/leads/[id]/page.module.css";

export const metadata: Metadata = { title: "Booking" };
export const dynamic = "force-dynamic";

const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requireUser();
  if (!can(me, "bookings:view")) notFound();

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      payments: { orderBy: { paidAt: "desc" } },
      advisor: { select: { name: true } },
      lead: { select: { id: true, name: true } },
      travellers: true,
    },
  });
  if (!booking) notFound();

  const canManage = can(me, "bookings:manage");
  const collected = collectedTotal(booking.payments);
  const balance = balanceDue(booking.totalValue, booking.payments);
  const pct = booking.totalValue > 0 ? Math.min(100, Math.round((collected / booking.totalValue) * 100)) : 0;

  const fields: [string, string | null][] = [
    ["Customer", booking.customerName],
    ["Phone", booking.customerPhone],
    ["Email", booking.customerEmail],
    ["Destination", booking.destination],
    ["Package", booking.packageTitle],
    ["Travel", `${fmtDate(booking.travelStart)} → ${fmtDate(booking.travelEnd)}`],
    ["Travellers", booking.pax],
    ["Advisor", booking.advisor?.name ?? null],
    ["From lead", booking.lead ? booking.lead.name : null],
  ];

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <Link href="/admin/bookings" className={lead.backLink}>← All bookings</Link>
          <h1 className={shared.pageTitle}>{bookingRef(booking.id)}</h1>
          <p className={shared.pageSub}>{booking.customerName}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          <a href={`/api/quotation/${booking.id}`} className="btn btn-outline btn--sm" download>
            Quotation PDF
          </a>
          {canManage ? (
            <BookingStatusControl bookingId={booking.id} status={booking.status} />
          ) : (
            <span className={styles.statusPill} data-status={booking.status}>
              {BOOKING_STATUS_LABELS[booking.status as BookingStatusValue]}
            </span>
          )}
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
          {/* Money */}
          <div className={`${shared.panel} ${shared.panelPad}`}>
            <div className={styles.money}>
              <div className={styles.moneyItem}>
                <div className={styles.moneyLabel}>Total value</div>
                <div className={styles.moneyValue}>{formatINR(booking.totalValue)}</div>
              </div>
              <div className={styles.moneyItem}>
                <div className={styles.moneyLabel}>Collected</div>
                <div className={styles.moneyValue}>{formatINR(collected)}</div>
              </div>
              <div className={styles.moneyItem}>
                <div className={styles.moneyLabel}>Balance due</div>
                <div className={styles.moneyValue} style={balance > 0 ? { color: "var(--orange-ink, #c0341d)" } : undefined}>
                  {formatINR(balance)}
                </div>
              </div>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Payment ledger */}
          <div className={`${shared.panel} ${shared.panelPad}`}>
            <h2 className={lead.panelTitle}>Payments</h2>
            {canManage && <PaymentForm bookingId={booking.id} />}
            {booking.payments.length === 0 ? (
              <p className={lead.noNotes} style={{ marginTop: "var(--sp-4)" }}>No payments recorded yet.</p>
            ) : (
              <div style={{ marginTop: "var(--sp-4)" }}>
                {booking.payments.map((p) => (
                  <div key={p.id} className={styles.ledgerRow}>
                    <span className={styles.ledgerAmt} data-refund={p.type === "REFUND" ? "1" : "0"}>
                      {p.type === "REFUND" ? "−" : ""}{formatINR(p.amount)}
                    </span>
                    <div className={styles.ledgerMeta}>
                      <div>{PAYMENT_TYPE_LABELS[p.type] ?? p.type} · {PAYMENT_MODE_LABELS[p.mode] ?? p.mode}</div>
                      <div className={styles.ledgerSub}>
                        {fmtDate(p.paidAt)}{p.note ? ` · ${p.note}` : ""}{p.recordedBy ? ` · ${p.recordedBy}` : ""}
                      </div>
                    </div>
                    {canManage && (
                      <form action={deletePayment.bind(null, p.id, booking.id)}>
                        <button type="submit" className={styles.delBtn} aria-label="Delete payment">✕</button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trip details */}
        <aside>
          <div className={`${shared.panel} ${shared.panelPad}`}>
            <h2 className={lead.panelTitle}>Trip Details</h2>
            <dl className={lead.fieldList}>
              {fields.map(([label, value]) =>
                value ? (
                  <div key={label} className={lead.fieldRow}>
                    <dt>{label}</dt>
                    <dd>{label === "From lead" && booking.lead ? (
                      <Link href={`/admin/leads/${booking.lead.id}`}>{value}</Link>
                    ) : value}</dd>
                  </div>
                ) : null
              )}
            </dl>
            {booking.notes && (
              <div className={lead.message}>
                <span className={lead.messageLabel}>Notes</span>
                <p>{booking.notes}</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <TravellerManifest
        bookingId={booking.id}
        bookingRef={bookingRef(booking.id)}
        travellers={booking.travellers}
        travelStart={booking.travelStart}
        canManage={canManage}
      />
    </div>
  );
}
