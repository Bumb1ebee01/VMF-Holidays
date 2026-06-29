import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth/member";
import LoginForm from "@/components/club/LoginForm";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Log in — VMF Travellers Club",
  description: "Log in to your VMF Holidays Travellers Club account to see your travel credit and referral link.",
  alternates: { canonical: "/travellers-club/login" },
  robots: { index: false },
};

export default async function ClubLoginPage() {
  const member = await getCurrentMember();
  if (member) redirect("/travellers-club/dashboard");

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.loginWrap}`}>
          <div className={styles.formCard}>
            <span className="eyebrow">Travellers Club</span>
            <h1 className={styles.formTitle}>Welcome back</h1>
            <p className={styles.formSub}>Log in to see your credit balance and referral link.</p>
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
