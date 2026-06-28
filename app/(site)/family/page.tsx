import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "family",
  title: "Family Tour Packages",
  description: "Kid-friendly family holiday packages with the perfect mix of fun, culture and relaxation for all ages.",
});

export default function FamilyPage() {
  return <CategoryLanding slug="family" />;
}
