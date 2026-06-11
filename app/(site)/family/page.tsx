import type { Metadata } from "next";
import CategoryLanding from "@/components/categories/CategoryLanding";

export const metadata: Metadata = {
  title: "Family Tour Packages",
  description: "Kid-friendly family holiday packages with the perfect mix of fun, culture and relaxation for all ages.",
};

export default function FamilyPage() {
  return <CategoryLanding slug="family" />;
}
