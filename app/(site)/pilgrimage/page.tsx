import type { Metadata } from "next";
import CategoryLanding from "@/components/categories/CategoryLanding";

export const metadata: Metadata = {
  title: "Pilgrimage Packages",
  description: "Pilgrimage tours to India's most revered temples and holy sites — comfortable travel and trusted, devotion-first planning by VMF Holidays.",
  alternates: { canonical: "/pilgrimage" },
};

export default function PilgrimagePage() {
  return <CategoryLanding slug="pilgrimage" />;
}
