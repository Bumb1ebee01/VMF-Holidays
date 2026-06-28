import type { Metadata } from "next";
import { getAllDestinations } from "@/lib/queries";
import { loadGeography } from "@/lib/data/geography-db";
import TripWizard from "@/components/forms/TripWizard";

export const metadata: Metadata = {
  title: "Build My Trip",
  description: "Build your perfect holiday — choose destination, travel style, and dates. VMF Holidays crafts personalised itineraries just for you.",
  alternates: { canonical: "/trip-builder" },
};

export default async function TripBuilderPage() {
  const [destinations, geography] = await Promise.all([
    getAllDestinations(),
    loadGeography(),
  ]);

  return <TripWizard destinations={destinations} geography={geography} />;
}
