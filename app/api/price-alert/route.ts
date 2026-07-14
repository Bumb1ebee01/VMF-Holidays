import { db } from "@/lib/db";
import { isRateLimited } from "@/lib/ratelimit";

// Public "notify me if the price drops" capture. Phone-only, no account. Defended by
// a per-IP rate limiter and a honeypot (lighter than the enquiry form on purpose).
function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (await isRateLimited(`pricealert:${ip}`, 8, 300)) {
    return Response.json({ error: "Too many requests — please try again shortly." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — hidden field bots fill; pretend success and drop it.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const phone = clip(body.phone, 25);
  const packageSlug = clip(body.packageSlug, 200);
  const packageTitle = clip(body.packageTitle, 200);
  if (phone.replace(/\D/g, "").length < 6) {
    return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (!packageSlug) {
    return Response.json({ error: "Missing package." }, { status: 400 });
  }
  const priceAtSignup = Number.isFinite(Number(body.priceAtSignup))
    ? Math.round(Number(body.priceAtSignup))
    : null;

  try {
    await db.priceAlert.create({ data: { phone, packageSlug, packageTitle, priceAtSignup } });
  } catch (err) {
    console.error("[price-alert] save failed:", err);
    return Response.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
