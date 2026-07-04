import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentMember } from "@/lib/auth/member";
import { db } from "@/lib/db";
import { JsonLd, serviceJsonLd } from "@/lib/seo";
import {
  REFERRAL_REWARD,
  WELCOME_BONUS,
  MIN_REDEMPTION,
  CREDIT_VALIDITY_MONTHS,
  REF_COOKIE,
  normalizeCode,
  referrerLabel,
  creditsToRupees,
} from "@/lib/referral";
import JoinForm from "@/components/club/JoinForm";
import styles from "./page.module.css";

const PAGE_DESC =
  "Join the free VMF Holidays Travellers Club: refer friends and you both earn VMF travel credit, redeemable against your next holiday package — plus exclusive community deals.";

export const metadata: Metadata = {
  title: "VMF Travellers Club — Refer Friends, Earn Travel Credit",
  description: PAGE_DESC,
  alternates: { canonical: "/travellers-club" },
  openGraph: {
    type: "website",
    url: "/travellers-club",
    title: "VMF Travellers Club — Refer Friends, Earn Travel Credit",
    description: PAGE_DESC,
  },
};

export default async function TravellersClubPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const member = await getCurrentMember();
  if (member) redirect("/travellers-club/dashboard");

  // The referral code now arrives via the first-touch cookie (proxy.ts strips the
  // ?ref= param); the search param is kept only as a dev / no-proxy fallback.
  const { ref: spRef = "" } = await searchParams;
  const jar = await cookies();
  const refCode = normalizeCode(spRef || jar.get(REF_COOKIE)?.value || "");
  let refName = "";
  if (refCode) {
    const referrer = await db.member.findUnique({
      where: { referralCode: refCode },
      select: { name: true },
    });
    if (referrer) refName = referrerLabel(referrer.name);
  }

  const benefits = [
    {
      t: "Refer & earn",
      d: `Give friends ${creditsToRupees(WELCOME_BONUS)} off their first trip and earn ${creditsToRupees(REFERRAL_REWARD)} credit yourself when they travel.`,
    },
    {
      t: "Credit that compounds",
      d: `Your VMF credit stacks up and stays valid for ${CREDIT_VALIDITY_MONTHS} months from your last activity — redeem from ${creditsToRupees(MIN_REDEMPTION)} against any holiday package.`,
    },
    {
      t: "Members-only community",
      d: "Join our WhatsApp Travellers Club for exclusive deals, early access and trip inspiration.",
    },
  ];

  return (
    <div className={styles.page}>
      <JsonLd
        data={serviceJsonLd({
          name: "VMF Travellers Club — referral rewards",
          description: PAGE_DESC,
          path: "/travellers-club",
        })}
      />
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className="eyebrow">VMF Holidays Travellers Club</span>
            <h1 className={styles.title}>Travel more. Refer friends. Earn credit.</h1>
            <p className={styles.sub}>
              Members earn VMF travel credit for every friend they bring — and your friends get a welcome
              discount too. Free to join, with a ₹250 head start the moment you sign up.
            </p>
            <div className={styles.benefits}>
              {benefits.map((b) => (
                <div key={b.t} className={styles.benefit}>
                  <h3 className={styles.benefitTitle}>{b.t}</h3>
                  <p className={styles.benefitText}>{b.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Create your free account</h2>
            <p className={styles.formSub}>Takes a minute. You&apos;ll get your own referral link instantly.</p>
            <JoinForm refCode={refCode} refName={refName} />
            <p className={styles.formConsent}>
              By creating an account you agree to the{" "}
              <Link href="/travellers-club/terms">Travellers Club Terms</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
