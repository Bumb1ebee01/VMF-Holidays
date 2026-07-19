import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { renderQuotationPdf } from "@/lib/itinerary-pdf";
import { bookingRef, collectedTotal } from "@/lib/bookings";

export const dynamic = "force-dynamic";

// Force a Cloudinary URL to a PDF-safe JPEG (@react-pdf can't draw gif/webp).
function toPdfSafeImageUrl(url: string): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  return `${url.slice(0, i + marker.length)}f_jpg,q_auto,w_1200/${url.slice(i + marker.length)}`;
}

async function heroDataUri(url: string | null | undefined): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(toPdfSafeImageUrl(url), { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (!/^image\/(jpeg|jpg|png)$/i.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 3_000_000) return null;
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

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
    include: { payments: { select: { amount: true, type: true } } },
  });
  if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });

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
