import { db } from "@/lib/db";
import { getPackageBySlug } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth/user";
import { can } from "@/lib/permissions";
import { renderItineraryPdf, itineraryFilename } from "@/lib/itinerary-pdf";
import { logActivity } from "@/lib/activity";
import { heroDataUri, resolveItineraryHero } from "@/lib/pdf-images";
import type { ItineraryDay } from "@/lib/types";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// STAFF share (CRM): generate a per-customer itinerary PDF from an existing
// package — with the customer's name/dates/pax on the cover, an optionally
// edited day-by-day, and a personalised notes block — then LOG the share on the
// lead so the timeline shows how many itineraries we've prepared for them.
// Deep-link + attach: the client downloads this file and attaches it to the
// WhatsApp/email it opens, so no BSP or mail pipeline is needed.
// ─────────────────────────────────────────────────────────────────────────────

interface ShareBody {
  leadId?: string;
  customerName?: string;
  dates?: string;
  adults?: number;
  children?: number;
  infants?: number;
  days?: { title?: string; description?: string }[];
  notes?: string;
  channel?: "download" | "whatsapp" | "email";
}

function paxString(a: number, c: number, inf: number): string {
  const parts: string[] = [];
  if (a > 0) parts.push(`${a} adult${a === 1 ? "" : "s"}`);
  if (c > 0) parts.push(`${c} child${c === 1 ? "" : "ren"}`);
  if (inf > 0) parts.push(`${inf} infant${inf === 1 ? "" : "s"}`);
  return parts.join(", ");
}

export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user || !can(user, "leads:edit")) {
    return Response.json({ error: "Not authorised" }, { status: 403 });
  }

  const { slug } = await ctx.params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return Response.json({ error: "Package not found" }, { status: 404 });

  let body: ShareBody;
  try {
    body = (await request.json()) as ShareBody;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const dest = await db.destination.findUnique({
    where: { slug: pkg.destinationSlug },
    select: { region: true, heroImage: true },
  });
  const region = dest?.region === "international" ? "international" : "domestic";
  const hero = await resolveItineraryHero({
    destHero: dest?.heroImage,
    pkgHero: pkg.heroImage,
    gallery: pkg.gallery,
    destSlug: pkg.destinationSlug,
  });
  const hotels = await Promise.all(
    (pkg.hotels ?? []).slice(0, 8).map(async (h) => ({
      name: h.name,
      city: h.city,
      imageDataUri: await heroDataUri(h.image),
    }))
  );

  // Per-customer edited days override the package's itinerary when provided.
  const editedDays: ItineraryDay[] = (body.days ?? [])
    .map((d, i) => ({
      day: i + 1,
      title: String(d.title ?? "").slice(0, 200),
      description: String(d.description ?? "").slice(0, 2000),
    }))
    .filter((d) => d.title || d.description)
    .slice(0, 40);
  const itinerary = editedDays.length > 0 ? editedDays : pkg.itinerary;

  const adults = Math.max(0, Math.min(99, Number(body.adults) || 0));
  const children = Math.max(0, Math.min(99, Number(body.children) || 0));
  const infants = Math.max(0, Math.min(99, Number(body.infants) || 0));
  const travellers = paxString(adults, children, infants) || undefined;
  const dates = body.dates?.trim() ? body.dates.trim().slice(0, 80) : undefined;
  const customerName = body.customerName?.trim().slice(0, 100) || undefined;
  const notes = body.notes?.trim() ? body.notes.trim().slice(0, 4000) : undefined;

  const bytes = await renderItineraryPdf(
    { ...pkg, itinerary },
    {
      variant: "member",
      region,
      cover: { name: customerName, dates, travellers },
      traceId: body.leadId ? `ref ${body.leadId.slice(-6).toUpperCase()}` : undefined,
      heroDataUri: hero,
      hotels,
      customNote: notes,
    }
  );

  // Record the share against the lead — best-effort, never blocks the download.
  if (body.leadId) {
    const channelLabel =
      body.channel === "whatsapp" ? "WhatsApp" : body.channel === "email" ? "email" : "download";
    const detail = [
      `Prepared "${pkg.title}" itinerary`,
      dates,
      travellers,
      editedDays.length > 0 ? "customised" : null,
    ]
      .filter(Boolean)
      .join(" · ");
    await logActivity(user, {
      action: "lead.itinerary",
      entity: "Lead",
      entityId: body.leadId,
      detail: `${detail} (${channelLabel})`,
    });
  }

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${itineraryFilename(pkg)}"`,
      "Cache-Control": "no-store",
    },
  });
}
