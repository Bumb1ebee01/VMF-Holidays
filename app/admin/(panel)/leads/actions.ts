"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { LEAD_STATUSES, type LeadStatusValue } from "@/components/admin/StatusBadge";
import { LEAD_SOURCES, type LeadSourceValue } from "@/components/admin/leadMeta";

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

export type LeadFormState = { error?: string };

const clip = (fd: FormData, key: string, max: number) =>
  String(fd.get(key) ?? "").trim().slice(0, max);

/** A `<input type="date">` value ("YYYY-MM-DD") → a Date at 09:00, or null. */
function parseFollowUp(fd: FormData): Date | null {
  const raw = clip(fd, "followUpAt", 20);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const d = new Date(`${raw}T09:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Parse + normalise the editable enquiry-detail fields shared by the manual-add
 * and edit forms. Deliberately excludes `status` and `assignedToId` — those are
 * owned by LeadControls (with their own leads:assign permission), so an edit
 * never silently resets them.
 */
function parseLeadDetails(fd: FormData) {
  const sourceRaw = clip(fd, "source", 30);
  const source: LeadSourceValue = (LEAD_SOURCES as readonly string[]).includes(sourceRaw)
    ? (sourceRaw as LeadSourceValue)
    : "OTHER";
  const interests = clip(fd, "interests", 400)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
  return {
    name: clip(fd, "name", 100),
    phone: clip(fd, "phone", 25),
    email: clip(fd, "email", 200),
    source,
    destination: clip(fd, "destination", 200) || null,
    packageTitle: clip(fd, "packageTitle", 200) || null,
    dates: clip(fd, "dates", 120) || null,
    travelers: clip(fd, "travelers", 40) || null,
    tripLength: clip(fd, "tripLength", 80) || null,
    timeframe: clip(fd, "timeframe", 60) || null,
    contactMode: clip(fd, "contactMode", 60) || null,
    contactTime: clip(fd, "contactTime", 60) || null,
    budget: clip(fd, "budget", 80) || null,
    hotelCategory: clip(fd, "hotelCategory", 80) || null,
    mealPlan: clip(fd, "mealPlan", 80) || null,
    interests,
    message: clip(fd, "message", 4000) || null,
  };
}

/** Manually add a lead (walk-in / phone enquiry) with the full detail set. */
export async function createLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const actor = await requirePermission("leads:edit");
  const data = parseLeadDetails(formData);
  if (!data.name || !data.phone) return { error: "Name and phone are required." };

  // Create-only: status + assignee may be set up front.
  const statusRaw = clip(formData, "status", 20);
  const status: LeadStatusValue = (LEAD_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as LeadStatusValue)
    : "NEW";
  const assignedToId = clip(formData, "assignedToId", 40) || null;
  const followUpAt = parseFollowUp(formData);

  const lead = await db.lead.create({
    data: { ...data, source: data.source || "OTHER", status, assignedToId, ...(followUpAt ? { followUpAt } : {}) },
  });
  await logActivity(actor, {
    action: "lead.create",
    entity: "Lead",
    entityId: lead.id,
    detail: `Added lead ${data.name}`,
  });
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${lead.id}`);
}

/** Edit an existing lead's enquiry details (customisation mid-journey). */
export async function updateLead(
  leadId: string,
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const actor = await requirePermission("leads:edit");
  const data = parseLeadDetails(formData);
  if (!data.name || !data.phone) return { error: "Name and phone are required." };
  const followUpAt = parseFollowUp(formData);

  const lead = await db.lead.update({
    where: { id: leadId },
    data: { ...data, ...(followUpAt ? { followUpAt } : {}) },
  });
  await logActivity(actor, {
    action: "lead.update",
    entity: "Lead",
    entityId: leadId,
    detail: `Edited ${lead.name}'s details`,
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  redirect(`/admin/leads/${leadId}`);
}
