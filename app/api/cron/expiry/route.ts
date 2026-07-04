import { expireCredits, expirePendingReferrals } from "@/lib/expiry";

// Daily expiry sweeps (WI-12), invoked by Vercel Cron (see vercel.json). When
// CRON_SECRET is set, Vercel sends it as a Bearer token and we require it; without
// it (local/dev) the endpoint runs unprotected.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const credits = await expireCredits();
    const referrals = await expirePendingReferrals();
    console.log("[cron/expiry]", { credits, referrals });
    return Response.json({ ok: true, credits, referrals });
  } catch (err) {
    console.error("[cron/expiry] failed:", err);
    return Response.json({ ok: false, error: "expiry job failed" }, { status: 500 });
  }
}
