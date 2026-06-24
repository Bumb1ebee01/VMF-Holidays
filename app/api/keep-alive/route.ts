import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Pinged on a schedule (see .github/workflows/keep-alive.yml) to stop Neon's
// free-tier compute from scale-to-zero suspending, which adds a 1-3s cold start
// to the first query after idle. A trivial SELECT 1 keeps the compute warm.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  // Optional shared-secret guard. Enforced only if CRON_SECRET is set, so the
  // endpoint still works (and is testable) without configuration.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "db error" },
      { status: 500 }
    );
  }
}
