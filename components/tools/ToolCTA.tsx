import Link from "next/link";
import { whatsappLink } from "@/lib/contact";
import styles from "./ToolCTA.module.css";

interface ToolCTAProps {
  title: string;
  sub: string;
  /** WhatsApp message body — pre-fills the chat so the customer doesn't start cold. */
  whatsappText: string;
  ctaLabel?: string;
  /** Secondary link (defaults to the Trip Builder). */
  secondaryHref?: string;
  secondaryLabel?: string;
}

/**
 * The conversion moment shared by every /tools page. Each tool passes its own
 * context-aware WhatsApp message so the enquiry starts warm.
 */
export default function ToolCTA({
  title,
  sub,
  whatsappText,
  ctaLabel = "Chat on WhatsApp",
  secondaryHref = "/trip-builder",
  secondaryLabel = "Plan a trip",
}: ToolCTAProps) {
  const waHref = whatsappLink(whatsappText);
  return (
    <section className={styles.cta}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.sub}>{sub}</p>
        <div className={styles.actions}>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className={styles.primary}>
            {ctaLabel}
          </a>
          <Link href={secondaryHref} className={styles.secondary}>
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
