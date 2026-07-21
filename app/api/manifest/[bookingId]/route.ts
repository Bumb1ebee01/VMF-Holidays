import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { bookingRef } from "@/lib/bookings";
import { manifestToCsv, manifestFilename } from "@/lib/travellers";

export const dynamic = "force-dynamic";

/**
 * Group manifest as CSV. Contains travellers' personal details, so it is gated
 * behind the same permission as the rest of a booking — never public.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  await requirePermission("bookings:view");
  const { bookingId } = await params;

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      travelStart: true,
      travellers: {
        select: {
          fullName: true,
          type: true,
          dateOfBirth: true,
          gender: true,
          nationality: true,
          phone: true,
          email: true,
          isLead: true,
          notes: true,
        },
      },
    },
  });
  if (!booking) return new Response("Not found", { status: 404 });

  const csv = manifestToCsv(booking.travellers, booking.travelStart);
  const filename = manifestFilename(bookingRef(booking.id));

  return new Response(
    // A BOM makes Excel read the file as UTF-8, so accented names survive.
    "﻿" + csv,
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    }
  );
}
