import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
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
  metadataBase: new URL("https://vmfholidays.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vmfholidays.com",
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
      <body>{children}</body>
    </html>
  );
}
