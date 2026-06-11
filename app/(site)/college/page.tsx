import type { Metadata } from "next";
import CategoryLanding from "@/components/categories/CategoryLanding";

export const metadata: Metadata = {
  title: "College Tours",
  description: "Budget-friendly group tours for students — educational, adventurous and unforgettable.",
};

export default function CollegePage() {
  return <CategoryLanding slug="college" />;
}
