import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { IconActivity } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

type Category = "auth" | "lead" | "content" | "team";

const ACTION_META: Record<string, { label: string; glyph: string; cat: Category }> = {
  "auth.login": { label: "Signed in", glyph: "→", cat: "auth" },
  "auth.logout": { label: "Signed out", glyph: "←", cat: "auth" },
  "lead.status": { label: "Changed lead status", glyph: "◆", cat: "lead" },
  "lead.assign": { label: "Assigned a lead", glyph: "○", cat: "lead" },
  "lead.note": { label: "Added a lead note", glyph: "✎", cat: "lead" },
  "lead.delete": { label: "Deleted a lead", glyph: "✕", cat: "lead" },
  "package.create": { label: "Created a package", glyph: "✦", cat: "content" },
  "package.update": { label: "Updated a package", glyph: "✎", cat: "content" },
  "package.delete": { label: "Deleted a package", glyph: "✕", cat: "content" },
  "destination.create": { label: "Created a destination", glyph: "✦", cat: "content" },
  "destination.update": { label: "Updated a destination", glyph: "✎", cat: "content" },
  "destination.delete": { label: "Deleted a destination", glyph: "✕", cat: "content" },
  "testimonial.create": { label: "Created a testimonial", glyph: "✦", cat: "content" },
  "testimonial.update": { label: "Updated a testimonial", glyph: "✎", cat: "content" },
  "testimonial.delete": { label: "Deleted a testimonial", glyph: "✕", cat: "content" },
  "user.create": { label: "Added a member", glyph: "○", cat: "team" },
  "user.role": { label: "Changed a role", glyph: "★", cat: "team" },
  "user.permissions": { label: "Updated permissions", glyph: "⚿", cat: "team" },
  "user.active": { label: "Changed member status", glyph: "◐", cat: "team" },
  "user.password": { label: "Reset a password", glyph: "⚷", cat: "team" },
};

const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

function dayLabel(date: Date) {
  const today = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(today) - startOf(date)) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return dateFmt.format(date);
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ member?: string }>;
}) {
  const me = await requireUser();
  const seeAll = can(me, "activity:view-all");
  const { member } = await searchParams;

  const where = seeAll ? (member ? { userId: member } : {}) : { userId: me.id };

  const [logs, members] = await Promise.all([
    db.activityLog.findMany({ where, orderBy: { createdAt: "desc" }, take: 250 }),
    seeAll
      ? db.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
      : Promise.resolve([]),
  ]);

  // Stats
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const todayCount = logs.filter((l) => l.createdAt >= startOfToday).length;
  const weekCount = logs.filter((l) => l.createdAt >= weekAgo).length;
  const actors = new Set(logs.map((l) => l.userName)).size;

  // Group by day
  const groups: { label: string; logs: typeof logs }[] = [];
  for (const log of logs) {
    const label = dayLabel(log.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.logs.push(log);
    else groups.push({ label, logs: [log] });
  }

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Oversight</p>
          <h1 className={shared.pageTitle}>Activity Log</h1>
          <p className={shared.pageSub}>
            {seeAll
              ? "Every action taken across the team console."
              : "A record of everything you've done in the console."}
          </p>
        </div>
      </div>

      <div className={shared.kpiGrid} style={{ marginBottom: "var(--sp-6)" }}>
        <div className={shared.kpiCard}>
          <div className={shared.kpiValue}>{todayCount}</div>
          <div className={shared.kpiLabel}>Actions Today</div>
        </div>
        <div className={shared.kpiCard}>
          <div className={shared.kpiValue}>{weekCount}</div>
          <div className={shared.kpiLabel}>This Week</div>
        </div>
        {seeAll && (
          <div className={shared.kpiCard}>
            <div className={shared.kpiValue}>{actors}</div>
            <div className={shared.kpiLabel}>Active People</div>
          </div>
        )}
      </div>

      {seeAll && members.length > 0 && (
        <div className={shared.toolbar}>
          <a href="/admin/activity" className={`${shared.filterTab} ${!member ? shared.filterActive : ""}`}>
            Everyone
          </a>
          {members.map((u) => (
            <a
              key={u.id}
              href={`/admin/activity?member=${u.id}`}
              className={`${shared.filterTab} ${member === u.id ? shared.filterActive : ""}`}
            >
              {u.name}
            </a>
          ))}
        </div>
      )}

      {logs.length === 0 ? (
        <div className={shared.panel}>
          <div className={shared.emptyState}>
            <IconActivity size={28} />
            <p>No activity recorded yet.</p>
          </div>
        </div>
      ) : (
        <div className={styles.timeline}>
          {groups.map((group) => (
            <div key={group.label} className={styles.dayGroup}>
              <div className={styles.dayHead}>
                <span className={styles.dayLabel}>{group.label}</span>
                <span className={styles.dayCount}>{group.logs.length}</span>
              </div>
              <div className={styles.dayBody}>
                {group.logs.map((log) => {
                  const meta = ACTION_META[log.action] ?? { label: log.action, glyph: "•", cat: "auth" as Category };
                  return (
                    <div key={log.id} className={styles.row}>
                      <span className={`${styles.glyph} ${styles[`cat_${meta.cat}`]}`} aria-hidden="true">
                        {meta.glyph}
                      </span>
                      <div className={styles.body}>
                        <p className={styles.line}>
                          {seeAll && <span className={styles.actor}>{log.userName} </span>}
                          <span className={styles.action}>
                            {seeAll ? meta.label.toLowerCase() : meta.label}
                          </span>
                          {log.detail ? <span className={styles.detail}> — {log.detail}</span> : null}
                        </p>
                      </div>
                      <span className={styles.time}>{timeFmt.format(log.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
