import type { Metadata } from "next";
import { db } from "@/lib/db";
import PackageForm from "@/components/admin/PackageForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Package" };
export const dynamic = "force-dynamic";

export default async function NewPackagePage() {
  const destinations = await db.destination.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Packages</p>
          <h1 className={shared.pageTitle}>New Package</h1>
        </div>
      </div>
      <PackageForm destinations={destinations} />
    </div>
  );
}
