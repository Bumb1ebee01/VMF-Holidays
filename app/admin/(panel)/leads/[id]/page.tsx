import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import StatusBadge, { type LeadStatusValue } from "@/components/admin/StatusBadge";
import LeadControls from "@/components/admin/LeadControls";
import LeadBookingPanel from "@/components/admin/LeadBookingPanel";
import { addLeadNote } from "../actions";
import { formatDateTime } from "@/lib/utils";
import shared from "@/components/admin/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Lead" };
export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  CONTACT_FORM: "Contact Form",
  TRIP_WIZARD: "Trip Builder",
  PACKAGE_PAGE: "Package Page",
  ASK_QUESTION: "Question",
  PDF_DOWNLOAD: "PDF Download",
  OTHER: "Other",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await requireUser();

  const [lead, users] = await Promise.all([
    db.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        notes: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true } } },
        },
      },
    }),
    db.user.findMany({
      where: { active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!lead) notFound();

  // Link the lead to a Travellers Club member by email, so marking it booked can
  // award the referral credit.
  const clubMember = lead.email
    ? await db.member.findUnique({ where: { email: lead.email.toLowerCase() }, select: { name: true } })
    : null;

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
    ["Source", SOURCE_LABELS[lead.source] ?? lead.source],
    ["Received", formatDateTime(lead.createdAt)],
  ];

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <Link href="/admin/leads" className={styles.backLink}>← All leads</Link>
          <h1 className={shared.pageTitle}>{lead.name}</h1>
        </div>
        <StatusBadge status={lead.status as LeadStatusValue} />
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
            <h2 className={styles.panelTitle}>Notes</h2>
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

            {lead.notes.length === 0 ? (
              <p className={styles.noNotes}>No notes yet.</p>
            ) : (
              <ul className={styles.noteList}>
                {lead.notes.map((note) => (
                  <li key={note.id} className={styles.note}>
                    <p className={styles.noteBody}>{note.body}</p>
                    <span className={styles.noteMeta}>
                      {note.author?.name ?? "Former member"} · {formatDateTime(note.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className={styles.sideCol}>
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
          {can(me, "leads:edit") && (
            <div className={`${shared.panel} ${shared.panelPad}`}>
              <LeadBookingPanel leadId={lead.id} memberName={clubMember?.name ?? null} />
            </div>
          )}
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
