import { describe, it, expect } from "vitest";
import {
  PHONE_PRIMARY,
  PHONE_SECONDARY,
  PHONE_MANGALORE,
  PHONE_PRIMARY_DISPLAY,
  PHONE_SECONDARY_DISPLAY,
  PHONE_MANGALORE_DISPLAY,
  WHATSAPP_NUMBER,
  EMAIL,
  telHref,
  mailtoHref,
  whatsappLink,
} from "@/lib/contact";
import { BUSINESS } from "@/lib/seo";

const digits = (s: string) => s.replace(/\D/g, "");

describe("phone constants", () => {
  it("keeps the dialable forms in E.164 with no spaces", () => {
    for (const p of [PHONE_PRIMARY, PHONE_SECONDARY, PHONE_MANGALORE]) {
      expect(p).toMatch(/^\+91\d{10}$/);
    }
  });

  it("keeps each display form the same number as its dialable form", () => {
    // The bug this guards: someone edits the pretty version and not the dialable
    // one, so the number people see differs from the one they call.
    expect(digits(PHONE_PRIMARY_DISPLAY)).toBe(digits(PHONE_PRIMARY));
    expect(digits(PHONE_SECONDARY_DISPLAY)).toBe(digits(PHONE_SECONDARY));
    expect(digits(PHONE_MANGALORE_DISPLAY)).toBe(digits(PHONE_MANGALORE));
  });

  it("uses three distinct numbers", () => {
    expect(new Set([PHONE_PRIMARY, PHONE_SECONDARY, PHONE_MANGALORE]).size).toBe(3);
  });
});

describe("seo.tsx stays in step", () => {
  // BUSINESS is built from these constants, so NAP can't drift between the
  // rendered pages and the JSON-LD.
  it("lists exactly these phones in BUSINESS", () => {
    expect(BUSINESS.phones).toEqual([PHONE_PRIMARY, PHONE_SECONDARY, PHONE_MANGALORE]);
  });

  it("uses the same WhatsApp link and email", () => {
    expect(BUSINESS.whatsapp).toBe(whatsappLink());
    expect(BUSINESS.email).toBe(EMAIL);
  });
});

describe("telHref / mailtoHref", () => {
  it("defaults to the primary number", () => {
    expect(telHref()).toBe(`tel:${PHONE_PRIMARY}`);
  });

  it("accepts another number", () => {
    expect(telHref(PHONE_MANGALORE)).toBe(`tel:${PHONE_MANGALORE}`);
  });

  it("builds a mailto for the business address", () => {
    expect(mailtoHref()).toBe(`mailto:${EMAIL}`);
  });
});

describe("whatsappLink", () => {
  it("strips the plus and spaces, since wa.me rejects them", () => {
    expect(WHATSAPP_NUMBER).toBe("917499322412");
    expect(whatsappLink()).toBe("https://wa.me/917499322412");
  });

  it("adds no query string when there's no message", () => {
    expect(whatsappLink()).not.toContain("?");
  });

  it("url-encodes a prefilled message so callers can pass plain text", () => {
    expect(whatsappLink("Hi VMF Holidays! I'd like to plan a trip.")).toBe(
      "https://wa.me/917499322412?text=Hi%20VMF%20Holidays!%20I'd%20like%20to%20plan%20a%20trip."
    );
  });

  it("encodes newlines, which the trip wizard and trip finder rely on", () => {
    expect(whatsappLink("line one\nline two")).toContain("line%20one%0Aline%20two");
  });

  it("does not double-encode an ampersand into an entity", () => {
    const link = whatsappLink("beaches & mountains");
    expect(link).toContain("%26");
    expect(link).not.toContain("&amp;");
  });
});
