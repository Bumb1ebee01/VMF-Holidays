import { ImageResponse } from "next/og";
import { getCurrentMember } from "@/lib/auth/member";

// Personalised branded share card with the member's referral code (WI-17b), sized
// for WhatsApp status / Instagram Stories. Avoids the ₹ glyph (default OG font).
export const dynamic = "force-dynamic";

export async function GET() {
  const member = await getCurrentMember();
  const code = member?.referralCode ?? "VMFCLUB";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "96px 80px",
          background: "linear-gradient(160deg, #002464 0%, #154667 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 6, color: "#FFA333", textTransform: "uppercase" }}>
            VMF Holidays Travellers Club
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.04, marginTop: 44 }}>
            Let&apos;s travel — on me.
          </div>
          <div style={{ fontSize: 34, color: "rgba(255,255,255,0.85)", marginTop: 30, maxWidth: 820 }}>
            Join with my code and get a welcome discount on your first VMF Holidays trip.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)", letterSpacing: 3, textTransform: "uppercase" }}>
            My referral code
          </div>
          <div style={{ fontSize: 96, fontWeight: 900, color: "#FE5C10", letterSpacing: 4, marginTop: 8 }}>
            {code}
          </div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)", marginTop: 28 }}>
            Join free at vmfholidays.com/travellers-club
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  );
}
