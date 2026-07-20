import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "VMF Holidays privacy & cookie policy — how we collect, use, share, retain and protect your personal data, and your rights under India's DPDP Act, 2023.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Privacy &amp; Cookie Policy</h1>
          <p className={styles.updated}>Last updated: 20 July 2026</p>
        </div>
      </div>
      <div className={`container ${styles.content}`}>
        <p>
          VMF Holidays Pvt. Ltd. (&ldquo;VMF Holidays&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data fiduciary
          for the personal data you share with us. This policy explains what we collect, why, how long we keep it, who
          we share it with, and the rights you have under India&apos;s Digital Personal Data Protection Act, 2023 (the
          &ldquo;DPDP Act&rdquo;). By using this website or sharing your details with us, you consent to the practices
          described here.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly when you fill out an enquiry or Trip Builder form, download a
          sample itinerary, create a Travellers Club account, contact us via WhatsApp, phone or email, or book a
          package. This includes your name, phone number, email address, travel preferences, dates and traveller
          details, and — for bookings — the information needed to process your trip and payment. We also collect limited
          technical data (such as your IP address) to keep the site secure and, only with your consent, analytics data
          (see Cookies below).
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to: respond to your enquiry and prepare and send itineraries and quotes; communicate
          with you about your booking; process payments; provide customer support; meet legal and tax obligations; keep
          our services and this site secure; and — only where you have opted in — send you relevant travel offers and
          updates. We use your data only for the purposes for which you provided it.
        </p>

        <h2>3. Consent &amp; Its Withdrawal</h2>
        <p>
          Where the law requires consent, we process your personal data on the basis of the consent you give when you
          submit a form or create an account. You may <strong>withdraw your consent at any time</strong> — as easily as
          you gave it — by emailing <a href="mailto:info@vmfholidays.com">info@vmfholidays.com</a>. Withdrawing consent
          does not affect processing already carried out, and we may still retain data where the law requires.
        </p>

        <h2>4. How We Share Your Information</h2>
        <p>
          We <strong>do not sell or rent</strong> your personal data. We share it only as needed to run our services:
        </p>
        <ul>
          <li>
            <strong>Travel partners</strong> (hotels, airlines, transport and activity providers) — solely to fulfil
            your booking.
          </li>
          <li>
            <strong>Payment processors</strong> — to collect payments securely; we do not store full card details.
          </li>
          <li>
            <strong>Service providers (data processors)</strong> who operate our platform on our behalf, under
            contract: hosting and database (Neon, Vercel), image delivery (Cloudinary), transactional email (Resend),
            and — only if you accept analytics cookies — Google Analytics.
          </li>
          <li>Authorities, where we are legally required to disclose.</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          We keep your personal data only for as long as needed for the purposes above — typically for the duration of
          our relationship and for a reasonable period afterwards to meet legal, accounting and dispute-resolution
          requirements — after which it is deleted or anonymised. You may ask us to erase your data sooner (see Your
          Rights).
        </p>

        <h2>6. Cookies</h2>
        <p>
          We use <strong>essential cookies</strong> that are necessary for the site to function (for example, to keep
          you signed in, remember your theme, and attribute referrals) — these do not require consent. We use{" "}
          <strong>analytics cookies</strong> (Google Analytics) only if you accept them via our cookie banner; you can
          decline and still use the full site, and you can change your choice at any time by clearing your browser
          storage for this site. We do not use advertising cookies.
        </p>

        <h2>7. Your Rights</h2>
        <p>Under the DPDP Act, you have the right to:</p>
        <ul>
          <li>access a summary of the personal data we hold about you and how we process it;</li>
          <li>have inaccurate or incomplete data corrected or completed;</li>
          <li>have your data erased where it is no longer needed;</li>
          <li>withdraw consent at any time;</li>
          <li>nominate another person to exercise your rights in the event of death or incapacity; and</li>
          <li>raise a grievance and, if unsatisfied, escalate to the Data Protection Board of India.</li>
        </ul>
        <p>
          To exercise any of these, email <a href="mailto:info@vmfholidays.com">info@vmfholidays.com</a>. We respond
          within the timelines required by law.
        </p>

        <h2>8. Children&apos;s Data</h2>
        <p>
          Our services are intended for adults. We do not knowingly collect the personal data of a child (under 18)
          without verifiable parental or guardian consent. If you believe a child has provided us data without such
          consent, contact us and we will delete it.
        </p>

        <h2>9. Data Security</h2>
        <p>
          We apply reasonable technical and organisational safeguards to protect your data. All traffic between your
          browser and our servers is encrypted via SSL/TLS, access to personal data is restricted to authorised staff,
          and passwords are stored only in hashed form.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be posted on this page with a revised
          &ldquo;last updated&rdquo; date.
        </p>

        <h2>11. Grievance Officer &amp; Contact</h2>
        <p>
          For any privacy question, request, or grievance, contact our Grievance Officer:
          <br />
          Grievance Officer, VMF Holidays Pvt. Ltd.
          <br />
          Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516, India
          <br />
          Email: <a href="mailto:info@vmfholidays.com">info@vmfholidays.com</a> · Phone:{" "}
          <a href="tel:+917499322412">+91 7499322412</a>
        </p>
      </div>
    </div>
  );
}
