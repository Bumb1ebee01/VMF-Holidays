import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "VMF Holidays privacy policy — how we collect, use and protect your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.updated}>Last updated: June 2025</p>
        </div>
      </div>
      <div className={`container ${styles.content}`}>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide when you fill out an enquiry form, contact us via WhatsApp or email, or book a travel package. This includes your name, phone number, email address, travel preferences and payment details.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to: prepare and send travel itineraries and quotes; communicate about your booking; process payments; send relevant travel updates (only with your consent); and improve our services.</p>

        <h2>3. Information Sharing</h2>
        <p>We do not sell or rent your personal information to third parties. We may share it with our trusted travel partners (hotels, airlines, activity providers) solely to fulfil your booking, and with payment processors as required.</p>

        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal data. All communications between you and our servers are encrypted via SSL/TLS.</p>

        <h2>5. Cookies</h2>
        <p>Our website uses essential cookies to ensure proper functionality. We do not use tracking or advertising cookies without your consent.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct or delete your personal data at any time. To exercise these rights, contact us at info@vmfholidays.com.</p>

        <h2>7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>

        <h2>8. Contact Us</h2>
        <p>VMF Holidays Pvt. Ltd., Mendes Vaddo, H. No 128/3/A, Calangute, Nagva, Goa 403516, India<br />Email: info@vmfholidays.com · Phone: +91 7499322412</p>
      </div>
    </div>
  );
}
