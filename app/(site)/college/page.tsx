import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "college",
  title: "College Tours",
  description: "Budget-friendly group tours for students — educational, adventurous and unforgettable.",
});

export default function CollegePage() {
  return <CategoryLanding slug="college" />;
}
