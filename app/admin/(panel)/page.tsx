import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import StatusBadge, {
  STATUS_LABELS,
  type LeadStatusValue,
} from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import {
  IconInbox,
  IconLeads,
  IconCheck,
  IconTarget,
  IconTrendUp,
  IconTrendDown,
  IconPackage,
  IconMap,
  IconStar,
  IconChevronRight,
  IconActivity,
} from "@/components/admin/icons";
import { SOURCE_LABELS } from "@/components/admin/leadMeta";
import shared from "@/components/admin/shared.module.css";

export const dynamic = "force-dynamic";

const ACTION_GLYPH: Record<string, string> = {
  "auth.login": "→",
  "lead.status": "◆",
  "lead.assign": "○",
  "lead.note": "✎",
  "lead.delete": "✕",
  "package.create": "✦",
  "package.update": "✎",
  "destination.create": "✦",
  "testimonial.create": "✦",
  "user.create": "○",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDateTime(date);
}

function followLabel(d: Date) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  const diffDays = Math.round((day.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "1d overdue";
  if (diffDays < 0) return `${-diffDays}d overdue`;
  return formatDateTime(d);
}

export default async function AdminDashboard() {
  const user = await requireUser();
  const canViewLeads = can(user, "leads:view");
  const seeAllActivity = can(user, "activity:view-all");

  const now = new Date();
  const d30 = new Date(now); d30.setDate(now.getDate() - 30);
  const d60 = new Date(now); d60.setDate(now.getDate() - 60);
  const weeksBack = 8;
  const chartStart = new Date(now); chartStart.setDate(now.getDate() - weeksBack * 7);

  const [
    statusCounts,
    sourceCounts,
    last30,
    prev30,
    chartLeads,
    recentLeads,
    myOpen,
    packageCount,
    destinationCount,
    testimonialCount,
    activity,
  ] = await Promise.all([
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.lead.groupBy({ by: ["source"], _count: { _all: true } }),
    db.lead.count({ where: { createdAt: { gte: d30 } } }),
    db.lead.count({ where: { createdAt: { gte: d60, lt: d30 } } }),
    db.lead.findMany({ where: { createdAt: { gte: chartStart } }, select: { createdAt: true } }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, status: true, destination: true, packageTitle: true, source: true, createdAt: true },
    }),
    can(user, "leads:view")
      ? db.lead.count({ where: { assignedToId: user.id, status: { in: ["NEW", "CONTACTED", "QUOTED"] } } })
      : Promise.resolve(0),
    db.package.count(),
    db.destination.count(),
    db.testimonial.count(),
    db.activityLog.findMany({
      where: seeAllActivity ? {} : { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
  ]);

  // Open leads whose follow-up date has arrived (or passed). Fetched on its own,
  // guarded, so it degrades to empty if the followUpAt column isn't live yet.
  const endToday = new Date();
  endToday.setHours(23, 59, 59, 999);
  let followUpsDue: {
    id: string;
    name: string;
    followUpAt: Date | null;
    destination: string | null;
    packageTitle: string | null;
  }[] = [];
  if (canViewLeads) {
    try {
      followUpsDue = await db.lead.findMany({
        where: {
          followUpAt: { lte: endToday },
          status: { in: ["NEW", "CONTACTED", "QUOTED"] },
          ...(seeAllActivity ? {} : { assignedToId: user.id }),
        },
        orderBy: { followUpAt: "asc" },
        take: 8,
        select: { id: true, name: true, followUpAt: true, destination: true, packageTitle: true },
      });
    } catch {
      followUpsDue = [];
    }
  }

  const countFor = (s: string) => statusCounts.find((x) => x.status === s)?._count._all ?? 0;
  const totalLeads = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const won = countFor("WON");
  const conversion = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

  const delta = prev30 === 0 ? (last30 > 0 ? 100 : 0) : Math.round(((last30 - prev30) / prev30) * 100);

  // Weekly buckets oldest → newest
  const buckets = Array.from({ length: weeksBack }, () => 0);
  for (const lead of chartLeads) {
    const idx = Math.floor((lead.createdAt.getTime() - chartStart.getTime()) / (7 * 86400000));
    if (idx >= 0 && idx < weeksBack) buckets[idx]++;
  }
  const maxBucket = Math.max(1, ...buckets);

  const pipeline = (["NEW", "CONTACTED", "QUOTED", "WON"] as const).map((s) => ({
    status: s,
    label: STATUS_LABELS[s],
    count: countFor(s),
  }));
  const pipelineMax = Math.max(1, ...pipeline.map((p) => p.count));

  const sources = sourceCounts
    .map((s) => ({ name: SOURCE_LABELS[s.source] ?? s.source, count: s._count._all }))
    .sort((a, b) => b.count - a.count);
  const sourceMax = Math.max(1, ...sources.map((s) => s.count));

  const kpis = canViewLeads
    ? [
        { label: "Total Leads", value: totalLeads, icon: IconInbox, tone: "" as const, delta, desc: "vs last 30 days" },
        { label: "New / Unactioned", value: countFor("NEW"), icon: IconLeads, tone: "kpiIconOrange" as const, desc: "awaiting a response" },
        { label: "Won", value: won, icon: IconCheck, tone: "kpiIconGreen" as const, desc: "closed deals" },
        { label: "Conversion", value: `${conversion}%`, icon: IconTarget, tone: "kpiIconBlue" as const, desc: "won of all leads" },
      ]
    : [
        { label: "Packages", value: packageCount, icon: IconPackage, tone: "" as const, desc: "live on the site" },
        { label: "Destinations", value: destinationCount, icon: IconMap, tone: "kpiIconBlue" as const, desc: "published" },
        { label: "Testimonials", value: testimonialCount, icon: IconStar, tone: "kpiIconOrange" as const, desc: "published" },
      ];

  const quickActions = [
    { perm: "leads:view", href: "/admin/leads?status=NEW", icon: IconLeads, label: "Review New Leads" },
    { perm: "packages:manage", href: "/admin/packages/new", icon: IconPackage, label: "New Package" },
    { perm: "destinations:manage", href: "/admin/destinations/new", icon: IconMap, label: "New Destination" },
    { perm: "testimonials:manage", href: "/admin/testimonials/new", icon: IconStar, label: "New Testimonial" },
  ].filter((a) => can(user, a.perm as Parameters<typeof can>[1]));

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>Dashboard</p>
          <h1 className={shared.pageTitle}>
            {greeting()}, {user.name.split(" ")[0]}
          </h1>
          <p className={shared.pageSub}>
            {canViewLeads && myOpen > 0
              ? `You have ${myOpen} open lead${myOpen === 1 ? "" : "s"} assigned to you.`
              : "Here's what's happening across VMF Holidays."}
          </p>
        </div>
        {canViewLeads && (
          <Link href="/admin/leads" className="btn btn-navy btn--sm">
            View All Leads
          </Link>
        )}
      </div>

      {/* KPI cards */}
      <div className={shared.kpiGrid}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const d = "delta" in kpi ? kpi.delta : undefined;
          return (
            <div key={kpi.label} className={shared.kpiCard}>
              <div className={shared.kpiTop}>
                <span className={`${shared.kpiIcon} ${kpi.tone ? shared[kpi.tone] : ""}`}>
                  <Icon size={19} />
                </span>
                {typeof d === "number" && (
                  <span
                    className={`${shared.kpiDelta} ${
                      d > 0 ? shared.kpiDeltaUp : d < 0 ? shared.kpiDeltaDown : shared.kpiDeltaFlat
                    }`}
                  >
                    {d > 0 ? <IconTrendUp size={12} /> : d < 0 ? <IconTrendDown size={12} /> : null}
                    {d > 0 ? "+" : ""}{d}%
                  </span>
                )}
              </div>
              <div className={shared.kpiValue}>{kpi.value}</div>
              <div className={shared.kpiLabel}>{kpi.label}</div>
              {"desc" in kpi && kpi.desc && <div className={shared.kpiDesc}>{kpi.desc}</div>}
            </div>
          );
        })}
      </div>

      <div className={shared.gridMain}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
          {canViewLeads && (
            <>
              {/* Leads over time */}
              <div className={shared.card}>
                <div className={shared.cardHead}>
                  <div>
                    <h2 className={shared.cardTitle}>Leads Over Time</h2>
                    <p className={shared.cardSub}>Enquiries per week · last {weeksBack} weeks</p>
                  </div>
                  <span className={shared.kpiLabel}>{last30} this month</span>
                </div>
                <div className={shared.bars}>
                  {buckets.map((count, i) => (
                    <div key={i} className={shared.barCol}>
                      <span className={shared.barValue}>{count > 0 ? count : ""}</span>
                      <div
                        className={shared.bar}
                        style={{ height: `${Math.max(3, (count / maxBucket) * 100)}%` }}
                      />
                      <span className={shared.barLabel}>
                        {i === weeksBack - 1 ? "Now" : `${weeksBack - 1 - i}w`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline */}
              <div className={shared.card}>
                <div className={shared.cardHead}>
                  <h2 className={shared.cardTitle}>Pipeline</h2>
                  <Link href="/admin/leads" className={shared.sectionLink}>
                    Open <IconChevronRight size={13} />
                  </Link>
                </div>
                <div className={shared.funnel}>
                  {pipeline.map((p, i) => (
                    <div key={p.status} className={shared.funnelRow}>
                      <div className={shared.funnelMeta}>
                        <span className={shared.funnelLabel}>{p.label}</span>
                        <span className={shared.funnelVal}>
                          <b>{p.count}</b> {totalLeads > 0 ? `· ${Math.round((p.count / totalLeads) * 100)}%` : ""}
                        </span>
                      </div>
                      <div className={shared.funnelTrack}>
                        <div
                          className={shared.funnelFill}
                          data-tone={i === pipeline.length - 1 ? "green" : i === 0 ? "orange" : undefined}
                          style={{ width: `${(p.count / pipelineMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Recent leads */}
          {canViewLeads && (
            <div className={shared.card}>
              <div className={shared.cardHead}>
                <h2 className={shared.cardTitle}>Recent Enquiries</h2>
                <Link href="/admin/leads" className={shared.sectionLink}>
                  All leads <IconChevronRight size={13} />
                </Link>
              </div>
              {recentLeads.length === 0 ? (
                <div className={shared.emptyState}>
                  <IconInbox size={28} />
                  <p>No leads yet. Website enquiries will appear here automatically.</p>
                </div>
              ) : (
                <div className={shared.miniList}>
                  {recentLeads.map((lead) => (
                    <Link key={lead.id} href={`/admin/leads/${lead.id}`} className={shared.miniRow}>
                      <span className={shared.miniAvatar}>{lead.name.charAt(0)}</span>
                      <div className={shared.miniMain}>
                        <div className={shared.miniName}>{lead.name}</div>
                        <div className={shared.miniSub}>
                          {lead.packageTitle ?? lead.destination ?? SOURCE_LABELS[lead.source] ?? "Enquiry"}
                        </div>
                      </div>
                      <StatusBadge status={lead.status as LeadStatusValue} />
                      <span className={shared.miniMeta}>{relativeTime(lead.createdAt)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
          {canViewLeads && (
            <div className={shared.card}>
              <div className={shared.cardHead}>
                <div>
                  <h2 className={shared.cardTitle}>Follow-ups Due</h2>
                  <p className={shared.cardSub}>Reach out today</p>
                </div>
                {followUpsDue.length > 0 && <span className={shared.kpiLabel}>{followUpsDue.length}</span>}
              </div>
              {followUpsDue.length === 0 ? (
                <div className={shared.emptyState}>
                  <IconCheck size={26} />
                  <p>Nothing due — you&apos;re all caught up.</p>
                </div>
              ) : (
                <div className={shared.miniList}>
                  {followUpsDue.map((l) => {
                    const overdue = l.followUpAt ? l.followUpAt.getTime() < now.getTime() : false;
                    return (
                      <Link key={l.id} href={`/admin/leads/${l.id}`} className={shared.miniRow}>
                        <span className={shared.miniAvatar}>{l.name.charAt(0)}</span>
                        <div className={shared.miniMain}>
                          <div className={shared.miniName}>{l.name}</div>
                          <div className={shared.miniSub}>{l.packageTitle ?? l.destination ?? "Follow up"}</div>
                        </div>
                        <span
                          className={shared.miniMeta}
                          style={overdue ? { color: "var(--orange-ink, #C0341D)", fontWeight: 600 } : undefined}
                        >
                          {l.followUpAt ? followLabel(l.followUpAt) : ""}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {quickActions.length > 0 && (
            <div className={shared.card}>
              <div className={shared.cardHead}>
                <h2 className={shared.cardTitle}>Quick Actions</h2>
              </div>
              <div className={shared.quickGrid}>
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link key={a.href} href={a.href} className={shared.quickTile}>
                      <span className={shared.quickTileIcon}><Icon size={17} /></span>
                      <span className={shared.quickTileText}>{a.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {canViewLeads && sources.length > 0 && (
            <div className={shared.card}>
              <div className={shared.cardHead}>
                <h2 className={shared.cardTitle}>Lead Sources</h2>
              </div>
              <div className={shared.breakdown}>
                {sources.map((s) => (
                  <div key={s.name} className={shared.breakRow}>
                    <div className={shared.breakMeta}>
                      <span className={shared.breakName}>{s.name}</span>
                      <span className={shared.breakCount}>{s.count}</span>
                    </div>
                    <div className={shared.breakTrack}>
                      <div className={shared.breakFill} style={{ width: `${(s.count / sourceMax) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity */}
          <div className={shared.card}>
            <div className={shared.cardHead}>
              <h2 className={shared.cardTitle}>{seeAllActivity ? "Team Activity" : "Your Activity"}</h2>
              <Link href="/admin/activity" className={shared.sectionLink}>
                All <IconChevronRight size={13} />
              </Link>
            </div>
            {activity.length === 0 ? (
              <div className={shared.emptyState}>
                <IconActivity size={28} />
                <p>No activity recorded yet.</p>
              </div>
            ) : (
              <div className={shared.miniList}>
                {activity.map((log) => (
                  <div key={log.id} className={shared.miniRow}>
                    <span className={shared.miniAvatar} aria-hidden="true">
                      {ACTION_GLYPH[log.action] ?? "•"}
                    </span>
                    <div className={shared.miniMain}>
                      <div className={shared.miniName}>
                        {seeAllActivity ? log.userName : "You"}
                      </div>
                      <div className={shared.miniSub}>
                        {log.detail ?? log.action.replace(/[.]/g, " ")}
                      </div>
                    </div>
                    <span className={shared.miniMeta}>{relativeTime(log.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
