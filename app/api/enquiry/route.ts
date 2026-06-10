import { Resend } from "resend";

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
  if (!name || !phone || !email) {
    return Response.json({ error: "name, phone and email are required" }, { status: 400 });
  }

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
      ${body.budget ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Budget</td><td style="padding:8px 0;font-size:14px">${body.budget}</td></tr>` : ""}
      ${Array.isArray(body.interests) && body.interests.length ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px">Interests</td><td style="padding:8px 0;font-size:14px">${(body.interests as string[]).join(", ")}</td></tr>` : ""}
      ${body.message ? `<tr><td style="padding:8px 0;color:#7B8298;font-size:13px;vertical-align:top">Message</td><td style="padding:8px 0;font-size:14px">${body.message}</td></tr>` : ""}
    </table>
    <hr style="border:none;border-top:1px solid #E2E6EF;margin:24px 0"/>
    <p style="font-size:12px;color:#7B8298">VMF Holidays Pvt. Ltd. — Nagoa, Bardez, Goa 403516</p>
  `;

  if (!resend) {
    console.log("[enquiry] No RESEND_API_KEY — logging enquiry:", JSON.stringify(body, null, 2));
    return Response.json({ ok: true, whatsappFallback: true });
  }

  try {
    await resend.emails.send({ from: FROM, to: TO, subject, html });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[enquiry] Resend error:", err);
    return Response.json({ ok: false, whatsappFallback: true }, { status: 500 });
  }
}
