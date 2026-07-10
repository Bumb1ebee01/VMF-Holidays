import "server-only";
import { Resend } from "resend";

// Shared transactional-email sender. Resend is only wired up when RESEND_API_KEY
// is set (prod), so locally this no-ops with a warning instead of throwing — the
// calling flow (e.g. password reset) still succeeds, it just doesn't deliver mail.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.ENQUIRY_FROM ?? "VMF Holidays <enquiries@vmfholidays.com>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped email: "${opts.subject}"`);
    return false;
  }
  try {
    await resend.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html });
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}
