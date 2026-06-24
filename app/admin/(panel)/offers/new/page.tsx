import type { Metadata } from "next";
import OfferForm from "@/components/admin/OfferForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "New Offer" };

export default function NewOfferPage() {
  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Offers</p>
          <h1 className={shared.pageTitle}>New Offer</h1>
        </div>
      </div>
      <OfferForm />
    </div>
  );
}
