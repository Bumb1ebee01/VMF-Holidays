import type { Metadata } from "next";
import GalleryForm from "@/components/admin/GalleryForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Add Photo" };

export default function NewPhotoPage() {
  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Gallery</p>
          <h1 className={shared.pageTitle}>Add Photo</h1>
        </div>
      </div>
      <GalleryForm />
    </div>
  );
}
