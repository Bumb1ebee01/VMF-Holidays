import React from "react";
import fs from "fs";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  Font,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Package } from "@/lib/types";
import { getTerms, PRICE_NOTES, type TourRegion } from "@/lib/itinerary-terms";
import {
  whatsappLink,
  telHref,
  mailtoHref,
  PHONE_PRIMARY_DISPLAY,
  PHONE_SECONDARY_DISPLAY,
} from "@/lib/contact";

// ─────────────────────────────────────────────────────────────────────────────
// Itinerary PDF — the single, reusable renderer.
//
// One <Itinerary> template drives every itinerary: the public site calls
// renderItineraryPdf() (email- or member-gated), and the CRM will later call the
// SAME function with `variant: "quote"` + customer/booking data. Built on
// @react-pdf/renderer so it runs in a normal Node route handler (no headless
// browser) and keeps any customer PII in-process (DPDP-friendly).
//
// Premium brochure treatment: a dedicated cover page (logo + hero + price +
// clickable CTAs), Roboto brand type, a diagonal watermark and an every-page
// disclaimer footer so a forwarded copy always reads as a sample and shows us.
// ─────────────────────────────────────────────────────────────────────────────

// Brand palette — mirrors the VMF design-system tokens (globals.css).
const NAVY = "#002464";
const ORANGE = "#FE5C10";
const ORANGE_LT = "#FFA333";
const INK = "#2E2E2E";
const MUTED = "#6F6A63";
const HAIR = "#E4DFD6";
const CREAM = "#FAF7F2";

// Brand contact — the CTA targets. Single-sourced from lib/contact.
const WA = whatsappLink();
const TEL = telHref();
const MAIL = mailtoHref();
const SITE = "https://www.vmfholidays.com";
const PHONE_1 = PHONE_PRIMARY_DISPLAY;
const PHONE_2 = PHONE_SECONDARY_DISPLAY;

// Register Roboto (bundled TTFs, no network at render). If tracing ever misses
// the files, registration throws → we fall back to Helvetica rather than 500.
let FONT = "Helvetica";
try {
  const f = (name: string) => path.join(process.cwd(), "lib", "fonts", name);
  Font.register({
    family: "Roboto",
    fonts: [
      { src: f("Roboto-Regular.ttf"), fontWeight: 400 },
      { src: f("Roboto-Medium.ttf"), fontWeight: 500 },
      { src: f("Roboto-Bold.ttf"), fontWeight: 700 },
    ],
  });
  // No hyphenation — cleaner line breaks read more premium.
  Font.registerHyphenationCallback((word) => [word]);
  FONT = "Roboto";
} catch (err) {
  console.warn("[itinerary-pdf] Roboto register failed, using Helvetica:", err);
}

/** Read a bundled asset as a data URI. Never throws (logo is optional). */
function assetDataUri(relPath: string, mime: string): string | null {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), relPath));
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
const LOGO_WHITE = assetDataUri("public/logo-white.png", "image/png");

// Roboto carries the ₹ glyph, so we can show a proper rupee sign.
function money(n: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(n)}`;
}

const DISCLAIMER =
  "Indicative itinerary and sample pricing only. Not a confirmed quotation. Final pricing varies with travel dates, availability, hotel category and any customisation.";

const QUOTE_DISCLAIMER =
  "Quotation subject to availability and final confirmation by VMF Holidays. Not a tax invoice. Final pricing may vary with travel dates, hotel category and customisation.";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    // Must clear the fixed footer, whose block (trace + 2-line disclaimer +
    // contact) stands ~54px tall above its bottom:26 anchor. Anything less and
    // flowing content — or the cover's closing tag — collides with it.
    paddingBottom: 92,
    paddingHorizontal: 44,
    fontFamily: FONT,
    fontSize: 10.5,
    color: INK,
    lineHeight: 1.5,
  },

  // ── Watermark ──
  watermark: {
    position: "absolute",
    top: "44%",
    left: "-6%",
    width: "112%",
    textAlign: "center",
    color: NAVY,
    opacity: 0.045,
    fontSize: 70,
    fontWeight: 700,
    transform: "rotate(-27deg)",
  },

  // ── Cover page ──
  coverBand: {
    backgroundColor: NAVY,
    marginTop: -44,
    marginHorizontal: -44,
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { height: 46, width: 118, objectFit: "contain" },
  bandTagline: { color: ORANGE_LT, fontSize: 8, letterSpacing: 1.4, textAlign: "right" },
  heroImg: { marginHorizontal: -44, height: 200, objectFit: "cover" },
  // orange rule directly under the hero — a crisp brand seam, kills the old gap.
  heroRule: { marginHorizontal: -44, height: 4, backgroundColor: ORANGE },

  coverBody: { marginTop: 18 },
  eyebrow: { color: ORANGE, fontSize: 9, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" },
  coverTitle: { color: NAVY, fontSize: 27, fontWeight: 700, marginTop: 7, lineHeight: 1.15 },
  coverMeta: { color: MUTED, fontSize: 11, marginTop: 8 },
  price: { color: ORANGE, fontSize: 21, fontWeight: 700, marginTop: 12, marginBottom: 6, lineHeight: 1.2 },
  priceNotes: {},
  priceNote: { color: MUTED, fontSize: 8.5, marginBottom: 2.5 },

  // Personalised "prepared for" card.
  forBox: {
    marginTop: 14,
    padding: 15,
    backgroundColor: CREAM,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: ORANGE,
  },
  forLabel: { color: MUTED, fontSize: 8, letterSpacing: 1.2, textTransform: "uppercase" },
  forName: { color: NAVY, fontSize: 14, fontWeight: 700, marginTop: 4 },
  forMeta: { color: INK, fontSize: 10, marginTop: 3 },

  sampleTag: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FDECEA",
    color: "#8a1f10",
    fontSize: 9,
    fontWeight: 500,
    borderRadius: 5,
    lineHeight: 1.5,
  },
  memberTag: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EAF2FF",
    color: NAVY,
    fontSize: 9,
    fontWeight: 500,
    borderRadius: 5,
    lineHeight: 1.5,
  },

  // ── CTA buttons ──
  ctaRow: { flexDirection: "row", marginTop: 16, gap: 10 },
  ctaPrimary: {
    backgroundColor: ORANGE,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 700,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 7,
    textDecoration: "none",
  },
  // Secondary CTA for use on the navy closing panel (white outline reads on navy).
  ctaGhostWhite: {
    borderWidth: 1.2,
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 700,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 7,
    textDecoration: "none",
  },
  ctaOutline: {
    borderWidth: 1.2,
    borderColor: NAVY,
    color: NAVY,
    fontSize: 11,
    fontWeight: 700,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 7,
    textDecoration: "none",
  },

  // ── Content sections ──
  section: { marginTop: 22 },
  // First section on a fresh page — no top gap under the page padding.
  sectionFirst: { marginTop: 0 },
  sectionTitle: {
    color: NAVY,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: HAIR,
  },
  bullet: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 },
  // Drawn markers — Roboto lacks the ✓/✕ glyphs, so we draw dots instead.
  markInc: { width: 5, height: 5, borderRadius: 3, backgroundColor: ORANGE, marginTop: 5, marginRight: 9 },
  markExc: { width: 5, height: 5, borderRadius: 3, borderWidth: 1, borderColor: MUTED, marginTop: 5, marginRight: 9 },
  bulletText: { flex: 1 },

  // Day rows.
  day: { flexDirection: "row", marginBottom: 13 },
  dayNum: {
    width: 42,
    color: "#FFFFFF",
    backgroundColor: NAVY,
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 13,
  },
  dayBody: { flex: 1 },
  dayTitle: { color: NAVY, fontSize: 11.5, fontWeight: 700 },
  dayText: { color: "#4a4a4a", marginTop: 2 },

  // Hotel cards.
  hotelRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  hotelImg: { width: 90, height: 66, objectFit: "cover", borderRadius: 5, marginRight: 12 },
  hotelImgEmpty: { width: 90, height: 66, borderRadius: 5, marginRight: 12, backgroundColor: HAIR },
  hotelBody: { flex: 1, paddingTop: 1 },
  hotelCity: { color: ORANGE, fontSize: 8.5, fontWeight: 700, marginBottom: 2 },
  hotelName: { color: NAVY, fontSize: 11.5, fontWeight: 700 },
  hotelFootnote: { color: MUTED, fontSize: 8.5, marginTop: 3 },

  // Terms & Conditions.
  termsHeadRow: { flexDirection: "row", marginTop: 11, marginBottom: 4 },
  termsNum: { color: ORANGE, fontWeight: 700, fontSize: 10.5, width: 18 },
  termsHead: { color: NAVY, fontWeight: 700, fontSize: 10.5, flex: 1 },
  termsPoint: { flexDirection: "row", marginBottom: 3, marginLeft: 18 },
  termsDot: { color: ORANGE_LT, width: 10 },
  termsText: { flex: 1, fontSize: 9.5, color: "#4a4a4a" },

  // ── Closing CTA panel ──
  ctaPanel: {
    marginTop: 26,
    backgroundColor: NAVY,
    borderRadius: 10,
    padding: 26,
  },
  ctaPanelTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: 700 },
  ctaPanelSub: { color: "#C7D2E8", fontSize: 10.5, marginTop: 7, lineHeight: 1.55, maxWidth: 380 },
  ctaPanelRow: { flexDirection: "row", marginTop: 18, gap: 10 },
  ctaPanelPhones: { color: "#9FB2D4", fontSize: 9, marginTop: 14 },

  // ── Footer (every page) ──
  footerWrap: { position: "absolute", bottom: 26, left: 44, right: 44 },
  footerTrace: { textAlign: "center", color: MUTED, fontSize: 7, marginBottom: 5 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: HAIR,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: { flex: 1, paddingRight: 12 },
  disclaimer: { color: MUTED, fontSize: 7, lineHeight: 1.4 },
  contact: { color: NAVY, fontSize: 8, marginTop: 4, fontWeight: 500 },
  footerWa: {
    color: "#FFFFFF",
    backgroundColor: "#25D366",
    fontSize: 8,
    fontWeight: 700,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    textDecoration: "none",
  },
});

function Watermark({ variant }: { variant: ItineraryVariant }) {
  const mark = variant === "sample" ? "VMF · SAMPLE" : "VMF HOLIDAYS";
  return (
    <Text style={styles.watermark} fixed>
      {mark}
    </Text>
  );
}

function Footer({ traceId, disclaimer }: { traceId?: string; disclaimer?: string }) {
  return (
    <View style={styles.footerWrap} fixed>
      {traceId ? (
        <Text style={styles.footerTrace}>
          Prepared for {traceId} · VMF Holidays · not for redistribution
        </Text>
      ) : null}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.disclaimer}>{disclaimer ?? DISCLAIMER}</Text>
          <Text style={styles.contact}>
            VMF Holidays Pvt. Ltd. · {PHONE_1} · info@vmfholidays.com · Nagoa, Bardez, Goa 403516
          </Text>
        </View>
        <Link src={WA} style={styles.footerWa}>
          WhatsApp us
        </Link>
      </View>
    </View>
  );
}

function Cover({ pkg, opts }: { pkg: Package; opts: ItineraryPdfOptions }) {
  const { variant, cover } = opts;
  const priceLine = pkg.priceOnRequest ? "Price on request — tailored to you" : `from ${money(pkg.fromPrice)} per person`;

  return (
    <View>
      {/* Navy band: logo + tagline */}
      <View style={styles.coverBand}>
        {LOGO_WHITE ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image, not an HTML img
          <Image src={LOGO_WHITE} style={styles.logo} />
        ) : (
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>VMF Holidays</Text>
        )}
        <Text style={styles.bandTagline}>DISCOVER YOUR{"\n"}WORLD, YOUR WAY</Text>
      </View>

      {/* Full-bleed hero, flush to the band, capped with an orange seam */}
      {opts.heroDataUri ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image, not an HTML img */}
          <Image src={opts.heroDataUri} style={styles.heroImg} />
          <View style={styles.heroRule} />
        </>
      ) : (
        <View style={styles.heroRule} />
      )}

      <View style={styles.coverBody}>
        <Text style={styles.eyebrow}>
          {pkg.destination} · {variant === "sample" ? "Sample Itinerary" : "Your Itinerary"}
        </Text>
        <Text style={styles.coverTitle}>{pkg.title}</Text>
        <Text style={styles.coverMeta}>{pkg.duration}</Text>

        <Text style={styles.price}>{priceLine}</Text>
        {!pkg.priceOnRequest && (
          <View style={styles.priceNotes}>
            {PRICE_NOTES.map((n, i) => (
              <Text style={styles.priceNote} key={i}>
                ›  {n}
              </Text>
            ))}
          </View>
        )}

        {cover?.name ? (
          <View style={styles.forBox}>
            <Text style={styles.forLabel}>Prepared for</Text>
            <Text style={styles.forName}>{cover.name}</Text>
            {cover.dates || cover.travellers ? (
              <Text style={styles.forMeta}>{[cover.dates, cover.travellers].filter(Boolean).join(" · ")}</Text>
            ) : null}
          </View>
        ) : null}

        {/* Primary CTAs — clickable */}
        <View style={styles.ctaRow}>
          <Link src={WA} style={styles.ctaPrimary}>
            Chat on WhatsApp
          </Link>
          <Link src={TEL} style={styles.ctaOutline}>
            Call {PHONE_1}
          </Link>
        </View>

        {variant === "sample" ? (
          <Text style={styles.sampleTag}>
            SAMPLE ITINERARY — not a confirmed quote. Tell us your dates and we&apos;ll tailor a final price for you.
          </Text>
        ) : (
          <Text style={styles.memberTag}>
            Your personalised itinerary. Message us to lock your dates and confirm pricing.
          </Text>
        )}
      </View>
    </View>
  );
}

function ClosingCta() {
  return (
    <View style={styles.ctaPanel} wrap={false}>
      <Text style={styles.ctaPanelTitle}>Ready to make this trip yours?</Text>
      <Text style={styles.ctaPanelSub}>
        Talk to a VMF travel expert — we&apos;ll tailor this itinerary to your dates, budget and travel style, with
        transparent pricing and no booking fees.
      </Text>
      <View style={styles.ctaPanelRow}>
        <Link src={WA} style={styles.ctaPrimary}>
          Chat on WhatsApp
        </Link>
        <Link src={MAIL} style={styles.ctaGhostWhite}>
          Email us
        </Link>
        <Link src={SITE} style={styles.ctaGhostWhite}>
          Visit vmfholidays.com
        </Link>
      </View>
      <Text style={styles.ctaPanelPhones}>
        Call {PHONE_1} or {PHONE_2}
      </Text>
    </View>
  );
}

/**
 * A titled section whose heading never strands: the heading and its first row
 * are kept together (`wrap={false}`), so a page break can only fall *after* real
 * content has appeared under the title — no orphaned headers, no near-blank
 * pages. Remaining rows flow and fill the page normally.
 */
function Section({
  title,
  first,
  children,
}: {
  title: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children);
  const [head, ...rest] = items;
  return (
    // minPresenceAhead: don't start this section unless there's room for the
    // heading AND its first row — otherwise it moves to the next page as a unit,
    // so a heading is never left stranded at the foot of a page (a tall hotel
    // card is the worst case, hence ~130pt). The inner wrap={false} then keeps
    // the heading physically glued to that first row.
    <View style={first ? [styles.section, styles.sectionFirst] : styles.section} minPresenceAhead={130}>
      <View wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {head}
      </View>
      {rest}
    </View>
  );
}

function Itinerary({ pkg, opts }: { pkg: Package; opts: ItineraryPdfOptions }) {
  const { variant, traceId } = opts;
  const terms = getTerms(opts.region ?? "domestic");

  // Which body section renders first — it alone skips the top margin so it sits
  // flush under the page padding.
  const firstBody = pkg.highlights.length
    ? "hi"
    : pkg.itinerary.length
      ? "day"
      : opts.customNote?.trim()
        ? "note"
        : pkg.inclusions.length
          ? "inc"
          : pkg.exclusions.length
            ? "exc"
            : "hotels";

  // Each logical part is its own <Page>. Relying on `break` inside one wrapping
  // page (the old approach) let the cover overflow and left near-blank pages
  // behind the break; explicit pages bound every part and kill the phantoms.
  const hasBody =
    pkg.highlights.length > 0 ||
    pkg.itinerary.length > 0 ||
    !!opts.customNote?.trim() ||
    pkg.inclusions.length > 0 ||
    pkg.exclusions.length > 0 ||
    (opts.hotels?.length ?? 0) > 0;

  return (
    <Document title={`${pkg.title} — VMF Holidays`} author="VMF Holidays" subject="Sample itinerary">
      {/* ── Page 1 — cover ── */}
      <Page size="A4" style={styles.page}>
        <Watermark variant={variant} />
        <Cover pkg={pkg} opts={opts} />
        <Footer traceId={traceId} />
      </Page>

      {/* ── Page 2 — itinerary body (flows across pages as needed) ── */}
      {hasBody && (
        <Page size="A4" style={styles.page} wrap>
          <Watermark variant={variant} />

          {pkg.highlights.length > 0 && (
            <Section title="Trip Highlights" first={firstBody === "hi"}>
              {pkg.highlights.map((h, i) => (
                <View style={styles.bullet} key={i} wrap={false}>
                  <View style={styles.markInc} />
                  <Text style={styles.bulletText}>{h}</Text>
                </View>
              ))}
            </Section>
          )}

          {pkg.itinerary.length > 0 && (
            <Section title="Day-by-Day Itinerary" first={firstBody === "day"}>
              {pkg.itinerary.map((d, i) => (
                <View style={styles.day} key={i} wrap={false}>
                  <Text style={styles.dayNum}>DAY {d.day}</Text>
                  <View style={styles.dayBody}>
                    <Text style={styles.dayTitle}>{d.title}</Text>
                    {d.description ? <Text style={styles.dayText}>{d.description}</Text> : null}
                  </View>
                </View>
              ))}
            </Section>
          )}

          {/* Personalised notes for this customer (CRM per-customer share) */}
          {opts.customNote?.trim() ? (
            <Section title="Personalised for You" first={firstBody === "note"}>
              {opts.customNote.trim().split("\n").map((line, i) => (
                <Text key={i} style={styles.dayText}>{line || " "}</Text>
              ))}
            </Section>
          ) : null}

          {pkg.inclusions.length > 0 && (
            <Section title="Inclusions" first={firstBody === "inc"}>
              {pkg.inclusions.map((item, i) => (
                <View style={styles.bullet} key={i} wrap={false}>
                  <View style={styles.markInc} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </Section>
          )}

          {pkg.exclusions.length > 0 && (
            <Section title="Exclusions" first={firstBody === "exc"}>
              {pkg.exclusions.map((item, i) => (
                <View style={styles.bullet} key={i} wrap={false}>
                  <View style={styles.markExc} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </Section>
          )}

          {/* Hotels — with photos */}
          {opts.hotels && opts.hotels.length > 0 && (
            <Section title="Hotels" first={firstBody === "hotels"}>
              {[
                ...opts.hotels.map((h, i) => (
                  <View style={styles.hotelRow} key={i} wrap={false}>
                    {h.imageDataUri ? (
                      // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image, not an HTML img
                      <Image src={h.imageDataUri} style={styles.hotelImg} />
                    ) : (
                      <View style={styles.hotelImgEmpty} />
                    )}
                    <View style={styles.hotelBody}>
                      {h.city ? <Text style={styles.hotelCity}>{h.city.toUpperCase()}</Text> : null}
                      <Text style={styles.hotelName}>{h.name}</Text>
                    </View>
                  </View>
                )),
                <Text style={styles.hotelFootnote} key="fn">
                  Hotels are indicative; an equivalent-category hotel may be substituted subject to availability.
                </Text>,
              ]}
            </Section>
          )}

          <Footer traceId={traceId} />
        </Page>
      )}

      {/* ── Terms & Conditions + closing CTA ── */}
      <Page size="A4" style={styles.page} wrap>
        <Watermark variant={variant} />
        <Section title={terms.title} first>
          {terms.sections.map((sec, i) => (
            <View key={i} wrap={false}>
              <View style={styles.termsHeadRow}>
                <Text style={styles.termsNum}>{i + 1}.</Text>
                <Text style={styles.termsHead}>{sec.heading}</Text>
              </View>
              {sec.points.map((p, j) => (
                <View style={styles.termsPoint} key={j}>
                  <Text style={styles.termsDot}>•</Text>
                  <Text style={styles.termsText}>{p}</Text>
                </View>
              ))}
            </View>
          ))}
          <ClosingCta />
        </Section>
        <Footer traceId={traceId} />
      </Page>
    </Document>
  );
}

export type ItineraryVariant = "sample" | "member" | "quote";

export interface ItineraryPdfOptions {
  variant: ItineraryVariant;
  /** Domestic vs international — selects the correct Terms & Conditions set. */
  region?: TourRegion;
  /** Optional cover personalisation. */
  cover?: { name?: string; dates?: string; travellers?: string };
  /** Small-print trace stamp woven into the watermark (member id / lead id). */
  traceId?: string;
  /** Data-URI of the hero image, pre-fetched by the caller (route can't rely on remote fetch inside render). */
  heroDataUri?: string | null;
  /** Hotels with images pre-fetched to data-URIs by the caller. */
  hotels?: { name: string; city?: string; imageDataUri?: string | null }[];
  /** Free-text personalised note (CRM per-customer share) — rendered as its own section. */
  customNote?: string;
}

/** Render an itinerary PDF to a Buffer. Reused by the public route and (later) the CRM. */
export function renderItineraryPdf(pkg: Package, opts: ItineraryPdfOptions): Promise<Buffer> {
  return renderToBuffer(<Itinerary pkg={pkg} opts={opts} />);
}

/** Safe, descriptive download filename, e.g. "vmf-goa-honeymoon-itinerary.pdf". */
export function itineraryFilename(pkg: Package): string {
  return `vmf-${pkg.slug}-itinerary.pdf`.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// Quotation PDF — a per-customer commercial quote generated from a Booking.
// Reuses this module's fonts, logo, T&C, footer and CTAs; the body is a price /
// payment summary rather than a day-by-day itinerary.
// ─────────────────────────────────────────────────────────────────────────────

const qStyles = StyleSheet.create({
  priceBox: { marginTop: 20, borderWidth: 1, borderColor: HAIR, borderRadius: 8 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: HAIR,
  },
  priceRowLast: { borderBottomWidth: 0 },
  totalRow: { backgroundColor: CREAM },
  priceLabel: { color: INK, fontSize: 11 },
  priceVal: { color: INK, fontSize: 11, fontWeight: 700 },
  totalLabel: { color: NAVY, fontSize: 12, fontWeight: 700 },
  totalVal: { color: NAVY, fontSize: 13, fontWeight: 700 },
  balanceVal: { color: ORANGE, fontSize: 13, fontWeight: 700 },
  validity: { color: MUTED, fontSize: 9, marginTop: 12, lineHeight: 1.5 },
});

export interface QuotationData {
  /** Human reference e.g. "VMF-AB12CD". */
  ref: string;
  customerName: string;
  destination: string;
  packageTitle?: string | null;
  /** Pre-formatted, e.g. "12 Nov – 19 Nov 2026". */
  travelDates?: string | null;
  pax?: string | null;
  region: TourRegion;
  totalValue: number;
  /** Per-person price in whole rupees, from the accepted quote (optional). */
  perPax?: number | null;
  /** Head count the per-pax figure is based on. */
  paxCount?: number | null;
  /** What the price includes — shown as a "What's included" section (optional). */
  inclusions?: string[];
  collected?: number;
  /** Pre-formatted validity date, e.g. "30 Jul 2026". */
  validUntil?: string | null;
  heroDataUri?: string | null;
}

function Quotation({ data }: { data: QuotationData }) {
  const terms = getTerms(data.region);
  const collected = data.collected ?? 0;
  const balance = Math.max(0, data.totalValue - collected);
  const title = data.packageTitle || data.destination;
  const metaLine = [data.travelDates, data.pax].filter(Boolean).join("  ·  ") || data.destination;

  return (
    <Document title={`Quotation ${data.ref} — VMF Holidays`} author="VMF Holidays" subject="Quotation">
      {/* ── Page 1 — cover + price summary ── */}
      <Page size="A4" style={styles.page}>
        <Watermark variant="quote" />

        {/* Cover */}
        <View>
          <View style={styles.coverBand}>
            {LOGO_WHITE ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image, not an HTML img
              <Image src={LOGO_WHITE} style={styles.logo} />
            ) : (
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>VMF Holidays</Text>
            )}
            <Text style={styles.bandTagline}>DISCOVER YOUR{"\n"}WORLD, YOUR WAY</Text>
          </View>
          {data.heroDataUri ? (
            <>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image, not an HTML img */}
              <Image src={data.heroDataUri} style={styles.heroImg} />
              <View style={styles.heroRule} />
            </>
          ) : (
            <View style={styles.heroRule} />
          )}

          <View style={styles.coverBody}>
            <Text style={styles.eyebrow}>Quotation · {data.ref}</Text>
            <Text style={styles.coverTitle}>{title}</Text>
            <Text style={styles.coverMeta}>{metaLine}</Text>

            <View style={styles.forBox}>
              <Text style={styles.forLabel}>Prepared for</Text>
              <Text style={styles.forName}>{data.customerName}</Text>
            </View>

            <View style={qStyles.priceBox}>
              <View style={[qStyles.priceRow, qStyles.totalRow]}>
                <Text style={qStyles.totalLabel}>Total trip value</Text>
                <Text style={qStyles.totalVal}>{money(data.totalValue)}</Text>
              </View>
              {data.perPax ? (
                <View style={qStyles.priceRow}>
                  <Text style={qStyles.priceLabel}>
                    Per person{data.paxCount ? ` (${data.paxCount} ${data.paxCount === 1 ? "traveller" : "travellers"})` : ""}
                  </Text>
                  <Text style={qStyles.priceVal}>{money(data.perPax)}</Text>
                </View>
              ) : null}
              {collected > 0 ? (
                <View style={qStyles.priceRow}>
                  <Text style={qStyles.priceLabel}>Received</Text>
                  <Text style={qStyles.priceVal}>{money(collected)}</Text>
                </View>
              ) : null}
              <View style={[qStyles.priceRow, qStyles.priceRowLast]}>
                <Text style={qStyles.priceLabel}>Balance due</Text>
                <Text style={qStyles.balanceVal}>{money(balance)}</Text>
              </View>
            </View>

            <Text style={qStyles.validity}>
              {data.validUntil ? `This quotation is valid until ${data.validUntil}. ` : ""}
              Prices are indicative and subject to availability at the time of confirmation.
            </Text>

            <View style={styles.ctaRow}>
              <Link src={WA} style={styles.ctaPrimary}>Confirm on WhatsApp</Link>
              <Link src={TEL} style={styles.ctaOutline}>Call {PHONE_1}</Link>
            </View>
          </View>
        </View>

        <Footer disclaimer={QUOTE_DISCLAIMER} />
      </Page>

      {/* ── What's included + Terms & Conditions + closing CTA ── */}
      <Page size="A4" style={styles.page} wrap>
        <Watermark variant="quote" />
        {data.inclusions && data.inclusions.length > 0 && (
          <Section title="What's included" first>
            {data.inclusions.map((item, i) => (
              <View style={styles.bullet} key={i} wrap={false}>
                <View style={styles.markInc} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </Section>
        )}
        <Section title={terms.title} first={!(data.inclusions && data.inclusions.length > 0)}>
          {terms.sections.map((sec, i) => (
            <View key={i} wrap={false}>
              <View style={styles.termsHeadRow}>
                <Text style={styles.termsNum}>{i + 1}.</Text>
                <Text style={styles.termsHead}>{sec.heading}</Text>
              </View>
              {sec.points.map((p, j) => (
                <View style={styles.termsPoint} key={j}>
                  <Text style={styles.termsDot}>•</Text>
                  <Text style={styles.termsText}>{p}</Text>
                </View>
              ))}
            </View>
          ))}
          <ClosingCta />
        </Section>
        <Footer disclaimer={QUOTE_DISCLAIMER} />
      </Page>
    </Document>
  );
}

/** Render a quotation PDF to a Buffer. Called from the CRM booking route. */
export function renderQuotationPdf(data: QuotationData): Promise<Buffer> {
  return renderToBuffer(<Quotation data={data} />);
}
