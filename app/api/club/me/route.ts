import { getCurrentMember } from "@/lib/auth/member";

// Lightweight logged-in probe for the header (WI-9). Reads the httpOnly member
// cookie server-side and returns only a first name — never any contact detail.
export async function GET() {
  const member = await getCurrentMember();
  return Response.json(
    member ? { loggedIn: true, firstName: member.name.split(" ")[0] } : { loggedIn: false },
    { headers: { "Cache-Control": "no-store" } }
  );
}
