"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { COST_CATEGORIES, quoteForBooking, type CostCategory } from "@/lib/pricing";
import { generateRef, nextVersion, quoteLabel, QUOTE_STATUSES, type QuoteStatusValue } from "@/lib/quotes";
import { mintLeadRef } from "@/lib/refs";

export type QuoteState = { error?: string };

const clip = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

const num = (fd: FormData, k: string): number | null => {
  const raw = clip(fd, k, 20).replace(/[^\d.]/g, "");
  return raw === "" ? null : Number(raw);
};

/**
 * Costs and margin are commercially sensitive, so every action here is ADMIN-only
 * rather than merely bookings:manage — an advisor negotiating a discount should
 * not be able to see exactly how much room there is.
 */
async function requireAdmin() {
  const me = await requireUser();
  if (me.role !== "ADMIN") redirect("/admin");
  return me;
}

/** An accepted quote sets the booking's value, so the ledger matches the price sold. */
async function syncAcceptedQuoteToBooking(quoteId: string) {
  const q = await db.quote.findUnique({
    where: { id: quoteId },
    select: {
      status: true, bookingId: true, paxCount: true, markupPct: true, priceOverride: true,
      gstApplicable: true, gstRatePct: true, gstBase: true, tcsApplicable: true, tcsRatePct: true,
      costLines: true,
    },
  });
  if (!q || q.status !== "ACCEPTED" || !q.bookingId) return;
  const quote = quoteForBooking(q);
  if (!quote) return;
  await db.booking.update({
    where: { id: q.bookingId },
    data: { totalValue: Math.round(quote.total / 100) },
  });
}

// ── Creating quotes ───────────────────────────────────────────────────────────

/** Start a quote — from a lead, or standalone when leadId is empty. */
export async function createQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const me = await requireAdmin();
  const leadId = clip(formData, "leadId", 40) || null;
  const optionLabel = clip(formData, "optionLabel", 60) || null;

  let ref: string | null = null;
  let snapshot: Record<string, unknown> = {};

  if (leadId) {
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      select: { id: true, ref: true, name: true, destination: true, packageTitle: true },
    });
    if (!lead) return { error: "That enquiry no longer exists." };
    // An older lead may predate references — mint one now so the quote has a home.
    ref = lead.ref ?? (await mintLeadRef());
    if (!lead.ref && ref) await db.lead.update({ where: { id: lead.id }, data: { ref } });
    snapshot = {
      customerName: lead.name,
      destination: lead.destination,
      packageTitle: lead.packageTitle,
    };
  } else {
    // Scratch quote: no customer, just a quick estimate.
    ref = await mintLeadRef();
    snapshot = { customerName: clip(formData, "customerName", 120) || null };
  }

  const quote = await db.quote.create({
    data: {
      ref: ref ?? generateRef(),
      version: 1,
      optionLabel,
      leadId,
      createdById: me.id,
      ...snapshot,
    },
  });

  await logActivity(me, {
    action: "quote.create",
    entity: "Quote",
    entityId: quote.id,
    detail: `Started quote ${quoteLabel(quote)}`,
  });
  if (leadId) revalidatePath(`/admin/leads/${leadId}`);
  redirect(`/admin/quotes/${quote.id}`);
}

/**
 * Copy a quote into a new version, so the previous figures stay on record.
 * Revisions count within an option, letting "Option A v2" and "Option B v1"
 * coexist under one reference.
 */
export async function reviseQuote(quoteId: string) {
  const me = await requireAdmin();
  const source = await db.quote.findUnique({
    where: { id: quoteId },
    include: { costLines: true },
  });
  if (!source) return;

  const siblings = await db.quote.findMany({
    where: { ref: source.ref },
    select: { version: true, optionLabel: true, ref: true },
  });

  const revision = await db.quote.create({
    data: {
      ref: source.ref,
      version: nextVersion(siblings, source.optionLabel),
      optionLabel: source.optionLabel,
      leadId: source.leadId,
      bookingId: source.bookingId,
      customerName: source.customerName,
      destination: source.destination,
      packageTitle: source.packageTitle,
      travelStart: source.travelStart,
      travelEnd: source.travelEnd,
      paxCount: source.paxCount,
      markupPct: source.markupPct,
      priceOverride: source.priceOverride,
      gstApplicable: source.gstApplicable,
      gstRatePct: source.gstRatePct,
      gstBase: source.gstBase,
      tcsApplicable: source.tcsApplicable,
      tcsRatePct: source.tcsRatePct,
      notes: source.notes,
      createdById: me.id,
      costLines: {
        create: source.costLines.map((l) => ({
          category: l.category,
          basis: l.basis,
          currency: l.currency,
          unitCostMinor: l.unitCostMinor,
          fxRate: l.fxRate,
          label: l.label,
        })),
      },
    },
  });

  // The old version stays readable but is clearly no longer the live one.
  await db.quote.update({ where: { id: source.id }, data: { status: "SUPERSEDED" } });

  await logActivity(me, {
    action: "quote.revise",
    entity: "Quote",
    entityId: revision.id,
    detail: `Revised to ${quoteLabel(revision)}`,
  });
  redirect(`/admin/quotes/${revision.id}`);
}

export async function setQuoteStatus(quoteId: string, status: string) {
  const me = await requireAdmin();
  if (!(QUOTE_STATUSES as readonly string[]).includes(status)) return;

  const data: Record<string, unknown> = { status: status as QuoteStatusValue };
  if (status === "SENT") data.sentAt = new Date();
  if (status === "ACCEPTED") data.acceptedAt = new Date();

  const quote = await db.quote.update({ where: { id: quoteId }, data });
  await syncAcceptedQuoteToBooking(quoteId);

  await logActivity(me, {
    action: "quote.status",
    entity: "Quote",
    entityId: quoteId,
    detail: `${quoteLabel(quote)} → ${status}`,
  });
  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath("/admin/quotes");
}

// ── Cost lines and pricing ────────────────────────────────────────────────────

export async function addCostLine(
  quoteId: string,
  _prev: QuoteState,
  formData: FormData
): Promise<QuoteState> {
  const me = await requireAdmin();
  const category = clip(formData, "category", 20).toUpperCase();
  const basis = clip(formData, "basis", 10).toUpperCase();
  const currency = (clip(formData, "currency", 3) || "INR").toUpperCase();
  const unitCost = num(formData, "unitCost");
  const fxRate = num(formData, "fxRate") ?? 1;

  if (unitCost === null || !Number.isFinite(unitCost) || unitCost <= 0) {
    return { error: "Enter a unit cost above zero." };
  }
  if (currency !== "INR" && (!Number.isFinite(fxRate) || fxRate <= 0)) {
    return { error: "A foreign-currency line needs an exchange rate." };
  }

  await db.costLine.create({
    data: {
      quoteId,
      category: (COST_CATEGORIES as readonly string[]).includes(category)
        ? (category as CostCategory)
        : "OTHER",
      basis: basis === "GROUP" ? "GROUP" : "PER_PAX",
      currency,
      unitCostMinor: Math.round(unitCost * 100),
      fxRate: currency === "INR" ? 1 : fxRate,
      label: clip(formData, "label", 120) || null,
    },
  });
  await syncAcceptedQuoteToBooking(quoteId);
  await logActivity(me, {
    action: "quote.cost.add",
    entity: "Quote",
    entityId: quoteId,
    detail: "Added a cost line",
  });
  revalidatePath(`/admin/quotes/${quoteId}`);
  return {};
}

export async function deleteCostLine(costLineId: string, quoteId: string) {
  const me = await requireAdmin();
  await db.costLine.delete({ where: { id: costLineId } });
  await syncAcceptedQuoteToBooking(quoteId);
  await logActivity(me, {
    action: "quote.cost.delete",
    entity: "Quote",
    entityId: quoteId,
    detail: "Removed a cost line",
  });
  revalidatePath(`/admin/quotes/${quoteId}`);
}

/** Markup, taxes and the optional agreed price. Everything stays editable. */
export async function saveQuoteSettings(
  quoteId: string,
  _prev: QuoteState,
  formData: FormData
): Promise<QuoteState> {
  const me = await requireAdmin();

  const markupPct = num(formData, "markupPct");
  const priceOverrideRupees = num(formData, "priceOverride");
  const paxCount = Math.max(1, Math.round(num(formData, "paxCount") ?? 1));

  if (markupPct !== null && (markupPct < 0 || markupPct > 500)) {
    return { error: "Markup should be between 0% and 500%." };
  }
  if (priceOverrideRupees !== null && priceOverrideRupees < 0) {
    return { error: "A manual price can't be negative." };
  }

  await db.quote.update({
    where: { id: quoteId },
    data: {
      paxCount,
      markupPct,
      priceOverride: priceOverrideRupees === null ? null : Math.round(priceOverrideRupees * 100),
      gstApplicable: formData.get("gstApplicable") === "on",
      gstRatePct: num(formData, "gstRatePct") ?? 18,
      gstBase: clip(formData, "gstBase", 20) === "TOTAL" ? "TOTAL" : "MARKUP_ONLY",
      tcsApplicable: formData.get("tcsApplicable") === "on",
      tcsRatePct: num(formData, "tcsRatePct") ?? 2,
      notes: clip(formData, "notes", 1000) || null,
    },
  });
  await syncAcceptedQuoteToBooking(quoteId);
  await logActivity(me, {
    action: "quote.update",
    entity: "Quote",
    entityId: quoteId,
    detail: "Updated quote pricing",
  });
  revalidatePath(`/admin/quotes/${quoteId}`);
  return {};
}
