import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { IconMap } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Trip Builder" };
export const dynamic = "force-dynamic";

export default async function AdminTripBuilderPage() {
  let countries: {
    id: string;
    name: string;
    code: string;
    flag: string;
    continent: string;
    region: string;
    _count: { places: number };
  }[] = [];
  let notReady = false;

  try {
    countries = await db.geoCountry.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { places: true } } },
    });
  } catch {
    notReady = true;
  }

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Trip Builder</h1>
          <p className={shared.pageSub}>Countries, cities &amp; activities shown in the Trip Builder.</p>
        </div>
        <Link href="/admin/trip-builder/new" className="btn btn-primary btn--sm">
          + New Country
        </Link>
      </div>

      <div className={shared.panel}>
        {notReady ? (
          <div className={shared.emptyState}>
            <IconMap size={28} />
            <p>
              Trip Builder tables aren&apos;t set up yet. Run <code>npm run db:push</code>, then{" "}
              <code>npm run db:geo</code> to import the current countries and activities.
            </p>
          </div>
        ) : countries.length === 0 ? (
          <div className={shared.emptyState}>
            <IconMap size={28} />
            <p>
              No countries yet. Add one above, or run <code>npm run db:geo</code> to import the
              bundled data.
            </p>
          </div>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Country</th>
                <th>Continent</th>
                <th>Region</th>
                <th>Cities</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className={shared.cellText}>
                      <Link href={`/admin/trip-builder/${c.id}`} className={shared.rowLink}>
                        {c.flag ? `${c.flag} ` : ""}
                        {c.name}
                      </Link>
                      <span className={shared.cellSub}>/{c.code}</span>
                    </div>
                  </td>
                  <td>{c.continent}</td>
                  <td><span className={shared.regionTag}>{c.region}</span></td>
                  <td>{c._count.places}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
