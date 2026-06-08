export default function HomePage() {
  return (
    <main>
      <section
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <span className="eyebrow">Phase 1 — Foundation</span>
        <h1
          style={{
            color: "white",
            fontWeight: 900,
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          VMF Holidays
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }}>
          Discover Your World, Your Way
        </p>
        <div
          style={{
            marginTop: "8px",
            padding: "8px 24px",
            background: "rgba(254,92,16,0.15)",
            border: "1px solid rgba(254,92,16,0.3)",
            borderRadius: "9999px",
            color: "var(--orange)",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          DESIGN SYSTEM READY
        </div>
      </section>
    </main>
  );
}
