import { ImageResponse } from "next/og";

// Branded Open Graph image for /travellers-club so every shared referral link
// previews cleanly (WI-17f). Avoids the ₹ glyph, which the default OG font lacks.
export const alt = "VMF Holidays Travellers Club — refer friends, earn travel credit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background: "linear-gradient(135deg, #002464 0%, #154667 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 6, color: "#FFA333", textTransform: "uppercase" }}>
          VMF Holidays Travellers Club
        </div>
        <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.08, marginTop: 24, maxWidth: 920 }}>
          Refer friends. Earn travel credit.
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 24, maxWidth: 860 }}>
          Earn VMF travel credit every time a friend completes their first trip — and they get a welcome discount too.
        </div>
        <div style={{ fontSize: 22, color: "#FFA333", marginTop: 44, letterSpacing: 3, textTransform: "uppercase" }}>
          Discover Your World Your Way
        </div>
      </div>
    ),
    { ...size }
  );
}
