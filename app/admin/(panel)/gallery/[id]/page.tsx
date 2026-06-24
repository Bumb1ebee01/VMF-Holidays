import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import GalleryForm from "@/components/admin/GalleryForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Photo" };
export const dynamic = "force-dynamic";

export default async function EditPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await db.galleryPhoto.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Gallery</p>
          <h1 className={shared.pageTitle}>{p.caption || "Photo"}</h1>
        </div>
      </div>
      <GalleryForm
        initial={{
          id: p.id,
          image: p.image,
          caption: p.caption ?? "",
          location: p.location ?? "",
          published: p.published,
          sortOrder: p.sortOrder,
        }}
      />
    </div>
  );
}
