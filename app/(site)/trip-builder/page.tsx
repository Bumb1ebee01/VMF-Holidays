import type { Metadata } from "next";
import { getAllDestinations, getAllPackages } from "@/lib/queries";
import TripWizard from "@/components/forms/TripWizard";

export const metadata: Metadata = {
  title: "Build My Trip | VMF Holidays",
  description: "Build your perfect holiday — choose destination, travel style, and dates. VMF Holidays crafts personalised itineraries just for you.",
};

export default async function TripBuilderPage() {
  const [destinations, packages] = await Promise.all([
    getAllDestinations(),
    getAllPackages(),
  ]);

  return <TripWizard destinations={destinations} packages={packages} />;
}
