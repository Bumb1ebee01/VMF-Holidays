"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { LEAD_STATUSES, type LeadStatusValue } from "@/components/admin/StatusBadge";

export async function updateLeadStatus(leadId: string, status: string) {
  await requireUser();
  if (!LEAD_STATUSES.includes(status as LeadStatusValue)) {
    throw new Error("Invalid status");
  }
  await db.lead.update({
    where: { id: leadId },
    data: { status: status as LeadStatusValue },
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function assignLead(leadId: string, userId: string) {
  await requireUser();
  await db.lead.update({
    where: { id: leadId },
    data: { assignedToId: userId || null },
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addLeadNote(leadId: string, formData: FormData) {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  await db.leadNote.create({
    data: { leadId, authorId: user.id, body },
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(leadId: string) {
  await requireUser();
  await db.lead.delete({ where: { id: leadId } });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
