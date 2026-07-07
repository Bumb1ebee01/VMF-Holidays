import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { JsonLd, organizationJsonLd, websiteJsonLd, SITE_URL } from "@/lib/seo";
import Analytics from "@/components/analytics/Analytics";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  // Weights actually used across the stylesheets. (Previously 100 was loaded but
  // never used, while 600/800 were used but not loaded — so the browser was
  // faux-synthesising them. This list matches the real font-weight declarations.)
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    // Search title leads with the terms people actually search ("travel agency",
    // "customised holiday packages"); the brand tagline lives in the OG/Twitter
    // titles below for social shares.
    default: "Goa Travel Agency & Customised Holiday Packages | VMF Holidays",
    template: "%s | VMF Holidays",
  },
  description:
    "VMF Holidays is a Goa travel agency crafting customised, tailor-made holiday packages — honeymoon, family, group & corporate tours across India and worldwide. Transparent pricing and full itineraries, planned around you.",
  keywords: [
    "goa travel agency",
    "travel agency in calangute",
    "customised holiday packages",
    "tailor-made tour packages india",
    "personalised itineraries",
    "honeymoon packages",
    "family tour packages",
    "international tour packages from india",
    "vmf holidays",
  ],
  authors: [{ name: "VMF Holidays Pvt. Ltd." }],
  creator: "VMF Holidays Pvt. Ltd.",
  publisher: "VMF Holidays Pvt. Ltd.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  category: "travel",
  // Emits <meta name="google-site-verification"> only when the token is set, so
  // you can verify the domain in Google Search Console without a code change.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "VMF Holidays",
    title: "VMF Holidays — Discover Your World Your Way",
    description:
      "Curated holiday packages with transparent pricing and full itineraries. Domestic & international tours from Goa, India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VMF Holidays — Discover Your World Your Way",
    description: "Curated holiday packages with transparent pricing from Goa, India.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Adapt the view to whatever device/display is rendering it.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#002464" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
