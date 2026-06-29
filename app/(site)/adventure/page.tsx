import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "adventure",
  title: "Adventure Tour Packages",
  description: "Trek, raft, paraglide and dive — curated adventure tour packages and holidays for thrill-seekers, across India and beyond.",
});

export default function AdventurePage() {
  return <CategoryLanding slug="adventure" />;
}
