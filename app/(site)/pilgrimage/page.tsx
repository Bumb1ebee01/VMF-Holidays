import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "pilgrimage",
  title: "Pilgrimage Packages",
  description: "Pilgrimage tours to India's most revered temples and holy sites — comfortable travel and trusted, devotion-first planning by VMF Holidays.",
});

export default function PilgrimagePage() {
  return <CategoryLanding slug="pilgrimage" />;
}
