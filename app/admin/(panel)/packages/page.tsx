import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Packages" };
export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await db.package.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      destination: true,
      category: true,
      duration: true,
      fromPrice: true,
      featured: true,
      badge: true,
    },
  });

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Packages</h1>
          <p className={shared.pageSub}>{packages.length} packages live on the website.</p>
        </div>
        <Link href="/admin/packages/new" className="btn btn-primary btn--sm">
          + New Package
        </Link>
      </div>

      <div className={shared.panel}>
        {packages.length === 0 ? (
          <p className={shared.empty}>No packages yet. Create the first one.</p>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Destination</th>
                <th>Category</th>
                <th>Duration</th>
                <th>From</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    <Link href={`/admin/packages/${pkg.id}`} className={shared.rowLink}>
                      {pkg.title}
                    </Link>
                  </td>
                  <td>{pkg.destination}</td>
                  <td style={{ textTransform: "capitalize" }}>{pkg.category}</td>
                  <td>{pkg.duration}</td>
                  <td>{formatINR(pkg.fromPrice)}</td>
                  <td>
                    {[pkg.featured ? "Featured" : null, pkg.badge].filter(Boolean).join(" · ") || "—"}
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
