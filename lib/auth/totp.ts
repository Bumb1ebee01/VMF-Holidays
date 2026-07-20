import crypto from "crypto";

// Time-based one-time passwords (RFC 6238, SHA1, 6 digits, 30s step) for admin
// 2FA — implemented on Node's crypto (no external dependency). Secrets are stored
// encrypted at rest; verification tolerates ±1 step of clock skew.

// ── Base32 (RFC 4648, no padding) — the format authenticator apps expect ──────
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(str: string): Buffer {
  const clean = str.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    value = (value << 5) | B32.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

// ── HOTP / TOTP ───────────────────────────────────────────────────────────────
const STEP = 30;

function hotp(key: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const bin =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (bin % 1_000_000).toString().padStart(6, "0");
}

/** The current 6-digit token for a secret (exported for tests / never sent to clients). */
export function totpToken(secretBase32: string, atMs: number = Date.now()): string {
  return hotp(base32Decode(secretBase32), Math.floor(atMs / 1000 / STEP));
}

/** Verify a 6-digit token against a base32 secret, tolerating ±`window` steps. */
export function verifyTotp(secretBase32: string, token: string, window = 1): boolean {
  const t = (token || "").replace(/\D/g, "");
  if (t.length !== 6) return false;
  const key = base32Decode(secretBase32);
  if (key.length === 0) return false;
  const counter = Math.floor(Date.now() / 1000 / STEP);
  for (let w = -window; w <= window; w++) {
    const candidate = hotp(key, counter + w);
    if (crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(t))) return true;
  }
  return false;
}

/** New random TOTP secret (base32, ~160 bits of entropy). */
export function generateSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

/** otpauth:// URI authenticator apps accept (for a QR or manual "setup key" entry). */
export function otpauthUri(secretBase32: string, account: string, issuer = "VMF Holidays"): string {
  const params = new URLSearchParams({ secret: secretBase32, issuer, algorithm: "SHA1", digits: "6", period: "30" });
  return `otpauth://totp/${encodeURIComponent(`${issuer}:${account}`)}?${params.toString()}`;
}

/** Group the secret into 4-char blocks so it's easier to type into an app. */
export function formatSecret(secretBase32: string): string {
  return secretBase32.replace(/(.{4})/g, "$1 ").trim();
}

// ── Backup codes ───────────────────────────────────────────────────────────────
export function generateBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () => {
    const hex = crypto.randomBytes(5).toString("hex"); // 10 hex chars
    return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8)}`;
  });
}

// ── Encryption at rest for the TOTP secret (AES-256-GCM, key from AUTH_SECRET) ──
function encKey(): Buffer {
  const secret = process.env.AUTH_SECRET || "vmf-dev-secret";
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encKey(), iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `${iv.toString("base64")}:${cipher.getAuthTag().toString("base64")}:${ct.toString("base64")}`;
}

export function decryptSecret(stored: string): string | null {
  try {
    const [ivB64, tagB64, ctB64] = stored.split(":");
    if (!ivB64 || !tagB64 || !ctB64) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", encKey(), Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(ctB64, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
