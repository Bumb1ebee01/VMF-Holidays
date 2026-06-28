import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "corporate",
  title: "Corporate & MICE Travel",
  description: "End-to-end MICE solutions — conferences, incentive trips, team outings and corporate retreats.",
});

export default function CorporatePage() {
  return <CategoryLanding slug="corporate" />;
}
