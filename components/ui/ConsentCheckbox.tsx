"use client";

import Link from "next/link";
import styles from "./ConsentCheckbox.module.css";

// Required consent checkbox for data-collection forms (DPDP: explicit, informed
// consent + notice). `required` blocks native form submission until it's ticked.
export default function ConsentCheckbox({
  name = "consent",
  context = "about my enquiry",
}: {
  name?: string;
  context?: string;
}) {
  return (
    <label className={styles.wrap}>
      <input type="checkbox" name={name} required className={styles.box} />
      <span className={styles.text}>
        I agree to the{" "}
        <Link href="/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>
          Privacy Policy
        </Link>{" "}
        and consent to VMF Holidays contacting me {context}.
      </span>
    </label>
  );
}
