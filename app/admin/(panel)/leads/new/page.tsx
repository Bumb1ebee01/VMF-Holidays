import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/user";
import { db } from "@/lib/db";
import LeadForm from "@/components/admin/LeadForm";
import { createLead } from "../actions";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Lead" };

export default async function NewLeadPage() {
  await requirePermission("leads:edit");

  const users = await db.user.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>
            <Link href="/admin/leads" style={{ color: "var(--orange)", textDecoration: "none" }}>← Leads</Link>
          </p>
          <h1 className={shared.pageTitle}>New lead</h1>
          <p className={shared.pageSub}>Add a walk-in or phone enquiry manually — capture as much as you have.</p>
        </div>
      </div>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <LeadForm action={createLead} mode="create" users={users} cancelHref="/admin/leads" />
      </div>
    </div>
  );
}
