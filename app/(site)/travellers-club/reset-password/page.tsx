import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "@/components/club/ResetPasswordForm";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Reset password — VMF Travellers Club",
  description: "Set a new password for your VMF Holidays Travellers Club account.",
  alternates: { canonical: "/travellers-club/reset-password" },
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.loginWrap}`}>
          <div className={styles.formCard}>
            <span className="eyebrow">Travellers Club</span>
            <h1 className={styles.formTitle}>Set a new password</h1>
            {token ? (
              <>
                <p className={styles.formSub}>Choose a new password for your account.</p>
                <ResetPasswordForm token={token} />
              </>
            ) : (
              <p className={styles.formSub}>
                This reset link is invalid or incomplete.{" "}
                <Link href="/travellers-club/forgot-password">Request a new one</Link>.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
