import type { Metadata } from "next";
import type { Package, BlogPost, TripCategorySlug } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data/categories";

// ─────────────────────────────────────────────────────────────────────────────
// Central SEO source of truth — site URL, business identity, and JSON-LD
// builders. Keep all canonical/structured-data logic here so every page stays
// consistent and there's a single place to update business facts.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://vmfholidays.com";
export const SITE_NAME = "VMF Holidays";
export const SITE_TAGLINE = "Discover Your World, Your Way";
export const SITE_DESCRIPTION =
  "VMF Holidays offers curated domestic and international holiday packages with transparent pricing, full itineraries, and personalised service. Based in Goa, India.";

export const BUSINESS = {
  legalName: "VMF Holidays Pvt. Ltd.",
  email: "info@vmfholidays.com",
  phones: ["+917499322412", "+918788324054"],
  whatsapp: "https://wa.me/917499322412",
  instagram: "https://www.instagram.com/vmfholidays/",
  facebook: "https://www.facebook.com/vmfholidays/",
  address: {
    street: "Mendes Vaddo, H. No 128/3/A",
    locality: "Calangute, Nagva",
    region: "Goa",
    postalCode: "403516",
    country: "IN",
  },
  geo: { lat: 15.5439, lng: 73.7553 },
} as const;

/** Build an absolute URL from a path (always returns a canonical, https URL). */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** TravelAgency / Organization schema — emitted once, sitewide, in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/logo-blue.png"),
    image: absoluteUrl("/opengraph-image"),
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    email: BUSINESS.email,
    telephone: BUSINESS.phones[0],
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${BUSINESS.address.street}, ${BUSINESS.address.locality}`,
      addressLocality: "Calangute",
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.phones[0],
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [BUSINESS.instagram, BUSINESS.facebook],
  };
}

/** WebSite schema linking the site to its publishing organisation. (No SearchAction:
 *  Google retired the sitelinks searchbox, so it would have no effect.) */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** BreadcrumbList schema for a trail of { name, path } items. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** ItemList schema for a listing page (helps Google understand a set of links). */
export function itemListJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

/** Full Metadata for a trip-category landing page — keeps the page's tailored copy
 *  but adds canonical, OpenGraph and Twitter cards (using the category's photo). */
export function categoryMetadata(opts: {
  slug: TripCategorySlug;
  title: string;
  description: string;
}): Metadata {
  const category = getCategoryBySlug(opts.slug);
  const url = `/${opts.slug}`;
  const ogTitle = `${opts.title} | ${SITE_NAME}`;
  const image = category?.image;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: ogTitle,
      description: opts.description,
      images: image ? [{ url: image, width: 1200, height: 630, alt: opts.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: opts.description,
      images: image ? [image] : undefined,
    },
  };
}

/** Product + Offer schema for a holiday package detail page (rich result eligible). */
export function packageJsonLd(pkg: Package) {
  const base = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.title,
    description: `${pkg.duration} in ${pkg.destination}. ${pkg.highlights.slice(0, 3).join(". ")}.`,
    image: pkg.gallery?.length ? pkg.gallery.map((g) => absoluteUrl(g)) : [absoluteUrl(pkg.heroImage)],
    brand: { "@type": "Brand", name: SITE_NAME },
    category: pkg.category,
    url: absoluteUrl(`/packages/${pkg.slug}`),
  };
  // A price-on-request package has no fixed price, so omit the Offer block
  // rather than emit an invalid price-less Offer.
  if (pkg.priceOnRequest) return base;
  return {
    ...base,
    offers: {
      "@type": "Offer",
      price: pkg.fromPrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/packages/${pkg.slug}`),
      seller: { "@id": `${SITE_URL}/#organization` },
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
    },
  };
}

/** FAQPage schema from a list of question/answer pairs (rich result eligible). */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BlogPosting schema for a blog article (rich result eligible). */
export function postJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : [absoluteUrl("/opengraph-image")],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.publishedAt?.toISOString(),
    author: { "@type": "Organization", name: post.author || SITE_NAME },
    publisher: { "@id": `${SITE_URL}/#organization` },
    keywords: post.tags.join(", "),
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

/** Render a JSON-LD <script> tag. Spread the object(s) you build above. */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return payload.map((d, i) => (
    <script
      key={i}
      type="application/ld+json"
      // Escape `<` so a stray "</script>" inside admin-entered text can't break out.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
    />
  ));
}
