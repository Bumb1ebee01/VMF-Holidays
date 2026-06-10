import SectionHeader from "@/components/ui/SectionHeader";
import CategoryTile from "@/components/ui/CategoryTile";
import { categories } from "@/lib/data/categories";
import styles from "./TripCategories.module.css";

export default function TripCategories() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          eyebrow="Travel Your Way"
          title="Trip Categories"
          sub="Whatever your travel style, we have a perfectly crafted journey waiting for you."
          centered
        />
        <div className={`grid-3 ${styles.grid}`}>
          {categories.map((cat) => (
            <CategoryTile key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
