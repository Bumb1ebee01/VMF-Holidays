import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { IconSearch, IconPackage } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Packages" };
export const dynamic = "force-dynamic";

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const packages = await db.package.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { destination: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, slug: true, destination: true, category: true,
      duration: true, fromPrice: true, featured: true, badge: true, heroImage: true,
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

      <div className={shared.listHead}>
        <form className={shared.searchBar} action="/admin/packages">
          <IconSearch size={15} className={shared.searchBarIcon} />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search packages…"
            className={shared.searchBarInput}
          />
        </form>
      </div>

      <div className={shared.panel}>
        {packages.length === 0 ? (
          <div className={shared.emptyState}>
            <IconPackage size={28} />
            <p>{q ? "No packages match your search." : "No packages yet. Create the first one."}</p>
          </div>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Package</th>
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
                    <div className={shared.cellMain}>
                      <Image src={pkg.heroImage} alt="" width={56} height={40} className={shared.thumb} />
                      <div className={shared.cellText}>
                        <Link href={`/admin/packages/${pkg.id}`} className={shared.rowLink}>
                          {pkg.title}
                        </Link>
                        <span className={shared.cellSub}>/{pkg.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>{pkg.destination}</td>
                  <td style={{ textTransform: "capitalize" }}>{pkg.category}</td>
                  <td>{pkg.duration}</td>
                  <td>{formatINR(pkg.fromPrice)}</td>
                  <td>
                    <div className={shared.flagRow}>
                      {pkg.featured && <span className={`${shared.flag} ${shared.flagFeatured}`}>Featured</span>}
                      {pkg.badge && <span className={`${shared.flag} ${shared.flagBadge}`}>{pkg.badge}</span>}
                      {!pkg.featured && !pkg.badge && <span className={shared.tagText}>—</span>}
                    </div>
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
