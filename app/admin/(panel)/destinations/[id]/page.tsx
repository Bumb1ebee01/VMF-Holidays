import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import DestinationForm from "@/components/admin/DestinationForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Destination" };
export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dest = await db.destination.findUnique({ where: { id } });
  if (!dest) notFound();

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Destinations</p>
          <h1 className={shared.pageTitle}>{dest.name}</h1>
        </div>
      </div>
      <DestinationForm
        initial={{
          id: dest.id,
          name: dest.name,
          slug: dest.slug,
          country: dest.country,
          state: dest.state ?? undefined,
          region: dest.region,
          heroImage: dest.heroImage,
          fromPrice: dest.fromPrice,
          blurb: dest.blurb,
          tags: dest.tags,
          guideIntro: dest.guideIntro ?? undefined,
          guideBestTime: dest.guideBestTime ?? undefined,
          guideThingsToDo: dest.guideThingsToDo,
          guideTip: dest.guideTip ?? undefined,
          guideGallery: dest.guideGallery,
          guideSections: Array.isArray(dest.guideSections)
            ? (dest.guideSections as { heading: string; body: string }[])
            : [],
        }}
      />
    </div>
  );
}
