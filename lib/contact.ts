// Contact details, in one place. Deliberately dependency-free and client-safe:
// most callers are "use client" components, so this must not drag `lib/seo.tsx`
// (JSON-LD builders, category data) into the browser bundle. `lib/seo.tsx`
// imports FROM here, so BUSINESS.phones and these constants can never disagree.

/** Dialable forms — no spaces, E.164. Used for tel: and wa.me links. */
export const PHONE_PRIMARY = "+917499322412";
export const PHONE_SECONDARY = "+919270354828";
export const PHONE_MANGALORE = "+919481384953";

/** Display forms — grouped for readability. Keep these in step with the above. */
export const PHONE_PRIMARY_DISPLAY = "+91 74993 22412";
export const PHONE_SECONDARY_DISPLAY = "+91 92703 54828";
export const PHONE_MANGALORE_DISPLAY = "+91 94813 84953";

export const EMAIL = "info@vmfholidays.com";

/** wa.me wants the number without "+" or spaces. Prefer `whatsappLink()` over
 *  building the URL by hand; this is exported for the few callers that can't. */
export const WHATSAPP_NUMBER = PHONE_PRIMARY.replace(/\D/g, "");

/**
 * Turn a phone number the customer typed into WhatsApp's format (digits, with a
 * country code). Customers are not all Indian, so an explicit international
 * number must survive untouched — never take "the last 10 digits", which
 * silently rewrites +44 7700 900123 into an Indian number and sends their trip
 * details to a stranger.
 *
 * Only a bare 10-digit number is assumed to be Indian; anything already carrying
 * a country code is left alone.
 */
export function normalizeWhatsAppNumber(raw: string, defaultCountryCode = "91"): string | null {
  let digits = String(raw ?? "").replace(/\D/g, "");
  if (!digits) return null;
  // Indian STD form: a leading 0 before the 10-digit mobile number.
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = defaultCountryCode + digits;
  return digits.length >= 11 ? digits : null;
}

/** Guidance shown under every phone field: we accept any country's number. */
export const PHONE_HINT = "Any country — please include your country code.";

/** `tel:` href for a dialable number. */
export function telHref(phone: string = PHONE_PRIMARY): string {
  return `tel:${phone}`;
}

/** `mailto:` href. */
export function mailtoHref(email: string = EMAIL): string {
  return `mailto:${email}`;
}

/**
 * WhatsApp deep link, optionally pre-filling the first message. The text is
 * URL-encoded here so callers can pass plain, readable copy.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
