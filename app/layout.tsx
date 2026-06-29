import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { JsonLd, organizationJsonLd, websiteJsonLd, SITE_URL } from "@/lib/seo";
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
    default: "VMF Holidays — Discover Your World, Your Way",
    template: "%s | VMF Holidays",
  },
  description:
    "VMF Holidays offers curated domestic and international holiday packages with transparent pricing, full itineraries, and personalised service. Based in Goa, India.",
  keywords: [
    "holiday packages india",
    "goa travel agency",
    "international tour packages",
    "honeymoon packages",
    "kerala tour",
    "vmf holidays",
  ],
  authors: [{ name: "VMF Holidays Pvt. Ltd." }],
  creator: "VMF Holidays Pvt. Ltd.",
  publisher: "VMF Holidays Pvt. Ltd.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  category: "travel",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "VMF Holidays",
    title: "VMF Holidays — Discover Your World, Your Way",
    description:
      "Curated holiday packages with transparent pricing and full itineraries. Domestic & international tours from Goa, India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VMF Holidays — Discover Your World, Your Way",
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
      </body>
    </html>
  );
}
