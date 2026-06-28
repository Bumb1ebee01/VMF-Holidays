import type { Metadata } from "next";
import GeoCountryForm from "@/components/admin/GeoCountryForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Country" };

export default function NewCountryPage() {
  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Trip Builder</p>
          <h1 className={shared.pageTitle}>New Country</h1>
        </div>
      </div>
      <GeoCountryForm />
    </div>
  );
}
