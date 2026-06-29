import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/user";
import NewLeadForm from "@/components/admin/NewLeadForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Lead" };

export default async function NewLeadPage() {
  await requirePermission("leads:edit");

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>
            <Link href="/admin/leads" style={{ color: "var(--orange)", textDecoration: "none" }}>← Leads</Link>
          </p>
          <h1 className={shared.pageTitle}>New lead</h1>
          <p className={shared.pageSub}>Add a walk-in or phone enquiry manually.</p>
        </div>
      </div>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <NewLeadForm />
      </div>
    </div>
  );
}
