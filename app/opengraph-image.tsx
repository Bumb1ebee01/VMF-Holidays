import { ImageResponse } from "next/og";

export const alt = "VMF Holidays — Discover Your World Your Way";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card. Rendered once at build (static route) so there's no
// per-request cost; surfaces on WhatsApp, Facebook, X, LinkedIn, iMessage, etc.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #002464 0%, #06316f 55%, #154667 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: -1,
              display: "flex",
            }}
          >
            VMF <span style={{ color: "#FE5C10", marginLeft: 12 }}>Holidays</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 28,
              color: "#FFA333",
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Curated Holiday Packages
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 900,
              display: "flex",
            }}
          >
            Discover Your World Your Way
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#C6D2E6",
          }}
        >
          <span style={{ display: "flex" }}>Transparent pricing · Full itineraries</span>
          <span style={{ display: "flex", color: "#ffffff" }}>vmfholidays.com</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: "linear-gradient(90deg, #FE5C10 0%, #FFA333 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
