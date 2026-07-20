import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How VMF Holidays collects, uses, shares, protects and retains your personal data — in plain language — and your rights under India's DPDP Act, 2023.",
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
        <p className={styles.lead}>
          The trips we plan are personal — and so is the information you share to make them happen. This page explains, in
          plain language, what we collect, why we collect it, how we look after it, and the choices and rights you have.
          No jargon, no surprises.
        </p>
        <p>
          VMF Holidays Pvt. Ltd. (&ldquo;VMF Holidays&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a travel company
          based in Goa, India, and we are the people responsible for your personal data — your &ldquo;data
          fiduciary&rdquo; under India&apos;s Digital Personal Data Protection Act, 2023 (the &ldquo;DPDP Act&rdquo;).
          This policy covers this website and the ways you get in touch with us.
        </p>

        <div className={styles.promise}>
          <h2>Our Privacy Promise</h2>
          <p>Your trust is the most valuable thing we hold. So here is our promise to you:</p>
          <ul>
            <li>We only ever ask for information we genuinely need to plan and deliver your trip.</li>
            <li>
              We will <strong>never sell or rent your personal data</strong> — to anyone, for any reason.
            </li>
            <li>
              We share your details only with the partners who actually make your trip happen (your hotel, airline or
              transport provider), and only the specific details they need.
            </li>
            <li>
              Inside VMF, only the team members helping with your booking can see your information, and they are bound to
              keep it confidential.
            </li>
            <li>We hold the companies that help us run our website to the same standard we hold ourselves.</li>
            <li>
              You stay in control — you can ask to see, correct or delete your data, or withdraw your consent, at any
              time.
            </li>
          </ul>
        </div>

        <h2>1. What We Collect — and Why</h2>
        <p>
          <strong>Things you tell us.</strong> When you send an enquiry, use the Trip Builder, download a sample
          itinerary, book a trip, or message us on WhatsApp, phone or email, you share details like your name, phone
          number, email, destination and travel preferences, dates, the number and ages of travellers, hotel and meal
          preferences, budget, and any notes you add. We use these to understand the trip you want and tailor it to you.
          When you book, we collect the further details needed to confirm your trip and arrange payment. We take
          payments directly — by bank transfer, UPI or cheque — so we don&apos;t collect or store card or bank-account
          numbers on this website.
        </p>
        <p>
          <strong>Your Travellers Club account.</strong> If you join our Travellers Club, we store your name, email,
          phone and a password — the password only ever in encrypted (hashed) form, so no one at VMF can read it.
        </p>
        <p>
          <strong>Things we notice automatically.</strong> When you browse the site, we collect your IP address and
          basic usage information (pages visited, roughly how long, and your device or browser type). We use this to keep
          the site secure and working properly, and — only if you agree to analytics cookies — to understand what&apos;s
          useful and improve it.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use what we collect to:</p>
        <ul>
          <li>reply to your enquiry and put together itineraries and quotes for you;</li>
          <li>keep in touch about your booking and your travel;</li>
          <li>process payments and send confirmations;</li>
          <li>look after you before, during and after your trip;</li>
          <li>meet our legal, tax and accounting obligations;</li>
          <li>keep this website secure and make it better;</li>
          <li>and, only if you have opted in, send you travel ideas and offers you can unsubscribe from at any time.</li>
        </ul>
        <p>We only ever use your data for the purpose you shared it with us for.</p>

        <h2>3. Your Consent — and How to Withdraw It</h2>
        <p>
          Where the law requires it, we process your data on the basis of the consent you give when you tick the box on a
          form or create an account. You can <strong>withdraw that consent as easily as you gave it</strong>, by emailing{" "}
          <a href="mailto:info@vmfholidays.com">info@vmfholidays.com</a>. We&apos;ll stop the relevant processing —
          although we may keep certain records where the law requires, and withdrawing consent doesn&apos;t undo anything
          done beforehand.
        </p>

        <h2>4. Who We Share It With</h2>
        <p>
          We do <strong>not</strong> sell or rent your personal data. We share it only where it&apos;s needed to run your
          trip and our services:
        </p>
        <ul>
          <li>
            <strong>Travel partners</strong> — hotels, airlines, transport and activity providers — purely to fulfil your
            booking, and only the details they need.
          </li>
          <li>
            <strong>Trusted service providers</strong> who run parts of our platform for us, under contract and to our
            standards: our database and hosting (Neon, Vercel), image delivery (Cloudinary), our email (Resend), and —
            only if you accept analytics cookies — Google Analytics.
          </li>
          <li>
            <strong>Authorities</strong>, where we are legally required to disclose.
          </li>
        </ul>

        <h2>5. How We Protect Your Data</h2>
        <ul>
          <li>All traffic between you and our servers is encrypted using SSL/TLS.</li>
          <li>Passwords are stored only as one-way hashes — we can&apos;t see or recover them.</li>
          <li>Access to your details inside VMF is limited to the team members handling your trip.</li>
          <li>The service providers we use are held to confidentiality and security commitments in our contracts.</li>
        </ul>

        <h2>6. How Long We Keep It</h2>
        <p>
          We keep your personal data only for as long as we need it — typically for the length of our relationship and a
          reasonable period afterwards to meet legal, accounting and dispute-resolution requirements — after which it is
          deleted or anonymised. You can ask us to delete your data sooner at any time (see Your Rights).
        </p>

        <h2>7. Cookies</h2>
        <p>
          A cookie is a small text file a website stores on your device to remember things between visits. We use two
          kinds:
        </p>
        <ul>
          <li>
            <strong>Essential cookies</strong> — needed for the site to work, such as keeping you signed in, remembering
            your light/dark preference, and attributing a referral. These don&apos;t require consent.
          </li>
          <li>
            <strong>Analytics cookies</strong> (Google Analytics) — used only if you accept them via our cookie banner.
            You can decline and still use the full site, and change your mind at any time by clearing this site&apos;s
            storage in your browser.
          </li>
        </ul>
        <p>We do not use advertising or tracking cookies.</p>

        <h2>8. Your Rights</h2>
        <p>Under the DPDP Act, you have the right to:</p>
        <ul>
          <li>ask for a summary of the personal data we hold about you and how we use it;</li>
          <li>have anything inaccurate or incomplete corrected or completed;</li>
          <li>have your data erased when it&apos;s no longer needed;</li>
          <li>withdraw your consent at any time;</li>
          <li>nominate someone to exercise your rights on your behalf if you die or are incapacitated; and</li>
          <li>
            raise a grievance with us and, if you&apos;re not satisfied, escalate it to the Data Protection Board of
            India.
          </li>
        </ul>
        <p>
          To exercise any of these, just email <a href="mailto:info@vmfholidays.com">info@vmfholidays.com</a> — we&apos;ll
          respond within the timelines the law requires.
        </p>

        <h2>9. Children&apos;s Privacy</h2>
        <p>
          Our services are meant for adults. We do not knowingly collect the personal data of a child (under 18) without
          verifiable consent from a parent or guardian. If you believe a child has shared data with us without that
          consent, please contact us and we&apos;ll delete it.
        </p>

        <h2>10. Where Your Data Is Processed</h2>
        <p>
          Some of the trusted providers who help us run this site process data on servers that may be located outside
          India. Wherever your data is handled, we take steps to keep it protected in line with this policy.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. If we make a material change, we&apos;ll post it on this page with
          a new &ldquo;last updated&rdquo; date, and we won&apos;t use your existing data in a materially different way
          without your consent.
        </p>

        <h2>12. Talk to Us — and Our Grievance Officer</h2>
        <p>
          We&apos;re happy to answer any question about your privacy, or help you exercise your rights. For anything —
          including a formal grievance — reach our Grievance Officer:
        </p>
        <p>
          Grievance Officer, VMF Holidays Pvt. Ltd.
          <br />
          Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516, India
          <br />
          Email: <a href="mailto:info@vmfholidays.com">info@vmfholidays.com</a>
          <br />
          Phone / WhatsApp: <a href="tel:+917499322412">+91 7499322412</a>
        </p>
      </div>
    </div>
  );
}
