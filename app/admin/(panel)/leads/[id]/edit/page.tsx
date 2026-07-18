import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import LeadForm from "@/components/admin/LeadForm";
import { updateLead } from "../../actions";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Lead" };
export const dynamic = "force-dynamic";

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePermission("leads:edit");

  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  const action = updateLead.bind(null, id);

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>
            <Link href={`/admin/leads/${id}`} style={{ color: "var(--orange)", textDecoration: "none" }}>← {lead.name}</Link>
          </p>
          <h1 className={shared.pageTitle}>Edit lead</h1>
          <p className={shared.pageSub}>Update the enquiry details as the trip takes shape.</p>
        </div>
      </div>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <LeadForm action={action} mode="edit" lead={lead} cancelHref={`/admin/leads/${id}`} />
      </div>
    </div>
  );
}
