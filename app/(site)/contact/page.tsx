import type { Metadata } from "next";
import EnquiryForm from "@/components/forms/EnquiryForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with VMF Holidays. Plan your next trip or ask us anything — we respond fast.",
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const sp = await props.searchParams;
  const packageTitle = typeof sp.title === "string" ? sp.title : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">Get in Touch</span>
          <h1 className={styles.heroTitle}>Contact VMF Holidays</h1>
          <p className={styles.heroSub}>
            Ready to plan your trip? Drop us a message and we&apos;ll get back to you within a few hours.
          </p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Form */}
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>
            {packageTitle ? `Enquire: ${packageTitle}` : "Send an Enquiry"}
          </h2>
          <EnquiryForm packageTitle={packageTitle} />
        </div>

        {/* Contact details */}
        <aside className={styles.details}>
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>Contact Details</h3>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 5.69 5.69l.41-.41a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className={styles.detailLabel}>Phone</p>
                <a href="tel:+917499322412" className={styles.detailValue}>+91 7499322412</a>
                <a href="tel:+918788324054" className={styles.detailValue}>+91 8788324054</a>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <p className={styles.detailLabel}>Email</p>
                <a href="mailto:info@vmfholidays.com" className={styles.detailValue}>info@vmfholidays.com</a>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className={styles.detailLabel}>Address</p>
                <p className={styles.detailValue}>Mendes Vaddo, H. No 128/3/A,<br />Calangute, Nagva, Goa 403516</p>
              </div>
            </div>

            <a
              href="https://wa.me/917499322412"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn--lg ${styles.waBtn}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Map */}
          <div className={styles.mapWrap}>
            <iframe
              src="https://maps.google.com/maps?q=HQ4H%2BWH+Calangute,+Goa,+India&z=16&output=embed"
              width="100%"
              height="240"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VMF Holidays location"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
