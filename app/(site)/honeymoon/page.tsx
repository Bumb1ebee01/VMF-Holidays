import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "honeymoon",
  title: "Honeymoon Packages",
  description: "Romantic honeymoon packages crafted for two — private villas, candlelit dinners and memories for a lifetime.",
});

export default function HoneymoonPage() {
  return <CategoryLanding slug="honeymoon" />;
}
