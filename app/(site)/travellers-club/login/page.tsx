import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth/member";
import LoginForm from "@/components/club/LoginForm";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Log in — VMF Travellers Club",
  description: "Log in to your VMF Holidays Travellers Club account to see your travel credit and referral link.",
  alternates: { canonical: "/travellers-club/login" },
  robots: { index: false },
};

const LOGIN_IMAGE =
  "https://res.cloudinary.com/dhmmvsjim/image/upload/vmf-holidays/images/destinations/maldives.jpg";

export default async function ClubLoginPage() {
  const member = await getCurrentMember();
  if (member) redirect("/travellers-club/dashboard");

  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID);

  return (
    <div className={styles.split}>
      <div className={styles.media}>
        <Image
          src={LOGIN_IMAGE}
          alt="A VMF Holidays destination"
          fill
          priority
          sizes="(max-width: 860px) 0px, 55vw"
          className={styles.mediaImg}
        />
        <div className={styles.mediaOverlay}>
          <span className="eyebrow">Travellers Club</span>
          <h2 className={styles.mediaTitle}>Your rewards are waiting.</h2>
          <p className={styles.mediaText}>
            Log in to see your travel credit, your referral link, and your tier.
          </p>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Log in to your VMF Travellers Club account.</p>
          <LoginForm googleEnabled={googleEnabled} />
        </div>
      </div>
    </div>
  );
}
