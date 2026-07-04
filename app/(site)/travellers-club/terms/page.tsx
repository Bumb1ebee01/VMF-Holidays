import type { Metadata } from "next";
import Link from "next/link";
import {
  creditsToRupees,
  JOIN_BONUS,
  WELCOME_BONUS,
  MIN_WELCOME_BOOKING,
  MIN_QUALIFYING_BOOKING,
  MIN_REDEMPTION,
  CAP_DOMESTIC_PCT,
  CAP_INTERNATIONAL_PCT,
  CREDIT_VALIDITY_MONTHS,
  PENDING_REFERRAL_EXPIRY_MONTHS,
  ENGAGEMENT_LIFETIME_CAP,
  TIERS,
  type TierRow,
} from "@/lib/referral";
import shell from "../../privacy/page.module.css";
import styles from "./terms.module.css";

// Public Travellers Club terms. All member-facing figures are read from the
// economics single-source-of-truth (lib/referral.ts) so this page can never state
// a number that contradicts the dashboard. The internal margin guard is kept as a
// discretion clause (§5.5) — never published as a figure. The document version /
// effective date below is bumped by hand when the wording (not just a figure) changes.
export const VERSION = "1.0";
export const EFFECTIVE = "4 July 2026";

export const metadata: Metadata = {
  title: "Travellers Club — Terms & Conditions",
  description:
    "Terms and conditions for the VMF Holidays Travellers Club referral and rewards programme — how credit is earned, redeemed and expires.",
  alternates: { canonical: "/travellers-club/terms" },
};

// How each tier is reached, derived from the tier table's own thresholds + mode.
function tierReach(t: TierRow): string {
  if (t.minReferrals === 0 && t.minTrips === 0) return "Awarded when you join";
  const ref = `${t.minReferrals} successful ${t.minReferrals === 1 ? "referral" : "referrals"}`;
  const trip = `${t.minTrips} completed ${t.minTrips === 1 ? "trip" : "trips"}`;
  return t.mode === "both" ? `${ref} and ${trip}` : `${ref} or ${trip}`;
}

export default function ClubTermsPage() {
  return (
    <div className={shell.page}>
      <div className={shell.hero}>
        <div className="container">
          <h1 className={shell.title}>Travellers Club — Terms &amp; Conditions</h1>
          <p className={shell.updated}>
            Version {VERSION} · Effective {EFFECTIVE}
          </p>
        </div>
      </div>

      <div className={`container ${shell.content}`}>
        <p className={styles.lead}>
          These terms govern the VMF Holidays Travellers Club — our loyalty and referral programme. By
          joining, using a referral link or code, or accepting or redeeming any credit, you agree to them,
          together with our{" "}
          <Link href="/terms">Terms &amp; Conditions</Link> and <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <p className={styles.notice}>
          <strong>In short:</strong> Club credit is a promotional discount on VMF services (1 credit = ₹1) — it
          is not cash and cannot be withdrawn or transferred. Referral rewards are earned only when a referred
          friend actually <strong>completes</strong> a qualifying trip — never on a click, sign-up or booking
          alone.
        </p>

        <h2>1. About these Terms</h2>
        <p>
          The Club is operated by VMF Holidays Pvt. Ltd. (&ldquo;VMF&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
          It is a promotional benefit offered at our discretion — not a deposit scheme, investment, payment
          instrument or prepaid product — and confers no ownership of, or monetary claim against, VMF. If you do
          not agree to these terms, please do not join or use any referral link, code or credit.
        </p>

        <h2>2. Eligibility &amp; membership</h2>
        <ul className={styles.list}>
          <li>Membership is open to individuals aged 18 or over who are resident in India.</li>
          <li>
            <strong>One person, one account, one referral code.</strong> Operating multiple or duplicate
            accounts to earn extra credit is not allowed.
          </li>
          <li>
            Your account, code, credit, tier and benefits are personal and <strong>non-transferable</strong> —
            they may not be sold, gifted, pooled or combined with anyone else&rsquo;s.
          </li>
          <li>You are responsible for the accuracy of your details and for activity under your account.</li>
        </ul>

        <h2>3. Joining &amp; the join bonus</h2>
        <p>
          Creating an account is free and earns a one-time join bonus of{" "}
          <strong>{creditsToRupees(JOIN_BONUS)}</strong> in credit. Credit below the redemption threshold
          (Section 6) cannot be redeemed on its own; it is a head start to be combined with credit you go on to
          earn. The join bonus is granted once per person.
        </p>

        <h2>4. Earning credit — the referral programme</h2>
        <p>
          Share your unique referral link or code with a friend. If they come to VMF through it and later
          travel with us, you both may earn credit. Rewards are earned on <strong>completed travel</strong> —
          not on an enquiry, a click or a booking alone.
        </p>
        <p className={styles.subhead}>Attribution</p>
        <p>
          A referred friend is attributed to the member whose link or code first brought them to VMF
          (first-touch attribution), recorded for a limited period after their first click. A person cannot be
          &ldquo;referred&rdquo; if they are already a VMF customer, an existing member, or have already
          enquired with us independently. VMF determines attribution from its own records, and its
          determination of who referred whom — and whether a reward is payable — is final.
        </p>
        <p className={styles.subhead}>Your friend&rsquo;s welcome credit</p>
        <p>
          Your referred friend receives a one-time welcome credit of{" "}
          <strong>{creditsToRupees(WELCOME_BONUS)}</strong> when they join through your valid link or code,
          complete their first VMF trip, and that booking is{" "}
          <strong>{creditsToRupees(MIN_WELCOME_BOOKING)}</strong> or more. It is paid once per person, ever.
        </p>
        <p className={styles.subhead}>Your referrer reward</p>
        <p>
          You earn a reward when your referred friend completes a qualifying trip with a booking value of{" "}
          <strong>{creditsToRupees(MIN_QUALIFYING_BOOKING)}</strong> or more. The amount depends on your tier
          when the reward is confirmed:
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Your tier</th>
                <th>Referrer reward</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.tier}>
                  <td>{t.label}</td>
                  <td>{creditsToRupees(t.referrerReward)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>5. Reward approval &amp; limits</h2>
        <ul className={styles.list}>
          <li>
            Rewards are earned only on trips that are actually completed. No reward is earned on an enquiry,
            quotation, cancelled trip, no-show or refunded booking.
          </li>
          <li>
            VMF operates the programme sustainably and may, at its reasonable discretion, decline, reduce, defer
            or cap any referrer reward — including where it is disproportionate to the value of the underlying
            trip, where a booking is heavily discounted or at cost, or where abuse is suspected. Your
            friend&rsquo;s welcome credit is not affected by a capped or declined referrer reward, provided its
            own conditions are met.
          </li>
          <li>
            Credit is confirmed only after VMF verifies the completed trip. Amounts shown as
            &ldquo;pending&rdquo; in your dashboard are indicative until confirmed.
          </li>
        </ul>

        <h2>6. Engagement credit</h2>
        <p>
          From time to time we may offer small one-time credit for light actions (for example completing your
          profile, verifying WhatsApp, or submitting a post-trip testimonial). The actions and their values are
          shown in your dashboard, may change, are subject to a lifetime cap of{" "}
          <strong>{creditsToRupees(ENGAGEMENT_LIFETIME_CAP)}</strong> per member, and may each be claimed once.
          Some credit automatically; others require verification before credit is granted.
        </p>

        <h2>7. Membership tiers</h2>
        <p>Members progress through tiers based on completed trips and successful (rewarded) referrals:</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tier</th>
                <th>How it is reached</th>
                <th>Benefits</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.tier}>
                  <td>{t.label}</td>
                  <td>{tierReach(t)}</td>
                  <td>{t.perks.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A &ldquo;successful referral&rdquo; is a referred friend whose completed, qualifying trip has earned
          you a confirmed reward. Tiers do not downgrade once earned, unless the account is found to be in
          breach of these terms. Some benefits (such as being featured as an Ambassador) require your separate
          consent.
        </p>

        <h2>8. Nature &amp; value of credit</h2>
        <p>Credit is a promotional discount benefit, not money. 1 credit has a redemption value of ₹1 against eligible VMF services only. Credit:</p>
        <ul className={styles.list}>
          <li>cannot be exchanged, redeemed or withdrawn for cash, and has no cash-out value;</li>
          <li>cannot be transferred, sold, gifted, pooled or merged between members or accounts;</li>
          <li>carries no interest and is not a stored-value or prepaid instrument; and</li>
          <li>may be adjusted, corrected or reversed where granted in error, in breach of these terms, or in connection with a cancelled or refunded trip.</li>
        </ul>
        <p>In any discrepancy, VMF&rsquo;s own records of your balance and history are definitive.</p>

        <h2>9. Redeeming credit</h2>
        <ul className={styles.list}>
          <li>
            <strong>Minimum balance.</strong> You may redeem only once your confirmed balance is{" "}
            {creditsToRupees(MIN_REDEMPTION)} or more.
          </li>
          <li>
            <strong>Per-trip cap.</strong> Credit may cover at most {CAP_DOMESTIC_PCT}% of a single domestic
            trip and {CAP_INTERNATIONAL_PCT}% of a single international trip. Any balance above the cap stays in
            your account for future trips.
          </li>
          <li>
            Credit is applied as a discount at booking or invoicing. Straightforward requests within the cap may
            apply automatically; others are reviewed by VMF first.
          </li>
          <li>
            Credit may not be combinable with certain other offers or discounted fares, and is subject to
            availability and the terms of the specific package.
          </li>
          <li>
            If a trip funded partly by credit is cancelled or refunded, the corresponding credit is restored to
            your account (subject to Section 11) rather than refunded as cash.
          </li>
        </ul>

        <h2>10. Expiry &amp; inactivity</h2>
        <p>
          Credit expires and is forfeited after <strong>{CREDIT_VALIDITY_MONTHS} consecutive months</strong> of
          no qualifying account activity (earning or redeeming credit, completing a trip, or a successful
          referral). A referral that has not led to completed, rewarded travel may lapse after{" "}
          {PENDING_REFERRAL_EXPIRY_MONTHS} months, with no reward becoming payable. It is your responsibility to
          monitor your balance and expiry in your dashboard.
        </p>

        <h2>11. Cancellations, reversals &amp; corrections</h2>
        <p>
          If a trip that gave rise to a reward is later cancelled, refunded, charged back or found not to have
          been genuinely completed, VMF may reverse or reclaim the related credit (including referrer and
          welcome credit) and adjust the affected balances and tiers. VMF may correct errors in credit, tiers or
          history at any time. Travel bookings are governed by VMF&rsquo;s separate booking, cancellation and
          refund terms; credit does not create any additional refund entitlement.
        </p>

        <h2>12. Fraud, abuse &amp; prohibited conduct</h2>
        <p>The following are prohibited and are a material breach of these terms:</p>
        <ul className={styles.list}>
          <li>self-referral — referring yourself, or arranging to be referred, to earn credit;</li>
          <li>creating or operating multiple, fake or impersonating accounts;</li>
          <li>circular, reciprocal or collusive referrals engineered mainly to generate credit;</li>
          <li>misrepresenting a booking, trip, identity or eligibility;</li>
          <li>using bots, bulk/spam distribution or misleading claims to spread referral links or codes; and</li>
          <li>buying, selling or trading links, codes, credit, tiers or accounts.</li>
        </ul>
        <p>
          Where VMF reasonably suspects any of the above, it may withhold, cancel, reverse or forfeit affected
          credit and rewards; reset or downgrade tiers; suspend or terminate the account(s); and recover the
          value of benefits wrongly obtained. Related accounts may be treated together. VMF&rsquo;s
          determination on these matters is final.
        </p>

        <h2>13. Changes to the programme</h2>
        <p>
          VMF may change these terms or any aspect of the Club — including credit amounts, rules, tiers, caps,
          thresholds, expiry periods, benefits and eligibility — or suspend or discontinue the Club, at its
          discretion. Updated terms are published here with a revised version and effective date; where a change
          materially reduces your rights, we will make reasonable efforts to notify you. Continued use after a
          change takes effect is acceptance of the updated terms. Credit has no cash value and no compensation
          is payable on discontinuation.
        </p>

        <h2>14. Suspension &amp; termination</h2>
        <p>
          You may leave the Club at any time by contacting us; on leaving, unredeemed credit is forfeited and
          your code is deactivated. VMF may suspend or terminate membership for breach of these terms, suspected
          fraud, or where required by law, in which case unredeemed credit and unconfirmed rewards are
          forfeited. Termination does not affect completed travel bookings.
        </p>

        <h2>15. Taxes</h2>
        <p>
          Credit is a promotional discount on VMF services; prices and any applicable GST are governed by
          VMF&rsquo;s booking terms and law. You are solely responsible for any personal tax consequences of
          participating in the Club, and for reporting them where required. VMF does not provide tax advice.
        </p>

        <h2>16. Privacy &amp; communications</h2>
        <p>
          We process your data under our <Link href="/privacy">Privacy Policy</Link> to operate the Club. To
          protect privacy, referrers and referred friends are shown only masked names and never each
          other&rsquo;s contact details. The Club may include a members&rsquo; WhatsApp community and related
          messages you can opt out of. Being featured publicly as an Ambassador, or having your testimonial,
          photos or social content used, requires your consent.
        </p>

        <h2>17. Disclaimers &amp; liability</h2>
        <p>
          The Club and all credit, tiers and benefits are provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;. To the maximum extent permitted by law, VMF is not liable for indirect or
          consequential loss, or for loss of credit, tiers or benefits arising from changes to or
          discontinuation of the Club, system errors or interruptions, or expiry/forfeiture/reversal of credit
          in accordance with these terms. VMF&rsquo;s total liability in connection with the Club shall not
          exceed the redemption value of the confirmed credit in your account when the claim arose. Nothing
          excludes liability that cannot lawfully be excluded.
        </p>

        <h2>18. Governing law, arbitration &amp; jurisdiction</h2>
        <p>
          These terms are governed by the laws of India. Any dispute arising out of or relating to the Club or
          these terms that cannot be resolved amicably within 30 days of written notice shall be finally
          resolved by arbitration under the Arbitration and Conciliation Act, 1996, by a sole arbitrator, with
          the seat and venue at Goa, India, conducted in English; the award is final and binding. Subject to
          that, the courts at Goa, India have exclusive jurisdiction, including for interim relief.
        </p>

        <h2>19. General</h2>
        <p>
          These terms, with VMF&rsquo;s <Link href="/terms">Terms &amp; Conditions</Link>,{" "}
          <Link href="/privacy">Privacy Policy</Link> and booking terms, are the entire agreement on the Club.
          If any provision is unenforceable, the rest continue in force. VMF&rsquo;s failure to enforce a
          provision is not a waiver. You may not assign your rights; VMF may assign to an affiliate or
          successor. &ldquo;Including&rdquo; means &ldquo;including without limitation&rdquo;; amounts are in
          Indian Rupees (₹); English prevails over any translation.
        </p>

        <h2>20. Contact</h2>
        <p>
          VMF Holidays Pvt. Ltd., Mendes Vaddo, H. No 128/3/A, Nagoa, Bardez, Goa 403516, India
          <br />
          Email: <a href="mailto:info@vmfholidays.com">info@vmfholidays.com</a> · Phone:{" "}
          <a href="tel:+917499322412">+91 7499322412</a>
        </p>

        <p className={styles.effective}>
          Version {VERSION} — Effective {EFFECTIVE}. VMF Holidays Pvt. Ltd. reserves the right to amend these
          terms in accordance with Section 13.
        </p>
      </div>
    </div>
  );
}
