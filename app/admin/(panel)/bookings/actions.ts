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
