import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "vmf_session";
const SESSION_DAYS = 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  // In production a missing/weak secret means admin session tokens could be
  // forged, so fail closed rather than fall back to a public placeholder. The
  // dev fallback keeps local setup frictionless.
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET must be set to a strong random value (≥16 chars) in production."
      );
    }
    return new TextEncoder().encode("vmf-dev-secret");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string, sessionVersion = 0) {
  const token = await new SignJWT({ sub: userId, ver: sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Full session claims (user id + session version) for stateful revocation checks. */
export async function getSessionClaims(): Promise<{ userId: string; ver: number } | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string") return null;
    // Tokens issued before versioning have no `ver` claim → treat as 0 (default),
    // so existing sessions keep working until a version bump revokes them.
    const ver = typeof payload.ver === "number" ? payload.ver : 0;
    return { userId: payload.sub, ver };
  } catch {
    return null;
  }
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

// ── Two-factor: a short-lived "password OK, awaiting 2FA code" ticket ──────────
// Set after a correct password when the user has 2FA on; exchanged for a real
// session once the TOTP/backup code is verified. Never grants access on its own.
const TWOFA_COOKIE = "vmf_2fa";

export async function createTwoFactorPending(userId: string) {
  const token = await new SignJWT({ sub: userId, purpose: "2fa" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getSecret());
  const jar = await cookies();
  jar.set(TWOFA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 300,
  });
}

export async function getTwoFactorPending(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(TWOFA_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.purpose !== "2fa" || typeof payload.sub !== "string") return null;
    return payload.sub;
  } catch {
    return null;
  }
}

export async function clearTwoFactorPending() {
  const jar = await cookies();
  jar.delete(TWOFA_COOKIE);
}
