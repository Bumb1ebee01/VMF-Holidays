import CategoryLanding from "@/components/categories/CategoryLanding";
import { categoryMetadata } from "@/lib/seo";

export const metadata = categoryMetadata({
  slug: "college",
  title: "College Trip Packages",
  description: "Budget-friendly college trip & student group tour packages — educational, adventurous and unforgettable, planned end-to-end by VMF Holidays.",
});

export default function CollegePage() {
  return <CategoryLanding slug="college" />;
}
