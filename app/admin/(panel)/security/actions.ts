"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import {
  generateSecret,
  otpauthUri,
  formatSecret,
  verifyTotp,
  encryptSecret,
  decryptSecret,
  generateBackupCodes,
} from "@/lib/auth/totp";

// Backup codes are stored/compared normalised (alphanumeric, lower-case), so the
// dashes and case shown to the user don't matter on entry.
const normalize = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export type TotpSetup = { secret: string; formatted: string; uri: string };

/** Begin enrollment: mint a secret and stash it (encrypted, still disabled). */
export async function startTotpSetup(): Promise<TotpSetup | { error: string }> {
  const me = await requireUser();
  // Guard: re-running setup overwrites the secret and clears `totpEnabled`, which
  // would silently drop an already-enrolled user's 2FA. Disabling is the only
  // supported way out, and that path demands a valid code.
  const existing = await db.user.findUnique({ where: { id: me.id }, select: { totpEnabled: true } });
  if (existing?.totpEnabled) {
    return { error: "Two-factor is already on. Turn it off first if you want to re-enrol a new device." };
  }

  const secret = generateSecret();
  await db.user.update({
    where: { id: me.id },
    data: { totpSecret: encryptSecret(secret), totpEnabled: false },
  });
  return { secret, formatted: formatSecret(secret), uri: otpauthUri(secret, me.email) };
}

export type ConfirmResult = { error: string } | { ok: true; backupCodes: string[] };

/** Confirm enrollment with a code from the app; on success, turn 2FA on + issue backup codes. */
export async function confirmTotpSetup(code: string): Promise<ConfirmResult> {
  const me = await requireUser();
  const user = await db.user.findUnique({ where: { id: me.id }, select: { totpSecret: true } });
  if (!user?.totpSecret) return { error: "Start the setup first." };

  const secret = decryptSecret(user.totpSecret);
  if (!secret || !verifyTotp(secret, code)) {
    return { error: "That code didn't match. Check your phone's time is correct and try again." };
  }

  const backupCodes = generateBackupCodes();
  const hashed = await Promise.all(backupCodes.map((c) => bcrypt.hash(normalize(c), 10)));
  await db.user.update({ where: { id: me.id }, data: { totpEnabled: true, totpBackupCodes: hashed } });
  await logActivity(me, { action: "user.2fa", entity: "User", entityId: me.id, detail: "Enabled two-factor authentication" });
  revalidatePath("/admin/security");
  return { ok: true, backupCodes };
}

export type DisableResult = { error: string } | { ok: true };

/** Turn 2FA off — requires a current app code or a backup code, to prove it's really you. */
export async function disableTotp(code: string): Promise<DisableResult> {
  const me = await requireUser();
  const user = await db.user.findUnique({
    where: { id: me.id },
    select: { totpSecret: true, totpEnabled: true, totpBackupCodes: true },
  });
  if (!user?.totpEnabled || !user.totpSecret) return { error: "Two-factor isn't enabled." };

  const secret = decryptSecret(user.totpSecret);
  let ok = secret ? verifyTotp(secret, code) : false;
  if (!ok) {
    for (const h of user.totpBackupCodes) {
      if (await bcrypt.compare(normalize(code), h)) {
        ok = true;
        break;
      }
    }
  }
  if (!ok) return { error: "Enter a current code from your app (or a backup code) to turn 2FA off." };

  await db.user.update({ where: { id: me.id }, data: { totpEnabled: false, totpSecret: null, totpBackupCodes: [] } });
  await logActivity(me, { action: "user.2fa", entity: "User", entityId: me.id, detail: "Disabled two-factor authentication" });
  revalidatePath("/admin/security");
  return { ok: true };
}
