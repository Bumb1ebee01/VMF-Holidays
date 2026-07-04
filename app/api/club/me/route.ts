import { getCurrentMember } from "@/lib/auth/member";

// Lightweight logged-in probe for the header (WI-9). Reads the httpOnly member
// cookie server-side and returns only a first name plus the member's own (already
// public, shareable) referral code — never any contact detail. The code powers the
// "share this trip" button so a shared package link carries the member's attribution.
export async function GET() {
  const member = await getCurrentMember();
  return Response.json(
    member
      ? { loggedIn: true, firstName: member.name.split(" ")[0], referralCode: member.referralCode }
      : { loggedIn: false },
    { headers: { "Cache-Control": "no-store" } }
  );
}
