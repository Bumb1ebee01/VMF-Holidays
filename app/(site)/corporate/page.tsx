import type { Metadata } from "next";
import CategoryLanding from "@/components/categories/CategoryLanding";

export const metadata: Metadata = {
  title: "Corporate & MICE Travel",
  description: "End-to-end MICE solutions — conferences, incentive trips, team outings and corporate retreats.",
  alternates: { canonical: "/corporate" },
};

export default function CorporatePage() {
  return <CategoryLanding slug="corporate" />;
}
