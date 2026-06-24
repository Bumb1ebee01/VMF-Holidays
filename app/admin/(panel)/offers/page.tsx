import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { truncate, formatDateTime } from "@/lib/utils";
import { IconTag } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Offers" };
export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await db.offer.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  const live = offers.filter((o) => o.published).length;

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Offers</h1>
          <p className={shared.pageSub}>
            {live} live of {offers.length} total.
          </p>
        </div>
        <Link href="/admin/offers/new" className="btn btn-primary btn--sm">
          + New Offer
        </Link>
      </div>

      <div className={shared.panel}>
        {offers.length === 0 ? (
          <div className={shared.emptyState}>
            <IconTag size={28} />
            <p>No offers yet. Post your first flyer.</p>
          </div>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Offer</th>
                <th>Ends</th>
                <th>Updated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div className={shared.cellText}>
                      <Link href={`/admin/offers/${o.id}`} className={shared.rowLink}>
                        {o.title}
                      </Link>
                      {o.description && <span className={shared.cellSub}>{truncate(o.description, 80)}</span>}
                    </div>
                  </td>
                  <td className={shared.tagText}>
                    {o.endsAt ? o.endsAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className={shared.tagText}>{formatDateTime(o.updatedAt)}</td>
                  <td>
                    <span className={`${shared.flag} ${o.published ? shared.flagOn : shared.flagOff}`}>
                      {o.published ? "Live" : "Hidden"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
