import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { renderQuotationPdf } from "@/lib/itinerary-pdf";
import { heroDataUri } from "@/lib/pdf-images";
import { bookingRef, collectedTotal } from "@/lib/bookings";
import { quoteForBooking, toRupees } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const fmt = (d: Date | null) =>
  d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

export async function GET(_req: Request, ctx: { params: Promise<{ bookingId: string }> }) {
  const user = await getCurrentUser();
  if (!user || !can(user, "bookings:view")) {
    return Response.json({ error: "Not authorised" }, { status: 403 });
  }

  const { bookingId } = await ctx.params;
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      payments: { select: { amount: true, type: true } },
      quotes: { include: { costLines: true } },
    },
  });
  if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });

  // Per-person price comes from the confirmed (accepted) quote behind the booking.
  const acceptedQuote = booking.quotes.find((q) => q.status === "ACCEPTED");
  const priced = acceptedQuote ? quoteForBooking(acceptedQuote) : null;
  const perPax = priced ? Math.round(toRupees(priced.perPax)) : null;
  const paxCount = acceptedQuote?.paxCount ?? null;

  // Best-effort inclusions: match the booking's package by title (bookings hold a
  // free-text package name, not a slug). Omitted if there's no clean match.
  const pkg = booking.packageTitle
    ? await db.package.findFirst({
        where: { title: { equals: booking.packageTitle, mode: "insensitive" } },
        select: { inclusions: true },
      })
    : null;

  // Map the (free-text) destination to a Destination row for its region + hero.
  const dest = booking.destination
    ? await db.destination.findFirst({
        where: {
          OR: [
            { name: { equals: booking.destination, mode: "insensitive" } },
            { slug: booking.destination.toLowerCase().replace(/\s+/g, "-") },
          ],
        },
        select: { region: true, heroImage: true },
      })
    : null;
  const region = dest?.region === "international" ? "international" : "domestic";

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 15);

  const travelDates =
    booking.travelStart && booking.travelEnd
      ? `${fmt(booking.travelStart)} – ${fmt(booking.travelEnd)}`
      : fmt(booking.travelStart);

  const bytes = await renderQuotationPdf({
    ref: bookingRef(booking.id),
    customerName: booking.customerName,
    destination: booking.destination ?? "Your trip",
    packageTitle: booking.packageTitle,
    travelDates,
    pax: booking.pax,
    region,
    totalValue: booking.totalValue,
    perPax,
    paxCount,
    inclusions: pkg?.inclusions ?? [],
    collected: collectedTotal(booking.payments),
    validUntil: fmt(validUntil),
    heroDataUri: await heroDataUri(dest?.heroImage),
  });

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="quotation-${bookingRef(booking.id).toLowerCase()}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
