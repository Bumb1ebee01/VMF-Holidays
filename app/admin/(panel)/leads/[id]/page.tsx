import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import StatusBadge, { STATUS_LABELS, type LeadStatusValue } from "@/components/admin/StatusBadge";
import LeadControls from "@/components/admin/LeadControls";
import LeadBookingPanel from "@/components/admin/LeadBookingPanel";
import { addLeadNote } from "../actions";
import { SOURCE_LABELS } from "@/components/admin/leadMeta";
import { formatDateTime } from "@/lib/utils";
import shared from "@/components/admin/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Lead" };
export const dynamic = "force-dynamic";

const ACTION_GLYPH: Record<string, string> = {
  "lead.create": "✦",
  "lead.status": "◆",
  "lead.assign": "○",
  "lead.update": "✎",
  "lead.booked": "✓",
  "lead.delete": "✕",
};

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireUser();

  const [lead, users, activity] = await Promise.all([
    db.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        notes: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true } } },
        },
        bookings: { select: { id: true, status: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    db.user.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    // The lead's own history for the activity timeline. `lead.note` events are
    // excluded — the note bodies themselves already appear in the timeline.
    db.activityLog.findMany({
      where: { entity: "Lead", entityId: id, action: { not: "lead.note" } },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
  ]);

  if (!lead) notFound();

  // Link the lead to a Travellers Club member by email, so marking it booked can
  // award the referral credit.
  const clubMember = lead.email
    ? await db.member.findUnique({ where: { email: lead.email.toLowerCase() }, select: { name: true } })
    : null;

  // Possible duplicates — other leads sharing this phone or email.
  const dupeOr = [
    ...(lead.phone ? [{ phone: lead.phone }] : []),
    ...(lead.email ? [{ email: { equals: lead.email, mode: "insensitive" as const } }] : []),
  ];
  const duplicates =
    dupeOr.length > 0
      ? await db.lead.findMany({
          where: { id: { not: lead.id }, OR: dupeOr },
          select: { id: true, name: true, status: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : [];

  const addNote = addLeadNote.bind(null, lead.id);

  const fields: [string, string | null][] = [
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Destination", lead.destination],
    ["Package", lead.packageTitle],
    ["Travel dates", lead.dates],
    ["Travellers", lead.travelers],
    ["Approx. length", lead.tripLength],
    ["Hotel category", lead.hotelCategory],
    ["Meal plan", lead.mealPlan],
    ["Preferred contact", lead.contactMode ? `${lead.contactMode}${lead.contactTime ? ` · ${lead.contactTime}` : ""}` : null],
    ["Budget", lead.budget],
    ["Interests", lead.interests.length ? lead.interests.join(", ") : null],
    ["Next follow-up", lead.followUpAt ? formatDate(lead.followUpAt) : null],
    ["Lost reason", lead.status === "LOST" ? lead.lostReason : null],
    ["Source", SOURCE_LABELS[lead.source] ?? lead.source],
    ["Received", formatDateTime(lead.createdAt)],
  ];

  // Merge notes + system events into one reverse-chronological activity timeline.
  const timeline = [
    ...lead.notes.map((n) => ({
      id: `n-${n.id}`,
      at: n.createdAt,
      who: n.author?.name ?? "Former member",
      text: n.body,
      kind: "note" as const,
      action: "",
    })),
    ...activity.map((a) => ({
      id: `a-${a.id}`,
      at: a.createdAt,
      who: a.userName,
      text: a.detail ?? a.action.replace(/[.]/g, " "),
      kind: "event" as const,
      action: a.action,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <Link href="/admin/leads" className={styles.backLink}>← All leads</Link>
          <h1 className={shared.pageTitle}>{lead.name}</h1>
          {lead.tags.length > 0 && (
            <div className={styles.tagRow}>
              {lead.tags.map((t) => (
                <Link key={t} href={`/admin/leads?tag=${encodeURIComponent(t)}`} className={styles.tagChip}>
                  {t}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          {can(me, "leads:edit") && (
            <Link href={`/admin/leads/${lead.id}/edit`} className="btn btn-outline btn--sm">
              Edit details
            </Link>
          )}
          <StatusBadge status={lead.status as LeadStatusValue} />
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <div className={`${shared.panel} ${shared.panelPad}`}>
            <h2 className={styles.panelTitle}>Enquiry Details</h2>
            <dl className={styles.fieldList}>
              {fields.map(([label, value]) =>
                value ? (
                  <div key={label} className={styles.fieldRow}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
            {lead.message && (
              <div className={styles.message}>
                <span className={styles.messageLabel}>Message</span>
                <p>{lead.message}</p>
              </div>
            )}
          </div>

          <div className={`${shared.panel} ${shared.panelPad}`}>
            <h2 className={styles.panelTitle}>Activity</h2>
            {can(me, "leads:edit") && (
              <form action={addNote} className={styles.noteForm}>
                <textarea
                  name="body"
                  className="form-textarea"
                  rows={3}
                  placeholder="Add a note — calls made, quotes sent, follow-ups…"
                  required
                />
                <button type="submit" className="btn btn-navy btn--sm">Add Note</button>
              </form>
            )}

            {timeline.length === 0 ? (
              <p className={styles.noNotes}>No activity yet.</p>
            ) : (
              <ul className={styles.noteList}>
                {timeline.map((e) =>
                  e.kind === "note" ? (
                    <li key={e.id} className={styles.note}>
                      <p className={styles.noteBody}>{e.text}</p>
                      <span className={styles.noteMeta}>
                        {e.who} · {formatDateTime(e.at)}
                      </span>
                    </li>
                  ) : (
                    <li key={e.id} className={styles.event}>
                      <span className={styles.eventGlyph} aria-hidden="true">
                        {ACTION_GLYPH[e.action] ?? "•"}
                      </span>
                      <div className={styles.eventBody}>
                        <span className={styles.eventText}>{e.text}</span>
                        <span className={styles.eventMeta}>
                          {e.who} · {formatDateTime(e.at)}
                        </span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>

        <aside className={styles.sideCol}>
          {duplicates.length > 0 && (
            <div className={`${shared.panel} ${shared.panelPad}`}>
              <h3 className={shared.cardTitle}>
                Possible duplicate{duplicates.length === 1 ? "" : "s"}
              </h3>
              <p className={shared.cardSub}>Same phone or email as this lead.</p>
              <ul className={styles.dupeList}>
                {duplicates.map((d) => (
                  <li key={d.id}>
                    <Link href={`/admin/leads/${d.id}`} className={styles.dupeLink}>
                      <span>{d.name}</span>
                      <span className={styles.dupeMeta}>
                        {STATUS_LABELS[d.status as LeadStatusValue]} · {formatDate(d.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={`${shared.panel} ${shared.panelPad}`}>
            <LeadControls
              leadId={lead.id}
              status={lead.status}
              assignedToId={lead.assignedTo?.id ?? null}
              users={users}
              canEdit={can(me, "leads:edit")}
              canAssign={can(me, "leads:assign")}
              canDelete={can(me, "leads:delete")}
            />
          </div>
          {lead.bookings.length > 0 ? (
            <div className={`${shared.panel} ${shared.panelPad}`}>
              <h3 className={shared.cardTitle}>Booking</h3>
              <p className={shared.cardSub}>This enquiry has been converted to a booking.</p>
              <Link
                href={`/admin/bookings/${lead.bookings[0].id}`}
                className="btn btn-outline btn--sm"
                style={{ marginTop: 10 }}
              >
                View booking →
              </Link>
            </div>
          ) : can(me, "bookings:manage") ? (
            <div className={`${shared.panel} ${shared.panelPad}`}>
              <LeadBookingPanel
                leadId={lead.id}
                memberName={clubMember?.name ?? null}
                prefill={{
                  name: lead.name,
                  phone: lead.phone ?? "",
                  email: lead.email ?? "",
                  destination: lead.destination ?? "",
                  packageTitle: lead.packageTitle ?? "",
                }}
              />
            </div>
          ) : null}
          <a
            href={`https://wa.me/91${lead.phone.replace(/\D/g, "").slice(-10)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-primary ${styles.waBtn}`}
          >
            WhatsApp {lead.name.split(" ")[0]}
          </a>
        </aside>
      </div>
    </div>
  );
}
