import type { Metadata } from "next";
import TripWizard from "@/components/forms/TripWizard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Trip Builder",
  description: "Build your perfect holiday with VMF Holidays. Tell us your dream trip and we'll craft a personalised itinerary.",
};

export default function TripBuilderPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Plan Your Holiday</span>
          <h1 className={styles.heroTitle}>Build Your Perfect Trip</h1>
          <p className={styles.heroSub}>
            Answer a few quick questions and our travel experts will craft a personalised itinerary just for you.
          </p>
        </div>
      </div>
      <div className={`container ${styles.content}`}>
        <TripWizard />
      </div>
    </div>
  );
}
