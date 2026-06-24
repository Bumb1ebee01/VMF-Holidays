import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import OfferForm from "@/components/admin/OfferForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Offer" };
export const dynamic = "force-dynamic";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const o = await db.offer.findUnique({ where: { id } });
  if (!o) notFound();

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Offers</p>
          <h1 className={shared.pageTitle}>{o.title}</h1>
        </div>
      </div>
      <OfferForm
        initial={{
          id: o.id,
          title: o.title,
          description: o.description ?? "",
          image: o.image,
          ctaLabel: o.ctaLabel ?? "",
          ctaHref: o.ctaHref ?? "",
          badge: o.badge ?? "",
          published: o.published,
          sortOrder: o.sortOrder,
          endsAt: o.endsAt ? o.endsAt.toISOString().slice(0, 10) : "",
        }}
      />
    </div>
  );
}
