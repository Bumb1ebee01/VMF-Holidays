import type { Metadata } from "next";
import { getAllDestinations } from "@/lib/queries";
import { loadGeography } from "@/lib/data/geography-db";
import TripWizard from "@/components/forms/TripWizard";
import { JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const PAGE_DESCRIPTION =
  "Build a fully customised, tailor-made holiday package with VMF Holidays — pick your destinations, dates and travel style and get a personalised itinerary and quote. Domestic & international, no booking fees.";

export const metadata: Metadata = {
  title: "Customised & Tailor-Made Holiday Packages",
  description: PAGE_DESCRIPTION,
  keywords: [
    "customised holiday packages",
    "tailor-made tour packages",
    "build your own trip",
    "personalised itinerary",
    "custom honeymoon package",
    "design your own holiday india",
  ],
  alternates: { canonical: "/trip-builder" },
  openGraph: {
    type: "website",
    url: "/trip-builder",
    title: "Customised & Tailor-Made Holiday Packages | VMF Holidays",
    description: PAGE_DESCRIPTION,
  },
};

export default async function TripBuilderPage() {
  const [destinations, geography] = await Promise.all([
    getAllDestinations(),
    loadGeography(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Customised Holiday Packages",
            description: PAGE_DESCRIPTION,
            path: "/trip-builder",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Customised Packages", path: "/trip-builder" },
          ]),
        ]}
      />
      <TripWizard destinations={destinations} geography={geography} />
    </>
  );
}
