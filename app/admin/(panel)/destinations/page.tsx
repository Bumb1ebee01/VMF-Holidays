import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { IconSearch, IconMap } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Destinations" };
export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const destinations = await db.destination.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { country: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
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

      <div className={shared.listHead}>
        <form className={shared.searchBar} action="/admin/destinations">
          <IconSearch size={15} className={shared.searchBarIcon} />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search destinations…"
            className={shared.searchBarInput}
          />
        </form>
      </div>

      <div className={shared.panel}>
        {destinations.length === 0 ? (
          <div className={shared.emptyState}>
            <IconMap size={28} />
            <p>{q ? "No destinations match your search." : "No destinations yet."}</p>
          </div>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Destination</th>
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
                    <div className={shared.cellMain}>
                      <Image src={d.heroImage} alt="" width={56} height={40} className={shared.thumb} />
                      <div className={shared.cellText}>
                        <Link href={`/admin/destinations/${d.id}`} className={shared.rowLink}>
                          {d.name}
                        </Link>
                        <span className={shared.cellSub}>/{d.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>{d.country}</td>
                  <td><span className={shared.regionTag}>{d.region}</span></td>
                  <td>{formatINR(d.fromPrice)}</td>
                  <td className={shared.tagText}>{d.tags.join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
