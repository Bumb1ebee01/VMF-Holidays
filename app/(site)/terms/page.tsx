import type { Metadata } from "next";
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
          <p className={styles.updated}>Last updated: June 2025</p>
        </div>
      </div>
      <div className={`container ${styles.content}`}>
        <h2>1. Bookings &amp; Confirmation</h2>
        <p>All bookings are confirmed only upon receipt of the deposit and a written confirmation from VMF Holidays. Verbal confirmations are not binding.</p>

        <h2>2. Payment Terms</h2>
        <p>A deposit of 25% of the total package cost is required at the time of booking. The remaining balance is due 30 days before departure, unless otherwise agreed in writing.</p>

        <h2>3. Cancellation Policy</h2>
        <p>Cancellations made more than 30 days before departure: 10% cancellation fee. 15–30 days before: 25% fee. 7–14 days before: 50% fee. Less than 7 days: 100% fee. Cancellation fees from airlines, hotels and third parties may apply additionally.</p>

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
