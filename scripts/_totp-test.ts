import {
  base32Encode,
  totpToken,
  verifyTotp,
  generateSecret,
  generateBackupCodes,
  encryptSecret,
  decryptSecret,
} from "../lib/auth/totp";

let pass = true;
const check = (name: string, ok: boolean) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) pass = false;
};

// RFC 6238 test vector (SHA1): secret ASCII "12345678901234567890", T=59s → step 1
// → 8-digit 94287082 → 6-digit 287082.
const rfcSecret = base32Encode(Buffer.from("12345678901234567890"));
check("RFC 6238 vector (T=59 → 287082)", totpToken(rfcSecret, 59_000) === "287082");
// Another RFC vector: T=1111111109 → 8-digit 07081804 → 6-digit 081804.
check("RFC 6238 vector (T=1111111109 → 081804)", totpToken(rfcSecret, 1111111109_000) === "081804");

// Round-trip: a fresh secret's current token verifies, ±window tolerant.
const secret = generateSecret();
check("round-trip verify (current token)", verifyTotp(secret, totpToken(secret)));
check("prev-step token still verifies (±1)", verifyTotp(secret, totpToken(secret, Date.now() - 30_000)));
check("wrong token rejected", verifyTotp(secret, "000000") === false || totpToken(secret) === "000000");
check("non-6-digit rejected", !verifyTotp(secret, "12345"));

// Backup codes
const codes = generateBackupCodes();
check("8 backup codes, unique, formatted", codes.length === 8 && new Set(codes).size === 8 && /^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{2}$/.test(codes[0]));

// Encryption round-trip + tamper rejection
const enc = encryptSecret(secret);
check("encrypt/decrypt round-trip", decryptSecret(enc) === secret);
check("tampered ciphertext rejected", decryptSecret(enc.slice(0, -2) + "xx") === null);

console.log(pass ? "\nALL PASS" : "\nSOME FAILED");
process.exit(pass ? 0 : 1);
