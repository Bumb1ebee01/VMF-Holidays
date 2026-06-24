import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { IconImage } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";
import styles from "./gallery.module.css";

export const metadata: Metadata = { title: "Gallery" };
export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const photos = await db.galleryPhoto.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  const live = photos.filter((p) => p.published).length;

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Gallery</h1>
          <p className={shared.pageSub}>
            {live} shown of {photos.length} total.
          </p>
        </div>
        <Link href="/admin/gallery/new" className="btn btn-primary btn--sm">
          + Add Photo
        </Link>
      </div>

      <div className={shared.panel}>
        {photos.length === 0 ? (
          <div className={shared.emptyState}>
            <IconImage size={28} />
            <p>No photos yet. Add trip and customer photos here.</p>
          </div>
        ) : (
          <div className={`${shared.panelPad} ${styles.grid}`}>
            {photos.map((p) => (
              <Link key={p.id} href={`/admin/gallery/${p.id}`} className={styles.tile}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.caption ?? ""} />
                {!p.published && <span className={styles.hidden}>Hidden</span>}
                {(p.caption || p.location) && (
                  <span className={styles.cap}>{p.caption || p.location}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
