import type { Metadata } from "next";
import DestinationForm from "@/components/admin/DestinationForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Destination" };

export default function NewDestinationPage() {
  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Destinations</p>
          <h1 className={shared.pageTitle}>New Destination</h1>
        </div>
      </div>
      <DestinationForm />
    </div>
  );
}
