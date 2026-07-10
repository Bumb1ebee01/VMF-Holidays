import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/club/ForgotPasswordForm";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Forgot password — VMF Travellers Club",
  description: "Reset your VMF Holidays Travellers Club password.",
  alternates: { canonical: "/travellers-club/forgot-password" },
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.loginWrap}`}>
          <div className={styles.formCard}>
            <span className="eyebrow">Travellers Club</span>
            <h1 className={styles.formTitle}>Forgot your password?</h1>
            <p className={styles.formSub}>
              Enter your email and we&apos;ll send you a link to set a new one.
            </p>
            <ForgotPasswordForm />
          </div>
        </div>
      </section>
    </div>
  );
}
