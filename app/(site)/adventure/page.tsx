import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "adventure",
  title: "Adventure Packages",
  description: "Trek, raft, paraglide and dive — curated adventure holidays for thrill-seekers.",
});

export default function AdventurePage() {
  return <CategoryLanding slug="adventure" />;
}
