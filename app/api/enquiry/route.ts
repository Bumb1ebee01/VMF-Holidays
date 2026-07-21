import { Resend } from "resend";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sendEnquiryWhatsApp } from "@/lib/whatsapp";
import { isRateLimited } from "@/lib/ratelimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { REF_COOKIE, normalizeCode } from "@/lib/referral";
import { upsertReferralStage } from "@/lib/referral-credit";
import { BUSINESS } from "@/lib/seo";
import { telHref, whatsappLink, PHONE_PRIMARY_DISPLAY } from "@/lib/contact";
import { mintLeadRef } from "@/lib/refs";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO = process.env.ENQUIRY_TO ?? "info@vmfholidays.com";
const FROM = process.env.ENQUIRY_FROM ?? "VMF Holidays <enquiries@vmfholidays.com>";

// This is a public, unauthenticated endpoint that writes a DB row and sends
// emails/WhatsApp, so it's a spam/cost-abuse target. Defences applied below: a
// per-IP rate limiter (shared Upstash store when configured, else in-memory), a
// honeypot, and optional Cloudflare Turnstile.

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

// HTML-escape any user-supplied value before it goes into an email body, so a
// crafted name/message can't inject markup or links into mail we send.
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Trim and hard-cap a free-text field so we never persist/echo oversized input. */
function clip(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (await isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests — please try again in a minute or message us on WhatsApp.", whatsappFallback: true },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a hidden "company" field that real users never see. If it's filled,
  // the submitter is a bot — pretend success so it moves on, but drop it entirely.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  // CAPTCHA (Cloudflare Turnstile) — only enforced when TURNSTILE_SECRET_KEY is set.
  const captchaOk = await verifyTurnstile(
    typeof body.turnstileToken === "string" ? body.turnstileToken : "",
    ip
  );
  if (!captchaOk) {
    return Response.json(
      { error: "Verification failed — please retry.", whatsappFallback: true },
      { status: 400 }
    );
  }

  // Validate + normalise the required fields.
  const name = clip(body.name, 100);
  const phone = clip(body.phone, 25);
  const email = clip(body.email, 200);
  if (!name || !phone) {
    return Response.json({ error: "name and phone are required" }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 6) {
    return Response.json({ error: "Please enter a valid phone number" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  // Normalise the optional fields up front (capped) so both the DB row and the
  // email use the same clean values.
  const f = {
    destination: clip(body.destination, 200),
    dates: clip(body.dates, 120),
    travelers: clip(body.travelers, 40),
    budget: clip(body.budget, 80),
    tripLength: clip(body.tripLength, 80),
    timeframe: clip(body.timeframe, 60),
    contactMode: clip(body.contactMode, 60),
    contactTime: clip(body.contactTime, 60),
    message: clip(body.message, 4000),
    packageTitle: clip(body.packageTitle, 200),
    hotelCategory: clip(body.hotelCategory, 80),
    mealPlan: clip(body.mealPlan, 80),
    interests: Array.isArray(body.interests)
      ? (body.interests as unknown[]).slice(0, 30).map((i) => clip(i, 60)).filter(Boolean)
      : [],
  };

  // CRM: persist the lead before anything else so it's never lost
  const isQuestion = body.enquiryType === "question";
  const source = isQuestion
    ? "ASK_QUESTION"
    : f.packageTitle
      ? "PACKAGE_PAGE"
      : f.interests.length || f.budget || f.contactMode
        ? "TRIP_WIZARD"
        : "CONTACT_FORM";

  // Urgency routing: near-term travellers are flagged so the team can prioritise.
  const URGENT_TIMEFRAMES = new Set(["Within 2 weeks", "This month"]);
  const isUrgent = URGENT_TIMEFRAMES.has(f.timeframe);

  // Travellers Club referral attribution (WI-1): a first-touch ?ref cookie (set by
  // proxy.ts) credits the referrer for an enquiry — even one made without signing up.
  const jar = await cookies();
  const refCookie = normalizeCode(jar.get(REF_COOKIE)?.value ?? "");
  let referrerId: string | null = null;
  if (refCookie) {
    const referrer = await db.member.findUnique({
      where: { referralCode: refCookie },
      select: { id: true, phone: true, email: true },
    });
    // Ignore self-referral (someone enquiring with their own code).
    if (referrer && referrer.phone !== phone && (!email || referrer.email !== email)) {
      referrerId = referrer.id;
    }
  }

  let leadId: string | null = null;
  try {
    const lead = await db.lead.create({
      data: {
        ref: await mintLeadRef(),
        name,
        phone,
        email,
        source,
        destination: f.destination || null,
        dates: f.dates || null,
        travelers: f.travelers || null,
        budget: f.budget || null,
        tripLength: f.tripLength || null,
        timeframe: f.timeframe || null,
        contactMode: f.contactMode || null,
        contactTime: f.contactTime || null,
        interests: f.interests,
        message: f.message || null,
        packageTitle: f.packageTitle || null,
        hotelCategory: f.hotelCategory || null,
        mealPlan: f.mealPlan || null,
        referralCode: referrerId ? refCookie : null,
      },
      select: { id: true },
    });
    leadId = lead.id;
  } catch (err) {
    console.error("[enquiry] Failed to save lead:", err);
  }

  // Record the referral touch (ENQUIRED) and consume the first-touch cookie.
  if (referrerId && leadId) {
    try {
      await upsertReferralStage({
        referrerId,
        refereeName: name,
        refereePhone: phone,
        leadId,
        status: "ENQUIRED",
      });
      jar.delete(REF_COOKIE);
    } catch (err) {
      console.error("[enquiry] referral attribution failed:", err);
    }
  }

  // Auto-confirm to the customer over WhatsApp (best-effort, never blocks the response)
  const interest = f.packageTitle || f.destination || null;
  void sendEnquiryWhatsApp(name, phone, interest);

  const kind = isQuestion ? "Question" : "Enquiry";
  const baseSubject = f.packageTitle
    ? `New ${kind}: ${f.packageTitle} — ${name}`
    : `New ${kind} from ${name}`;
  // Push time-sensitive leads to the top of the team's inbox.
  const subject = isUrgent ? `🔴 Travelling soon — ${baseSubject}` : baseSubject;

  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px;width:140px">${label}</td><td style="padding:8px 0;font-size:14px">${esc(value)}</td></tr>`
      : "";

  const urgentBanner = isUrgent
    ? `<p style="background:#FDECEA;border-left:4px solid #C0341D;color:#8a1f10;padding:10px 14px;border-radius:6px;font-size:14px;font-weight:600;margin:0 0 16px">🔴 Travelling soon (${esc(f.timeframe)}) — please respond promptly.</p>`
    : "";

  const html = `
    <h2 style="color:#002464">New ${kind} — VMF Holidays</h2>
    ${urgentBanner}
    <table style="border-collapse:collapse;width:100%;max-width:560px">
      <tr><td style="padding:8px 0;color:#7B8298;font-size:13px;width:140px">Name</td><td style="padding:8px 0;font-size:14px;font-weight:600">${esc(name)}</td></tr>
      <tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Phone</td><td style="padding:8px 0;font-size:14px">${esc(phone)}</td></tr>
      ${row("Email", email)}
      ${row("Package", f.packageTitle)}
      ${row("Destination", f.destination)}
      ${row("Travelling", f.timeframe)}
      ${row("Dates", f.dates)}
      ${row("Travelers", f.travelers)}
      ${row("Approx. Length", f.tripLength)}
      ${row("Hotel Category", f.hotelCategory)}
      ${row("Meal Plan", f.mealPlan)}
      ${row("Preferred Contact", f.contactMode ? `${f.contactMode}${f.contactTime ? ` · ${f.contactTime}` : ""}` : "")}
      ${row("Budget", f.budget)}
      ${row("Interests", f.interests.join(", "))}
      ${row("Message", f.message)}
    </table>
    <hr style="border:none;border-top:1px solid #E2E6EF;margin:24px 0"/>
    <p style="font-size:12px;color:#7B8298">${BUSINESS.legalName} — ${BUSINESS.address.full}</p>
  `;

  if (!resend) {
    console.log("[enquiry] No RESEND_API_KEY — logging enquiry for:", name, phone);
    return Response.json({ ok: true, whatsappFallback: true });
  }

  try {
    await resend.emails.send({ from: FROM, to: TO, subject, html });
  } catch (err) {
    console.error("[enquiry] Resend error:", err);
    return Response.json({ ok: false, whatsappFallback: true }, { status: 500 });
  }

  // Best-effort thank-you to the customer (only when they shared an email).
  // Never blocks or fails the request — the business notification above is what
  // the enquiry depends on; this is a courtesy auto-reply.
  if (email) {
    const enquiryAbout =
      f.packageTitle && f.packageTitle !== "Custom Itinerary"
        ? f.packageTitle
        : f.destination || null;
    const thankYouHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1A1F36">
        <div style="background:#002464;padding:26px 32px;border-radius:14px 14px 0 0">
          <h1 style="margin:0;color:#ffffff;font-size:20px;letter-spacing:-0.01em">VMF Holidays</h1>
          <p style="margin:6px 0 0;color:#FFA333;font-size:11px;letter-spacing:1.5px">DISCOVER YOUR WORLD, YOUR WAY</p>
        </div>
        <div style="border:1px solid #E2E6EF;border-top:none;border-radius:0 0 14px 14px;padding:28px 32px">
          <h2 style="margin:0 0 14px;color:#002464;font-size:18px">Thank you, ${esc(name)}!</h2>
          <p style="font-size:14px;line-height:1.7;margin:0 0 16px">
            We've received your enquiry${enquiryAbout ? ` about <strong>${esc(enquiryAbout)}</strong>` : ""} and our
            travel experts are already on it. You can expect a personalised reply within <strong>24 hours</strong>.
          </p>
          <p style="font-size:14px;line-height:1.7;margin:0 0 18px">Need us sooner? Reach out any time:</p>
          <p style="font-size:14px;line-height:1.9;margin:0 0 24px">
            Phone: <a href="${telHref()}" style="color:#002464;font-weight:600;text-decoration:none">${PHONE_PRIMARY_DISPLAY}</a><br/>
            WhatsApp: <a href="${whatsappLink()}" style="color:#002464;font-weight:600;text-decoration:none">chat with us</a><br/>
            Email: <a href="mailto:info@vmfholidays.com" style="color:#002464;font-weight:600;text-decoration:none">info@vmfholidays.com</a>
          </p>
          <a href="${whatsappLink()}" style="display:inline-block;background:#FE5C10;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 26px;border-radius:10px">Chat on WhatsApp</a>
        </div>
        <p style="font-size:11px;color:#7B8298;text-align:center;margin:18px 0 0">
          ${BUSINESS.legalName} — ${BUSINESS.address.full}
        </p>
      </div>
    `;
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Thanks for your enquiry — VMF Holidays",
        html: thankYouHtml,
      });
    } catch (err) {
      console.error("[enquiry] Customer thank-you email failed:", err);
    }
  }

  return Response.json({ ok: true });
}
