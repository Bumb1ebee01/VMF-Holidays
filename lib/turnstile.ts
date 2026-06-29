// Server-side verification for Cloudflare Turnstile. Enforced only when
// TURNSTILE_SECRET_KEY is set, so forms keep working unconfigured.

const SECRET = process.env.TURNSTILE_SECRET_KEY;
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Returns true if the token is valid — or if Turnstile isn't configured (skip). */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  if (!SECRET) return true; // not configured
  if (!token) return false;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: SECRET, response: token, ...(ip ? { remoteip: ip } : {}) }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
