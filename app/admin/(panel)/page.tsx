import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import StatusBadge, { type LeadStatusValue } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import shared from "@/components/admin/shared.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await requireUser();

  const [statusCounts, packageCount, destinationCount, testimonialCount, recentLeads] =
    await Promise.all([
      db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
      db.package.count(),
      db.destination.count(),
      db.testimonial.count(),
      db.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          name: true,
          status: true,
          destination: true,
          packageTitle: true,
          createdAt: true,
        },
      }),
    ]);

  const countFor = (status: string) =>
    statusCounts.find((s) => s.status === status)?._count._all ?? 0;
  const totalLeads = statusCounts.reduce((sum, s) => sum + s._count._all, 0);

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Dashboard</p>
          <h1 className={shared.pageTitle}>Welcome back, {user.name.split(" ")[0]}</h1>
        </div>
        <Link href="/admin/leads" className="btn btn-navy btn--sm">
          View All Leads
        </Link>
      </div>

      <div className={shared.statGrid}>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{totalLeads}</div>
          <div className={shared.statLabel}>Total Leads</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{countFor("NEW")}</div>
          <div className={shared.statLabel}>New</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{countFor("QUOTED")}</div>
          <div className={shared.statLabel}>Quoted</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{countFor("WON")}</div>
          <div className={shared.statLabel}>Won</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{packageCount}</div>
          <div className={shared.statLabel}>Packages</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{destinationCount}</div>
          <div className={shared.statLabel}>Destinations</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statValue}>{testimonialCount}</div>
          <div className={shared.statLabel}>Testimonials</div>
        </div>
      </div>

      <div className={shared.panel}>
        {recentLeads.length === 0 ? (
          <p className={shared.empty}>
            No leads yet. Enquiries from the website will appear here automatically.
          </p>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Interest</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link href={`/admin/leads/${lead.id}`} className={shared.rowLink}>
                      {lead.name}
                    </Link>
                  </td>
                  <td>{lead.packageTitle ?? lead.destination ?? "—"}</td>
                  <td><StatusBadge status={lead.status as LeadStatusValue} /></td>
                  <td>{formatDateTime(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
