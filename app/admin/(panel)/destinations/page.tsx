import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Destinations" };
export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const destinations = await db.destination.findMany({
    orderBy: [{ region: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Destinations</h1>
          <p className={shared.pageSub}>{destinations.length} destinations on the website.</p>
        </div>
        <Link href="/admin/destinations/new" className="btn btn-primary btn--sm">
          + New Destination
        </Link>
      </div>

      <div className={shared.panel}>
        {destinations.length === 0 ? (
          <p className={shared.empty}>No destinations yet.</p>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Region</th>
                <th>From price</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link href={`/admin/destinations/${d.id}`} className={shared.rowLink}>
                      {d.name}
                    </Link>
                  </td>
                  <td>{d.country}</td>
                  <td style={{ textTransform: "capitalize" }}>{d.region}</td>
                  <td>{formatINR(d.fromPrice)}</td>
                  <td>{d.tags.join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
