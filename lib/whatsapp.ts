import type { EnquiryPayload } from "@/lib/types";

const WHATSAPP_NUMBER = "917499322412";

export function buildWhatsAppLink(payload: EnquiryPayload): string {
  const lines: string[] = [
    `Hi VMF Holidays! I'd like to enquire about a trip.`,
    ``,
    `*Name:* ${payload.name}`,
    `*Phone:* ${payload.phone}`,
    `*Email:* ${payload.email}`,
  ];

  if (payload.packageTitle) lines.push(`*Package:* ${payload.packageTitle}`);
  if (payload.destination) lines.push(`*Destination:* ${payload.destination}`);
  if (payload.dates) lines.push(`*Travel Dates:* ${payload.dates}`);
  if (payload.travelers) lines.push(`*Travelers:* ${payload.travelers}`);
  if (payload.budget) lines.push(`*Budget:* ${payload.budget}`);
  if (payload.interests?.length) lines.push(`*Interests:* ${payload.interests.join(", ")}`);
  if (payload.message) lines.push(``, `*Message:* ${payload.message}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTOMATED WHATSAPP CONFIRMATION (Meta WhatsApp Business Cloud API)
//
// Sends a confirmation to the customer right after they submit an enquiry.
// Best-effort: if not configured (env vars missing) or the send fails, it logs
// and resolves — it must NEVER break the enquiry flow.
//
// Env vars to go live:
//   WHATSAPP_PHONE_NUMBER_ID  — Phone Number ID from Meta (not the phone number)
//   WHATSAPP_TOKEN            — permanent access token for the WhatsApp app
// Optional:
//   WHATSAPP_TEMPLATE         — name of an APPROVED template. Business-initiated
//                               messages must use a template; the customer's first
//                               name is passed as body parameter {{1}}. If unset, a
//                               plain text message is sent (delivered only inside the
//                               24h customer-initiated window / during testing).
//   WHATSAPP_TEMPLATE_LANG    — template language code (default "en")
//   WHATSAPP_DEFAULT_CC       — country code for 10-digit numbers (default "91")
//   WHATSAPP_API_VERSION      — Graph API version (default "v21.0")
// ─────────────────────────────────────────────────────────────────────────────

/** Normalise a user-entered phone to WhatsApp international format (digits + country code). */
export function normalizeWhatsAppNumber(raw: string): string | null {
  let digits = String(raw).replace(/\D/g, "");
  if (!digits) return null;
  const cc = process.env.WHATSAPP_DEFAULT_CC ?? "91";
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = cc + digits;
  return digits.length >= 11 ? digits : null;
}

/** The confirmation copy sent to the customer. */
export function enquiryConfirmationText(name: string, interest?: string | null): string {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const topic = interest?.trim() ? `*${interest.trim()}*` : "your trip";
  return (
    `Hello ${firstName}! 👋\n\n` +
    `Thank you for your enquiry with *VMF Holidays* regarding ${topic}. ` +
    `We've received it and our team is actively looking into it — we'll get back to you very shortly with the best options.\n\n` +
    `Warm regards,\nTeam VMF Holidays\nDiscover Your World, Your Way`
  );
}

type SendResult = { ok: true; id?: string } | { ok: false; skipped?: boolean; error?: string };

/**
 * Send the enquiry confirmation to a customer over WhatsApp.
 * Resolves (never throws) so callers can fire-and-forget.
 */
export async function sendEnquiryWhatsApp(
  name: string,
  phone: string,
  interest?: string | null
): Promise<SendResult> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!phoneId || !token) {
    console.log("[whatsapp] Not configured (WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_TOKEN). Skipping auto-message.");
    return { ok: false, skipped: true };
  }

  const to = normalizeWhatsAppNumber(phone);
  if (!to) {
    console.warn("[whatsapp] Could not normalise phone number, skipping:", phone);
    return { ok: false, skipped: true };
  }

  const version = process.env.WHATSAPP_API_VERSION ?? "v21.0";
  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;
  const template = process.env.WHATSAPP_TEMPLATE;
  const firstName = name.trim().split(/\s+/)[0] || name;

  const payload = template
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG ?? "en" },
          components: [{ type: "body", parameters: [{ type: "text", text: firstName }] }],
        },
      }
    : {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { preview_url: false, body: enquiryConfirmationText(name, interest) },
      };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      messages?: { id: string }[];
      error?: { message?: string };
    };
    if (!res.ok) {
      console.error("[whatsapp] Send failed:", res.status, data?.error?.message ?? data);
      return { ok: false, error: data?.error?.message ?? `HTTP ${res.status}` };
    }
    return { ok: true, id: data?.messages?.[0]?.id };
  } catch (err) {
    console.error("[whatsapp] Network error:", err);
    return { ok: false, error: String(err) };
  }
}
