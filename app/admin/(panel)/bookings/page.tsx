import type { Metadata } from "next";
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
import shared from "@/components/admin/shared.module.css";
import styles from "./bookings.module.css";

export const metadata: Metadata = { title: "Bookings" };
export const dynamic = "force-dynamic";

const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default async function BookingsPage() {
  await requirePermission("bookings:view");

  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      payments: { select: { amount: true, type: true } },
      advisor: { select: { name: true } },
    },
  });

  let dueTotal = 0;
  let activeValue = 0;
  for (const b of bookings) {
    if (b.status !== "CANCELLED") {
      dueTotal += balanceDue(b.totalValue, b.payments);
      activeValue += b.totalValue;
    }
  }

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Workspace</p>
          <h1 className={shared.pageTitle}>Bookings</h1>
          <p className={shared.pageSub}>Trips, payment ledgers and balances. Create a booking from a won lead.</p>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>Bookings</div>
          <div className={styles.tileValue}>{bookings.length}</div>
        </div>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>Active trip value</div>
          <div className={styles.tileValue}>{formatINR(activeValue)}</div>
        </div>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>Balance due</div>
          <div className={styles.tileValue} data-tone={dueTotal > 0 ? "orange" : undefined}>{formatINR(dueTotal)}</div>
        </div>
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        {bookings.length === 0 ? (
          <p className={shared.pageSub} style={{ margin: 0 }}>
            No bookings yet. Open a won lead and use <strong>Create booking</strong>.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Customer</th>
                  <th>Trip</th>
                  <th>Travel</th>
                  <th className={styles.num}>Value</th>
                  <th className={styles.num}>Collected</th>
                  <th className={styles.num}>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const collected = collectedTotal(b.payments);
                  const balance = balanceDue(b.totalValue, b.payments);
                  return (
                    <tr key={b.id}>
                      <td className={styles.ref}>
                        <Link href={`/admin/bookings/${b.id}`} className={styles.rowLink}>{bookingRef(b.id)}</Link>
                      </td>
                      <td><Link href={`/admin/bookings/${b.id}`} className={styles.rowLink}>{b.customerName}</Link></td>
                      <td>{b.packageTitle ?? b.destination ?? "—"}</td>
                      <td>{fmtDate(b.travelStart)}</td>
                      <td className={styles.num}>{formatINR(b.totalValue)}</td>
                      <td className={styles.num}>{formatINR(collected)}</td>
                      <td className={`${styles.num} ${balance > 0 ? styles.due : ""}`}>{formatINR(balance)}</td>
                      <td>
                        <span className={styles.statusPill} data-status={b.status}>
                          {BOOKING_STATUS_LABELS[b.status as BookingStatusValue]}
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
    </div>
  );
}
