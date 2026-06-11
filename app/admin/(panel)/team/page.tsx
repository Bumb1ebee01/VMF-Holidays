import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/user";
import TeamManager from "@/components/admin/TeamManager";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const admin = await requireAdmin();

  const users = await db.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Administration</p>
          <h1 className={shared.pageTitle}>Team</h1>
          <p className={shared.pageSub}>
            {users.filter((u) => u.active).length} active members. Only admins can see this page.
          </p>
        </div>
      </div>
      <TeamManager users={users} currentUserId={admin.id} />
    </div>
  );
}
