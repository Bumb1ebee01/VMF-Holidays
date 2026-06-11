import type { Metadata } from "next";
import CategoryLanding from "@/components/categories/CategoryLanding";

export const metadata: Metadata = {
  title: "Honeymoon Packages",
  description: "Romantic honeymoon packages crafted for two — private villas, candlelit dinners and memories for a lifetime.",
};

export default function HoneymoonPage() {
  return <CategoryLanding slug="honeymoon" />;
}
