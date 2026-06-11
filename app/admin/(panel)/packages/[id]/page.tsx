import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PackageForm from "@/components/admin/PackageForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Package" };
export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [pkg, destinations] = await Promise.all([
    db.package.findUnique({ where: { id } }),
    db.destination.findMany({
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!pkg) notFound();

  const itinerary = Array.isArray(pkg.itinerary)
    ? (pkg.itinerary as { title?: string; description?: string }[]).map((d) => ({
        title: d.title ?? "",
        description: d.description ?? "",
      }))
    : [];

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Packages</p>
          <h1 className={shared.pageTitle}>{pkg.title}</h1>
        </div>
      </div>
      <PackageForm
        destinations={destinations}
        initial={{
          id: pkg.id,
          title: pkg.title,
          slug: pkg.slug,
          destination: pkg.destination,
          destinationSlug: pkg.destinationSlug,
          category: pkg.category,
          duration: pkg.duration,
          nights: pkg.nights,
          fromPrice: pkg.fromPrice,
          heroImage: pkg.heroImage,
          gallery: pkg.gallery,
          highlights: pkg.highlights,
          inclusions: pkg.inclusions,
          exclusions: pkg.exclusions,
          itinerary,
          featured: pkg.featured,
          badge: pkg.badge ?? "",
        }}
      />
    </div>
  );
}
