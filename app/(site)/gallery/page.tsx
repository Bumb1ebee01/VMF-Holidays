import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedGalleryPhotos } from "@/lib/queries";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Real moments from real VMF Holidays travellers — trip photos and customer memories from across India and beyond.",
  alternates: { canonical: "/gallery" },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = await getPublishedGalleryPhotos();

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} />

      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Memories</span>
          <h1 className={styles.heroTitle}>Moments from our travellers</h1>
          <p className={styles.heroSub}>
            Real photos from real trips we&apos;ve planned. This could be your next holiday.
          </p>
        </div>
      </div>

      <div className="container">
        {photos.length === 0 ? (
          <div className={styles.empty}>
            <p>Our photo wall is coming soon. Be one of our first featured travellers.</p>
            <Link href="/trip-builder" className="btn btn-primary">
              Plan your trip
            </Link>
          </div>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </div>
    </div>
  );
}
