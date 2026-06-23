import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { db } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | VMF Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();
  const newLeads = can(user, "leads:view")
    ? await db.lead.count({ where: { status: "NEW" } })
    : 0;

  return (
    <AdminShell user={user} newLeads={newLeads}>
      {children}
    </AdminShell>
  );
}
