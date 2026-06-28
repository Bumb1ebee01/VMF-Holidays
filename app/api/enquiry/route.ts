import { Resend } from "resend";
import { db } from "@/lib/db";
import { sendEnquiryWhatsApp } from "@/lib/whatsapp";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO = process.env.ENQUIRY_TO ?? "info@vmfholidays.com";
const FROM = process.env.ENQUIRY_FROM ?? "VMF Holidays <enquiries@vmfholidays.com>";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, email } = body as { name?: string; phone?: string; email?: string };
  if (!name || !phone) {
    return Response.json({ error: "name and phone are required" }, { status: 400 });
  }

  // CRM: persist the lead before anything else so it's never lost
  const source = body.packageTitle
    ? "PACKAGE_PAGE"
    : body.interests || body.budget || body.contactMode
      ? "TRIP_WIZARD"
      : "CONTACT_FORM";

  try {
    await db.lead.create({
      data: {
        name: String(name),
        phone: String(phone),
        email: String(email),
        source,
        destination: body.destination ? String(body.destination) : null,
        dates: body.dates ? String(body.dates) : null,
        travelers: body.travelers ? String(body.travelers) : null,
        budget: body.budget ? String(body.budget) : null,
        tripLength: body.tripLength ? String(body.tripLength) : null,
        contactMode: body.contactMode ? String(body.contactMode) : null,
        contactTime: body.contactTime ? String(body.contactTime) : null,
        interests: Array.isArray(body.interests) ? (body.interests as string[]).map(String) : [],
        message: body.message ? String(body.message) : null,
        packageTitle: body.packageTitle ? String(body.packageTitle) : null,
        hotelCategory: body.hotelCategory ? String(body.hotelCategory) : null,
        mealPlan: body.mealPlan ? String(body.mealPlan) : null,
      },
    });
  } catch (err) {
    console.error("[enquiry] Failed to save lead:", err);
  }

  // Auto-confirm to the customer over WhatsApp (best-effort, never blocks the response)
  const interest = body.packageTitle
    ? String(body.packageTitle)
    : body.destination
      ? String(body.destination)
      : null;
  void sendEnquiryWhatsApp(String(name), String(phone), interest);

  const subject = body.packageTitle
    ? `New Enquiry: ${body.packageTitle} — ${name}`
    : `New Enquiry from ${name}`;

  const html = `
    <h2 style="color:#002464">New Enquiry — VMF Holidays</h2>
    <table style="border-collapse:collapse;width:100%;max-width:560px">
      <tr><td style="padding:8px 0;color:#7B8298;font-size:13px;width:140px">Name</td><td style="padding:8px 0;font-size:14px;font-weight:600">${name}</td></tr>
      <tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Phone</td><td style="padding:8px 0;font-size:14px">${phone}</td></tr>
      <tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Email</td><td style="padding:8px 0;font-size:14px">${email}</td></tr>
      ${body.packageTitle ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Package</td><td style="padding:8px 0;font-size:14px">${body.packageTitle}</td></tr>` : ""}
      ${body.destination ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Destination</td><td style="padding:8px 0;font-size:14px">${body.destination}</td></tr>` : ""}
      ${body.dates ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Dates</td><td style="padding:8px 0;font-size:14px">${body.dates}</td></tr>` : ""}
      ${body.travelers ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Travelers</td><td style="padding:8px 0;font-size:14px">${body.travelers}</td></tr>` : ""}
      ${body.tripLength ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Approx. Length</td><td style="padding:8px 0;font-size:14px">${body.tripLength}</td></tr>` : ""}
      ${body.hotelCategory ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Hotel Category</td><td style="padding:8px 0;font-size:14px">${body.hotelCategory}</td></tr>` : ""}
      ${body.mealPlan ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Meal Plan</td><td style="padding:8px 0;font-size:14px">${body.mealPlan}</td></tr>` : ""}
      ${body.contactMode ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Preferred Contact</td><td style="padding:8px 0;font-size:14px;font-weight:600">${body.contactMode}${body.contactTime ? ` · ${body.contactTime}` : ""}</td></tr>` : ""}
      ${body.budget ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Budget</td><td style="padding:8px 0;font-size:14px">${body.budget}</td></tr>` : ""}
      ${Array.isArray(body.interests) && body.interests.length ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Interests</td><td style="padding:8px 0;font-size:14px">${(body.interests as string[]).join(", ")}</td></tr>` : ""}
      ${body.message ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px;vertical-align:top">Message</td><td style="padding:8px 0;font-size:14px">${body.message}</td></tr>` : ""}
    </table>
    <hr style="border:none;border-top:1px solid #E2E6EF;margin:24px 0"/>
    <p style="font-size:12px;color:#7B8298">VMF Holidays Pvt. Ltd. — Mendes Vaddo, Calangute, Nagva, Goa 403516</p>
  `;

  if (!resend) {
    console.log("[enquiry] No RESEND_API_KEY — logging enquiry:", JSON.stringify(body, null, 2));
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
      body.packageTitle && body.packageTitle !== "Custom Itinerary"
        ? String(body.packageTitle)
        : body.destination
          ? String(body.destination)
          : null;
    const thankYouHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1A1F36">
        <div style="background:#002464;padding:26px 32px;border-radius:14px 14px 0 0">
          <h1 style="margin:0;color:#ffffff;font-size:20px;letter-spacing:-0.01em">VMF Holidays</h1>
          <p style="margin:6px 0 0;color:#FFA333;font-size:11px;letter-spacing:1.5px">DISCOVER YOUR WORLD, YOUR WAY</p>
        </div>
        <div style="border:1px solid #E2E6EF;border-top:none;border-radius:0 0 14px 14px;padding:28px 32px">
          <h2 style="margin:0 0 14px;color:#002464;font-size:18px">Thank you, ${name}!</h2>
          <p style="font-size:14px;line-height:1.7;margin:0 0 16px">
            We've received your enquiry${enquiryAbout ? ` about <strong>${enquiryAbout}</strong>` : ""} and our
            travel experts are already on it. You can expect a personalised reply within <strong>24 hours</strong>.
          </p>
          <p style="font-size:14px;line-height:1.7;margin:0 0 18px">Need us sooner? Reach out any time:</p>
          <p style="font-size:14px;line-height:1.9;margin:0 0 24px">
            Phone: <a href="tel:+917499322412" style="color:#002464;font-weight:600;text-decoration:none">+91 74993 22412</a><br/>
            WhatsApp: <a href="https://wa.me/917499322412" style="color:#002464;font-weight:600;text-decoration:none">chat with us</a><br/>
            Email: <a href="mailto:info@vmfholidays.com" style="color:#002464;font-weight:600;text-decoration:none">info@vmfholidays.com</a>
          </p>
          <a href="https://wa.me/917499322412" style="display:inline-block;background:#FE5C10;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 26px;border-radius:10px">Chat on WhatsApp</a>
        </div>
        <p style="font-size:11px;color:#7B8298;text-align:center;margin:18px 0 0">
          VMF Holidays Pvt. Ltd. — Calangute, Goa 403516, India
        </p>
      </div>
    `;
    try {
      await resend.emails.send({
        from: FROM,
        to: String(email),
        subject: "Thanks for your enquiry — VMF Holidays",
        html: thankYouHtml,
      });
    } catch (err) {
      console.error("[enquiry] Customer thank-you email failed:", err);
    }
  }

  return Response.json({ ok: true });
}
