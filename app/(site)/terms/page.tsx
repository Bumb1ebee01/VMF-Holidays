import type { Metadata } from "next";
import { DOMESTIC_CANCELLATION } from "@/lib/itinerary-terms";
import styles from "../privacy/page.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "VMF Holidays terms and conditions for travel bookings.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Terms &amp; Conditions</h1>
          <p className={styles.updated}>Last updated: July 2026</p>
        </div>
      </div>
      <div className={`container ${styles.content}`}>
        <h2>1. Bookings &amp; Confirmation</h2>
        <p>All bookings are confirmed only upon receipt of the deposit and a written confirmation from VMF Holidays. Verbal confirmations are not binding.</p>

        <h2>2. Payment Terms</h2>
        <p>A non-refundable advance of 50% of the total package cost confirms your booking, with the balance due at least 21 days before departure. For bookings made within 21 days of departure, full payment is required at the time of confirmation. International tours require a higher advance and earlier full payment (balance at least 45 days before departure), as stated on your quotation, because airline tickets, visas and overseas hotels are booked and paid for well in advance.</p>

        <h2>3. Cancellation Policy (Domestic)</h2>
        <p>If you need to cancel, the following charges apply — the same policy stated on your written quotation:</p>
        <ul>
          {DOMESTIC_CANCELLATION.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p>International tours follow a stricter cancellation schedule (higher charges further from departure, and airline / visa / hotel costs non-refundable at actuals), set out on your quotation. Cancellation fees levied by airlines, hotels and other third-party suppliers apply in addition to the above.</p>

        <h2>4. Changes to Bookings</h2>
        <p>Requests to change travel dates, destinations or inclusions after confirmation are subject to availability and may incur amendment fees. VMF Holidays will endeavour to accommodate changes but cannot guarantee them.</p>

        <h2>5. Travel Insurance</h2>
        <p>VMF Holidays strongly recommends purchasing comprehensive travel insurance. We are not liable for losses arising from medical emergencies, cancellations, lost luggage or other unforeseen events that travel insurance typically covers.</p>

        <h2>6. Passports, Visas &amp; Health Requirements</h2>
        <p>It is the traveller&apos;s responsibility to ensure their passport is valid for at least six months beyond the travel date and to obtain any required visas. VMF Holidays provides general visa assistance but cannot guarantee visa approval.</p>

        <h2>7. Liability</h2>
        <p>VMF Holidays acts as an agent for airlines, hotels and other service providers. We are not liable for any injury, loss or damage caused by the negligence of third-party providers. Our liability is limited to the total cost of the package booked.</p>

        <h2>8. Governing Law</h2>
        <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Goa, India.</p>

        <h2>9. Contact</h2>
        <p>VMF Holidays Pvt. Ltd., Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516, India<br />Email: info@vmfholidays.com · Phone: +91 7499322412</p>
      </div>
    </div>
  );
}
