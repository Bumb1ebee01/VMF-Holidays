import { db } from "@/lib/db";
import { getPackageBySlug } from "@/lib/queries";
import { getCurrentMember } from "@/lib/auth/member";
import { isRateLimited } from "@/lib/ratelimit";
import { renderItineraryPdf, itineraryFilename } from "@/lib/itinerary-pdf";
import type { Package } from "@/lib/types";

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

// @react-pdf can only embed PNG/JPEG. Our Cloudinary assets are sometimes served
// as gif/webp (by original format), which render blank. Force a JPEG delivery —
// and size/compress it while we're at it — by injecting a transform after
// `/image/upload/`. Non-Cloudinary URLs are returned unchanged.
function toPdfSafeImageUrl(url: string): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const head = url.slice(0, i + marker.length);
  const tail = url.slice(i + marker.length);
  return `${head}f_jpg,q_auto,w_1200/${tail}`;
}

/** Best-effort: fetch a remote hero image and inline it as a data URI. Never throws. */
async function heroDataUri(url: string | null | undefined): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null; // only remote (e.g. Cloudinary) images
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(toPdfSafeImageUrl(url), { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "image/jpeg";
    // Never embed a format @react-pdf can't draw (gif/webp/etc.) — it renders blank.
    if (!/^image\/(jpeg|jpg|png)$/i.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 3_000_000) return null; // don't inline huge images
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
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

  // Prefer the DESTINATION hero so every package for a destination shares one
  // cover photo (Kerala → Kerala hero, Dubai → Dubai hero…), new packages
  // included. Fall back to the package image when the destination image is
  // missing or broken (some Destination.heroImage URLs 404) so the cover is
  // never blank.
  const hero = (await heroDataUri(dest?.heroImage)) ?? (await heroDataUri(pkg.heroImage));

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
  });
  return pdfResponse(bytes, pkg);
}
