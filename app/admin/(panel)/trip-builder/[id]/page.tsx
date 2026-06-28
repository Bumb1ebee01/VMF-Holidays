import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import GeoCountryForm from "@/components/admin/GeoCountryForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Country" };
export const dynamic = "force-dynamic";

export default async function EditCountryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const country = await db.geoCountry.findUnique({
    where: { id },
    include: { places: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] } },
  });
  if (!country) notFound();

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Trip Builder</p>
          <h1 className={shared.pageTitle}>{country.name}</h1>
        </div>
      </div>
      <GeoCountryForm
        initial={{
          id: country.id,
          code: country.code,
          name: country.name,
          flag: country.flag,
          continent: country.continent,
          region: country.region,
          heroImage: country.heroImage,
          places: country.places.map((p) => ({
            slug: p.slug,
            name: p.name,
            destinationSlug: p.destinationSlug,
            image: p.image,
            lat: p.lat,
            lng: p.lng,
            activities: p.activities,
          })),
        }}
      />
    </div>
  );
}
