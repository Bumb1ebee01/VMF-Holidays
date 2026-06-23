"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { LEAD_STATUSES, type LeadStatusValue } from "@/components/admin/StatusBadge";

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
