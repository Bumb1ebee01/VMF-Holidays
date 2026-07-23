import { db } from "@/lib/db";
import { getPackageBySlug } from "@/lib/queries";
import { getCurrentMember } from "@/lib/auth/member";
import { isRateLimited } from "@/lib/ratelimit";
import { renderItineraryPdf, itineraryFilename } from "@/lib/itinerary-pdf";
import { heroDataUri, resolveItineraryHero } from "@/lib/pdf-images";
import type { Package } from "@/lib/types";
import { mintLeadRef } from "@/lib/refs";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// Itinerary PDF download — tiered gate (ROADMAP: "Download itinerary as PDF").
//
//  • Logged-in Travellers Club member → one-click, personalised + trace-stamped
//    (member id woven into the watermark so a leaked copy traces back). No lead.
//  • Everyone else → must give name + email; stored as a Lead (source
//    PDF_DOWNLOAD) so the download itself becomes a CRM lead. Sample watermark.
//
// The PDF is delivered in the browser — this does NOT depend on the (currently
// unconfigured) Resend email pipeline.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function pdfResponse(bytes: Buffer, pkg: Package): Response {
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${itineraryFilename(pkg)}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return Response.json({ error: "Package not found" }, { status: 404 });

  // One lookup gives us both the T&C region and the shared destination hero.
  const dest = await db.destination.findUnique({
    where: { slug: pkg.destinationSlug },
    select: { region: true, heroImage: true },
  });
  const region = dest?.region === "international" ? "international" : "domestic";

  // Guarantee a cover photo: destination hero → package image → gallery → the
  // bundled destination photo on disk. Handles local `/images/...` paths too
  // (some destinations store those rather than a remote URL).
  const hero = await resolveItineraryHero({
    destHero: dest?.heroImage,
    pkgHero: pkg.heroImage,
    gallery: pkg.gallery,
    destSlug: pkg.destinationSlug,
  });

  // Pre-fetch hotel images to data URIs too — @react-pdf can't fetch during render.
  const hotels = await Promise.all(
    (pkg.hotels ?? []).slice(0, 8).map(async (h) => ({
      name: h.name,
      city: h.city,
      imageDataUri: await heroDataUri(h.image),
    }))
  );

  // ── Member path: one-click, no lead, trace-stamped ──
  const member = await getCurrentMember();
  if (member) {
    if (await isRateLimited(`pdf:member:${member.id}`, 20, 3600)) {
      return Response.json({ error: "Too many downloads — please try again later." }, { status: 429 });
    }
    const bytes = await renderItineraryPdf(pkg, {
      variant: "member",
      region,
      cover: { name: member.name },
      traceId: `member ${member.id.slice(-6).toUpperCase()}`,
      heroDataUri: hero,
      hotels,
    });
    return pdfResponse(bytes, pkg);
  }

  // ── Public path: name + email required, captured as a lead ──
  const ip = clientIp(request);
  if (await isRateLimited(`pdf:ip:${ip}`, 5, 60)) {
    return Response.json({ error: "Too many requests — please try again in a minute." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 200);
  if (!name) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Capture the download as a lead — best-effort, never blocks the download.
  try {
    await db.lead.create({
      data: {
        ref: await mintLeadRef(),
        name,
        email,
        phone: "",
        source: "PDF_DOWNLOAD",
        packageTitle: pkg.title,
        destination: pkg.destination,
        message: `Downloaded the "${pkg.title}" sample itinerary PDF.`,
      },
      select: { id: true },
    });
  } catch (err) {
    console.error("[itinerary] Failed to save PDF-download lead:", err);
  }

  const bytes = await renderItineraryPdf(pkg, {
    variant: "sample",
    region,
    cover: { name },
    heroDataUri: hero,
    hotels,
  });
  return pdfResponse(bytes, pkg);
}
