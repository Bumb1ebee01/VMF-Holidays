import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import StatusBadge, {
  LEAD_STATUSES,
  STATUS_LABELS,
  type LeadStatusValue,
} from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import shared from "@/components/admin/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  CONTACT_FORM: "Contact Form",
  TRIP_WIZARD: "Trip Builder",
  PACKAGE_PAGE: "Package Page",
  OTHER: "Other",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const activeStatus = LEAD_STATUSES.includes(status as LeadStatusValue)
    ? (status as LeadStatusValue)
    : undefined;

  const leads = await db.lead.findMany({
    where: {
      ...(activeStatus ? { status: activeStatus } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { destination: { contains: q, mode: "insensitive" } },
              { packageTitle: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { assignedTo: { select: { name: true } } },
  });

  const tabHref = (s?: string) => {
    const params = new URLSearchParams();
    if (s) params.set("status", s);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  };

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CRM</p>
          <h1 className={shared.pageTitle}>Leads</h1>
          <p className={shared.pageSub}>
            Every enquiry from the website lands here the moment it&apos;s submitted.
          </p>
        </div>
      </div>

      <div className={shared.toolbar}>
        <Link
          href={tabHref()}
          className={`${shared.filterTab} ${!activeStatus ? shared.filterActive : ""}`}
        >
          All
        </Link>
        {LEAD_STATUSES.map((s) => (
          <Link
            key={s}
            href={tabHref(s)}
            className={`${shared.filterTab} ${activeStatus === s ? shared.filterActive : ""}`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}

        <form className={styles.search} action="/admin/leads">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, email, phone…"
            className={`form-input ${styles.searchInput}`}
          />
        </form>
      </div>

      <div className={shared.panel}>
        {leads.length === 0 ? (
          <p className={shared.empty}>No leads match these filters.</p>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Interest</th>
                <th>Source</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link href={`/admin/leads/${lead.id}`} className={shared.rowLink}>
                      {lead.name}
                    </Link>
                  </td>
                  <td>
                    <div className={styles.contactCell}>
                      <span>{lead.phone}</span>
                      <span className={styles.contactSub}>{lead.email}</span>
                    </div>
                  </td>
                  <td>{lead.packageTitle ?? lead.destination ?? "—"}</td>
                  <td>{SOURCE_LABELS[lead.source] ?? lead.source}</td>
                  <td>{lead.assignedTo?.name ?? "—"}</td>
                  <td><StatusBadge status={lead.status as LeadStatusValue} /></td>
                  <td className={styles.dateCell}>{formatDateTime(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
