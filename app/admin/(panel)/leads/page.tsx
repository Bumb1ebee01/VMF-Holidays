import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import StatusBadge, {
  LEAD_STATUSES,
  STATUS_LABELS,
  type LeadStatusValue,
} from "@/components/admin/StatusBadge";
import LeadFilters from "@/components/admin/LeadFilters";
import LeadBoard, { type BoardLead } from "@/components/admin/LeadBoard";
import { IconInbox } from "@/components/admin/icons";
import { formatDateTime } from "@/lib/utils";
import type { LeadSource } from "@/lib/generated/prisma/client";
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

type Search = { status?: string; q?: string; source?: string; assignee?: string; view?: string };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const me = await requireUser();
  const { status, q, source, assignee, view } = await searchParams;
  const isBoard = view === "board";
  const activeStatus = LEAD_STATUSES.includes(status as LeadStatusValue)
    ? (status as LeadStatusValue)
    : undefined;

  const where = {
    // Status tabs only constrain the table; the board shows every column.
    ...(activeStatus && !isBoard ? { status: activeStatus } : {}),
    ...(source ? { source: source as LeadSource } : {}),
    ...(assignee ? { assignedToId: assignee } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q } },
            { destination: { contains: q, mode: "insensitive" as const } },
            { packageTitle: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [leads, users] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: isBoard ? 400 : 200,
      include: { assignedTo: { select: { id: true, name: true } } },
    }),
    db.user.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const buildHref = (overrides: Partial<Search>) => {
    const params = new URLSearchParams();
    const merged: Search = { status, q, source, assignee, view, ...overrides };
    if (merged.status) params.set("status", merged.status);
    if (merged.q) params.set("q", merged.q);
    if (merged.source) params.set("source", merged.source);
    if (merged.assignee) params.set("assignee", merged.assignee);
    if (merged.view) params.set("view", merged.view);
    const qs = params.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  };

  const boardLeads: BoardLead[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    interest: l.packageTitle ?? l.destination ?? SOURCE_LABELS[l.source] ?? "Enquiry",
    contact: l.phone,
    assignedName: l.assignedTo?.name ?? null,
    status: l.status as LeadStatusValue,
    when: formatDateTime(l.createdAt),
  }));

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CRM</p>
          <h1 className={shared.pageTitle}>Leads</h1>
          <p className={shared.pageSub}>
            {leads.length} {leads.length === 1 ? "enquiry" : "enquiries"}
            {activeStatus && !isBoard ? ` · ${STATUS_LABELS[activeStatus]}` : ""}
          </p>
        </div>
        <div className={styles.headActions}>
          <div className={styles.viewToggle}>
            <Link
              href={buildHref({ view: undefined })}
              className={`${styles.viewBtn} ${!isBoard ? styles.viewActive : ""}`}
            >
              Table
            </Link>
            <Link
              href={buildHref({ view: "board" })}
              className={`${styles.viewBtn} ${isBoard ? styles.viewActive : ""}`}
            >
              Board
            </Link>
          </div>
          <a href={`/admin/leads/export${buildHref({}).replace("/admin/leads", "")}`} className="btn btn-outline btn--sm">
            Export CSV
          </a>
        </div>
      </div>

      {!isBoard && (
        <div className={shared.toolbar}>
          <Link
            href={buildHref({ status: undefined })}
            className={`${shared.filterTab} ${!activeStatus ? shared.filterActive : ""}`}
          >
            All
          </Link>
          {LEAD_STATUSES.map((s) => (
            <Link
              key={s}
              href={buildHref({ status: s })}
              className={`${shared.filterTab} ${activeStatus === s ? shared.filterActive : ""}`}
            >
              {STATUS_LABELS[s]}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.filterRow}>
        <LeadFilters
          q={q ?? ""}
          source={source ?? ""}
          assignee={assignee ?? ""}
          view={view ?? ""}
          status={status ?? ""}
          users={users}
        />
      </div>

      {isBoard ? (
        leads.length === 0 ? (
          <div className={shared.panel}>
            <div className={shared.emptyState}>
              <IconInbox size={28} />
              <p>No leads match these filters.</p>
            </div>
          </div>
        ) : (
          <LeadBoard leads={boardLeads} canEdit={can(me, "leads:edit")} />
        )
      ) : (
        <div className={shared.panel}>
          {leads.length === 0 ? (
            <div className={shared.emptyState}>
              <IconInbox size={28} />
              <p>No leads match these filters.</p>
            </div>
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
      )}
    </div>
  );
}
