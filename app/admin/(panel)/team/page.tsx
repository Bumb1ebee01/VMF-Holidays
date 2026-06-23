import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/user";
import TeamManager from "@/components/admin/TeamManager";
import { IconTeam, IconStar, IconCheck } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const admin = await requireAdmin();

  const users = await db.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, permissions: true, createdAt: true },
  });

  const active = users.filter((u) => u.active).length;
  const admins = users.filter((u) => u.role === "ADMIN").length;

  const kpis = [
    { label: "Team Members", value: users.length, icon: IconTeam, tone: "" },
    { label: "Administrators", value: admins, icon: IconStar, tone: "kpiIconOrange" },
    { label: "Active", value: active, icon: IconCheck, tone: "kpiIconGreen" },
  ];

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Administration</p>
          <h1 className={shared.pageTitle}>Team</h1>
          <p className={shared.pageSub}>
            Manage members, roles and per-person permissions. Only admins can see this page.
          </p>
        </div>
      </div>

      <div className={shared.kpiGrid} style={{ marginBottom: "var(--sp-6)" }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={shared.kpiCard}>
              <div className={shared.kpiTop}>
                <span className={`${shared.kpiIcon} ${kpi.tone ? shared[kpi.tone] : ""}`}>
                  <Icon size={19} />
                </span>
              </div>
              <div className={shared.kpiValue}>{kpi.value}</div>
              <div className={shared.kpiLabel}>{kpi.label}</div>
            </div>
          );
        })}
      </div>

      <TeamManager users={users} currentUserId={admin.id} />
    </div>
  );
}
