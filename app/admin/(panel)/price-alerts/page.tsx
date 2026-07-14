import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { formatDateTime, formatINR } from "@/lib/utils";
import { IconInbox } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Price Alerts" };
export const dynamic = "force-dynamic";

export default async function PriceAlertsPage() {
  const me = await requireUser();
  if (!can(me, "leads:view")) redirect("/admin");

  const alerts = await db.priceAlert.findMany({ orderBy: { createdAt: "desc" }, take: 300 });

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CRM</p>
          <h1 className={shared.pageTitle}>Price Alerts</h1>
          <p className={shared.pageSub}>
            {alerts.length} {alerts.length === 1 ? "person is" : "people are"} watching for a price drop.
          </p>
        </div>
      </div>

      <div className={shared.panel}>
        {alerts.length === 0 ? (
          <div className={shared.emptyState}>
            <IconInbox size={28} />
            <p>No price alerts yet.</p>
          </div>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Phone</th>
                <th>Package</th>
                <th>Price at signup</th>
                <th>Signed up</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id}>
                  <td>
                    <a href={`tel:${a.phone}`} className={shared.rowLink}>{a.phone}</a>
                  </td>
                  <td>
                    <Link href={`/packages/${a.packageSlug}`}>{a.packageTitle}</Link>
                  </td>
                  <td>{a.priceAtSignup ? formatINR(a.priceAtSignup) : "—"}</td>
                  <td>{formatDateTime(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
