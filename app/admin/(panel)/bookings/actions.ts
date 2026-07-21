"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { upsertReferralStage } from "@/lib/referral-credit";
import {
  BOOKING_STATUSES,
  PAYMENT_TYPES,
  PAYMENT_MODES,
  bookingRef,
  type BookingStatusValue,
} from "@/lib/bookings";
import {
  TRAVELLER_TYPES,
  paxSummaryFromTravellers,
  type TravellerTypeValue,
} from "@/lib/travellers";

export type BookingFormState = { error?: string };
export type PaymentState = { error?: string };

const clip = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

function parseDate(fd: FormData, k: string): Date | null {
  const raw = clip(fd, k, 20);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const d = new Date(`${raw}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseAmount(fd: FormData, k: string): number {
  const n = Math.round(Number(String(fd.get(k) ?? "").replace(/[^\d.]/g, "")));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parseCount(fd: FormData, k: string): number {
  const n = Math.round(Number(String(fd.get(k) ?? "").replace(/[^\d]/g, "")));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** "2 adults, 1 child, 1 infant · 4 pax" — human summary stored on the booking. */
function paxSummary(a: number, c: number, i: number): string {
  const parts = [`${a} adult${a === 1 ? "" : "s"}`];
  if (c > 0) parts.push(`${c} ${c === 1 ? "child" : "children"}`);
  if (i > 0) parts.push(`${i} infant${i === 1 ? "" : "s"}`);
  return `${parts.join(", ")} · ${a + c + i} pax`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Convert a won lead into a Booking (the trip lifecycle) and set the lead Won. */
export async function createBookingFromLead(
  leadId: string,
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const actor = await requirePermission("bookings:manage");
  const lead = await db.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { error: "Lead not found." };

  // Confirmed booking — all customer + trip details are mandatory.
  const customerName = clip(formData, "customerName", 120);
  const customerPhone = clip(formData, "customerPhone", 40);
  const customerEmail = clip(formData, "customerEmail", 200);
  const destination = clip(formData, "destination", 120);
  const packageTitle = clip(formData, "packageTitle", 160);
  const travelStart = parseDate(formData, "travelStart");
  const travelEnd = parseDate(formData, "travelEnd");
  const adults = parseCount(formData, "adults");
  const children = parseCount(formData, "children");
  const infants = parseCount(formData, "infants");
  const totalValue = parseAmount(formData, "totalValue");

  if (!customerName) return { error: "Customer name is required." };
  if (!customerPhone) return { error: "Phone is required." };
  if (!EMAIL_RE.test(customerEmail)) return { error: "A valid email is required." };
  if (!destination) return { error: "Destination is required." };
  if (!travelStart || !travelEnd) return { error: "Travel start and end dates are required." };
  if (travelEnd < travelStart) return { error: "Travel end can't be before travel start." };
  if (adults < 1) return { error: "At least one adult is required." };
  if (totalValue <= 0) return { error: "Total value must be greater than zero." };

  const booking = await db.booking.create({
    data: {
      leadId: lead.id,
      customerName,
      customerPhone,
      customerEmail,
      destination,
      packageTitle: packageTitle || lead.packageTitle,
      travelStart,
      travelEnd,
      pax: paxSummary(adults, children, infants),
      paxCount: Math.max(1, adults + children + infants),
      totalValue,
      advisorId: lead.assignedToId ?? actor.id,
    },
  });

  // Preserve the old "mark booked" behaviour: Won + advance any club referral.
  await db.lead.update({ where: { id: lead.id }, data: { status: "WON" } });
  let refMsg = "";
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
      refMsg = " Club referral advanced to Booked.";
      revalidatePath(`/admin/members/${member.id}`);
    }
  }

  await logActivity(actor, {
    action: "lead.booked",
    entity: "Lead",
    entityId: lead.id,
    detail: `Booked ${lead.name} — ${bookingRef(booking.id)}.${refMsg}`,
  });
  await logActivity(actor, {
    action: "booking.create",
    entity: "Booking",
    entityId: booking.id,
    detail: `Created booking ${bookingRef(booking.id)} for ${lead.name}`,
  });
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/leads/${lead.id}`);
  redirect(`/admin/bookings/${booking.id}`);
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const actor = await requirePermission("bookings:manage");
  if (!(BOOKING_STATUSES as readonly string[]).includes(status)) throw new Error("Invalid status");
  await db.booking.update({ where: { id: bookingId }, data: { status: status as BookingStatusValue } });
  await logActivity(actor, {
    action: "booking.status",
    entity: "Booking",
    entityId: bookingId,
    detail: `${bookingRef(bookingId)} → ${status}`,
  });
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/bookings");
}

export async function addPayment(
  bookingId: string,
  _prev: PaymentState,
  formData: FormData
): Promise<PaymentState> {
  const actor = await requirePermission("bookings:manage");
  const amount = parseAmount(formData, "amount");
  if (amount <= 0) return { error: "Enter an amount greater than zero." };

  const typeRaw = clip(formData, "type", 20);
  const type = (PAYMENT_TYPES as readonly string[]).includes(typeRaw)
    ? (typeRaw as (typeof PAYMENT_TYPES)[number])
    : "ADVANCE";
  const modeRaw = clip(formData, "mode", 20);
  const mode = (PAYMENT_MODES as readonly string[]).includes(modeRaw)
    ? (modeRaw as (typeof PAYMENT_MODES)[number])
    : "CASH";

  await db.payment.create({
    data: {
      bookingId,
      amount,
      type,
      mode,
      paidAt: parseDate(formData, "paidAt") ?? new Date(),
      note: clip(formData, "note", 300) || null,
      recordedBy: actor.name,
    },
  });
  await logActivity(actor, {
    action: "payment.add",
    entity: "Booking",
    entityId: bookingId,
    detail: `Recorded ₹${amount.toLocaleString("en-IN")} on ${bookingRef(bookingId)}`,
  });
  revalidatePath(`/admin/bookings/${bookingId}`);
  return {};
}

export async function deletePayment(paymentId: string, bookingId: string) {
  const actor = await requirePermission("bookings:manage");
  await db.payment.delete({ where: { id: paymentId } });
  await logActivity(actor, {
    action: "payment.delete",
    entity: "Booking",
    entityId: bookingId,
    detail: `Removed a payment from ${bookingRef(bookingId)}`,
  });
  revalidatePath(`/admin/bookings/${bookingId}`);
}

// ── Group manifest ────────────────────────────────────────────────────────────
// The per-traveller list for a booking. Deliberately stores no ID document
// numbers (see the Traveller model in schema.prisma). Every write re-derives the
// booking's `pax` summary from the manifest, so the head count on the booking,
// the quotation PDF and the manifest can never disagree.

export type TravellerState = { error?: string };

/** Recompute Booking.pax from the manifest. No-op while the manifest is empty. */
async function syncPaxSummary(bookingId: string) {
  const travellers = await db.traveller.findMany({
    where: { bookingId },
    select: { type: true, fullName: true },
  });
  const summary = paxSummaryFromTravellers(travellers);
  // paxCount drives per-pax cost lines, so it has to follow the manifest too.
  if (summary) {
    await db.booking.update({
      where: { id: bookingId },
      data: { pax: summary, paxCount: Math.max(1, travellers.length) },
    });
  }
}

/**
 * A birth date has no timezone. Parsing it at *local* midnight stores a moment
 * whose UTC date can be the previous day, and every surface here renders dates
 * in UTC (toISOString) — so the value would come back a day early and drift
 * earlier again on each save. Anchor it to UTC midnight instead.
 */
function parseBirthDate(fd: FormData): Date | null {
  const raw = clip(fd, "dateOfBirth", 20);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const d = new Date(`${raw}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseTraveller(fd: FormData) {
  const rawType = clip(fd, "type", 10).toUpperCase();
  return {
    fullName: clip(fd, "fullName", 120),
    type: (TRAVELLER_TYPES as readonly string[]).includes(rawType)
      ? (rawType as TravellerTypeValue)
      : ("ADULT" as TravellerTypeValue),
    dateOfBirth: parseBirthDate(fd),
    gender: clip(fd, "gender", 30) || null,
    nationality: clip(fd, "nationality", 60) || null,
    phone: clip(fd, "phone", 40) || null,
    email: clip(fd, "email", 200) || null,
    isLead: fd.get("isLead") === "on" || fd.get("isLead") === "true",
    notes: clip(fd, "notes", 500) || null,
  };
}

export async function addTraveller(
  bookingId: string,
  _prev: TravellerState,
  formData: FormData
): Promise<TravellerState> {
  const actor = await requirePermission("bookings:manage");
  const data = parseTraveller(formData);
  if (!data.fullName) return { error: "Traveller name is required." };
  if (data.email && !EMAIL_RE.test(data.email)) return { error: "That email doesn't look right." };
  if (data.dateOfBirth && data.dateOfBirth.getTime() > Date.now()) {
    return { error: "Date of birth can't be in the future." };
  }

  // Exactly one lead passenger per booking.
  if (data.isLead) {
    await db.traveller.updateMany({ where: { bookingId, isLead: true }, data: { isLead: false } });
  }

  await db.traveller.create({ data: { ...data, bookingId } });
  await syncPaxSummary(bookingId);
  await logActivity(actor, {
    action: "traveller.add",
    entity: "Booking",
    entityId: bookingId,
    detail: `Added ${data.fullName} to the manifest for ${bookingRef(bookingId)}`,
  });
  revalidatePath(`/admin/bookings/${bookingId}`);
  return {};
}

export async function updateTraveller(
  travellerId: string,
  bookingId: string,
  _prev: TravellerState,
  formData: FormData
): Promise<TravellerState> {
  const actor = await requirePermission("bookings:manage");
  const data = parseTraveller(formData);
  if (!data.fullName) return { error: "Traveller name is required." };
  if (data.email && !EMAIL_RE.test(data.email)) return { error: "That email doesn't look right." };
  if (data.dateOfBirth && data.dateOfBirth.getTime() > Date.now()) {
    return { error: "Date of birth can't be in the future." };
  }

  if (data.isLead) {
    await db.traveller.updateMany({
      where: { bookingId, isLead: true, NOT: { id: travellerId } },
      data: { isLead: false },
    });
  }

  await db.traveller.update({ where: { id: travellerId }, data });
  await syncPaxSummary(bookingId);
  await logActivity(actor, {
    action: "traveller.update",
    entity: "Booking",
    entityId: bookingId,
    detail: `Updated ${data.fullName} on the manifest for ${bookingRef(bookingId)}`,
  });
  revalidatePath(`/admin/bookings/${bookingId}`);
  return {};
}

export async function deleteTraveller(travellerId: string, bookingId: string) {
  const actor = await requirePermission("bookings:manage");
  const traveller = await db.traveller.findUnique({
    where: { id: travellerId },
    select: { fullName: true },
  });
  await db.traveller.delete({ where: { id: travellerId } });
  await syncPaxSummary(bookingId);
  await logActivity(actor, {
    action: "traveller.delete",
    entity: "Booking",
    entityId: bookingId,
    detail: `Removed ${traveller?.fullName ?? "a traveller"} from the manifest for ${bookingRef(bookingId)}`,
  });
  revalidatePath(`/admin/bookings/${bookingId}`);
}

