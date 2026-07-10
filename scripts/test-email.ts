import "dotenv/config";
import { Resend } from "resend";

/**
 * Email pipeline diagnostic. Sends one test email using the SAME env + sender the
 * app uses (RESEND_API_KEY + ENQUIRY_FROM), so you can confirm Resend is configured
 * and the sending domain is verified.
 *
 *   npm run test:email                 → sends to ENQUIRY_TO (or info@vmfholidays.com)
 *   npm run test:email you@gmail.com   → sends to that address
 *
 * Run it wherever the env is set (locally with your .env, or `vercel env pull`
 * then run). It prints the Resend id on success, or the exact error (e.g. an
 * unverified-domain message) on failure.
 */
const key = process.env.RESEND_API_KEY;
const FROM = process.env.ENQUIRY_FROM ?? "VMF Holidays <enquiries@vmfholidays.com>";
const TO = process.argv[2] || process.env.ENQUIRY_TO || "info@vmfholidays.com";

async function main() {
  if (!key) {
    console.error("\n❌ RESEND_API_KEY is not set in this environment.");
    console.error("   → No email can send at all. Add it to your .env (and Vercel env), then retry.\n");
    process.exit(1);
  }

  console.log("\nSending test email…");
  console.log(`  from: ${FROM}`);
  console.log(`  to:   ${TO}\n`);

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: "VMF Holidays — email pipeline test",
    html: `<div style="font-family:Arial,sans-serif;color:#1a1f36">
      <h2 style="color:#002464">Email pipeline works ✅</h2>
      <p>If you're reading this, Resend is configured correctly and your sending
      domain is verified. Your password-reset and lead-notification emails will deliver.</p>
    </div>`,
  });

  if (error) {
    console.error("❌ Resend rejected the send:");
    console.error("  ", error);
    console.error(
      "\n   Common cause: the sending domain in ENQUIRY_FROM (vmfholidays.com) is not verified in Resend.",
      "\n   → Resend dashboard → Domains → add vmfholidays.com → add the DKIM/SPF DNS records it gives you.\n"
    );
    process.exit(1);
  }

  console.log("✅ Sent successfully. Resend id:", data?.id);
  console.log(`   Check the inbox (and spam) for ${TO}.\n`);
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
