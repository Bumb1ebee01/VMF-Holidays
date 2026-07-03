import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { REF_COOKIE, REF_COOKIE_DAYS, normalizeCode } from "@/lib/referral";

// Next 16 renamed the `middleware` convention to `proxy` (Node.js runtime).
// This handles two unrelated concerns, each gated so it only runs where needed:
//   1. /admin/* — optimistic auth guard (real authz is re-checked in the admin
//      layout + server actions against the database).
//   2. everything else — Travellers Club first-touch referral capture (WI-1).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth guard (only touches the session token under /admin) ──────────
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const userId = token ? await verifySessionToken(token) : null;

    if (pathname.startsWith("/admin/login")) {
      if (userId) return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.next();
    }
    if (!userId) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next();
  }

  // ── First-touch referral attribution (WI-1) ─────────────────────────────────
  // Any page reached with ?ref=CODE remembers the code in a first-touch cookie so
  // the referrer is credited even after browsing / a tab-close / a return days
  // later, then strips the param so it doesn't linger or get re-shared. First
  // touch wins — an existing cookie is never overwritten.
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref) {
    const code = normalizeCode(ref);
    const url = request.nextUrl.clone();
    url.searchParams.delete("ref");
    const response = NextResponse.redirect(url);
    if (code && !request.cookies.get(REF_COOKIE)) {
      response.cookies.set(REF_COOKIE, code, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * REF_COOKIE_DAYS,
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // /admin/* for the auth guard, plus all page routes for ?ref= capture — while
  // skipping API routes, Next internals and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
