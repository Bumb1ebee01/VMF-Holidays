// Minimal GA4 (gtag) event helpers. Every call is a safe no-op when GA isn't
// loaded (NEXT_PUBLIC_GA_ID unset) or during SSR, so callers never need to guard.
// The gtag loader lives in components/analytics/Analytics.tsx.

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Primary conversion — an enquiry/lead was submitted. Mark "generate_lead" as a
 *  key event in GA4 to count it as a conversion. */
export function trackLead(params?: EventParams): void {
  trackEvent("generate_lead", params);
}

/** Soft conversion — visitor clicked through to WhatsApp. */
export function trackWhatsAppClick(params?: EventParams): void {
  trackEvent("whatsapp_click", params);
}
