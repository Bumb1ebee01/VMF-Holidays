import type { Metadata } from "next";
import CategoryLanding from "@/components/categories/CategoryLanding";

export const metadata: Metadata = {
  title: "Pilgrimage Packages",
  description: "Sacred journeys to India's holiest sites — Char Dham, Vaishno Devi, Tirupati and more.",
};

export default function PilgrimagePage() {
  return <CategoryLanding slug="pilgrimage" />;
}
