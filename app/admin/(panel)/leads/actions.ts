"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { LEAD_STATUSES, type LeadStatusValue } from "@/components/admin/StatusBadge";
import { upsertReferralStage } from "@/lib/referral-credit";

export async function updateLeadStatus(leadId: string, status: string) {
  const actor = await requirePermission("leads:edit");
  if (!LEAD_STATUSES.includes(status as LeadStatusValue)) {
    throw new Error("Invalid status");
  }
  const lead = await db.lead.update({
    where: { id: leadId },
    data: { status: status as LeadStatusValue },
  });
  await logActivity(actor, {
    action: "lead.status",
    entity: "Lead",
    entityId: leadId,
    detail: `Set ${lead.name}'s status to ${status}`,
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function assignLead(leadId: string, userId: string) {
  const actor = await requirePermission("leads:assign");
  const lead = await db.lead.update({
    where: { id: leadId },
    data: { assignedToId: userId || null },
  });
  const assignee = userId
    ? await db.user.findUnique({ where: { id: userId }, select: { name: true } })
    : null;
  await logActivity(actor, {
    action: "lead.assign",
    entity: "Lead",
    entityId: leadId,
    detail: assignee ? `Assigned ${lead.name} to ${assignee.name}` : `Unassigned ${lead.name}`,
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addLeadNote(leadId: string, formData: FormData) {
  const actor = await requirePermission("leads:edit");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  await db.leadNote.create({
    data: { leadId, authorId: actor.id, body },
  });
  await logActivity(actor, {
    action: "lead.note",
    entity: "Lead",
    entityId: leadId,
    detail: body.length > 80 ? `${body.slice(0, 80)}…` : body,
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(leadId: string) {
  const actor = await requirePermission("leads:delete");
  const lead = await db.lead.delete({ where: { id: leadId } });
  await logActivity(actor, {
    action: "lead.delete",
    entity: "Lead",
    entityId: leadId,
    detail: `Deleted lead ${lead.name}`,
  });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

export type NewLeadState = { error?: string };

/** Manually add a lead (e.g. a walk-in or phone enquiry). */
export async function createLead(_prev: NewLeadState, formData: FormData): Promise<NewLeadState> {
  const actor = await requirePermission("leads:edit");
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 25);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const destination = String(formData.get("destination") ?? "").trim().slice(0, 200);
  const message = String(formData.get("message") ?? "").trim().slice(0, 4000);

  if (!name || !phone) return { error: "Name and phone are required." };

  const lead = await db.lead.create({
    data: {
      name,
      phone,
      email,
      source: "OTHER",
      destination: destination || null,
      message: message || null,
    },
  });
  await logActivity(actor, {
    action: "lead.create",
    entity: "Lead",
    entityId: lead.id,
    detail: `Added lead ${name}`,
  });
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${lead.id}`);
}

export type BookedState = { error?: string; success?: string };

/**
 * Mark a lead as booked (status WON). If the lead matches a referred Travellers
 * Club member, advance their referral to BOOKED — the reward itself pays later,
 * when their trip is marked completed (rewards fire on travel, not booking).
 */
export async function markLeadBooked(_prev: BookedState, formData: FormData): Promise<BookedState> {
  const actor = await requirePermission("leads:edit");
  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) return { error: "Missing lead." };

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    select: { id: true, name: true, email: true },
  });
  if (!lead) return { error: "Lead not found." };

  await db.lead.update({ where: { id: leadId }, data: { status: "WON" } });

  let msg = "No matching club member — booking recorded.";
  if (lead.email) {
    const member = await db.member.findUnique({
      where: { email: lead.email.toLowerCase() },
      select: { id: true, name: true, referredById: true },
    });
    if (member?.referredById) {
      await upsertReferralStage({
        referrerId: member.referredById,
        refereeMemberId: member.id,
        refereeName: member.name,
        status: "BOOKED",
      });
      msg = "Club member matched — their referral is now Booked. Mark their trip completed on their member profile to release the reward.";
      revalidatePath(`/admin/members/${member.id}`);
    } else if (member) {
      msg = "Club member matched (they weren't referred).";
    }
  }

  await logActivity(actor, {
    action: "lead.booked",
    entity: "Lead",
    entityId: leadId,
    detail: `Marked ${lead.name} booked. ${msg}`,
  });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
  return { success: `Marked as booked. ${msg}` };
}
