import type { Metadata } from "next";
import CategoryLanding from "@/components/categories/CategoryLanding";

export const metadata: Metadata = {
  title: "Adventure Packages",
  description: "Trek, raft, paraglide and dive — curated adventure holidays for thrill-seekers.",
  alternates: { canonical: "/adventure" },
};

export default function AdventurePage() {
  return <CategoryLanding slug="adventure" />;
}
